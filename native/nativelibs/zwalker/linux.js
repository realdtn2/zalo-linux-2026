'use strict';
// zwalker - pure-JS Linux drop-in for the macOS NAPI-RS backup-scanner module
// (used by Zalo's local backup / storage cleaner in main-dist).
//
// Contract replicated from macOS ground-truth probes (zre/probe1..14, raw
// outputs zw7..zw14) against zwalker.darwin-arm64/x64.node under Electron.
//
// Marker file: `<root>/.zwalker.json`, written by scanDirectory as a FULL
// snapshot of the tree. Raw schema (verbatim key names from the native module):
//   {"files":[{"file_name","file_path","atime","size","reference_message_id"}],
//    "folder_name","folder_path","folder_parent_path",
//    "size","file_number","update_count","sub_folders":{<absDir>:{"size":0,"path":<absDir>}}}
//  - `files` includes the marker file itself when it already exists on disk;
//    its recorded size is the stale on-disk size measured BEFORE the rewrite
//    (probe H-mk2: self-entry size 591 while the file becomes 726).
//  - `sub_folders` = every directory strictly under root, recursive, each
//    {size: 0, path}. The root itself never appears.
//  - `atime` = whole seconds; `folder_parent_path` carries a trailing path
//    separator (native quirk, e.g. "/Users/dnc/zw14/" for root ".../H").
//
// Lifecycle semantics (probes B/C/D/F/H/R/S/T series):
//  * scanDirectory(path, trackingPaths): walks the tree, RESETS every
//    reference_message_id to null and update_count to 0 (H-mk2), includes an
//    existing marker as a normal entry. trackingPath return = JSON object
//    keyed by each trackingPaths entry that resolves inside the tree, value
//    = {size, path, file_number} of that subtree computed live during the
//    walk (D-scan). trackingPath = "" when the list is empty.
//    Return {fileNumber, size, trackingPath} where fileNumber/size = the
//    whole tree (== marker totals).
//  * updateReferenceMessageId(path, [{id, filePath}]): validates every item
//    BEFORE any disk access (B3: zero partial writes on a late invalid item);
//    matched entries get reference_message_id = id and the `<filePath>.json`
//    sidecar is REWRITTEN with its `id` key converted to
//    `reference_message_id` (H-mk); ghost filePaths are silently skipped;
//    update_count increments by 1 on EVERY call (ghosts/empty included —
//    B2-mk-empty); marker is rewritten each call. Return {updateCount}.
//  * statUnmarkedFiles(path, trackingPaths, ignoreList, ranges): returns
//    {fileNumber, size, trackingPath: "", trackingATime} computed from the
//    marker entries whose reference_message_id is null/undefined, EXCLUDING
//    the marker self-entry (C-stat: {1,7} = h.bin only). trackingATime = ""
//    when ranges is empty; otherwise a JSON object keyed by String(range
//    value) with {size, file_number}, one bucket per unique value, an entry
//    counting into bucket `hi` iff lo < atime <= hi for each consecutive
//    pair (ranges[i], ranges[i+1]) (C2 discriminator). The main count is NOT
//    range-filtered (C-stat-r).
//  * deleteHomelessFiles(path, trackingPaths, ignoreList, aggressive):
//    homeless = ref-null entries excluding the self-entry; both modes unlink
//    them (the self-entry is NEVER unlinked in conservative mode, IS unlinked
//    last in aggressive mode). Return = ALL marker entries MINUS the ones
//    successfully unlinked — protected entries, the self-entry (cons mode) and
//    unlink failures (incl. ENOENT) all remain in the stats, sizes taken from
//    the marker, never re-stat'd (D {1,20}, H-cons2 {1,591}, F {2,11}/{3,18}).
//    failedFileNumber/failedSize = entries whose unlink errored (ENOENT
//    included — F-aggr {2,13}). Aggressive mode additionally unlinks the
//    marker AFTER the loop, even when some unlinks failed (F-aggr/R2).
//    Conservative mode REWRITES the marker afterwards with the self-entry
//    appended if missing (F-after: marker present with self entry).
//    trackingPath always ""; trackingPaths/ignoreList validated as string
//    arrays but otherwise ignored.
//  * deleteEmptyFolders(path): removes empty directories bottom-up below the
//    root; the root is never removed; a file root yields {deletedCount: 0,
//    deletedDirs: []}; a missing/empty root throws plain Error
//    "The original path does not exist: <path>". deletedDirs holds the
//    absolute paths in deletion order (native readdir order is unspecified —
//    the app consumes only length/contents).
//
// Error surface (NAPI-RS): errors carry `status` ('GenericFailure',
// 'InvalidArg', 'StringExpected') and the EXACT native message string:
//   "Folder name not found"                        (scan on '')
//   {"error_code":1016,"error_message":"Error creating file"} (scan: missing/
//      file root/unreadable)
//   {"error_code":1017,"error_message":"Error opening file"}  (update/mark/
//      stat/delete: missing path or missing marker, empty path)
//   {"error_code":1000,"error_message":"File or directory not found"} (same
//      fns on a file root; non-array stat args -> InvalidArg instead)
//   {"error_code":2001,"error_message":"Error converting bytes to JSON"}
//      (marker not valid JSON / wrong shape)
//   "Given napi value is not an array"             (InvalidArg)
//   "Missing field `id`"                           (update item lacks id)
//   "Failed to convert JavaScript value `Null` into rust type `String` on
//    BaseFileInfoUpdated.<field>"                  (wrong scalar types)
//
// Documented deviations: marker JSON key order differs from serde (never read
// positionally); deleteEmptyFolders deletion order; trackingPath map for
// tracking paths outside the tree omits them (native tolerated silently).

const fsp = require('fs/promises');
const path = require('path');

const MARKER_NAME = '.zwalker.json';

// ---- napi-rs error surface -------------------------------------------------

function invalidArg(message) {
  const err = new Error(message);
  err.status = 'InvalidArg';
  return err;
}

function genericFailure(message) {
  const err = new Error(message);
  err.status = 'GenericFailure';
  return err;
}

function errorCode(code, message) {
  return genericFailure(
    `{"error_code":${code},"error_message":"${message}"}`
  );
}

function describeJs(value) {
  if (value === null) return 'Null';
  if (value === undefined) return 'Undefined';
  switch (typeof value) {
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'bigint':
      return 'BigInt';
    case 'function':
      return 'Function';
    case 'symbol':
      return 'Symbol';
    default:
      return 'Object';
  }
}

function parsePathArg(arg) {
  if (typeof arg !== 'string') {
    throw invalidArg(
      `Failed to convert JavaScript value \`${describeJs(arg)}\` into rust type \`String\``
    );
  }
  return arg;
}

function parseBoolArg(arg) {
  if (typeof arg !== 'boolean') {
    throw invalidArg(
      `Failed to convert JavaScript value \`${describeJs(arg)}\` into rust type \`bool\``
    );
  }
  return arg;
}

// Vec<String> argument conversion; `context` names the rust field for error
// messages (only updateReferenceMessageId items carry a field name).
function parseStringList(arg) {
  if (!Array.isArray(arg)) throw invalidArg('Given napi value is not an array');
  return arg.map((item) => {
    if (typeof item !== 'string') {
      throw invalidArg(
        `Failed to convert JavaScript value \`${describeJs(item)}\` into rust type \`String\``
      );
    }
    return item;
  });
}

// ---- marker loading ----------------------------------------------------------
// openMode drives the file-root vs missing-path distinction:
//   'dir1000' (deleteHomeless/stat/update): file root -> 1000; missing/'' -> 1017.
// updateReferenceMessageId also uses 1000 for file roots (A-ref-file/B2).
async function loadMarker(rootPath) {
  let raw;
  try {
    raw = await fsp.readFile(path.join(rootPath, MARKER_NAME), 'utf8');
  } catch (e) {
    if ((e.code === 'ENOENT' || e.code === 'ENOTDIR') && rootPath !== '') {
      try {
        const st = await fsp.stat(rootPath);
        if (!st.isDirectory()) throw errorCode(1000, 'File or directory not found');
      } catch (inner) {
        if (inner && inner.status === 'GenericFailure') throw inner;
      }
    }
    throw errorCode(1017, 'Error opening file');
  }
  let marker;
  try {
    marker = JSON.parse(raw);
  } catch (e) {
    throw errorCode(2001, 'Error converting bytes to JSON');
  }
  if (
    marker === null ||
    typeof marker !== 'object' ||
    Array.isArray(marker) ||
    !Array.isArray(marker.files)
  ) {
    throw errorCode(2001, 'Error converting bytes to JSON');
  }
  if (typeof marker.update_count !== 'number') marker.update_count = 0;
  return { markerPath: path.join(rootPath, MARKER_NAME), marker };
}

function isSelf(entry, rootPath) {
  return (
    typeof entry.file_path === 'string' &&
    path.resolve(entry.file_path) === path.join(path.resolve(rootPath), MARKER_NAME)
  );
}

function isHomeless(entry) {
  return entry.reference_message_id === null || entry.reference_message_id === undefined;
}

function sizeOf(entry) {
  return typeof entry.size === 'number' && Number.isFinite(entry.size) ? entry.size : 0;
}

function statsOf(entries) {
  let fileNumber = 0;
  let size = 0;
  for (const e of entries) {
    fileNumber += 1;
    size += sizeOf(e);
  }
  return { fileNumber, size };
}

// ---- scanDirectory -----------------------------------------------------------
// scanDirectory(path, trackingPaths) -> { fileNumber, size, trackingPath }
async function scanDirectory(rootPathRaw, trackingPathsRaw) {
  const rootPath = parsePathArg(rootPathRaw);
  const trackingPaths = parseStringList(trackingPathsRaw);
  if (rootPath === '') throw genericFailure('Folder name not found');

  const rootAbs = path.resolve(rootPath);
  try {
    const st = await fsp.stat(rootAbs);
    if (!st.isDirectory()) throw errorCode(1016, 'Error creating file');
  } catch (e) {
    if (e && e.status === 'GenericFailure') throw e;
    throw errorCode(1016, 'Error creating file');
  }

  const markerPath = path.join(rootAbs, MARKER_NAME);
  const files = [];
  const subFolders = {};
  // Live per-trackingPath stats keyed by the raw tracking string (D-scan).
  const tracked = new Map();
  for (const tp of trackingPaths) {
    tracked.set(tp, { size: 0, file_number: 0 });
  }

  async function walk(dir) {
    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch (e) {
      throw errorCode(1016, 'Error creating file');
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      let fst;
      try {
        fst = await fsp.lstat(full);
      } catch (e) {
        throw errorCode(1016, 'Error creating file');
      }
      if (fst.isDirectory()) {
        subFolders[path.resolve(full)] = { size: 0, path: path.resolve(full) };
        await walk(full);
      } else if (fst.isFile()) {
        const entry = {
          file_name: ent.name,
          file_path: path.resolve(full),
          atime: Math.floor(fst.atimeMs / 1000),
          size: Number(fst.size),
          reference_message_id: null,
        };
        files.push(entry);
        for (const [tp, agg] of tracked) {
          const tpAbs = path.resolve(tp);
          const rel = path.relative(tpAbs, entry.file_path);
          if (rel === '' || (rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel))) {
            agg.size += entry.size;
            agg.file_number += 1;
          }
        }
      }
    }
  }
  await walk(rootAbs);

  const totals = statsOf(files);
  let parent = path.dirname(rootAbs);
  if (!parent.endsWith(path.sep)) parent += path.sep; // native trailing-sep quirk
  const marker = {
    files,
    folder_name: path.basename(rootAbs),
    folder_path: rootAbs,
    folder_parent_path: parent,
    size: totals.size,
    file_number: files.length,
    update_count: 0,
    sub_folders: subFolders,
  };
  try {
    await fsp.writeFile(markerPath, JSON.stringify(marker));
  } catch (e) {
    throw errorCode(1016, 'Error creating file');
  }

  let trackingPath = '';
  if (trackingPaths.length > 0) {
    const map = {};
    for (const tp of trackingPaths) {
      const tpAbs = path.resolve(tp);
      const rel = path.relative(rootAbs, tpAbs);
      const inside = rel === '' || (rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel));
      if (inside) map[tp] = { size: tracked.get(tp).size, path: tp, file_number: tracked.get(tp).file_number };
    }
    trackingPath = JSON.stringify(map);
  }
  return { fileNumber: totals.fileNumber, size: totals.size, trackingPath };
}

// ---- updateReferenceMessageId --------------------------------------------------
// updateReferenceMessageId(path, [{id, filePath}]) -> { updateCount }
async function updateReferenceMessageId(rootPathRaw, entriesRaw) {
  const rootPath = parsePathArg(rootPathRaw);
  if (!Array.isArray(entriesRaw)) throw invalidArg('Given napi value is not an array');

  // Full pre-flight validation before ANY disk access (probe B3).
  const items = entriesRaw.map((it) => {
    if (it === null || typeof it !== 'object' || Array.isArray(it)) {
      throw invalidArg('Missing field `id`');
    }
    // Absent/undefined field -> serde "Missing field"; an explicit `null`
    // reaches the deserializer and yields the convert error instead (probe:
    // {id:null} -> "Failed to convert ... `Null` ... on BaseFileInfoUpdated.id").
    if (!('id' in it) || it.id === undefined) {
      throw invalidArg('Missing field `id`');
    }
    if (typeof it.id !== 'string') {
      throw invalidArg(
        `Failed to convert JavaScript value \`${describeJs(it.id)}\` into rust type \`String\` on BaseFileInfoUpdated.id`
      );
    }
    if (!('filePath' in it) || it.filePath === undefined) {
      throw invalidArg('Missing field `filePath`');
    }
    if (typeof it.filePath !== 'string') {
      throw invalidArg(
        `Failed to convert JavaScript value \`${describeJs(it.filePath)}\` into rust type \`String\` on BaseFileInfoUpdated.filePath`
      );
    }
    return { id: it.id, filePath: it.filePath };
  });

  const { markerPath, marker } = await loadMarker(rootPath);

  const byPath = new Map();
  for (const f of marker.files) {
    if (typeof f.file_path === 'string') byPath.set(path.resolve(f.file_path), f);
  }

  for (const it of items) {
    const entry = byPath.get(path.resolve(it.filePath));
    if (!entry) continue; // ghost filePaths silently skipped (B2-ghost)
    entry.reference_message_id = it.id;
    // Sidecar rewrite: `id` -> `reference_message_id`, other keys preserved
    // (probe H-mk); unreadable/unparseable sidecar left untouched.
    try {
      const raw = await fsp.readFile(it.filePath + '.json', 'utf8');
      const sidecar = JSON.parse(raw);
      if (sidecar && typeof sidecar === 'object' && !Array.isArray(sidecar)) {
        const { id, ...rest } = sidecar;
        rest.reference_message_id = it.id;
        await fsp.writeFile(it.filePath + '.json', JSON.stringify(rest));
      }
    } catch (e) {
      /* sidecar optional */
    }
  }

  // update_count increments on EVERY call, ghosts/empty included (B2 series).
  marker.update_count += 1;
  try {
    await fsp.writeFile(markerPath, JSON.stringify(marker));
  } catch (e) {
    /* native writes unconditionally; best-effort mirror */
  }
  return { updateCount: marker.update_count };
}

// ---- statUnmarkedFiles ---------------------------------------------------------
// statUnmarkedFiles(path, trackingPaths, ignoreList, ranges)
//   -> { fileNumber, size, trackingPath: "", trackingATime }
async function statUnmarkedFiles(rootPathRaw, trackingPathsRaw, ignoreListRaw, rangesRaw) {
  const rootPath = parsePathArg(rootPathRaw);
  // stat validates args 2/3/4 as arrays BEFORE opening the marker
  // (C-stat-file with valid arrays -> 1000; non-array -> InvalidArg).
  parseStringList(trackingPathsRaw);
  parseStringList(ignoreListRaw);
  const ranges = parseNumberList(rangesRaw);

  const { markerPath, marker } = await loadMarker(rootPath);

  const unmarked = marker.files.filter(
    (f) => isHomeless(f) && !isSelf(f, rootPath) && typeof f.file_path === 'string'
  );
  const { fileNumber, size } = statsOf(unmarked);

  let trackingATime = '';
  if (ranges.length > 0) {
    // Bucket keys = unique range values in first-seen order (C2 raw:
    // [0,5,5,3600] -> {"5","0","3600"}; serde_json emits in hash order so
    // key order is not contractual). Deviation: the C probe ([0,3600]) showed
    // a single "3600" bucket with all-zero counts, which no single generation
    // rule reproduces together with C2; the app consumes only size/
    // file_number totals, never trackingATime, so the all-unique form ships.
    // An entry counts into bucket `hi` iff lo < atime <= hi for each
    // consecutive (ranges[i], ranges[i+1]) pair.
    const buckets = {};
    for (const v of ranges) {
      const key = String(v);
      if (!Object.prototype.hasOwnProperty.call(buckets, key)) {
        buckets[key] = { size: 0, file_number: 0 };
      }
    }
    for (const f of unmarked) {
      if (typeof f.atime !== 'number') continue;
      for (let i = 0; i + 1 < ranges.length; i += 1) {
        const lo = ranges[i];
        const hi = ranges[i + 1];
        if (f.atime > lo && f.atime <= hi) {
          const b = buckets[String(hi)];
          if (b) {
            b.size += sizeOf(f);
            b.file_number += 1;
          }
        }
      }
    }
    trackingATime = JSON.stringify(buckets);
  }
  return { fileNumber, size, trackingPath: '', trackingATime };
}

function parseNumberList(arg) {
  if (!Array.isArray(arg)) throw invalidArg('Given napi value is not an array');
  return arg.map((v) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw invalidArg('Given napi value is not an array');
    }
    return Math.floor(v);
  });
}

// ---- deleteHomelessFiles -------------------------------------------------------
// deleteHomelessFiles(path, trackingPaths, ignoreList, aggressive)
//   -> { fileNumber, size, trackingPath: "", failedFileNumber, failedSize }
async function deleteHomelessFiles(rootPathRaw, trackingPathsRaw, ignoreListRaw, aggressiveRaw) {
  const rootPath = parsePathArg(rootPathRaw);
  parseStringList(trackingPathsRaw);
  parseStringList(ignoreListRaw);
  const aggressive = parseBoolArg(aggressiveRaw);

  const { markerPath, marker } = await loadMarker(rootPath);

  let fileNumber = 0;
  let size = 0;
  let failedFileNumber = 0;
  let failedSize = 0;

  // Entries remaining after the pass = snapshot minus successfully unlinked.
  const survivors = [];
  for (const f of marker.files) {
    const self = isSelf(f, rootPath);
    if (!self && isHomeless(f) && typeof f.file_path === 'string') {
      let removed = false;
      try {
        await fsp.unlink(f.file_path);
        removed = true;
      } catch (e) {
        // ENOENT (already gone) and any other error count as failures; the
        // entry still remains in the returned stats (F/R/T/S series).
        failedFileNumber += 1;
        failedSize += sizeOf(f);
      }
      if (removed) continue;
    }
    if (self && aggressive) {
      // Aggressive mode removes the marker itself last (still never before
      // the homeless pass); it must not appear in the return.
      continue;
    }
    survivors.push(f);
  }
  const kept = statsOf(survivors);
  fileNumber = kept.fileNumber;
  size = kept.size;

  if (aggressive) {
    // Aggressive sweep (F-after-aggr: tree empty afterwards): every non-marker
    // file on disk is unlinked AFTER the snapshot pass, protected entries
    // included, errors silently ignored and NOT counted in failed*. The
    // returned stats were already computed from the snapshot, so swept files
    // (e.g. protected keep.bin) still appear in the return.
    const markerAbs = path.resolve(markerPath);
    const sweep = async (dir) => {
      let entries;
      try {
        entries = await fsp.readdir(dir, { withFileTypes: true });
      } catch (e) {
        return;
      }
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          await sweep(full);
        } else if (path.resolve(full) !== markerAbs) {
          try {
            await fsp.unlink(full);
          } catch (e) {
            /* ignored */
          }
        }
      }
    };
    await sweep(path.resolve(rootPath));
    try {
      await fsp.unlink(markerPath);
    } catch (e) {
      /* already gone */
    }
  } else {
    // Conservative mode rewrites the marker as the VERBATIM snapshot: deleted
    // entries stay listed (D marker still lists deleted y.bin 30; H marker
    // retains p.bin/p.bin.json/c.bin + stale self 591 after cons), update_count
    // untouched, no self-append (D marker has no self entry at all).
    try {
      await fsp.writeFile(markerPath, JSON.stringify(marker));
    } catch (e) {
      /* best effort */
    }
  }

  return { fileNumber, size, trackingPath: '', failedFileNumber, failedSize };
}

// ---- deleteEmptyFolders ----------------------------------------------------------
// deleteEmptyFolders(path) -> { deletedCount, deletedDirs }
async function deleteEmptyFolders(rootPathRaw) {
  const rootPath = parsePathArg(rootPathRaw);
  let rootSt = null;
  if (rootPath !== '') {
    try {
      rootSt = await fsp.stat(path.resolve(rootPath));
    } catch (e) {
      rootSt = null;
    }
  }
  if (!rootSt) throw new Error(`The original path does not exist: ${rootPath}`);
  if (!rootSt.isDirectory()) return { deletedCount: 0, deletedDirs: [] };

  const rootAbs = path.resolve(rootPath);
  const deletedDirs = [];

  async function descend(dir) {
    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch (e) {
      return; // unreadable -> leave subtree alone
    }
    for (const ent of entries) {
      if (ent.isDirectory()) await descend(path.join(dir, ent.name));
    }
    if (dir === rootAbs) return; // root never removed
    let remaining;
    try {
      remaining = await fsp.readdir(dir);
    } catch (e) {
      return;
    }
    if (remaining.length === 0) {
      try {
        await fsp.rmdir(dir);
        deletedDirs.push(dir);
      } catch (e) {
        /* raced non-empty / permissions -> leave */
      }
    }
  }
  await descend(rootAbs);
  return { deletedCount: deletedDirs.length, deletedDirs };
}

module.exports = {
  scanDirectory,
  updateReferenceMessageId,
  deleteHomelessFiles,
  statUnmarkedFiles,
  deleteEmptyFolders,
};
