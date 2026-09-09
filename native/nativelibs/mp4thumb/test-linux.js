'use strict';
// Regression tests for the Linux mp4thumb port (run: node test-linux.js)
// Requires ffmpeg on PATH to generate the fixture; skips otherwise.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

if (process.platform !== 'linux') { console.log('SKIP: linux-only'); process.exit(0); }

const ff = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
if (ff.error || ff.status !== 0) { console.log('SKIP: ffmpeg not available'); process.exit(0); }

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mp4thumb-'));
const clip = path.join(dir, 'clip.mp4');
const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'testsrc=duration=1:size=320x240:rate=10',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', clip], { stdio: 'ignore' });
assert.strictEqual(r.status, 0, 'fixture generated');

const lib = require('./index.js');

(async () => {
    assert.strictEqual(typeof lib.generateThumbnail, 'function');
    assert.strictEqual(typeof lib.cancel, 'function');

    // --- real thumbnail generation with scaling ---
    const out = path.join(dir, 'thumb.jpg');
    const ok = await lib.generateThumbnail(clip, out, 160, 120, 'media-1');
    assert.strictEqual(ok, true, 'generateThumbnail resolves true');
    assert.ok(fs.existsSync(out) && fs.statSync(out).size > 0, 'output written');
    const head = fs.readFileSync(out).subarray(0, 2);
    assert.strictEqual(head[0], 0xff, 'JPEG SOI');
    assert.strictEqual(head[1], 0xd8, 'JPEG SOI');

    // mediaId cache entry must be cleaned after completion
    lib.cancel('media-1'); // must not throw on a finished job

    // --- missing input rejects with a structured error ---
    let threw = null;
    try { await lib.generateThumbnail(path.join(dir, 'nope.mp4'), path.join(dir, 'x.jpg'), 100, 100, 'm2'); }
    catch (e) { threw = e; }
    assert.ok(threw && typeof threw.error === 'string', `structured reject, got ${JSON.stringify(threw)}`);

    // --- cancel() on an in-flight job kills it ---
    const busy = lib.generateThumbnail(clip, path.join(dir, 'c.jpg'), 160, 120, 'm3');
    lib.cancel('m3');
    let cerr = null;
    try { await busy; } catch (e) { cerr = e; }
    assert.ok(cerr && cerr.error === 'CANCELLED', `cancelled reject shape, got ${JSON.stringify(cerr)}`);

    console.log('ALL mp4thumb LINUX TESTS PASS');
})().catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
});
