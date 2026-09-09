//! file-utilities native binding (linux-x64 port of the macOS napi-rs module).
//!
//! Mirrors the ABI consumed by the auto-generated wrapper in ../index.js:
//!   getDirectorySizeSync(path, options?) -> DirectorySizeResult
//!   getDirectorySizeAsync(path, options?, jobId?) -> Promise<DirectorySizeResult>
//!   getDirectorySizeTreeSync(path, treeOptions) -> DirectoryTreeResult
//!   getDirectorySizeTreeAsync(path, treeOptions, jobId?) -> Promise<DirectoryTreeResult>
//!   getDirectorySizeByGlobSync(pattern, options?) -> DirectorySizeResult
//!   getDirectorySizeByGlobAsync(pattern, options?, jobId?) -> Promise<DirectorySizeResult>
//!   detectHardlinksSync(path, options?) -> HardlinkDetectionResult
//!   detectHardlinksAsync(path, options?, jobId?) -> Promise<HardlinkDetectionResult>
//!   detectFilesystemSync(path, options?) -> FilesystemInfo
//!   detectFilesystemAsync(path, options?, jobId?) -> Promise<FilesystemInfo>
//!   cancelJob(jobId) -> boolean
//!
//! Cancellation: the JS wrapper registers the jobId in a native registry and
//! flips its flag via cancelJob(jobId) when an AbortSignal fires. Worker code
//! checks the flag every CHECK_INTERVAL walked entries and bails with a
//! Status::Cancelled error, which rejects the promise returned to JS.

use napi::bindgen_prelude::*;
use napi::Status;
use napi_derive::napi;
use parking_lot::Mutex;
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, LazyLock};
use std::time::Instant;

use globset::{Glob, GlobSet, GlobSetBuilder};
use std::os::unix::ffi::OsStrExt;
use std::os::unix::fs::MetadataExt;

// ---------------------------------------------------------------------------
// Job registry (cancellation)
// ---------------------------------------------------------------------------

/// Entries walked between cancellation checks.
const CHECK_INTERVAL: usize = 64;

static JOBS: LazyLock<Mutex<HashMap<u32, Arc<AtomicBool>>>> = LazyLock::new(|| Mutex::new(HashMap::new()));

/// Registers a cancellation flag for `job_id` (if any). Removing on Drop keeps
/// the registry bounded even if a task panics.
struct JobToken {
    id: Option<u32>,
    flag: Option<Arc<AtomicBool>>,
}

impl JobToken {
    fn new(job_id: Option<u32>) -> Self {
        match job_id {
            Some(id) => {
                let flag = Arc::new(AtomicBool::new(false));
                JOBS.lock().insert(id, flag.clone());
                JobToken {
                    id: Some(id),
                    flag: Some(flag),
                }
            }
            None => JobToken {
                id: None,
                flag: None,
            },
        }
    }

    fn cancelled(&self) -> bool {
        self.flag
            .as_ref()
            .map(|f| f.load(Ordering::Relaxed))
            .unwrap_or(false)
    }
}

impl Drop for JobToken {
    fn drop(&mut self) {
        if let Some(id) = self.id {
            JOBS.lock().remove(&id);
        }
    }
}

#[napi]
/// Flips the cancellation flag for a registered job. Returns false when the
/// job id is unknown (already finished / never registered).
pub fn cancel_job(job_id: u32) -> bool {
    let map = JOBS.lock();
    if let Some(flag) = map.get(&job_id) {
        flag.store(true, Ordering::Relaxed);
        return true;
    }
    false
}

fn cancelled_err(id: u32) -> Error {
    Error::new(Status::Cancelled, format!("Operation cancelled (job {})", id))
}

// ---------------------------------------------------------------------------
// Result / option structs (camelCase on the JS side via #[napi(object)])
// ---------------------------------------------------------------------------

#[napi(object)]
#[derive(Default)]
pub struct DirectorySizeOptions {
    /// Accepted for API parity with the macOS build; scanning is single
    /// threaded on linux. Must be > 0 when present.
    pub workers: Option<f64>,

    pub max_depth: Option<f64>,
    pub include_root: Option<bool>,
}

#[napi(object)]
pub struct DirectorySizeResult {
    pub total_size: f64,
    pub file_count: f64,
    pub duration_ms: f64,
}

#[napi(object)]
#[derive(Clone)]
pub struct DirectoryTreeEntry {
    pub name: String,
    pub relative_path: String,
    pub depth: f64,
    pub total_size: f64,
    pub file_count: f64,
    pub dir_count: f64,
    pub children: Vec<DirectoryTreeEntry>,
}

#[napi(object)]
pub struct DirectoryTreeResult {
    pub total_size: f64,
    pub file_count: f64,
    pub dir_count: f64,
    pub max_depth: f64,
    pub duration_ms: f64,
    pub children: Vec<DirectoryTreeEntry>,
}

#[napi(object)]
pub struct HardlinkDetectionResult {
    pub has_hardlinks: bool,
    /// Number of entries observed with nlink > 1.
    pub hardlink_count: f64,
    pub total_files: f64,
    pub duration_ms: f64,
}

#[napi(object)]
pub struct FilesystemInfo {
    pub filesystem_type: String,
    pub volume_name: String,
    pub max_filename_length: f64,
    pub supports_case_sensitive_names: bool,
    pub supports_unicode_filenames: bool,
    pub supports_compression: bool,
    pub supports_encryption: bool,
}

// ---------------------------------------------------------------------------
// Shared filesystem helpers
// ---------------------------------------------------------------------------

fn validate_workers(opts: &Option<DirectorySizeOptions>) -> Result<()> {
    if let Some(o) = opts {
        if let Some(w) = o.workers {
            if w <= 0.0 {
                return Err(Error::new(
                    Status::InvalidArg,
                    "Worker count must be greater than 0",
                ));
            }
        }
    }
    Ok(())
}

fn check_dir(path: &str) -> Result<()> {
    let p = Path::new(path);
    match fs::metadata(p) {
        Err(_) => Err(Error::new(
            Status::InvalidArg,
            format!("'{}' does not exist or cannot be accessed", path),
        )),
        Ok(md) if !md.is_dir() => Err(Error::new(
            Status::InvalidArg,
            format!("Path '{}' is not a directory", path),
        )),
        Ok(_) => Ok(()),
    }
}

/// (size, counted_as_file) using lstat semantics: symlinks are counted as
/// entries but contribute zero size (their target is never stat'ed).
fn entry_size(path: &Path) -> (u64, bool) {
    match fs::symlink_metadata(path) {
        Ok(md) => {
            let ft = md.file_type();
            if ft.is_symlink() {
                (0, true)
            } else if ft.is_file() {
                (md.len(), true)
            } else if ft.is_dir() {
                (0, false)
            } else {
                // fifo/socket/device: count as a file entry, size 0
                (0, true)
            }
        }
        Err(_) => (0, false),
    }
}

fn now_ms(start: Instant) -> f64 {
    start.elapsed().as_secs_f64() * 1000.0
}

/// Iterative recursive scan: sums file sizes (symlink targets excluded) and
/// counts file entries. Honors the job cancellation flag.
fn scan_size(root: &Path, token: &JobToken) -> Result<(u64, u64)> {
    let mut total: u64 = 0;
    let mut files: u64 = 0;
    let mut visited = 0usize;
    let mut stack: Vec<PathBuf> = vec![root.to_path_buf()];

    while let Some(dir) = stack.pop() {
        let rd = match fs::read_dir(&dir) {
            Ok(rd) => rd,
            Err(_) => continue, // unreadable subdirectory: skip, like macOS build
        };
        for entry in rd.flatten() {
            let p = entry.path();
            match entry.file_type() {
                Ok(ft) if ft.is_dir() && !ft.is_symlink() => stack.push(p),
                _ => {
                    let (size, counted) = entry_size(&p);
                    if counted {
                        total += size;
                        files += 1;
                    }
                }
            }
            visited += 1;
            if visited % CHECK_INTERVAL == 0 && token.cancelled() {
                return Err(cancelled_err(token.id.unwrap_or(0)));
            }
        }
    }
    Ok((total, files))
}

// ---------------------------------------------------------------------------
// getDirectorySize (sync + async)
// ---------------------------------------------------------------------------

fn size_impl(path: String, opts: Option<DirectorySizeOptions>, token: JobToken) -> Result<DirectorySizeResult> {
    validate_workers(&opts)?;
    check_dir(&path)?;
    let t0 = Instant::now();
    let (total, files) = scan_size(Path::new(&path), &token)?;
    Ok(DirectorySizeResult {
        total_size: total as f64,
        file_count: files as f64,
        duration_ms: now_ms(t0),
    })
}

#[napi]
pub fn get_directory_size_sync(path: String, options: Option<DirectorySizeOptions>) -> Result<DirectorySizeResult> {
    size_impl(path, options, JobToken::new(None))
}

pub struct SizeTask {
    path: String,
    opts: Option<DirectorySizeOptions>,
    job: Option<JobToken>,
}

impl Task for SizeTask {
    type Output = DirectorySizeResult;
    type JsValue = DirectorySizeResult;

    fn compute(&mut self) -> Result<Self::Output> {
        let token = self.job.take().unwrap_or_else(|| JobToken::new(None));
        size_impl(self.path.clone(), self.opts.take(), token)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
pub fn get_directory_size_async(
    path: String,
    options: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
) -> Result<AsyncTask<SizeTask>> {
    validate_workers(&options)?;
    check_dir(&path)?;
    let job = job_id.map(|id| JobToken::new(Some(id)));
    Ok(AsyncTask::new(SizeTask {
        path,
        opts: options,
        job,
    }))
}

// ---------------------------------------------------------------------------
// getDirectorySizeTree (sync + async)
// ---------------------------------------------------------------------------

struct TreeAccum {
    size: u64,
    files: u64,
    dirs: u64,
    children: Vec<DirectoryTreeEntry>,
}

fn scan_tree(
    dir: &Path,
    rel: &str,
    depth: u32,
    max_depth: u32,
    token: &JobToken,
    visited: &mut usize,
) -> Result<TreeAccum> {
    let mut acc = TreeAccum {
        size: 0,
        files: 0,
        dirs: 0,
        children: Vec::new(),
    };
    let rd = match fs::read_dir(dir) {
        Ok(rd) => rd,
        Err(_) => return Ok(acc),
    };
    let mut subdirs: Vec<(String, PathBuf)> = Vec::new();
    for entry in rd.flatten() {
        let name = entry.file_name().to_string_lossy().to_string();
        let p = entry.path();
        let is_dir = matches!(entry.file_type(), Ok(ft) if ft.is_dir() && !ft.is_symlink());
        if is_dir {
            subdirs.push((name, p));
        } else {
            let (size, counted) = entry_size(&p);
            if counted {
                acc.size += size;
                acc.files += 1;
            }
        }
        *visited += 1;
        if *visited % CHECK_INTERVAL == 0 && token.cancelled() {
            return Err(cancelled_err(token.id.unwrap_or(0)));
        }
    }
    for (name, p) in subdirs {
        let child_rel = if rel.is_empty() {
            name.clone()
        } else {
            format!("{}/{}", rel, name)
        };
        acc.dirs += 1;
        if depth < max_depth {
            let child = scan_tree(&p, &child_rel, depth + 1, max_depth, token, visited)?;
            acc.size += child.size;
            acc.files += child.files;
            acc.dirs += child.dirs;
            acc.children.push(DirectoryTreeEntry {
                name,
                relative_path: child_rel,
                depth: (depth + 1) as f64,
                total_size: child.size as f64,
                file_count: child.files as f64,
                dir_count: child.dirs as f64,
                children: child.children,
            });
        }
    }
    Ok(acc)
}

fn tree_impl(
    path: String,
    opts: Option<DirectorySizeOptions>,
    token: JobToken,
) -> Result<DirectoryTreeResult> {
    validate_workers(&opts)?;
    check_dir(&path)?;
    let max_depth = opts
        .as_ref()
        .and_then(|o| o.max_depth)
        .unwrap_or(3.0)
        .clamp(0.0, u32::MAX as f64) as u32;
    let include_root = opts
        .as_ref()
        .and_then(|o| o.include_root)
        .unwrap_or(false);

    let t0 = Instant::now();
    let mut visited = 0usize;
    let acc = scan_tree(Path::new(&path), "", 0, max_depth, &token, &mut visited)?;

    let mut children = acc.children;
    if include_root {
        // Prepend an entry describing the root itself; its children become the
        // (shifted) top-level list so consumers always find data in `children`.
        let root_entry = DirectoryTreeEntry {
            name: Path::new(&path)
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_else(|| path.clone()),
            relative_path: String::new(),
            depth: 0.0,
            total_size: acc.size as f64,
            file_count: acc.files as f64,
            dir_count: acc.dirs as f64,
            children: children.clone(),
        };
        children.insert(0, root_entry);
    }

    Ok(DirectoryTreeResult {
        total_size: acc.size as f64,
        file_count: acc.files as f64,
        dir_count: acc.dirs as f64,
        max_depth: max_depth as f64,
        duration_ms: now_ms(t0),
        children,
    })
}

#[napi]
pub fn get_directory_size_tree_sync(
    path: String,
    options: Option<DirectorySizeOptions>,
) -> Result<DirectoryTreeResult> {
    tree_impl(path, options, JobToken::new(None))
}

pub struct TreeTask {
    path: String,
    opts: Option<DirectorySizeOptions>,
    job: Option<JobToken>,
}

impl Task for TreeTask {
    type Output = DirectoryTreeResult;
    type JsValue = DirectoryTreeResult;

    fn compute(&mut self) -> Result<Self::Output> {
        let token = self.job.take().unwrap_or_else(|| JobToken::new(None));
        tree_impl(self.path.clone(), self.opts.take(), token)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
pub fn get_directory_size_tree_async(
    path: String,
    options: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
) -> Result<AsyncTask<TreeTask>> {
    validate_workers(&options)?;
    check_dir(&path)?;
    let job = job_id.map(|id| JobToken::new(Some(id)));
    Ok(AsyncTask::new(TreeTask {
        path,
        opts: options,
        job,
    }))
}

// ---------------------------------------------------------------------------
// getDirectorySizeByGlob (sync + async)
// ---------------------------------------------------------------------------

/// Longest literal directory prefix of a glob pattern (up to the first
/// component containing a wildcard/metacharacter). Falls back to ".".
fn glob_root(pattern: &str) -> PathBuf {
    let mut root = PathBuf::new();
    for comp in pattern.split('/') {
        if comp.is_empty() {
            // absolute pattern leading ""
            if pattern.starts_with('/') {
                root.push("/");
            }
            continue;
        }
        if comp
            .chars()
            .any(|c| matches!(c, '*' | '?' | '[' | ']' | '{' | '}' | '!'))
        {
            break;
        }
        root.push(comp);
    }
    if root.as_os_str().is_empty() {
        PathBuf::from(".")
    } else {
        root
    }
}

fn glob_impl(
    pattern: String,
    opts: Option<DirectorySizeOptions>,
    token: JobToken,
) -> Result<DirectorySizeResult> {
    validate_workers(&opts)?;
    let t0 = Instant::now();

    let mut builder = GlobSetBuilder::new();
    let glob = Glob::new(&pattern)
        .map_err(|e| Error::new(Status::InvalidArg, format!("Invalid glob pattern '{}' ({})", pattern, e)))?;
    builder.add(glob);
    let set: GlobSet = builder
        .build()
        .map_err(|e| Error::new(Status::GenericFailure, format!("Failed to build glob set: {}", e)))?;

    let root = glob_root(&pattern);
    if fs::metadata(&root).is_err() {
        return Err(Error::new(
            Status::InvalidArg,
            format!("Root path does not exist: {}", root.display()),
        ));
    }

    let absolute = pattern.starts_with('/');
    let mut total: u64 = 0;
    let mut files: u64 = 0;
    let mut visited = 0usize;
    let mut stack: Vec<PathBuf> = vec![root.clone()];

    while let Some(dir) = stack.pop() {
        let rd = match fs::read_dir(&dir) {
            Ok(rd) => rd,
            Err(_) => continue,
        };
        for entry in rd.flatten() {
            let p = entry.path();
            match entry.file_type() {
                Ok(ft) if ft.is_dir() && !ft.is_symlink() => stack.push(p),
                _ => {
                    let cand: String = if absolute {
                        p.to_string_lossy().to_string()
                    } else {
                        match p.strip_prefix(&root) {
                            Ok(rel) => rel.to_string_lossy().to_string(),
                            Err(_) => p.to_string_lossy().to_string(),
                        }
                    };
                    if set.is_match(&cand) {
                        let (size, counted) = entry_size(&p);
                        if counted {
                            total += size;
                            files += 1;
                        }
                    }
                }
            }
            visited += 1;
            if visited % CHECK_INTERVAL == 0 && token.cancelled() {
                return Err(cancelled_err(token.id.unwrap_or(0)));
            }
        }
    }

    Ok(DirectorySizeResult {
        total_size: total as f64,
        file_count: files as f64,
        duration_ms: now_ms(t0),
    })
}

#[napi]
pub fn get_directory_size_by_glob_sync(
    pattern: String,
    options: Option<DirectorySizeOptions>,
) -> Result<DirectorySizeResult> {
    glob_impl(pattern, options, JobToken::new(None))
}

pub struct GlobTask {
    pattern: String,
    opts: Option<DirectorySizeOptions>,
    job: Option<JobToken>,
}

impl Task for GlobTask {
    type Output = DirectorySizeResult;
    type JsValue = DirectorySizeResult;

    fn compute(&mut self) -> Result<Self::Output> {
        let token = self.job.take().unwrap_or_else(|| JobToken::new(None));
        glob_impl(self.pattern.clone(), self.opts.take(), token)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
pub fn get_directory_size_by_glob_async(
    pattern: String,
    options: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
) -> Result<AsyncTask<GlobTask>> {
    validate_workers(&options)?;
    let job = job_id.map(|id| JobToken::new(Some(id)));
    Ok(AsyncTask::new(GlobTask {
        pattern,
        opts: options,
        job,
    }))
}

// ---------------------------------------------------------------------------
// detectHardlinks (sync + async)
// ---------------------------------------------------------------------------

fn hardlinks_impl(
    path: String,
    opts: Option<DirectorySizeOptions>,
    token: JobToken,
) -> Result<HardlinkDetectionResult> {
    validate_workers(&opts)?;
    let root = Path::new(&path);
    let md = fs::symlink_metadata(root).map_err(|_| {
        Error::new(
            Status::InvalidArg,
            format!("Root path does not exist: {}", path),
        )
    })?;

    let t0 = Instant::now();

    // Single file: direct nlink check.
    if !md.is_dir() {
        let nlink = md.nlink();
        return Ok(HardlinkDetectionResult {
            has_hardlinks: nlink > 1,
            hardlink_count: if nlink > 1 { 1.0 } else { 0.0 },
            total_files: 1.0,
            duration_ms: now_ms(t0),
        });
    }

    // Directory walk: track (dev, ino) pairs; a file is hardlinked when its
    // nlink > 1 or when the same inode shows up more than once.
    let mut seen: HashSet<(u64, u64)> = HashSet::new();
    let mut has = false;
    let mut hardlink_count: u64 = 0;
    let mut total_files: u64 = 0;
    let mut visited = 0usize;
    let mut stack: Vec<PathBuf> = vec![root.to_path_buf()];

    while let Some(dir) = stack.pop() {
        let rd = match fs::read_dir(&dir) {
            Ok(rd) => rd,
            Err(_) => continue,
        };
        for entry in rd.flatten() {
            let p = entry.path();
            match fs::symlink_metadata(&p) {
                Ok(emd) if emd.is_file() => {
                    total_files += 1;
                    let key = (emd.dev(), emd.ino());
                    let dup = !seen.insert(key);
                    if emd.nlink() > 1 || dup {
                        has = true;
                        hardlink_count += 1;
                    }
                }
                Ok(emd) if emd.is_dir() && !emd.file_type().is_symlink() => stack.push(p),
                Ok(_) => total_files += 1, // symlink/fifo/etc: counted, no link check
                Err(_) => {}
            }
            visited += 1;
            if visited % CHECK_INTERVAL == 0 && token.cancelled() {
                return Err(cancelled_err(token.id.unwrap_or(0)));
            }
        }
    }

    Ok(HardlinkDetectionResult {
        has_hardlinks: has,
        hardlink_count: hardlink_count as f64,
        total_files: total_files as f64,
        duration_ms: now_ms(t0),
    })
}

#[napi]
pub fn detect_hardlinks_sync(
    path: String,
    options: Option<DirectorySizeOptions>,
) -> Result<HardlinkDetectionResult> {
    hardlinks_impl(path, options, JobToken::new(None))
}

pub struct HardlinkTask {
    path: String,
    opts: Option<DirectorySizeOptions>,
    job: Option<JobToken>,
}

impl Task for HardlinkTask {
    type Output = HardlinkDetectionResult;
    type JsValue = HardlinkDetectionResult;

    fn compute(&mut self) -> Result<Self::Output> {
        let token = self.job.take().unwrap_or_else(|| JobToken::new(None));
        hardlinks_impl(self.path.clone(), self.opts.take(), token)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
pub fn detect_hardlinks_async(
    path: String,
    options: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
) -> Result<AsyncTask<HardlinkTask>> {
    validate_workers(&options)?;
    let job = job_id.map(|id| JobToken::new(Some(id)));
    Ok(AsyncTask::new(HardlinkTask {
        path,
        opts: options,
        job,
    }))
}

// ---------------------------------------------------------------------------
// detectFilesystem (sync + async) — Linux implementation via /proc/mounts +
// statvfs (the macOS build used statfs volume properties).
// ---------------------------------------------------------------------------

fn statvfs_namemax(path: &Path) -> Option<u64> {
    let cpath = std::ffi::CString::new(path.as_os_str().as_bytes()).ok()?;
    let mut sv: libc::statvfs = unsafe { std::mem::zeroed() };
    if unsafe { libc::statvfs(cpath.as_ptr(), &mut sv) } != 0 {
        return None;
    }
    Some(sv.f_namemax as u64)
}

/// Longest matching mount point for `path` from /proc/mounts.
fn find_mount(path: &Path) -> Option<(String /*fstype*/, String /*device*/, String /*mountpoint*/)> {
    let content = fs::read_to_string("/proc/mounts").ok()?;
    let canonical = fs::canonicalize(path).unwrap_or_else(|_| path.to_path_buf());
    let cpath = canonical.to_string_lossy().to_string();
    let mut best: Option<usize> = None;
    let mut best_row: Option<(String, String, String)> = None;
    for line in content.lines() {
        let mut it = line.split_whitespace();
        let (Some(dev), Some(mnt), Some(fstype)) = (it.next(), it.next(), it.next()) else {
            continue;
        };
        let mnt = mnt.replace("\\040", " ");
        let hit = if mnt == "/" {
            true
        } else {
            cpath == mnt || cpath.starts_with(&format!("{}/", mnt))
        };
        if hit {
            let len = mnt.len();
            if best.map(|b| len > b).unwrap_or(true) {
                best = Some(len);
                best_row = Some((fstype.to_string(), dev.to_string(), mnt));
            }
        }
    }
    best_row
}

fn fs_info_impl(path: String, _opts: Option<DirectorySizeOptions>, _job_id: Option<u32>) -> Result<FilesystemInfo> {
    let p = Path::new(&path);
    if fs::symlink_metadata(p).is_err() {
        return Err(Error::new(
            Status::InvalidArg,
            format!("Path does not exist: {}", path),
        ));
    }
    let (fstype, device, mountpoint) = find_mount(p).ok_or_else(|| {
        Error::new(
            Status::GenericFailure,
            format!("Failed to get filesystem information for '{}'", path),
        )
    })?;

    let namemax = statvfs_namemax(p).unwrap_or(255);

    let lower = fstype.to_lowercase();
    let case_insensitive = matches!(
        lower.as_str(),
        "vfat" | "msdos" | "fat32" | "exfat" | "ntfs" | "ntfs3" | "hfs" | "hfsplus" | "apfs" | "cifs" | "smbfs" | "smb2" | "webdav" | "fuseblk"
    );
    let compression = matches!(
        lower.as_str(),
        "btrfs" | "zfs" | "f2fs" | "bcachefs" | "reiserfs" | "jfs"
    );
    let encryption = matches!(lower.as_str(), "ecryptfs" | "fscrypt");

    // volumeName: label if resolvable via device basename, else the device.
    let volume_name = Path::new(&device)
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| mountpoint.clone());

    Ok(FilesystemInfo {
        filesystem_type: fstype,
        volume_name,
        max_filename_length: namemax as f64,
        supports_case_sensitive_names: !case_insensitive,
        supports_unicode_filenames: true,
        supports_compression: compression,
        supports_encryption: encryption,
    })
}

#[napi]
pub fn detect_filesystem_sync(
    path: String,
    options: Option<DirectorySizeOptions>,
) -> Result<FilesystemInfo> {
    fs_info_impl(path, options, None)
}

pub struct FsTask {
    path: String,
    opts: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
}

impl Task for FsTask {
    type Output = FilesystemInfo;
    type JsValue = FilesystemInfo;

    fn compute(&mut self) -> Result<Self::Output> {
        fs_info_impl(self.path.clone(), self.opts.take(), self.job_id)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
pub fn detect_filesystem_async(
    path: String,
    options: Option<DirectorySizeOptions>,
    job_id: Option<u32>,
) -> Result<AsyncTask<FsTask>> {
    Ok(AsyncTask::new(FsTask {
        path,
        opts: options,
        job_id,
    }))
}

