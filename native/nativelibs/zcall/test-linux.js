'use strict';
// Regression tests for the Linux zcall stub (run: node test-linux.js)
// The macOS engine (zcall_mac.node) is a Mach-O binary and cannot run here,
// so this tests the stub's *contract* — exactly what the shipped bundles call.
const assert = require('assert');

if (process.platform !== 'linux') { console.log('SKIP: linux-only'); process.exit(0); }

const stub = require('./binding.js'); // linux -> binding-stub.js
const zcall = require('./index.js');  // ZVCMac wrapper the app actually uses

(async () => {
    const app = stub.MainApp();

    // --- device list contract (pc-dist: e.replace(/\\/g,"\\\\") then JSON.parse) ---
    assert.strictEqual(typeof app.getListDevices, 'function');
    const raw = app.getListDevices();
    assert.strictEqual(typeof raw, 'string', 'getListDevices must return a JSON string, not an array');
    raw.replace(/\\/g, '\\\\'); // must not throw (the old stub crashed here)
    const list = JSON.parse(raw);
    assert.ok(Array.isArray(list), 'parsed device list is an array');

    // --- string-returning natives ---
    assert.strictEqual(typeof app.getExtendData(), 'string');
    assert.strictEqual(typeof app.getJsonStats406(0, 0), 'string');
    assert.strictEqual(JSON.parse(app.getExtendData()).constructor, Object);

    // --- availability: check() must read as "unavailable" ---
    // vcmac.check() == instance.test(123) == 123 is the "available" signal.
    assert.notStrictEqual(app.test(123), 123, 'engine must not report itself available');

    // --- call setup must FAIL LOUD (reject), never hang in "connecting" ---
    await assert.rejects(() => app.setConfigData({}, true, false),
        'setConfigData must reject on linux');
    await assert.rejects(() => app.setConfigData({}, false, false),
        'setConfigData must reject for callee path too');

    // --- through the ZVCMac wrapper (what the call window awaits) ---
    // zrtc_config forces vcmac's synchronous fast-path: the only thing that
    // can fail the call there is the stub's setConfig choke-point. Without
    // the throw this path RESOLVES and the UI hangs on "connecting".
    const config = {
        fromId: 1, toId: 2, protocol: 3, callId: 10, sessId: 'x',
        settings: {}, zrtc_config: { rtp: 'test' }, rtcpIP: '1.2.3.4:8018', rtpIP: '1.2.3.4:8019',
    };
    await assert.rejects(() => zcall.makeCall(config, false),
        'makeCall must reject (fast-path) so the UI leaves "connecting"');
    await assert.rejects(() => zcall.incomingCall(config, false),
        'incomingCall must reject (call declines instead of dead-connecting)');
    // Also covers the config-fetch path (no zrtc_config): must not resolve either.
    await assert.rejects(() => zcall.makeCall({ fromId: 1, toId: 2, protocol: 3, callId: 11, sessId: 'y', settings: {} }, false),
        'makeCall must reject on the CONFIG_URL path too (dead endpoint / XHR error)');
    assert.strictEqual(zcall.enableCheckEventMessage, false, 'wrapper returns to idle after failure');

    // --- no-op surface must not throw ---
    for (const m of ['stop', 'mute', 'stopCapture', 'holdAudio', 'changeAudioDevice',
        'setAudioVolume', 'changeVideoDevice', 'setAgc', 'startDesktopCapture',
        'stopDesktopCapture', 'bindGetPeerId', 'setState', 'testBuffer']) {
        assert.doesNotThrow(() => app[m](1, 1), `${m} must be a safe no-op`);
    }

    console.log('zcall stub: all contract checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
