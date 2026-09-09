'use strict';
// Linux port of the zfile native addon (Windows addon.node / macOS equivalents).
// Pure JS + core Node APIs — no ABI/packaging concerns.
//
// Contract (observed from consumers in main-dist):
//   statFolder(path)        -> Promise<{ fileCount, size, isDirectory, ... }>  (fileCount is destructured for folder size labels)
//   stat(path, isFolder)    -> Promise<same shape>
//   diskInfo()              -> Promise<{ [mountPoint]: { totalSpace, freeSpace, availableSpace, fileSystem } }>
//                              (getDrivesInfo in main-dist/8.js proxies this map; Windows keys are 'C:\\')
//   copyFolder(src,dst,cb)  -> recursive copy, cancellable via cancelCopy()
//   canRead / canWrite / canReadAndWrite (sync booleans)

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

function statSafe(p) {
    try { return fs.statSync(p); } catch (e) { return null; }
}

// Iterative recursive scan; unreadable subtrees are skipped, not fatal.
function walkDir(root) {
    let size = 0;
    let fileCount = 0;
    let directoryCount = 0;
    const stack = [root];
    while (stack.length) {
        const dir = stack.pop();
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch (e) {
            continue;
        }
        for (const ent of entries) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) {
                directoryCount++;
                stack.push(full);
            } else if (ent.isSymbolicLink()) {
                const st = statSafe(full);
                if (!st) continue;
                if (st.isDirectory()) { directoryCount++; stack.push(full); }
                else { size += st.size; fileCount++; }
            } else if (ent.isFile()) {
                const st = statSafe(full);
                if (!st) continue;
                size += st.size;
                fileCount++;
            }
        }
    }
    return { size, fileCount, directoryCount };
}

function getInfo(target, isFolder) {
    const st = statSafe(target);
    if (!st) {
        return Promise.resolve({ size: 0, fileCount: 0, fileNumber: 0, isDirectory: false, errorCode: 'ENOENT' });
    }
    if (isFolder || st.isDirectory()) {
        const t = target;
        const { size, fileCount, directoryCount } = walkDir(t);
        return Promise.resolve({
            size,
            fileCount,
            fileNumber: fileCount,
            directoryCount,
            isDirectory: true,
            mtimeMs: st.mtimeMs,
            atimeMs: st.atimeMs,
            birthtimeMs: st.birthtimeMs,
        });
    }
    return Promise.resolve({
        size: st.size,
        fileCount: 1,
        fileNumber: 1,
        isDirectory: false,
        mtimeMs: st.mtimeMs,
        atimeMs: st.atimeMs,
        birthtimeMs: st.birthtimeMs,
    });
}

const PSEUDO_FS = /^(proc|sysfs|devtmpfs|devpts|securityfs|pstore|efivarfs|mqueue|debugfs|tracefs|configfs|fusectl|cgroup|cgroup2|bpf|autofs|binfmt_misc|hugetlbfs|selinuxfs|ramfs|squashfs|snapoverlay|nsfs|rpc_pipefs|fuse.gvfsd-fuse|fuse.portal|tmpfs)$/;

function isInterestingMount(mp, fstype) {
    if (!mp || mp === 'none') return false;
    if (/^\/(proc|sys|dev|run|snap)($|\/)/.test(mp)) return false;
    // tmpfs root/tmp mounts are the only tmpfs worth showing; the rest are under the prefixes above anyway.
    if (PSEUDO_FS.test(fstype) && fstype !== 'tmpfs') return false;
    return true;
}

// Prefer native statfs when the runtime provides it (Electron >= 29 / Node >= 18.15),
// otherwise parse `df -kP` (POSIX) — no extra binary needed on any Linux.
function readMountsAndSpace(cb) {
    if (typeof fs.statfs === 'function') {
        let mounts;
        try {
            mounts = fs.readFileSync('/proc/mounts', 'utf8').split('\n');
        } catch (e) { return cb(e); }
        const seen = new Set();
        const rows = [];
        const wanted = [];
        for (const line of mounts) {
            const parts = line.trim().split(/\s+/);
            if (parts.length < 3) continue;
            const [, mp, fstype] = parts;
            if (!isInterestingMount(mp, fstype)) continue;
            if (seen.has(mp)) continue;
            seen.add(mp);
            wanted.push({ mp, fstype });
        }
        let pending = wanted.length;
        if (!pending) return cb(null, rows);
        for (const w of wanted) {
            fs.statfs(w.mp, (err, s) => {
                if (!err && s && s.blocks > 0) {
                    const bsize = s.bsize || 4096;
                    rows.push({
                        mount: w.mp,
                        fileSystem: w.fstype,
                        totalSpace: s.blocks * bsize,
                        freeSpace: s.bfree * bsize,
                        availableSpace: s.bavail * bsize,
                    });
                }
                if (--pending === 0) cb(null, rows);
            });
        }
        return;
    }
    execFile('df', ['-kP'], { timeout: 5000 }, (err, out) => {
        if (err) return cb(err);
        const rows = [];
        const seen = new Set();
        for (const line of out.split('\n').slice(1)) {
            const parts = line.trim().split(/\s+/);
            if (parts.length < 6) continue;
            const mp = parts.slice(5).join(' ');
            if (!isInterestingMount(mp, parts[0]) && PSEUDO_FS.test(parts[0])) continue;
            if (seen.has(mp)) continue;
            seen.add(mp);
            const kb = Number(parts[1]);
            if (!Number.isFinite(kb) || kb <= 0) continue;
            rows.push({
                mount: mp,
                fileSystem: parts[0],
                totalSpace: kb * 1024,
                freeSpace: Number(parts[2]) * 1024,
                availableSpace: Number(parts[3]) * 1024,
            });
        }
        cb(null, rows);
    });
}

function diskInfo() {
    return new Promise((resolve) => {
        readMountsAndSpace((err, rows) => {
            const info = {};
            if (!err && rows) {
                for (const r of rows) {
                    info[r.mount] = {
                        totalSpace: r.totalSpace,
                        freeSpace: r.freeSpace,
                        availableSpace: r.availableSpace,
                        fileSystem: r.fileSystem,
                    };
                }
            }
            return resolve(info);
        });
    });
}

let copyCancelled = false;

function cancelCopy() {
    copyCancelled = true;
    return true;
}

async function copyTree(src, dest) {
    let copied = 0;
    const failed = [];
    let cancelled = false;

    async function walk(s, d) {
        if (cancelled) return;
        let entries;
        try {
            await fs.promises.mkdir(d, { recursive: true });
            entries = await fs.promises.readdir(s, { withFileTypes: true });
        } catch (e) {
            failed.push({ path: s, error: e.code || String(e) });
            return;
        }
        for (const ent of entries) {
            if (copyCancelled) { cancelled = true; break; }
            const sp = path.join(s, ent.name);
            const dp = path.join(d, ent.name);
            try {
                if (ent.isDirectory()) {
                    await walk(sp, dp);
                } else {
                    await fs.promises.copyFile(sp, dp);
                    copied++;
                }
            } catch (e) {
                failed.push({ path: sp, error: e.code || String(e) });
            }
            // yield so the UI thread and cancelCopy() get a chance between files
            await new Promise((r) => setImmediate(r));
        }
    }

    await walk(src, dest);
    return { success: !cancelled && failed.length === 0, cancelled, copied, failed };
}

function copyFolder(src, dest, callback) {
    copyCancelled = false;
    const job = copyTree(src, dest);
    if (typeof callback === 'function') {
        job.then(
            (res) => callback(res.cancelled ? Object.assign(new Error('Copy cancelled'), { code: 'ECANCELLED', result: res }) : null, res),
            (err) => callback(err)
        );
        return job;
    }
    return job;
}

function accessOk(p, mode) {
    try {
        fs.accessSync(p, mode);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    stat: (p, isFolder) => getInfo(p, isFolder),
    statFolder: (folderPath) => getInfo(folderPath, true),
    diskInfo,
    copyFolder,
    cancelCopy,
    canRead: (p) => accessOk(p, fs.constants.R_OK),
    canWrite: (p) => accessOk(p, fs.constants.W_OK),
    canReadAndWrite: (p) => accessOk(p, fs.constants.R_OK | fs.constants.W_OK),
};
