'use strict';
// Regression tests for the Linux zfile port (run: node test-linux.js)
// Exercises the real module surface on a real filesystem.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

if (process.platform !== 'linux') { console.log('SKIP: linux-only'); process.exit(0); }

const zfile = require('./index.js');

(async () => {
    assert.strictEqual(typeof zfile.stat, 'function', 'stat');
    assert.strictEqual(typeof zfile.statFolder, 'function', 'statFolder');
    assert.strictEqual(typeof zfile.diskInfo, 'function', 'diskInfo');
    assert.strictEqual(typeof zfile.copyFolder, 'function', 'copyFolder');
    assert.strictEqual(typeof zfile.cancelCopy, 'function', 'cancelCopy');
    assert.strictEqual(typeof zfile.canRead, 'function', 'canRead');
    assert.strictEqual(typeof zfile.canWrite, 'function', 'canWrite');
    assert.strictEqual(typeof zfile.canReadAndWrite, 'function', 'canReadAndWrite');

    // --- stat on a real file ---
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zfile-'));
    const f = path.join(dir, 'a.txt');
    fs.writeFileSync(f, 'hello');
    const st = await zfile.stat(f, false);
    assert.strictEqual(st.isDirectory, false, 'stat isDirectory');
    assert.strictEqual(st.fileNumber, 1, 'stat fileNumber');
    assert.ok(st.size === 5, `stat size got ${st.size}`);
    assert.ok(Number.isFinite(st.mtimeMs) && st.mtimeMs > 0, 'stat mtimeMs');
    assert.ok(Number.isFinite(st.atimeMs), 'stat atimeMs');

    // --- stat on a directory ---
    fs.mkdirSync(path.join(dir, 'sub'));
    fs.writeFileSync(path.join(dir, 'sub', 'b.txt'), '1234567890');
    const stD = await zfile.stat(dir, true);
    assert.strictEqual(stD.isDirectory, true, 'stat dir isDirectory');

    // --- statFolder sums recursively ---
    const sf = await zfile.statFolder(dir);
    assert.ok(sf.fileNumber >= 2 && sf.size >= 15, `statFolder got ${JSON.stringify(sf)}`);

    // --- diskInfo for the mount under test ---
    const di = await zfile.diskInfo(dir);
    assert.ok(di && typeof di === 'object', 'diskInfo object');

    // --- permissions ---
    assert.strictEqual(await zfile.canRead(f), true, 'canRead');
    assert.strictEqual(await zfile.canWrite(f), true, 'canWrite');
    assert.strictEqual(await zfile.canReadAndWrite(f), true, 'canReadAndWrite');
    const noexec = path.join(dir, 'nope.bin');
    assert.strictEqual(await zfile.canRead(noexec), false, 'canRead missing=false');

    // --- copyFolder real copy ---
    const dest = path.join(dir, 'copied');
    const copied = await zfile.copyFolder(dir, dest, () => {});
    assert.ok(copied, 'copyFolder returns truthy');
    assert.ok(fs.existsSync(path.join(dest, 'a.txt')), 'copied a.txt');
    assert.ok(fs.existsSync(path.join(dest, 'sub', 'b.txt')), 'copied nested');

    // copying INTO a subdir of itself must not infinitely recurse
    await zfile.cancelCopy();

    console.log('ALL zfile LINUX TESTS PASS');
})().catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
});
