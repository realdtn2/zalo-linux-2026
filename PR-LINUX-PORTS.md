# Port all remaining native modules to Linux x64 + call-v2 wire bridge

Closes every ❌ Unported row in the README, and replaces the "calling impossible"
dead-end with a real, tested implementation of the **call-v2 wire protocol** so the
call pipeline fails correctly (and rings!) instead of hanging.

## 1. Native modules — all now ported (pure-JS/CLI implementations, no new runtime deps)

| module | old status | now | how |
|---|---|---|---|
| `file-utils` | ❌ stub | ✅ | pure JS: `moveFileToTrash` (gio trash → trash-cli → `~/.local/share/Trash` per FreeSpec, XDG env aware), `isExecutable` (`fs.accessSync X_OK`) |
| `file-utilities` | ❌ stub | ✅ | `getDirectorySize{Sync,Async}`, `detectHardlinks{Sync,Async}`, `detectFilesystem{Sync,Async}`, `getDirectorySizeByGlob…`, `getDirectorySizeTree…` with the exact Rust result shapes (`DirectorySizeResult`/`TreeResult`) + `cancelJob` |
| `zwalker` | ❌ stub | ✅ | `scanDirectory`, `updateReferenceMessageId`, `deleteHomelessFiles`, `statUnmarkedFiles`, `deleteEmptyFolders` — same arg/return contracts consumed by compact-app/main backup code |
| `v8Profiles` | ❌ stub | ✅ | real CPU profiling via `node:inspector` (`Profiler.enable/start/stop`) — profile map, `setSamplingInterval`, `deleteAllProfiles`, idle notifier parity |
| `zfile` | ❌ stub | ✅ | `stat`/`isFolder`/`diskInfo`/`statFolder` via `statfs(2)` (`fs.statfs` where present, `df -kP` fallback), `copyFolder`/`cancelCopy`/`canRead*`/`canWrite` semantics parity |
| `mp4thumb` | ❌ stub | ✅ | ffmpeg/ffprobe CLI probe+frame extraction with scaling, `LIB_ERR*` error-code contract preserved; graceful `{error}` when ffmpeg absent |
| `zimage` | ❌ stub | ✅ | thumbnail pipeline through Electron `nativeImage` (main process) incl. `rotateQA`/`resizeQA` callbacks + file variants |
| `zjxl` | ❌ stub | ✅ | `decodeToJpeg`: system `djxl`/`cjxl` when available, else bundled WASM `jxl_dec` decode → baseline JPEG re-encode (pure JS); honest `false` when neither |
| `zcall` (native binding) | ❌ stub | ✅ contract | JSON-string device-list contract + fail-fast reject paths (see 2/3) |

Loader (`native/nativelibs/index.js`) keeps its exact switch surface; each module's
`index.js` now resolves linux first. Every module ships a standalone Node regression
(`native/nativelibs/<mod>/test-linux.js`), all passing on Node 16.17 (Electron 22's
Node — `ELECTRON_RUN_AS_NODE=1`) and Node 22. No changes to darwin/win code paths.

## 2. Calling: real call-v2 wire protocol (`native/qt-call-cap-linux/`)

Reverse-engineered the engine↔main.js IPC from the bundle (module `4KIH` chunker,
`ZQzv`/`vqv6` md5 verifier, serverRecv/serverSend wiring, lines cited in
`recon-zcall-protocol.md` / `CALL-LINUX.md`):

- two unix sockets (`/tmp/socketzalorecv2021` engine→host, `/tmp/socketzalosend2021`
  host→engine), `$`-framed AES-128-CBC hex payloads (key material is in the bundle,
  md5(key1+key2), zero IV)
- host→engine chunking `hex#seq#total#idx#` (**trailing `#` required**) and a
  mandatory one-byte ACK per received frame on the send leg — the host in-flight
  gate only clears on serverSend data, single frames included
- `ZaloCall` POSIX launcher: resolves a Node runtime from `/proc/$PPID/exe`
  (Electron-as-node trick main.js itself uses for workers), then sibling/bundled
  electron, then system node; exit 3 = "no runtime, bridge disabled"
- `zcall-agent.js`: `native-ready` gating, `listDevice` with the full JSON-string
  device contract (settings UI populated from real `/dev/snd` + `/dev/video*`),
  `update` (audio) → `response`, numeric `sendSignal` → deterministic
  `sendSignal 401` + `state free` + `end` echo (same degrade path as a macOS
  config-fetch failure — calls now fail in ~1s, not hang), `killMe` silence + SIGINT
  exit 0 (host-owned lifecycle)
- spawn-site patches (`main.js`/`compact-app.js` `W()` ZaloCall + `K()` ZaloCap) add
  `process.platform === "linux"` branches with dev/installed layout resolution; md5
  gate verified inert on Linux (`b = E && !R`, `E = win32-only`)

**Media (voice/video I/O) is not implemented** — it needs VNG's proprietary
ZRTP-variant stack, which exists only as Mach-O/PE with no portable handshake
schema in the bundle (evidence table in `recon-zcall-protocol.md`). The bridge
never forges media success; it implements the control plane honestly and fails
fast. The wire contract documented in `CALL-LINUX.md` is the seam for a future
open-media engine.

## 3. Verification

```
node native/nativelibs/<mod>/test-linux.js        # each module, incl. zcall contract
node native/qt-call-cap-linux/test-wire.js        # WIRE-TEST ALL PASS (host emulator:
   # ready-gating, chunk ACK round-trip, listDevice shapes, 401 end path, killMe)
ELECTRON_RUN_AS_NODE=1 <electron22> …             # same, Node 16.17 ABI parity
node --check main-dist/{main,compact-app}.js
```

Real-app smoke procedure (isolated instance, device list + fail-fast call):
`CALL-SMOKE.md`.

## 3. Live wire-protocol capture (Windows engine under Wine, 2026-09-09)

Media-plane ground truth for the next step (real ZRTC client) is now in
`recon-zcall-wire.md`, captured from a connected 1-on-1 video call (1280x720,
opus/48000/2, 31 700 datagrams via an LD_PRELOAD sendmsg/recvmsg shim + mitm):

- **Server-relay ZRTC**: engine connects UDP to a session-allocated VNG gateway
  (`171.244.25.109:4200`; prior capture `42.119.138.76:4200`), STUN reflexive probe
  to `8.8.8.8:33433`. The full offer appears in plaintext in the engine's own
  `call.log` (`[4,[client, codec, serverA, …, serverB, stun, …]]`).
- Media = proprietary LE-16 framing (`0x7f00009a`/`0x7f00019a`) over **SRTP with
  server-transported per-call keys** — keys ride inside `voicecall/*` HTTPS blobs
  encrypted with the account session key `zpw_sek`, which this port's own login
  already holds. No ZRTP cracking needed in relay mode (ZRTP magic only seen in the
  direct-P2P fallback).
- `voicecall-wpa.chat.zalo.me` signaling flow fully enumerated:
  `requestcall → conf(poll) → request → answerack`, params/data = AES-GCM(`zpw_sek`).
- Host↔engine pipe JSON contract confirmed live end-to-end — matches what
  `qt-call-cap-linux` speaks.

## Honest gaps

- Call media unavailable (above); group-call/share additionally need the ZaloCap
  capture helper, which also has no Linux counterpart (now degrades to
  "invalid call" instead of a mac-path ENOENT).
- `zjxl` WASM path is decode-only baseline profile (no lossless-var-hybrid
  corner-profiles); system `djxl` used when present.

Co-Authored-By: RuriMeiko <rurimeiko@users.noreply.github.com>
