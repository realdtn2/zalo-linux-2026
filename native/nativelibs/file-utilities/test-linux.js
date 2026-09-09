/* Throwaway functional test for the linux-x64 file-utilities native binding.
 * Run: cd /tmp/ezap && ELECTRON_RUN_AS_NODE=1 ./electron/electron <this file>
 * Also works with plain node v22.
 */
'use strict'
const assert = require('assert')
const fs = require('fs')
const path = require('path')

const DIR = '/tmp/fu-test'
const HARD = '/tmp/fu-hard'
const BIG = '/tmp/fu-big'

// ---- setup ----------------------------------------------------------------
for (const d of [DIR, HARD, BIG]) fs.rmSync(d, { recursive: true, force: true })

fs.mkdirSync(`${DIR}/sub/deep`, { recursive: true })
fs.mkdirSync(`${DIR}/empty`, { recursive: true })
fs.writeFileSync(`${DIR}/a.txt`, Buffer.alloc(1000, 0x61))
fs.writeFileSync(`${DIR}/sub/b.bin`, Buffer.alloc(2048, 0x62))
fs.writeFileSync(`${DIR}/sub/deep/c.db`, Buffer.alloc(4096, 0x63))
fs.symlinkSync(`${DIR}/a.txt`, `${DIR}/link.txt`)

// hardlink trio: two links of one inode + one unique file
fs.mkdirSync(HARD, { recursive: true })
fs.writeFileSync(`${HARD}/a.txt`, Buffer.alloc(123, 1))
fs.linkSync(`${HARD}/a.txt`, `${HARD}/b.txt`)
fs.writeFileSync(`${HARD}/c.txt`, Buffer.alloc(45, 2))

// big tree: 200 dirs x 100 files = 20k files (abort/cancel target)
for (let d = 0; d < 200; d++) {
  const dir = `${BIG}/d${d}`
  fs.mkdirSync(dir, { recursive: true })
  for (let f = 0; f < 100; f++) fs.writeFileSync(`${dir}/f${f}.dat`, Buffer.alloc(8, d))
}

const EXPECT_TOTAL = 1000 + 2048 + 4096 // symlink contributes 0 (lstat semantics)
const EXPECT_FILES = 4                  // a.txt, b.bin, c.db, link.txt

function ok(name) {
  console.log('PASS', name)
}

;(async () => {
  // ---- wrapper (index.js) is the module under test -------------------------
  const fu = require('./index.js')
  assert.strictEqual(typeof fu.getDirectorySizeSync, 'function')
  assert.strictEqual(typeof fu.getDirectorySizeAsync, 'function')
  assert.strictEqual(typeof fu.detectHardlinksSync, 'function')
  assert.strictEqual(typeof fu.detectFilesystemSync, 'function')
  ok('wrapper exports present')

  // ---- sync size -----------------------------------------------------------
  const s = fu.getDirectorySizeSync(DIR)
  assert.strictEqual(s.totalSize, EXPECT_TOTAL, `totalSize ${s.totalSize}`)
  assert.strictEqual(s.fileCount, EXPECT_FILES, `fileCount ${s.fileCount}`)
  assert.ok(typeof s.durationMs === 'number' && s.durationMs >= 0)
  ok(`getDirectorySizeSync (totalSize=${s.totalSize}, fileCount=${s.fileCount})`)

  // consumers read s?.totalSize / s?.fileCount — same object shape
  ok('consumer field access pattern (s?.totalSize, s?.fileCount)')

  // ---- async size resolves same -------------------------------------------
  const a = await fu.getDirectorySizeAsync(DIR)
  assert.strictEqual(a.totalSize, EXPECT_TOTAL)
  assert.strictEqual(a.fileCount, EXPECT_FILES)
  ok('getDirectorySizeAsync resolves same values')

  // ---- workers validation --------------------------------------------------
  assert.throws(() => fu.getDirectorySizeSync(DIR, { workers: 0 }), /greater than 0/)
  const a4 = await fu.getDirectorySizeAsync(DIR, { workers: 4 })
  assert.strictEqual(a4.totalSize, EXPECT_TOTAL)
  ok('workers:0 rejected, workers:4 accepted (ignored, single-threaded)')

  // ---- bad args ------------------------------------------------------------
  assert.throws(() => fu.getDirectorySizeSync('/tmp/definitely-not-here-xyz'), /does not exist or cannot be accessed/)
  assert.throws(() => fu.getDirectorySizeSync(`${DIR}/a.txt`), /not a directory/)
  ok('invalid path errors')

  // ---- tree mode (deep) ----------------------------------------------------
  const t = fu.getDirectorySizeSync(DIR, { deep: { maxDepth: 3 } })
  assert.strictEqual(t.totalSize, EXPECT_TOTAL)
  assert.strictEqual(t.fileCount, EXPECT_FILES)
  assert.ok(Array.isArray(t.children) && t.children.length === 2, `children len ${t.children && t.children.length}`)
  const sub = t.children.find((c) => c.name === 'sub')
  const empty = t.children.find((c) => c.name === 'empty')
  assert.ok(sub && empty)
  assert.strictEqual(sub.relativePath, 'sub')
  assert.strictEqual(sub.depth, 1)
  assert.strictEqual(sub.totalSize, 2048 + 4096)
  assert.strictEqual(sub.fileCount, 2)
  assert.strictEqual(sub.dirCount, 1)
  assert.strictEqual(sub.children[0].name, 'deep')
  assert.strictEqual(sub.children[0].relativePath, 'sub/deep')
  assert.strictEqual(sub.children[0].depth, 2)
  assert.strictEqual(sub.children[0].totalSize, 4096)
  assert.strictEqual(empty.totalSize, 0)
  assert.strictEqual(t.dirCount, 3) // sub + sub/deep + empty
  ok(`tree mode (children=${t.children.length}, dirCount=${t.dirCount})`)

  const tr = fu.getDirectorySizeSync(DIR, { deep: { maxDepth: 3, includeRoot: true } })
  assert.strictEqual(tr.children[0].name, 'fu-test')
  assert.strictEqual(tr.children[0].depth, 0)
  assert.strictEqual(tr.children[0].totalSize, EXPECT_TOTAL)
  ok('tree includeRoot prepends root node')

  // async deep branch
  const ta = await fu.getDirectorySizeAsync(DIR, { deep: { maxDepth: 3 } })
  assert.strictEqual(ta.totalSize, EXPECT_TOTAL)
  assert.strictEqual(ta.children.length, 2)
  ok('getDirectorySizeAsync deep branch')

  // ---- byGlob --------------------------------------------------------------
  const g = fu.getDirectorySizeByGlobSync('/tmp/fu-test/**/*.db')
  assert.strictEqual(g.totalSize, 4096)
  assert.strictEqual(g.fileCount, 1)
  const ga = await fu.getDirectorySizeByGlobAsync('/tmp/fu-test/**/*.db')
  assert.strictEqual(ga.totalSize, 4096)
  assert.strictEqual(ga.fileCount, 1)
  ok('byGlob absolute pattern sums only matches')

  const cwd = process.cwd()
  process.chdir(DIR)
  try {
    const gr = fu.getDirectorySizeByGlobSync('**/*.db')
    assert.strictEqual(gr.totalSize, 4096)
    assert.strictEqual(gr.fileCount, 1)
    const gw = fu.getDirectorySizeByGlobSync('**/*.db', { workers: 4 })
    assert.strictEqual(gw.totalSize, 4096)
  } finally {
    process.chdir(cwd)
  }
  ok('byGlob relative pattern + workers option')

  assert.throws(() => fu.getDirectorySizeByGlobSync('['), /Invalid glob pattern|Failed to build glob set/)
  ok('invalid glob pattern rejected')

  // ---- hardlinks -----------------------------------------------------------
  const h = fu.detectHardlinksSync(HARD)
  assert.strictEqual(h.hasHardlinks, true, JSON.stringify(h))
  assert.strictEqual(h.hardlinkCount, 2)
  assert.strictEqual(h.totalFiles, 3)
  const hSingle = fu.detectHardlinksSync(`${HARD}/a.txt`)
  assert.strictEqual(hSingle.hasHardlinks, true)
  const hSolo = fu.detectHardlinksSync(`${HARD}/c.txt`)
  assert.strictEqual(hSolo.hasHardlinks, false)
  const hDirNone = fu.detectHardlinksSync(DIR) // no hardlinks in fu-test
  assert.strictEqual(hDirNone.hasHardlinks, false)
  const ha = await fu.detectHardlinksAsync(HARD)
  assert.strictEqual(ha.hasHardlinks, true)
  ok(`detectHardlinks (dir pair + single-file nlink>1, ${JSON.stringify(h)})`)

  // ---- filesystem ----------------------------------------------------------
  const fi = fu.detectFilesystemSync(DIR)
  assert.ok(typeof fi.filesystemType === 'string' && fi.filesystemType.length > 0, JSON.stringify(fi))
  assert.ok(typeof fi.volumeName === 'string')
  assert.ok(typeof fi.maxFilenameLength === 'number' && fi.maxFilenameLength > 0)
  assert.ok(typeof fi.supportsCaseSensitiveNames === 'boolean')
  console.log('  detectFilesystem ->', JSON.stringify(fi))
  const fia = await fu.detectFilesystemAsync('/tmp')
  assert.ok(typeof fia.filesystemType === 'string' && fia.filesystemType.length > 0)
  ok(`detectFilesystem (type=${fi.filesystemType})`)

  // ---- abortSignal mid-scan -----------------------------------------------
  // Job is registered synchronously on the JS thread, so an abort on the same
  // tick flips the flag before the worker finishes walking 20k entries.
  const ac = new AbortController()
  const p = fu.getDirectorySizeAsync(BIG, { abortSignal: ac.signal })
  ac.abort()
  let rejected = false
  try {
    await p
  } catch (e) {
    rejected = true
    assert.ok(/cancel/i.test(String(e && e.message)), `unexpected abort error: ${e && e.message}`)
  }
  assert.ok(rejected, 'aborted scan must reject')
  ok('abortSignal mid-scan rejects (Cancelled)')

  // ---- cancelJob (direct binding) ------------------------------------------
  const bin = require('./linux-x64/file-utilities.node')
  assert.strictEqual(typeof bin.cancelJob, 'function')
  assert.strictEqual(bin.cancelJob(999999), false, 'unknown job -> false')
  const p2 = bin.getDirectorySizeAsync(BIG, undefined, 4242)
  assert.strictEqual(bin.cancelJob(4242), true, 'registered job -> true')
  let rejected2 = false
  try {
    await p2
  } catch (e) {
    rejected2 = true
    assert.ok(/cancel/i.test(String(e && e.message)))
  }
  assert.ok(rejected2, 'cancelled job must reject')
  // completed job deregisters -> subsequent cancelJob is false
  const p3 = bin.getDirectorySizeAsync(DIR, undefined, 4343)
  await p3
  await new Promise((r) => setTimeout(r, 50))
  assert.strictEqual(bin.cancelJob(4343), false, 'finished job deregistered')
  ok('cancelJob: unknown=false, running=true+reject, finished=deregistered')

  // direct tree/glob/hardlink async fns exist with exact names
  for (const n of [
    'getDirectorySizeSync', 'getDirectorySizeAsync',
    'getDirectorySizeTreeSync', 'getDirectorySizeTreeAsync',
    'getDirectorySizeByGlobSync', 'getDirectorySizeByGlobAsync',
    'detectHardlinksSync', 'detectHardlinksAsync',
    'detectFilesystemSync', 'detectFilesystemAsync', 'cancelJob',
  ]) {
    assert.strictEqual(typeof bin[n], 'function', `missing native export ${n}`)
  }
  ok('all 11 native exports present')

  // ---- require('file-utilities') resolution --------------------------------
  let viaName, resolved
  try {
    viaName = require('file-utilities')
    resolved = require.resolve('file-utilities')
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e
    viaName = require('./index.js')
    resolved = path.resolve('./index.js')
  }
  assert.strictEqual(viaName.getDirectorySizeSync(DIR).totalSize, EXPECT_TOTAL)
  assert.ok(resolved.endsWith(path.join('file-utilities', 'index.js')) ||
    resolved === path.resolve('./index.js'), `resolved to ${resolved}`)
  ok(`require('file-utilities') -> ${resolved}`)

  console.log('\nALL TESTS PASS')
})().catch((e) => {
  console.error('TEST FAILURE:', e)
  process.exit(1)
})
