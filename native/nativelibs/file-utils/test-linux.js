/*
 * Self-contained contract test for ./linux.js (file-utils linux port).
 * Run: node test-linux.js  -> prints ALL PASS, exit 0.
 * All temp state lives under a mkdtemp dir; the trash sandbox is redirected
 * via HOME / XDG_DATA_HOME (restored at exit).
 */
'use strict';

var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');

var fu = require('./linux.js');

// ---- surface ----
assert.strictEqual(typeof fu.moveFileToTrash, 'function');
assert.strictEqual(typeof fu.copyFileSync, 'function');
assert.strictEqual(typeof fu.ensureDirSync, 'function');
assert.strictEqual(typeof fu.isFileExecutable, 'function');
assert.strictEqual(Object.keys(fu).length, 4, 'exactly the addon consumer surface');

var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fu-test-'));
var origHome = process.env.HOME;
var origXdg = process.env.XDG_DATA_HOME;

function cleanup() {
    process.env.HOME = origHome;
    if (origXdg === undefined) delete process.env.XDG_DATA_HOME;
    else process.env.XDG_DATA_HOME = origXdg;
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
}
process.on('exit', cleanup);

function trashRootFor(rootBase) { return path.join(rootBase, 'Trash'); }

// ---- sandbox HOME (no XDG_DATA_HOME): trash must land under $HOME/.local/share/Trash ----
var fakeHome = path.join(tmp, 'home');
fs.mkdirSync(fakeHome, { recursive: true });
process.env.HOME = fakeHome;
delete process.env.XDG_DATA_HOME;
// sanity: the port derives from HOME, not the real account home
assert.ok(os.homedir().indexOf(tmp) === 0, 'os.homedir() honours HOME override');

var f1 = path.join(tmp, 'src1', 'doomed.txt');
fs.mkdirSync(path.dirname(f1), { recursive: true });
fs.writeFileSync(f1, 'content-1');
var absF1 = fs.realpathSync(f1);

assert.strictEqual(fu.moveFileToTrash(f1), true, 'moveFileToTrash returns true');
assert.strictEqual(fs.existsSync(f1), false, 'original removed');

var root = trashRootFor(path.join(fakeHome, '.local', 'share'));
var moved = path.join(root, 'files', 'doomed.txt');
var info = path.join(root, 'info', 'doomed.txt.trashinfo');
assert.ok(fs.existsSync(moved), 'file moved into Trash/files/');
assert.strictEqual(fs.readFileSync(moved, 'utf8'), 'content-1', 'content preserved through trash');
assert.ok(fs.existsSync(info), 'trashinfo written');

var infoText = fs.readFileSync(info, 'utf8');
assert.strictEqual(
    infoText,
    '[Trash Info]\nPath=' + absF1 + '\nMimeType=application/octet-stream\n',
    'trashinfo exact contents incl. Path line'
);
var pathLine = infoText.split('\n')[1];
assert.strictEqual(pathLine, 'Path=' + absF1, 'Path line exact-match');

var infoMode = fs.statSync(info).mode & 0o777;
assert.strictEqual(infoMode, 0o600, 'trashinfo chmod 600');

// ---- collision: second file with same basename gets .1 suffix ----
var f2 = path.join(tmp, 'src2', 'doomed.txt');
fs.mkdirSync(path.dirname(f2), { recursive: true });
fs.writeFileSync(f2, 'content-2');
var absF2 = fs.realpathSync(f2);
assert.strictEqual(fu.moveFileToTrash(f2), true);
var moved2 = path.join(root, 'files', 'doomed.txt.1');
var info2 = path.join(root, 'info', 'doomed.txt.1.trashinfo');
assert.ok(fs.existsSync(moved2), 'collision suffix .1 in files/');
assert.strictEqual(fs.readFileSync(moved2, 'utf8'), 'content-2');
assert.ok(fs.existsSync(info2), 'collision suffix .1 trashinfo');
assert.strictEqual(
    fs.readFileSync(info2, 'utf8'),
    '[Trash Info]\nPath=' + absF2 + '\nMimeType=application/octet-stream\n',
);
// third collision -> .2
var f3 = path.join(tmp, 'src3', 'doomed.txt');
fs.mkdirSync(path.dirname(f3), { recursive: true });
fs.writeFileSync(f3, 'content-3');
assert.strictEqual(fu.moveFileToTrash(f3), true);
assert.ok(fs.existsSync(path.join(root, 'files', 'doomed.txt.2')), 'collision suffix .2');

// ---- XDG_DATA_HOME override honoured per call ----
var xdgBase = path.join(tmp, 'xdg');
process.env.XDG_DATA_HOME = xdgBase;
var f4 = path.join(tmp, 'src4', 'xdg.txt');
fs.mkdirSync(path.dirname(f4), { recursive: true });
fs.writeFileSync(f4, 'x');
assert.strictEqual(fu.moveFileToTrash(f4), true);
assert.ok(fs.existsSync(path.join(trashRootFor(xdgBase), 'files', 'xdg.txt')), 'XDG_DATA_HOME root used');
assert.ok(fs.existsSync(path.join(trashRootFor(xdgBase), 'info', 'xdg.txt.trashinfo')));
delete process.env.XDG_DATA_HOME;

// ---- trash of missing path -> false ----
assert.strictEqual(fu.moveFileToTrash(path.join(tmp, 'nope', 'ghost.bin')), false, 'missing -> false');

// ---- ensureDirSync ----
var nested = path.join(tmp, 'a', 'b', 'c', 'd');
assert.strictEqual(fu.ensureDirSync(nested), true, 'ensureDirSync returns true');
assert.ok(fs.statSync(nested).isDirectory(), 'nested dirs created');
assert.strictEqual(fu.ensureDirSync(nested), true, 'idempotent on existing dir');

// ---- copyFileSync ----
var cs = path.join(tmp, 'cp-src.txt');
var cd = path.join(tmp, 'deep', 'er', 'cp-dest.txt');
fs.writeFileSync(cs, 'AAA');
assert.strictEqual(fu.copyFileSync(cs, cd), true, 'copyFileSync returns true');
assert.strictEqual(fs.readFileSync(cd, 'utf8'), 'AAA');
// overwrite semantics
fs.writeFileSync(cs, 'BBBB');
assert.strictEqual(fu.copyFileSync(cs, cd), true, 'overwrite allowed');
assert.strictEqual(fs.readFileSync(cd, 'utf8'), 'BBBB', 'dest overwritten');
// missing src throws, and no dest side-effects
var ghostDest = path.join(tmp, 'ghost-dest.bin');
assert.throws(function () { fu.copyFileSync(path.join(tmp, 'missing-src.bin'), ghostDest); },
    function (err) { return err && err.code === 'ENOENT'; }, 'missing src throws ENOENT');
assert.strictEqual(fs.existsSync(ghostDest), false, 'no dest side-effect on failed copy');

// ---- isFileExecutable matrix ----
function mkExec(name, mode) {
    var p = path.join(tmp, name);
    fs.writeFileSync(p, '#!/bin/sh\n');
    fs.chmodSync(p, mode);
    return p;
}
assert.strictEqual(fu.isFileExecutable(mkExec('x755', 0o755)), true, '755 -> true');
assert.strictEqual(fu.isFileExecutable(mkExec('x644', 0o644)), false, '644 -> false');
assert.strictEqual(fu.isFileExecutable(mkExec('x711', 0o711)), true, 'owner-x-only -> true');
assert.strictEqual(fu.isFileExecutable(path.join(tmp, 'a')), false, 'directory -> false (even traversable)');
assert.strictEqual(fu.isFileExecutable(path.join(tmp, 'does-not-exist')), false, 'missing -> false');

console.log('ALL PASS');
