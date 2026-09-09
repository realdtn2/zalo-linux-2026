/*
 * Self-contained contract test for ./linux.js (v8-profiles linux port).
 * Run: node test-linux.js  -> prints ALL PASS, exit 0.
 */
'use strict';

var assert = require('assert');
var path = require('path');

var binding = require('./linux.js');

function busy(ms) {
    var t = Date.now();
    var x = 0;
    while (Date.now() - t < ms) { x += Math.sqrt(x + 1); }
    return x;
}

function keysOf(obj) { return Object.keys(obj); }

// ---- surface ----
assert.ok(binding && binding.cpu, 'exports { cpu }');
assert.strictEqual(typeof binding.cpu.startProfiling, 'function');
assert.strictEqual(typeof binding.cpu.stopProfiling, 'function');
assert.strictEqual(typeof binding.cpu.setSamplingInterval, 'function');
assert.strictEqual(typeof binding.cpu.profiles, 'object');

// ---- guarded index.js load (throws on linux: mac .node) ----
var indexLoaded = false;
try {
    var prof = require('./index.js');
    indexLoaded = true;
    // If it ever loads, it must expose the profiler facade.
    assert.strictEqual(typeof prof.startProfiling, 'function');
    assert.strictEqual(typeof prof.setSamplingInterval, 'function');
} catch (err) {
    // expected on linux: cannot dlopen profiler_electron1.8_mac.node
}

// ---- setSamplingInterval while idle: forwarded, no throw ----
binding.cpu.setSamplingInterval(500);

// ---- stop on unknown name -> undefined ----
assert.strictEqual(binding.cpu.stopProfiling('never-started'), undefined);

// ---- start -> busy -> stop: full profile contract ----
var t0 = Date.now();
binding.cpu.startProfiling('alpha', true);
busy(250);
var p1 = binding.cpu.stopProfiling('alpha');
assert.ok(p1, 'stopProfiling returns a profile');
assert.strictEqual(typeof p1.uid, 'number', 'uid is a number');
assert.ok(p1.uid >= 1, 'uid positive');
assert.strictEqual(p1.title, 'alpha');
assert.strictEqual(p1.typeId, 'CPU');
assert.strictEqual(typeof p1.startTime, 'number', 'startTime ms number');
assert.strictEqual(typeof p1.endTime, 'number', 'endTime ms number');
var durMs = p1.endTime - p1.startTime;
assert.ok(durMs >= 150 && durMs < 30000, 'endTime-startTime in ms roughly matches busy span: ' + durMs);
assert.ok(durMs >= (Date.now() - t0) - 200, 'duration not wildly short of wall span');
assert.ok(Array.isArray(p1.nodes), 'nodes array');
assert.ok(Array.isArray(p1.samples), 'samples array');
assert.ok(p1.nodes.length > 0, 'nodes.length > 0 after 250ms busy loop (got ' + p1.nodes.length + ')');
assert.ok(p1.samples.length > 0, 'samples.length > 0');
assert.ok(Array.isArray(p1.timeDeltas), 'timeDeltas array');
if (p1.timeDeltas.length > 0) {
    assert.strictEqual(p1.timeDeltas.length, p1.samples.length, 'timeDeltas aligns with samples');
}
assert.strictEqual(typeof p1.delete, 'function', '.delete() present');

// ---- profile present in cpu.profiles keyed by uid, BEFORE delete ----
assert.ok(binding.cpu.profiles[p1.uid] === p1, 'profile listed in cpu.profiles[uid] pre-delete');

// ---- JSON round-trip yields a node CPU profile ----
var json = JSON.stringify(p1);
var round = JSON.parse(json);
assert.ok(Array.isArray(round.nodes) && round.nodes.length > 0, 'JSON round-trip nodes');
assert.ok(Array.isArray(round.samples) && round.samples.length > 0, 'JSON round-trip samples');
assert.ok(round.nodes[0] && typeof round.nodes[0].id !== 'undefined', 'nodes carry ids');

// ---- index.js prototype reassignment works on our profile object ----
function CpuProfile() {}
CpuProfile.prototype.getHeader = function () {
    return { typeId: this.typeId, uid: this.uid, title: this.title };
};
p1.__proto__ = CpuProfile.prototype; // must not throw; plain object literal accepts it
assert.deepStrictEqual(p1.getHeader(), { typeId: 'CPU', uid: p1.uid, title: 'alpha' });

// ---- .delete() removes from cpu.profiles ----
p1.delete();
assert.strictEqual(binding.cpu.profiles[p1.uid], undefined, 'delete removes from map');
// delete() is idempotent
p1.delete();

// ---- two named profiles tracked independently ----
binding.cpu.startProfiling('one', true);
busy(200);
var pa = binding.cpu.stopProfiling('one');
busy(50);
binding.cpu.startProfiling('two', true);
busy(200);
var pb = binding.cpu.stopProfiling('two');
assert.ok(pa && pb, 'both profiles returned');
assert.notStrictEqual(pa.uid, pb.uid, 'unique uids');
assert.strictEqual(pa.title, 'one');
assert.strictEqual(pb.title, 'two');
assert.ok(binding.cpu.profiles[pa.uid] === pa, 'profile one still in map');
assert.ok(binding.cpu.profiles[pb.uid] === pb, 'profile two still in map');
assert.ok(pa.nodes.length > 0 && pb.nodes.length > 0, 'both captured samples');

// stopProfiling(name) again returns the last-stopped profile for that name
assert.strictEqual(binding.cpu.stopProfiling('one'), pa, 'repeat stop returns last-stopped profile');

pa.delete();
pb.delete();
assert.strictEqual(binding.cpu.profiles[pa.uid], undefined);
assert.strictEqual(binding.cpu.profiles[pb.uid], undefined);

// ---- restart while running (same name) restarts cleanly ----
binding.cpu.startProfiling('rt', true);
busy(100);
binding.cpu.startProfiling('rt', true); // restart while running
busy(200);
var pr = binding.cpu.stopProfiling('rt');
assert.ok(pr && pr.nodes.length > 0, 'restarted profile captured fresh samples');
assert.strictEqual(pr.title, 'rt');
assert.ok(binding.cpu.profiles[pr.uid] === pr);
pr.delete();

// ---- start B while A running: A is frozen into its completed profile ----
binding.cpu.startProfiling('A', true);
busy(150);
binding.cpu.startProfiling('B', true); // preempts A's capture
busy(150);
var pB = binding.cpu.stopProfiling('B');
var pA = binding.cpu.stopProfiling('A');
assert.ok(pB && pB.title === 'B' && pB.nodes.length > 0, 'B captured after preempt');
assert.ok(pA && pA.title === 'A' && pA.nodes.length > 0, 'A kept its frozen capture');
assert.ok(binding.cpu.profiles[pA.uid] === pA && binding.cpu.profiles[pB.uid] === pB);
pA.delete();
pB.delete();
assert.strictEqual(keysOf(binding.cpu.profiles).length, 0, 'map empty after deletes');

// ---- empty name works ----
binding.cpu.startProfiling('', true);
busy(150);
var pe = binding.cpu.stopProfiling('');
assert.ok(pe && pe.nodes.length > 0, 'empty-name profile captured samples');
pe.delete();

// ---- setSamplingInterval while running must throw ----
binding.cpu.startProfiling('si', true);
var threw = false;
try {
    binding.cpu.setSamplingInterval(800);
} catch (err) {
    threw = true;
}
assert.ok(threw, 'setSamplingInterval throws while profiling is running');
var psi = binding.cpu.stopProfiling('si');
assert.ok(psi && psi.nodes.length > 0, 'si profile still captured despite interval error');
psi.delete();
assert.strictEqual(keysOf(binding.cpu.profiles).length, 0, 'profiles map fully drained at end');

console.log('index.js loaded on this platform: ' + indexLoaded + (indexLoaded ? '' : ' (throws on linux as expected)'));
console.log('ALL PASS');
