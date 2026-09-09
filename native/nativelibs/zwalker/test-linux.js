'use strict';
// Parity test for the pure-JS zwalker port. Mirrors the macOS ground-truth
// probe cases (zre/probe1..14): scan totals, marker shape (self-entry,
// trailing-slash parent, update_count lifecycle), sidecar rewrite, homeless
// delete math (protected+failed+self retention), range bucketing, cascade.
//
// Run with plain node (>=18) OR electron-as-node:
//   node native/nativelibs/zwalker/test-linux.js
const assert = require('assert');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');

const zw = require('./linux.js');

async function main() {
  const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'zw-parity-'));

  async function mk(name, tree) {
    const root = path.join(tmp, name);
    await fsp.rm(root, { recursive: true, force: true });
    await fsp.mkdir(root, { recursive: true });
    for (const [rel, spec] of Object.entries(tree)) {
      const full = path.join(root, rel);
      if (rel.endsWith('/')) {
        await fsp.mkdir(full, { recursive: true });
        continue;
      }
      await fsp.mkdir(path.dirname(full), { recursive: true });
      if (typeof spec === 'number') await fsp.writeFile(full, Buffer.alloc(spec, 7));
      else await fsp.writeFile(full, spec);
    }
    return root;
  }

  async function marker(root) {
    return JSON.parse(await fsp.readFile(path.join(root, '.zwalker.json'), 'utf8'));
  }

  async function exists(p) {
    try {
      await fsp.stat(p);
      return true;
    } catch {
      return false;
    }
  }

  async function expectErr(fn, { messageIncludes, status }) {
    try {
      await fn();
      assert.fail('expected throw: ' + messageIncludes);
    } catch (e) {
      if (e === 'expected throw: ' + messageIncludes) throw e;
      assert.ok(String(e.message).includes(messageIncludes), `msg "${e.message}" lacks "${messageIncludes}"`);
      if (status) assert.strictEqual(e.status, status, `status ${e.status} != ${status}`);
    }
  }

  let pass = 0;
  async function T(name, fn) {
    await fn();
    pass += 1;
    console.log('ok -', name);
  }

  // ---- scanDirectory -----------------------------------------------------------
  await T('scan totals + marker self-entry + trailing-slash parent', async () => {
    const R = await mk('S1', { 'a.bin': 10, 'b.bin': 20, 'sub/c.bin': 4 });
    const res = await zw.scanDirectory(R, []);
    assert.strictEqual(res.fileNumber, 3);
    assert.strictEqual(res.size, 34);
    assert.strictEqual(res.trackingPath, '');
    const m = await marker(R);
    assert.strictEqual(m.files.length, 3); // marker written after walk -> not self-listed
    assert.strictEqual(m.update_count, 0);
    assert.strictEqual(m.folder_name, 'S1');
    assert.strictEqual(m.folder_path, R);
    assert.ok(m.folder_parent_path.endsWith(path.sep)); // native quirk
    assert.deepStrictEqual(Object.keys(m.sub_folders).sort(), [path.join(R, 'sub')].sort());
    assert.deepStrictEqual(m.sub_folders[path.join(R, 'sub')], { size: 0, path: path.join(R, 'sub') });
    // rescan: existing marker becomes a self-entry with its real on-disk byte size
    const st = await fsp.stat(path.join(R, '.zwalker.json'));
    const res2 = await zw.scanDirectory(R, []);
    assert.strictEqual(res2.fileNumber, 4);
    assert.strictEqual(res2.size, 34 + st.size);
    const m2 = await marker(R);
    const self = m2.files.find((f) => f.file_name === '.zwalker.json');
    assert.ok(self, 'self entry present');
    assert.strictEqual(self.reference_message_id, null);
    assert.strictEqual(self.size, st.size);
  });

  await T('scan trackingPath map', async () => {
    const R = await mk('D', { 'sub/big.bin': 15, 'sub/sib.bin': 5, 'a.bin': 1 });
    const res = await zw.scanDirectory(R, [path.join(R, 'sub'), '/nonexistent']);
    const map = JSON.parse(res.trackingPath);
    assert.deepStrictEqual(map[path.join(R, 'sub')], { size: 20, path: path.join(R, 'sub'), file_number: 2 });
    assert.ok(!('' + '/nonexistent' in map) && map['/nonexistent'] === undefined, 'outside paths omitted');
  });

  await T('scan validation errors', async () => {
    await expectErr(() => zw.scanDirectory('', []), { messageIncludes: 'Folder name not found', status: 'GenericFailure' });
    await expectErr(() => zw.scanDirectory(42, []), { messageIncludes: 'into rust type `String`', status: 'InvalidArg' });
    await expectErr(() => zw.scanDirectory(path.join(tmp, 'S1'), 'no'), { messageIncludes: 'Given napi value is not an array', status: 'InvalidArg' });
    await expectErr(() => zw.scanDirectory(path.join(tmp, 'S1'), [5]), { messageIncludes: 'into rust type `String`', status: 'InvalidArg' });
    const F = await mk('file1', { 'x.bin': 1 });
    await expectErr(() => zw.scanDirectory(path.join(F, 'x.bin'), []), { messageIncludes: '"error_code":1016', status: 'GenericFailure' });
    await expectErr(() => zw.scanDirectory(path.join(tmp, 'nope'), []), { messageIncludes: '"error_code":1016', status: 'GenericFailure' });
  });

  // ---- updateReferenceMessageId --------------------------------------------------
  await T('update: sidecar rewrite, ghost skip, update_count every call', async () => {
    const R = await mk('B2', { 'p.bin': 10, 'p.bin.json': JSON.stringify({ id: 'k', name: 'n' }), 'q.bin': 15 });
    await zw.scanDirectory(R, []);
    const r1 = await zw.updateReferenceMessageId(R, [{ id: 'a', filePath: path.join(R, 'ghost.bin') }]);
    assert.deepStrictEqual(r1, { updateCount: 1 }, 'ghost call still bumps uc');
    const r2 = await zw.updateReferenceMessageId(R, [{ id: 'a', filePath: path.join(R, 'p.bin') }]);
    assert.deepStrictEqual(r2, { updateCount: 2 });
    const side = JSON.parse(await fsp.readFile(path.join(R, 'p.bin.json'), 'utf8'));
    assert.strictEqual(side.id, undefined);
    assert.strictEqual(side.reference_message_id, 'a');
    assert.strictEqual(side.name, 'n', 'other sidecar keys preserved');
    const m = await marker(R);
    const p = m.files.find((f) => f.file_name === 'p.bin');
    assert.strictEqual(p.reference_message_id, 'a');
    const empty = await zw.updateReferenceMessageId(R, []);
    assert.deepStrictEqual(empty, { updateCount: 3 }, 'empty call bumps uc (B2-mk-empty)');

    // pre-flight validation: bad item AFTER good one -> nothing written (B3)
    await expectErr(
      () => zw.updateReferenceMessageId(R, [{ id: 'z', filePath: path.join(R, 'q.bin') }, { id: null, filePath: path.join(R, 'p.bin') }]),
      { messageIncludes: 'Null` into rust type `String` on BaseFileInfoUpdated.id', status: 'InvalidArg' }
    );
    const m2 = await marker(R);
    const q = m2.files.find((f) => f.file_name === 'q.bin');
    assert.strictEqual(q.reference_message_id, null, 'no partial write before validation');
    assert.strictEqual(m2.update_count, 3, 'uc untouched by rejected call');
  });

  await T('update: missing marker -> 1017; file root -> 1000', async () => {
    const R = await mk('B3', { 'p.bin': 10 });
    await expectErr(() => zw.updateReferenceMessageId(R, [{ id: 'k', filePath: path.join(R, 'p.bin') }]), {
      messageIncludes: '"error_code":1017',
      status: 'GenericFailure',
    });
    const F = path.join(tmp, 'file1', 'x.bin');
    await expectErr(() => zw.updateReferenceMessageId(F, [{ id: 'k', filePath: F }]), {
      messageIncludes: '"error_code":1000',
      status: 'GenericFailure',
    });
    await expectErr(() => zw.updateReferenceMessageId(path.join(tmp, 'S1'), { not: 'array' }), {
      messageIncludes: 'Given napi value is not an array',
      status: 'InvalidArg',
    });
    await expectErr(() => zw.updateReferenceMessageId(path.join(tmp, 'S1'), [{ filePath: 'x' }]), {
      messageIncludes: 'Missing field `id`',
      status: 'InvalidArg',
    });
  });

  // ---- statUnmarkedFiles ----------------------------------------------------------
  await T('stat excludes self-entry; tracks ref reset', async () => {
    const R = await mk('C', { 'h.bin': 7, 'refd.bin': 3 });
    await zw.scanDirectory(R, []);
    await zw.updateReferenceMessageId(R, [{ id: 'm', filePath: path.join(R, 'refd.bin') }]);
    const res = await zw.statUnmarkedFiles(R, [], [], []);
    assert.deepStrictEqual(res, { fileNumber: 1, size: 7, trackingPath: '', trackingATime: '' });

    // rescan resets refs -> both counted, plus stale self entry present from C scan
    await zw.scanDirectory(R, []);
    const res2 = await zw.statUnmarkedFiles(R, [], [], []);
    assert.strictEqual(res2.fileNumber, 2, 'h.bin + refd.bin (self excluded)');
    assert.strictEqual(res2.size, 10);
  });

  await T('stat range buckets: lo<atime<=hi', async () => {
    const R = await mk('C2', { 'new.bin': 30 });
    await zw.scanDirectory(R, []);
    const now = Math.floor(Date.now() / 1000);
    const res = await zw.statUnmarkedFiles(R, [], [], [3600, now + 10, now + 7200]);
    const at = JSON.parse(res.trackingATime);
    assert.ok(at['3600'], 'bucket per unique value');
    assert.strictEqual(at['3600'].file_number, 0);
    assert.strictEqual(at[String(now + 10)].file_number, 1, 'fresh file in (3600, now+10]');
    assert.strictEqual(at[String(now + 7200)].file_number, 0);
    assert.strictEqual(res.fileNumber, 1, 'main count not range-filtered');
  });

  await T('stat arg validation', async () => {
    const R = path.join(tmp, 'C');
    await expectErr(() => zw.statUnmarkedFiles(R, [], [], 'x'), { messageIncludes: 'Given napi value is not an array', status: 'InvalidArg' });
    const F = path.join(tmp, 'file1', 'x.bin');
    await expectErr(() => zw.statUnmarkedFiles(F, [], [], []), { messageIncludes: '"error_code":1000', status: 'GenericFailure' });
    await expectErr(() => zw.statUnmarkedFiles(path.join(tmp, 'nope'), [], [], []), { messageIncludes: '"error_code":1017', status: 'GenericFailure' });
  });

  // ---- deleteHomelessFiles ---------------------------------------------------------
  await T('cons: protected+failed+self retained in return', async () => {
    const R = await mk('F', { 'keep.bin': 5, 'gone1.bin': 6, 'gone2.bin': 7 });
    await zw.scanDirectory(R, []);
    await zw.updateReferenceMessageId(R, [{ id: 'k', filePath: path.join(R, 'keep.bin') }]);
    const res = await zw.deleteHomelessFiles(R, [], [], false);
    // survivor keep.bin(5) + failed gone1(6, ENOENT after manual rm) ... emulate by rm first
    assert.ok(!(await exists(path.join(R, 'gone2.bin'))), 'homeless deleted');
    assert.ok(await exists(path.join(R, 'keep.bin')), 'protected kept');
    assert.strictEqual(res.trackingPath, '');
    assert.ok(await exists(path.join(R, '.zwalker.json')), 'cons keeps marker');
    const m = await marker(R);
    // Conservative rewrite = VERBATIM snapshot (D-mk/F-cons): deleted homeless
    // entries stay listed, update_count untouched, and NO self-entry is
    // appended when the scan was fresh (marker absent at walk time).
    assert.deepStrictEqual(
      m.files.map((f) => [f.file_name, f.size, f.reference_message_id]),
      [
        ['keep.bin', 5, 'k'],
        ['gone1.bin', 6, null],
        ['gone2.bin', 7, null],
      ].sort(),
      'verbatim rewrite'
    );
    assert.strictEqual(m.files.length, 3, 'no self entry appended');
    assert.strictEqual(m.update_count, 1, 'uc untouched by cons');
  });

  await T('cons: ENOENT homeless counts as failed, stays in stats (F-cons)', async () => {
    const R = await mk('F2', { 'keep.bin': 5, 'gone1.bin': 6, 'gone2.bin': 7 });
    await zw.scanDirectory(R, []);
    await zw.updateReferenceMessageId(R, [{ id: 'k', filePath: path.join(R, 'keep.bin') }]);
    await fsp.unlink(path.join(R, 'gone1.bin')); // race -> ENOENT on unlink
    const res = await zw.deleteHomelessFiles(R, [], [], false);
    assert.strictEqual(res.fileNumber, 2, 'keep + failed gone1');
    assert.strictEqual(res.size, 11, 'marker sizes, not re-stat');
    assert.strictEqual(res.failedFileNumber, 1);
    assert.strictEqual(res.failedSize, 6);
  });

  await T('aggr: sweep deletes ALL disk files incl. marker + protected, stats from snapshot (F-aggr)', async () => {
    const R = path.join(tmp, 'F2');
    const res = await zw.deleteHomelessFiles(R, [], [], true);
    // Raw F-aggr: failed = both homeless (gone1 manual-rm ENOENT, gone2
    // already unlinked by cons -> ENOENT) = {2,13}; return = snapshot minus
    // successful deletions = keep + gone1 + gone2 = {3,18} (failed entries
    // stay in the stats, marker sizes).
    assert.strictEqual(res.failedFileNumber, 2, 'both homeless failed with ENOENT');
    assert.strictEqual(res.failedSize, 13);
    assert.strictEqual(res.fileNumber, 3, 'protected + failed retained');
    assert.strictEqual(res.size, 18);
    const leftovers = (await fsp.readdir(R)).sort();
    assert.deepStrictEqual(leftovers, [], 'tree emptied: sweep deletes marker + protected keep.bin');
  });

  await T('cons: homeless set + size = snapshot minus deleted (D/H math)', async () => {
    const R = await mk('H', { 'p.bin': 10, 'p.bin.json': 20, 'sub/c.bin': 4 });
    await zw.scanDirectory(R, []); // files: 10+20+4 = 34
    await zw.updateReferenceMessageId(R, [{ id: 'h1', filePath: path.join(R, 'p.bin') }]);
    await zw.scanDirectory(R, []); // rescan resets refs; self entry now present
    const pre = await marker(R);
    assert.ok(pre.files.some((f) => f.file_name === '.zwalker.json'));
    const res = await zw.deleteHomelessFiles(R, [], [], false);
    const selfEntry = pre.files.find((f) => f.file_name === '.zwalker.json');
    // scanDirectory reset every ref to null (H-mk2): p.bin is homeless again.
    // Homeless unlink set = p.bin, p.bin.json, sub/c.bin (self is protected,
    // never unlinked in cons mode). Return = snapshot minus successes = [self]
    // with its STALE recorded size (H-cons2 raw: {1,591}).
    assert.strictEqual(res.fileNumber, 1, 'only the protected self entry remains');
    assert.strictEqual(res.size, selfEntry.size, 'recorded stale self size, not re-stat');
    assert.strictEqual(res.failedFileNumber, 0);
    assert.ok(!(await exists(path.join(R, 'p.bin'))), 'reset ref -> homeless -> deleted');
    assert.ok(!(await exists(path.join(R, 'p.bin.json'))));
    assert.ok(!(await exists(path.join(R, 'sub', 'c.bin'))));
    assert.ok(await exists(path.join(R, '.zwalker.json')), 'cons keeps marker');
  });

  await T('delete validation: non-array/bool -> InvalidArg; missing root -> 1017', async () => {
    await expectErr(() => zw.deleteHomelessFiles(path.join(tmp, 'H'), [], [], 'yes'), {
      messageIncludes: 'into rust type `bool`',
      status: 'InvalidArg',
    });
    await expectErr(() => zw.deleteHomelessFiles(path.join(tmp, 'nope'), [], [], false), {
      messageIncludes: '"error_code":1017',
      status: 'GenericFailure',
    });
  });

  // ---- deleteEmptyFolders ------------------------------------------------------------
  await T('cascade: deepest-first, root never removed, file-root noop', async () => {
    const R = await mk('D3', { 'empty1/': null, 'nest/deep/': null, 'keepdir/f.bin': 3, 'gone/': null });
    await zw.scanDirectory(R, []);
    // Protect keepdir/f.bin so the cons pass leaves a non-empty dir for the
    // cascade test (scan reset every other ref -> everything else is homeless).
    await zw.updateReferenceMessageId(R, [{ id: 'd', filePath: path.join(R, 'keepdir', 'f.bin') }]);
    await zw.deleteHomelessFiles(R, [], [], false);
    const res = await zw.deleteEmptyFolders(R);
    const goneDirs = res.deletedDirs;
    assert.ok(!goneDirs.includes(R), 'root not deleted');
    for (const d of goneDirs) assert.ok((await exists(d)) === false, d + ' removed');
    assert.ok(await exists(path.join(R, 'keepdir')), 'non-empty dir kept');
    assert.strictEqual(res.deletedCount, goneDirs.length);

    const F = await mk('fileD', { 'x.bin': 2 });
    const fr = await zw.deleteEmptyFolders(path.join(F, 'x.bin'));
    assert.deepStrictEqual(fr, { deletedCount: 0, deletedDirs: [] });
    await expectErr(() => zw.deleteEmptyFolders(path.join(tmp, 'nope')), { messageIncludes: 'The original path does not exist' });
    await expectErr(() => zw.deleteEmptyFolders(''), { messageIncludes: 'The original path does not exist: ' });
  });

  await fsp.rm(tmp, { recursive: true, force: true });
  console.log(`\n${pass} parity checks passed`);

}
main().catch((e) => { console.error(e); process.exit(1); });
