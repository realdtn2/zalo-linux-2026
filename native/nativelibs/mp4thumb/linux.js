'use strict';
// Linux port of mp4thumb (macOS binary is a static FFmpeg wrapper).
// Spawns an ffmpeg binary to grab one scaled frame. ffmpeg is located via:
//   1. ZALO_FFMPEG env override
//   2. Electron bundled resources (process.resourcesPath/ffmpeg)
//   3. PATH (ffmpeg, then avconv)
// When none exists the port rejects `{ error: 'LIB_ERR', ... }` — the exact
// shape index.js's fallback stub already throws, so consumers are unchanged.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let cachedBin; // undefined = not probed yet, null = unavailable

function which(cmd) {
    const dirs = (process.env.PATH || '').split(path.delimiter);
    for (const d of dirs) {
        if (!d) continue;
        const p = path.join(d, cmd);
        try {
            fs.accessSync(p, fs.constants.X_OK);
            return p;
        } catch (e) {}
    }
    return null;
}

function findFfmpeg() {
    if (cachedBin !== undefined) return cachedBin;
    const candidates = [];
    if (process.env.ZALO_FFMPEG) candidates.push(process.env.ZALO_FFMPEG);
    if (process.resourcesPath) {
        candidates.push(path.join(process.resourcesPath, 'ffmpeg'));
        candidates.push(path.join(process.resourcesPath, 'app', 'ffmpeg'));
    }
    candidates.push(which('ffmpeg'), which('avconv'));
    cachedBin = null;
    for (const c of candidates) {
        if (!c) continue;
        try {
            fs.accessSync(c, fs.constants.X_OK);
            cachedBin = c;
            break;
        } catch (e) {}
    }
    return cachedBin;
}

function buildScaleFilter(maxWidth, maxHeight) {
    const w = Math.max(1, Math.floor(Number(maxWidth) || 0));
    const h = Math.max(1, Math.floor(Number(maxHeight) || 0));
    if (w && h) return `scale=w=${w}:h=${h}:force_original_aspect_ratio=decrease`;
    if (w) return `scale=w=${w}:h=-2`;
    if (h) return `scale=w=-2:h=${h}`;
    return null;
}

class MP4Thumb {
    constructor() {
        this._child = null;
        this._cancelled = false;
    }

    generateThumbnailAsync(inputPath, outputPath, maxWidth, maxHeight) {
        return new Promise((resolve, reject) => {
            this._cancelled = false;
            const bin = findFfmpeg();
            if (!bin) {
                reject({ error: 'LIB_ERR', message: 'ffmpeg not available on this system' });
                return;
            }
            if (!inputPath || !fs.existsSync(inputPath)) {
                reject({ error: 'INPUT_NOT_FOUND', message: `input not found: ${inputPath}` });
                return;
            }
            const args = ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '0'];
            // fast seek then accurate decode for the first frame
            args.push('-i', inputPath, '-frames:v', '1', '-an', '-sn', '-vsync', 'vfr');
            const vf = buildScaleFilter(maxWidth, maxHeight);
            if (vf) args.push('-vf', vf);
            args.push(outputPath);

            let child;
            try {
                child = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
            } catch (e) {
                reject({ error: 'LIB_ERR', message: `spawn failed: ${e.message}` });
                return;
            }
            this._child = child;
            let stderr = '';
            child.stderr.on('data', (d) => { stderr += d.toString(); if (stderr.length > 4096) stderr = stderr.slice(-4096); });
            child.on('error', (err) => {
                this._child = null;
                reject({ error: 'LIB_ERR', message: err.message });
            });
            child.on('close', (code) => {
                this._child = null;
                if (this._cancelled) {
                    try { fs.unlinkSync(outputPath); } catch (e) {}
                    reject({ error: 'CANCELLED', message: 'thumbnail generation cancelled' });
                    return;
                }
                if (code === 0 && fs.existsSync(outputPath)) {
                    resolve(true);
                } else {
                    try { fs.unlinkSync(outputPath); } catch (e) {}
                    reject({ error: 'FFMPEG_FAIL', message: stderr || `ffmpeg exited with ${code}` });
                }
            });
        });
    }

    generateThumbnail(inputPath, outputPath, maxWidth, maxHeight) {
        // Synchronous parity path: spawnSync, returns boolean like the mac binary.
        const bin = findFfmpeg();
        if (!bin) throw { error: 'LIB_ERR', message: 'ffmpeg not available on this system' };
        const { spawnSync } = require('child_process');
        const args = ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '0', '-i', inputPath,
            '-frames:v', '1', '-an', '-sn'];
        const vf = buildScaleFilter(maxWidth, maxHeight);
        if (vf) args.push('-vf', vf);
        args.push(outputPath);
        const r = spawnSync(bin, args, { timeout: 30000 });
        return r.status === 0 && fs.existsSync(outputPath);
    }

    cancel() {
        this._cancelled = true;
        if (this._child) {
            try { this._child.kill('SIGKILL'); } catch (e) {}
        }
        return true;
    }
}

module.exports = { MP4Thumb };
