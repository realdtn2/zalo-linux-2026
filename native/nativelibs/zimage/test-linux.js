'use strict';
// Regression tests for the Linux zimage port (run: node test-linux.js)
// Plain node has no Electron, so we inject a stub nativeImage via Module._load
// to verify the full contract: getLib() -> Image.thumbnail() -> Buffer.
const assert = require('assert');
const Module = require('module');

if (process.platform !== 'linux') { console.log('SKIP: linux-only'); process.exit(0); }

// --- stub electron.nativeImage (decode/resize/encode control flow) ---
const dims = { w: 64, h: 64 };
let resizeCalls = 0;
const NI = {
    createFromBuffer(buf) {
        if (!buf || !buf.length) throw new Error('empty');
        return {
            isEmpty: () => false,
            getSize: () => ({ width: dims.w, height: dims.h }),
            resize: ({ width, height }) => {
                resizeCalls++;
                return {
                    isEmpty: () => false,
                    getSize: () => ({ width, height }),
                    toJPEG: (q) => Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(4, q || 80)]),
                    toPNG: () => Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3])
                };
            },
            toJPEG: (q) => Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(4, q || 80)]),
            toPNG: () => Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3])
        };
    }
};
const orig = Module._load;
Module._load = function (request, parent, isMain) {
    if (request === 'electron') return { nativeImage: NI };
    return orig.apply(this, arguments);
};

(async () => {
    const getLib = require('./index.js');
    const lib = await getLib(null);
    assert.ok(lib && lib.Image && typeof lib.Image.thumbnail === 'function', 'Image.thumbnail exists');

    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 9, 9, 9]);

    // downscale + jpeg encode
    const a = await lib.Image.thumbnail(png, 32, 32, 'jpeg', 80);
    assert.ok(Buffer.isBuffer(a) && a[0] === 0xff && a[1] === 0xd8, 'jpeg bits');
    assert.strictEqual(resizeCalls, 1, 'resize invoked when source larger');

    // png encode
    const b = await lib.Image.thumbnail(png, 32, 32, 'png', 80);
    assert.ok(b[1] === 0x50 && b[2] === 0x4e, 'png bits');

    // source already small -> no resize (sharp 'inside' parity)
    dims.w = 10; dims.h = 10; resizeCalls = 0;
    const c = await lib.Image.thumbnail(png, 32, 32, 'jpeg', 90);
    assert.ok(Buffer.isBuffer(c), 'small source still encodes');
    assert.strictEqual(resizeCalls, 0, 'no resize for smaller source');

    console.log('ALL zimage LINUX TESTS PASS');
})().catch((e) => {
    console.error('FAIL:', e);
    process.exit(1);
});
