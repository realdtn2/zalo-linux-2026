'use strict';
// Linux stub — zcall_mac.node is a Mach-O binary for VNG's proprietary
// ZRTP/VoIP engine and cannot run on Linux. This stub keeps the app alive:
// - device enumeration returns the native contract (a JSON string), so the
//   settings UI shows an empty device list instead of throwing;
// - call setup REJECTS instead of resolving, so the call window follows the
//   same failure path the macOS engine uses when config fetch fails
//   (UI shows call failed) instead of hanging on "connecting" forever.
const noop = () => {};
const noopPromise = () => Promise.resolve({});

let warned = false;
function warn() {
    if (!warned) {
        warned = true;
        console.error(
            "[zcall] proprietary VoIP engine (zcall_mac.node) is unavailable on Linux — " +
            "calls will fail. Signalling/ringing is pure JS; media is not portable. See CALL-LINUX.md."
        );
    }
}
function notSupported() {
    warn();
    return Promise.reject({ error: "NOT_SUPPORTED", message: "zcall engine is not supported on linux" });
}

// vcmac.js applies the call config via instance.setConfig(...) on BOTH paths
// (zrtc_config fast-path and after the CONFIG_URL fetch). Throwing there is
// the single choke point: the sync throw inside the promise executor/then
// turns VCMac.setConfigData into a rejection, which ZVCMac.makeCall /
// incomingCall propagate to the call window (same path as a macOS config
// fetch failure) instead of hanging on "connecting".
function throwNotSupported() {
    warn();
    throw new Error("zcall engine is not supported on linux");
}

const stub = {
    MainApp: () => ({
        check:               noop,
        authenication:       noopPromise,
        setCallback:         noop,
        setConfigData:       notSupported,
        makeCall:            noop,
        incomingCall:        noop,
        stop:                noop,
        mute:                noop,
        stopCapture:         noop,
        holdAudio:           noop,
        getCallInfo:         () => ({}),
        getJsonStats406:     () => '{}',
        // Native returns a JSON string (pc-dist does e.replace(/\\/g,"\\\\")
        // then JSON.parse), entries {t,i,n}: t=0 video, 1 mic, 2 speaker.
        getListDevices:      () => '[]',
        getEventMessage:     () => null,
        getVideoFrame:       noop,
        getVideoFrameLocal:  noop,
        changeAudioDevice:   noop,
        setAudioVolume:      noop,
        changeVideoDevice:   noop,
        setAgc:              noop,
        startDesktopCapture: noop,
        stopDesktopCapture:  noop,
        changeMinMaxMobileBitrate: noop,
        getExtendData:       () => '{}',
        getActiveAudioCodecs: () => [],
        bindGetPeerId:       noop,
        // choke-point: vcmac.setConfigData calls this on every path; throwing
        // here fails the call instead of letting it "resolve" into a hang.
        setConfig:           throwNotSupported,
        setMediaConfig:      noop,
        setConfigServer:     noop,
        setListServers:      noop,
        updateCallerInfo:    noop,
        setState:            noop,
        testBuffer:          noop,
        // vcmac.check() does `instance.test(123) == 123`; returning a falsy
        // value keeps calling reported as unavailable instead of fake-enabled.
        test:                () => 0,
    })
};
module.exports = stub;
