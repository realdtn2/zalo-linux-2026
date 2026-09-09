'use strict';
// Linux port of zimage (macOS binary is a libvips/sharp wrapper).
// Strategy, in order:
//   1. Electron `nativeImage` (available in the main process — zimage is loaded
//      from main via nativelibs; consumers only use Image.thumbnail via IPC).
//   2. optional `sharp` if the app ever ships it.
//   3. system `vips thumbnail` CLI if present.
// Otherwise reject with { error: LIB_NOT_FOUND } exactly like the old loader did.
//
// Sharp semantics mirrored: resize `fit: 'inside'` (no upscale beyond source
// when upscale=false — vips thumbnail default), flatten transparency onto white
// for JPEG, quality passthrough, output format from `format`.

const NOT_SUPPORT = -2;
const LIB_NOT_FOUND = -1;

function pickEncoder(format) {
    const f = String(format || 'jpeg').toLowerCase();
    if (f === 'png') return 'png';
    if (f === 'webp') return 'webp';
    if (f === 'gif') return 'gif';
    return 'jpeg';
}

function loadNativeImage() {
    try {
        const electron = require('electron');
        if (electron && electron.nativeImage) return electron.nativeImage;
    } catch (e) { /* not in an Electron main process */ }
    return null;
}

function loadSharp() {
    try { return require('sharp'); } catch (e) { return null; }
}

function vipsCli() {
    const { spawnSync } = require('child_process');
    try {
        const r = spawnSync('vips', ['--version'], { timeout: 5000, stdio: 'ignore' });
        return r.status === 0 ? 'vips' : null;
    } catch (e) {
        return null;
    }
}

function thumbnailWithNativeImage(nativeImage, buffer, width, height, format, quality) {
    return new Promise((resolve, reject) => {
        try {
            if (!Buffer.isBuffer(buffer) && !(buffer instanceof Uint8Array)) {
                reject(new Error('thumbnail: buffer required'));
                return;
            }
            const img = nativeImage.createFromBuffer(Buffer.from(buffer));
            if (img.isEmpty()) {
                reject(new Error('An error occurred in thumbnailing'));
                return;
            }
            const size = img.getSize();
            const w = Math.max(1, Math.round(Number(width) || size.width || 1));
            const h = Math.max(1, Math.round(Number(height) || size.height || 1));
            let out = img;
            // fit:'inside' == sharp default; skip work when already small enough
            if (size.width > w || size.height > h) {
                out = img.resize({ width: w, height: h, fit: 'inside' });
            }
            const enc = pickEncoder(format);
            const q = Math.max(1, Math.min(100, Math.round(Number(quality) || 80)));
            let data;
            // nativeImage encoders: JPEG (lossy q) / PNG (lossless). webp/gif
            // requests fall back to PNG — consumers only re-encode/preview.
            if (enc === 'jpeg') data = out.toJPEG(q);
            else data = out.toPNG();
            resolve(Buffer.from(data));
        } catch (e) {
            reject(e);
        }
    });
}

function thumbnailWithSharp(sharp, buffer, width, height, format, quality) {
    const enc = pickEncoder(format);
    let pipe = sharp(Buffer.from(buffer), { failOn: 'none' })
        .resize({
            width: Math.max(1, Math.round(Number(width) || 1)),
            height: Math.max(1, Math.round(Number(height) || 1)),
            fit: 'inside',
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .flatten({ background: '#ffffff' });
    if (enc === 'png') pipe = pipe.png();
    else if (enc === 'webp') pipe = pipe.webp({ quality: Math.round(Number(quality) || 80) });
    else pipe = pipe.jpeg({ quality: Math.round(Number(quality) || 80), background: '#ffffff' });
    return pipe.toBuffer();
}

function thumbnailWithVipsCli(vipsBin, buffer, width, height, format) {
    const { spawnSync } = require('child_process');
    const enc = pickEncoder(format);
    const ext = enc === 'jpeg' ? '.jpg' : enc === 'png' ? '.png' : '.tif';
    const tmpOut = `/tmp/zimage-thumb-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const w = Math.max(1, Math.round(Number(width) || 1));
    const h = Math.max(1, Math.round(Number(height) || 1));
    const r = spawnSync(vipsBin, ['thumbnail', 'stdin', tmpOut, `${w}`, '-h', `${h}`], {
        input: Buffer.from(buffer),
        timeout: 30000,
    });
    const fs = require('fs');
    try {
        if (r.status !== 0) throw new Error('An error occurred in thumbnailing');
        return Promise.resolve(fs.readFileSync(tmpOut));
    } finally {
        try { fs.unlinkSync(tmpOut); } catch (e) {}
    }
}

// resizeQA mirrors thumbnailFs (inputPath/outputPath) — unused by the port today
// but kept for API parity.
function makeResizeQA(thumbImpl) {
    return (inputPath, outputPath, width, height, quality, _, callback) => {
        const fs = require('fs');
        const run = async () => {
            const buf = fs.readFileSync(inputPath);
            const fmt = /\.png$/i.test(outputPath) ? 'png' : 'jpeg';
            const out = await thumbImpl(buf, width, height, fmt, quality);
            fs.writeFileSync(outputPath, out);
            return out;
        };
        if (typeof callback === 'function') {
            run().then((r) => callback(null, r), (e) => callback(e));
        }
        return run().catch(() => {});
    };
}

function getLib(/* options */) {
    return new Promise((resolve, reject) => {
        const nativeImage = loadNativeImage();
        if (nativeImage) {
            const impl = (b, w, h, f, q) => thumbnailWithNativeImage(nativeImage, b, w, h, f, q);
            resolve({ Image: { thumbnail: impl, resizeQA: makeResizeQA(impl) } });
            return;
        }
        const sharp = loadSharp();
        if (sharp) {
            const impl = (b, w, h, f, q) => thumbnailWithSharp(sharp, b, w, h, f, q);
            resolve({ Image: { thumbnail: impl, resizeQA: makeResizeQA(impl) } });
            return;
        }
        const vips = vipsCli();
        if (vips) {
            const impl = (b, w, h, f, q) => thumbnailWithVipsCli(vips, b, w, h, f, q);
            resolve({ Image: { thumbnail: impl, resizeQA: makeResizeQA(impl) } });
            return;
        }
        reject({ error: LIB_NOT_FOUND });
    });
}

module.exports = getLib;
module.exports.NOT_SUPPORT = NOT_SUPPORT;
module.exports.LIB_NOT_FOUND = LIB_NOT_FOUND;
