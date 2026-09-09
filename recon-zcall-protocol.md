# Recon: zcall (calling) — what is portable, what is not

Evidence-only notes gathered while making the Linux zcall stub fail gracefully.
Every claim below is reproducible from files in this repo (paths + method given).
Anything not reproducible is marked **[remote]** or **[inference]**.

## 1. Engine binary — not portable (verified)

`native/nativelibs/zcall/zcall_mac.node` is Mach-O 64-bit x86_64 (`file`).
`strings -a` shows the stack inside it:

| evidence | count | meaning |
|---|---|---|
| `webrtc`/`WebRtc`/`WebRTC` | ~9800 | full Google WebRTC media engine |
| `x264` | 1744 | H.264 video encoder |
| `silk` | 545 | SILK speech codec (Opus internals) |
| `opus_`/`Opus_` | 142 | Opus codec |
| `H264` | 123 | H.264 signaling/payloads |
| `ZRTPPacket`, `ZRTPTimeout`, `ZRTPServerInfoCompare` | — | custom ZRTP key-agreement implementation |
| `MainAppWrapper`, `getEventMessage`, `onEventMessage` | — | the NAPI surface exposed to JS |

A Mach-O binary with a bundled ZRTP + WebRTC + x264/Opus stack cannot be
"translated" to Linux. Porting the engine would mean reimplementing ZRTP
key-agreement and matching a closed, proprietary signalling/KeyExchange
contract — a separate multi-month project against a moving target. Not
attempted. (Reusing the engine from the **Windows** build is a different
proposition — see §5.)

## 2. What the shipped Linux app actually calls (verified)

Grepping `main-dist/` + `pc-dist/` for engine methods:

- The **only** native zcall call-site inside our bundles is
  `pc-dist/compact-app-pc.*.js` → `getListDevicesFromNative()`:
  ```js
  let e = $znode.nativelibs.zcall().getListDevices();
  e = e.replace(/\\/g, "\\\\");           // expects a STRING
  let t = JSON.parse(e);                  // entries {t,i,n}; t: 0=video,1=mic,2=speaker
  ```
  This is why the stub's `getListDevices()` must return a JSON **string**
  (`'[]'`), not an array — the old stub array hit `.replace` → TypeError,
  swallowed by `catch { return null }` (device settings silently empty).
- `bindCanvas` / `makeCall` / `setConfigData` / `checkEventMessage`: **0 hits**
  in `main-dist/` and `pc-dist/`. The call-window UI that drives the engine is
  not in the repo — it is loaded from Zalo's CDN into the call popup **[remote]**.
  Consequence: the stub must satisfy a caller we cannot inspect; the safe
  contract is "reject like a config-fetch failure" (see §4), never "resolve".
- Signalling is pure JS in `pc-dist`: websocket commands
  `voicecall/answer|answerack|cancel|conf|endcall|group/...` (grep
  `voicecall/` in `compact-app-pc.*.js`), `wss://zalo.me` socket, QoS upload
  endpoints `talk.zing.vn/api/qos/uploadcalllog`. Ringing/accept/cancel state
  is app-level JS; the engine only handles media **[remote driver, local signalling commands verified]**.

## 3. Host-side wrapper flow (verified — `native/nativelibs/zcall/vcmac.js`)

```
ZVCMac.makeCall(config)                    (index.js — instance the app uses)
 └─ zmac.setCallback()
 └─ VCMac.setConfigData(config, caller, isVideo)   (vcmac.js:79)
     ├─ fast path: config.zrtc_config present → onDone(JSON)      [vcmac.js:134]
     ├─ else: GET CONFIG_URL = http://api.conf.talk.zing.vn/zls?action=call_config
     │        (sendHttp via XMLHttpRequest — renderer context only)
     └─ onDone → instance.setConfig(...) + setMediaConfig/setListServers/setConfigServer
 └─ .then → zmac.makeCall() ; enableCheckEventMessage = true
 └─ .catch → reject(e)                      ← our failure exits here
```

- `zrtc_config` appears **only** in vcmac.js — no shipped bundle constructs
  it; the remote call UI may **[remote]**.
- CONFIG_URL currently returns **HTTP 502** (curl) — the legacy host-side
  config fetch is dead; media config arrives through the remote UI instead.
- Event pump: `ZVCMac.doCheckEventMessage()` polls `getEventMessage()`;
  sentinel `NO_INSTANCE_ERROR = -100` stops polling. Event `type` numbers are
  a switch table in the Mach-O — **not** recoverable from strings, and no
  numeric semantics are claimed here.

## 4. Stub design decision (implemented in `binding-stub.js`)

- **Fail fast, loudly:** `setConfig` throws `zcall engine is not supported on
  linux`. It is the one call every config path makes, the throw happens
  inside the `VCMac.setConfigData` promise executor/then → the promise
  rejects → `ZVCMac.makeCall/incomingCall` propagate rejection to the call
  window. This is the same code path a macOS config-fetch failure takes, so
  the UI has a real (non-hanging) failure mode. A resolving no-op leaves the
  window in "connecting" forever (old behavior — `enableCheckEventMessage`
  set, no events ever).
- **Native-shaped strings:** `getListDevices() -> '[]'`, `getExtendData()`,
  `getJsonStats406()` stay JSON strings (consumers parse them).
- **check unavailable:** `test()` returns falsy so `vcmac.check() == false`
  (mirrors engine-missing on macOS).
- Regression contract: `native/nativelibs/zcall/test-linux.js` (runs under
  plain node, no electron).

## 5. Open paths (not pursued here)

1. **Windows `zcall_x64.node` reuse** — the pc/windows build ships an ELF? No:
   PE binary. Could theoretically run under Wine with an Electron-for-Windows
   call window, but the app here is Linux Electron; a NAPI PE cannot be
   required. Only viable as a side-process bridge (named-pipe/RPC shim) —
   large effort, licence gray-zone. **[inference]**
2. **WebRTC-Google fallback** — implement a compatible media leg with
   open `libwebrtc` + the local `voicecall/*` signalling. Blocked on the
   closed ZRTP-family key-exchange contract (`zrtc` config fields, ZRTPPacket
   handling, AES key derivation in the remote worker.js) which lives on
   Zalo's CDN and cannot be inspected offline. **[remote]**
3. Capturing live `wss://zalo.me` `voicecall/*` traffic from a working macOS
   client would ground §2/§5.2 — needs a macOS machine; out of scope here.

## 6. Repro commands

```bash
file native/nativelibs/zcall/zcall_mac.node
strings -a native/nativelibs/zcall/zcall_mac.node | grep -ciE 'webrtc|x264|silk|opus_'
strings -a native/nativelibs/zcall/zcall_mac.node | grep -oE 'ZRTP[A-Za-z]*' | sort -u
curl -s -o /dev/null -w '%{http_code}\n' 'http://api.conf.talk.zing.vn/zls?action=call_config'   # 502
grep -c 'getListDevicesFromNative' pc-dist/compact-app-pc.*.js                                    # 2
node native/nativelibs/zcall/test-linux.js                                                       # contract green
```
