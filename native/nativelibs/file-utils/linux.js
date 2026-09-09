/*
 * linux.js — pure-JS drop-in for the file-utils native addon
 * (darwin/win file-utils.node). Consumer surface (observed via consumers +
 * Windows parity): moveFileToTrash, copyFileSync, ensureDirSync, isFileExecutable.
 *
 * moveFileToTrash implements the FreeDesktop.org Trash spec:
 *   root = $XDG_DATA_HOME/Trash (fallback ~/.local/share/Trash), resolved PER CALL
 *   file  -> <root>/files/<name>          (collision: name.1, name.2, ...)
 *   info  -> <root>/info/<name>.trashinfo (chmod 600)
 *     [Trash Info]
 *     Path=<original absolute path>
 *     MimeType=application/octet-stream
 * fs.renameSync fast path; EXDEV (cross-device) falls back to copy+unlink.
 * Returns true on success, false on any failure (boolean contract of the addon).
 *
 * Notes [INFERRED]:
 *   - `xdg-user-dir TRASH` is NOT spawned; the env-var fallback is used directly
 *     (deterministic, testable, no external binary dependency).
 *   - No DeletionDate line: the ported contract pins exactly the three lines above.
 *   - Electron 22 ≈ Node 16: uses fs.copyFileSync / mkdirSync{recursive} / chmodSync
 *     only (no fs.cp, no structuredClone).
 */
'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');

function trashRoot() {
    var base = process.env.XDG_DATA_HOME;
    if (!base) {
        base = path.join(os.homedir(), '.local', 'share');
    }
    return path.join(base, 'Trash');
}

function ensureDirSync(dir) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
}

function copyFileSync(src, dest) {
    fs.statSync(src); // throws ENOENT (no side effects) when src is missing
    var parent = path.dirname(dest);
    if (parent) ensureDirSync(parent);
    fs.copyFileSync(src, dest); // overwrite semantics (truncates existing dest)
    return true;
}

function moveFileToTrash(target) {
    try {
        var abs = path.resolve(target);
        fs.statSync(abs); // failure (missing/unreadable) -> false below

        var root = trashRoot();
        var filesDir = path.join(root, 'files');
        var infoDir = path.join(root, 'info');
        ensureDirSync(filesDir);
        ensureDirSync(infoDir);

        var base = path.basename(abs);
        var name = base;
        var n = 1;
        while (fs.existsSync(path.join(filesDir, name)) ||
               fs.existsSync(path.join(infoDir, name + '.trashinfo'))) {
            name = base + '.' + n;
            n++;
        }

        var dest = path.join(filesDir, name);
        try {
            fs.renameSync(abs, dest);
        } catch (err) {
            if (err && err.code === 'EXDEV') {
                // cross-device: copy then remove the original
                fs.copyFileSync(abs, dest);
                fs.unlinkSync(abs);
            } else {
                throw err;
            }
        }

        var infoPath = path.join(infoDir, name + '.trashinfo');
        fs.writeFileSync(
            infoPath,
            '[Trash Info]\nPath=' + abs + '\nMimeType=application/octet-stream\n',
            { mode: 0o600 }
        );
        fs.chmodSync(infoPath, 0o600); // exact 600 regardless of umask / pre-existing file
        return true;
    } catch (err) {
        return false;
    }
}

function isFileExecutable(target) {
    try {
        var st = fs.statSync(target);
        if (!st.isFile()) return false;
        return (st.mode & 0o111) !== 0;
    } catch (err) {
        return false;
    }
}

module.exports = {
    moveFileToTrash: moveFileToTrash,
    copyFileSync: copyFileSync,
    ensureDirSync: ensureDirSync,
    isFileExecutable: isFileExecutable
};
