/*
 * linux.js — pure-JS drop-in for the `binding.cpu` surface consumed by
 * ./index.js (v8-profiler shim over profiler_electron1.8_mac.node).
 *
 * Backed by the core `inspector` module (node:inspector Session):
 *   Profiler.enable (once) / Profiler.start / Profiler.stop / Profiler.setSamplingInterval
 *
 * Contract (mirrors binding.cpu as read by index.js):
 *   - cpu.profiles            : object keyed by numeric uid -> profile with .delete()
 *   - startProfiling(name, recsamples)
 *   - stopProfiling(name)     : returns profile object; keeps it in cpu.profiles until .delete()
 *   - setSamplingInterval(us) : forwarded to inspector; throws while profiling is running
 *
 * Profile object:
 *   - plain object literal -> index.js `profile.__proto__ = CpuProfile.prototype` works
 *   - uid (unique number), title, typeId 'CPU'
 *   - startTime/endTime in WALL-CLOCK ms (inspector reports microseconds on a
 *     monotonic clock; duration is converted and anchored to Date.now()).
 *   - JSON.stringify(profile) yields a node CPU profile: nodes / samples / timeDeltas.
 *   - .delete() removes it from cpu.profiles.
 *
 * Notes / [INFERRED] semantics:
 *   - The V8 CPU profiler is a singleton; v8-profiler's multi-named-profile API is
 *     emulated: at most one capture owns the V8 profiler at a time. Starting a
 *     different name while another runs freezes the running capture into the
 *     previous owner's completed profile (returned by its later stopProfiling).
 *   - Restarting an already-running profile with the SAME name discards the
 *     in-flight capture and starts fresh ("restarts cleanly").
 *   - `recsamples` is accepted but ignored [INFERRED]: the inspector CPU profiler
 *     always records samples; there is no way to turn sampling off per-start.
 *   - Response delivery relies on inspector.Session connect()-mode synchronous
 *     callbacks (stable since Node ~12, matches Electron 22 / Node 16). A missed
 *     sync callback throws loudly rather than corrupting state.
 */
'use strict';

var inspector = require('inspector');

var session = null;        // single lazily-created session
var enabled = false;       // Profiler.enable posted once
var seq = 1;               // uid counter
var profiles = {};         // String(uid) -> profile (binding.cpu.profiles)
var completedByName = {};  // name -> last-stopped profile object
var running = null;        // { name, wallStartMs } while a capture owns the V8 profiler

function openSession() {
    var s = new inspector.Session();
    try {
        s.connect();
    } catch (err) {
        // No --inspect channel active: spin up an in-process session instead.
        s.connect({ reason: 'v8-profiles linux shim' });
    }
    return s;
}

// Posts on the session and returns the result. Delivery is synchronous in
// connect() mode; anything else (async delivery, inspector protocol error)
// throws so callers never observe half-applied state.
function rpc(method, params) {
    if (!session) {
        session = openSession();
    }
    if (!enabled) {
        enabled = true; // set first: a failed enable must not spam re-connections
        var st = { done: false, err: null };
        session.post('Profiler.enable', {}, function (err) { st.done = true; st.err = err || null; });
        if (!st.done) throw new Error('inspector response was not delivered synchronously: Profiler.enable');
        if (st.err) { enabled = false; throw st.err; }
    }
    var state = { done: false, err: null, res: null };
    session.post(method, params || {}, function (err, result) {
        state.done = true;
        state.err = err || null;
        state.res = result || null;
    });
    if (!state.done) throw new Error('inspector response was not delivered synchronously: ' + method);
    if (state.err) throw state.err;
    return state.res;
}

// Convert a raw Inspector.Protocol CPUProfile into a v8-profiler profile object.
// raw.startTime/endTime are microseconds on V8's monotonic clock.
function register(raw, title, wallStartMs) {
    var uid = seq++;
    var durationMs = Math.round(((raw.endTime || 0) - (raw.startTime || 0)) / 1000);
    var profile = {
        uid: uid,
        title: title,
        typeId: 'CPU',
        startTime: wallStartMs,
        endTime: wallStartMs + durationMs,
        nodes: raw.nodes || [],
        samples: raw.samples || [],
        timeDeltas: raw.timeDeltas || []
    };
    profile.delete = function () {
        delete profiles[uid];
        delete completedByName[title];
    };
    profiles[uid] = profile;
    completedByName[title] = profile;
    return profile;
}

function freezeRunning() {
    // Stop the V8 capture and register it for whoever owns it.
    var raw = rpc('Profiler.stop').profile;
    var owner = running;
    running = null;
    return register(raw, owner.name, owner.wallStartMs);
}

function discardRunning() {
    rpc('Profiler.stop'); // discard the capture
    running = null;
}

function startProfiling(name, recsamples) {
    name = '' + name;
    // recsamples intentionally ignored — inspector always samples [INFERRED].
    if (running && running.name === name) {
        discardRunning();
    } else if (running) {
        freezeRunning();
    }
    rpc('Profiler.start');
    running = { name: name, wallStartMs: Date.now() };
}

function stopProfiling(name) {
    name = '' + name;
    if (running && running.name === name) {
        return freezeRunning();
    }
    if (Object.prototype.hasOwnProperty.call(completedByName, name)) {
        return completedByName[name]; // last-stopped profile for this name
    }
    return undefined;
}

function setSamplingInterval(us) {
    // Only valid while idle; while profiling the inspector replies with an
    // error which rpc() rethrows (index.js guards this path anyway).
    rpc('Profiler.setSamplingInterval', { interval: Number(us) | 0 });
}

module.exports = {
    cpu: {
        profiles: profiles,
        startProfiling: startProfiling,
        stopProfiling: stopProfiling,
        setSamplingInterval: setSamplingInterval
    }
};
