# Calling on Linux — zcall bridge (`native/qt-call-cap-linux/`)

What the call pipeline actually is on Linux, what we ship, and every invariant
the bridge must satisfy. Evidence for all protocol claims: extracted from
`main-dist/main.js` / `main-dist/compact-app.js` (module IDs and line numbers in
`recon-zcall-protocol.md`).

## Architecture (from the bundle, verified)

```
renderer (call UI)
   │  IPC: call-update / call-command
main.js "call-v2" host
   │  fork/exec  ZaloHelper.app/Contents/MacOS/ZaloCall  (macOS)
   │              plugins/capture/ZaloCall.exe            (Windows)
   │              native/qt-call-cap-linux/ZaloCall       (Linux, this port)
   │  argv: [ , <socketzalorecv2021>, <socketzalosend2021>]
   ▼
ZaloCall helper  ←— the real one is a proprietary Qt/C++ binary
                    (Mach-O PE) embedding Zalo's ZRTP-based VoIP stack.
```

- The two sockets are **two separate connections**, not one duplex socket:
  the helper connects to `/tmp/socketzalorecv2021` to **send** engine→host
  frames, and connects to `/tmp/socketzalosend2021` to **receive** host→engine
  frames. Names are hard-coded in the bundle (`R`/`g`/`y` constants).
- Every frame is `<AES-hex>$`. The key is hard-coded in the bundle
  (`ZaloCall2021PrivateInf` / `ZaloCall2021PrivatePsd`, AES-128-CBC, key =
  md5(key1+key2), zero IV). The host and helper both speak it — this is
  obfuscation, not security (see recon doc §3).
- Host→engine frames larger than 4000 hex chars are chunked as
  `<hex>#<seq>#<total>#<idx>#` (trailing `#` required, module `4KIH`), and the
  helper **must write one ACK byte per received frame** on the send leg: the
  host's in-flight gate `x` is cleared only by `serverSend` data
  (`E || (x = !1, G(e))`) — including single frames, not just chunks.
- The helper never sends `response` to `request/killMe`; the host SIGINTs the
  process itself.

## What we ship

`native/qt-call-cap-linux/`

| file | role |
|---|---|
| `ZaloCall` | POSIX sh launcher — resolves a Node-capable runtime (spawning Electron via `ELECTRON_RUN_AS_NODE=1` through `/proc/$PPID/exe`, else bundled/sibling electron, else system node) and `exec`s `zcall-agent.js`. Exits 3 if no runtime. |
| `zcall-agent.js` | Full call-v2 wire agent: two-socket model, `$` framing, AES-128-CBC, chunk reassembly + per-frame ACK. Implements the **control-plane** honestly: `native-ready`, device enumeration with the exact JSON-string contract, `update` (audio) → `response`, `makeCall` → popup notice + `state free` + `end` within 300 ms (never hangs the UI gate; `ZALO_ZCALL_HOLD=ms` holds ringing for diagnostics), numeric `sendSignal` → deterministic `sendSignal 401` + `state free` + `end` echo (mirrors the macOS config-fetch-failure degrade), `killMe` silence + SIGINT exit 0. Logs to `~/.config/ZaloData/zcall-agent.log` (main.js pipes agent stderr away). Media plane (audio/video I/O) is **not** implemented — the ZRTP VoIP stack is proprietary and absent; the agent never pretends otherwise (no `did-recv-video-frame` forge, no `200 OK` lie). |
| `test-wire.js` | Host emulator regression: `node test-wire.js` must print `WIRE-TEST ALL PASS`. Covers ready-gating, chunked-ACK round-trip, listDevice announce/response shapes, 401 end path, killMe silence + clean exit. Verified under both system Node 22 and Electron 22's Node 16.17 (`ELECTRON_RUN_AS_NODE=1`). |

Launcher patches (this commit) add `process.platform === "linux"` branches to
the four spawn sites: `main.js` W/K and `compact-app.js` W/K (the
`--launch-compact-app` entry uses its own copies). The ZaloCap screen-capture
path on Linux deliberately points at a non-existent `qt-call-cap-linux/ZaloCap`
so `p(e,u).catch(...)` degrades to "invalid call" exactly like a missing macOS
helper, instead of resolving a mac-only path that would ENOENT-log as a crash
candidate.

## Why not port media

`zcall_mac.node` / `ZaloCall.exe` embed VNG's closed ZRTP-variant stack
(ringbuffered ICE + proprietary crypto, 6000+ proprietary strings, no
signalling schema anywhere in the bundle — recon doc §1/§7). Media requires
their server handshake. Reimplementing the control plane buys **correct failure
behavior** (ring, decline, timeout, device list, UI state) not media. When a
real open VoIP bridge is ready it can replace `zcall-agent.js` without touching
main.js — the wire contract above is the seam.

### Why the partner's phone can never ring via this bridge (live-verified)

`makeCall` reaches the agent carrying only `{partner:{id,name,avatar},
type:1}` — **no token, no SDP, no session key**. While a call is held
ringing, a hook on all 21 `$zsub.$zcall` methods in the renderer and a full
capture of every bridge frame show the renderer emits **zero** signalling
frames (`sendSignal 401/402/…`). On macOS those numeric WS frames — and the
ZRTP offer and the call-server authentication — are generated *inside* the
proprietary helper binary; the renderer only fire-and-forgets `makeCall` and
consumes `callState`. Ringing a real phone therefore requires reimplementing
VNG's obfuscated proprietary signalling/crypto from the Mach-O/PE binary —
out of scope (and ToS/DMCA-encumbered). The bridge's honest contract: UI
state always releases deterministically, and the user is told why.

## Known gaps (honest list)

- Group-calls / screen share: not reachable without the capture helper (ZaloCap)
  either; no Linux counterpart ships.
- `update` video devices: enumerates `/dev/video*` via v4l2 name query where
  `v4l2-ctl` exists, else GUID names — cosmetic parity only.
- Media engine: absent (see above); `sendSignal` requests with `data` payloads
  (hangup notify etc.) are echoed structurally but no media state machine runs.

## Verify

```bash
node native/qt-call-cap-linux/test-wire.js        # WIRE-TEST ALL PASS
# under the real runtime too:
ELECTRON_RUN_AS_NODE=1 ~/.local/electron-v22.3.27/electron \
    native/qt-call-cap-linux/test-wire.js         # WIRE-TEST ALL PASS
```

Real-app smoke (device list + fail-fast call) procedure: `CALL-SMOKE.md`.
