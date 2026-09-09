# Zalo Linux Port — Coverage Report

Branch: `port/linux-native-modules` · Base: `origin/latest` @ `0f3049a`
Scope: every module marked **Unported** in the README, plus live end-to-end
call investigation and Android-engine disassembly. All claims below were
executed on this machine (Ubuntu 26.04 x86_64, Electron 22.3.27 ABI 110).

## Status matrix

| Module | README status | Now | How | Verified |
|---|---|---|---|---|
| `sqlite3` | OK | OK | prebuilt Linux `.node` (upstream) | ✅ |
| `db-cross-v4` | OK | OK | prebuilt Linux `.node` (upstream) | ✅ |
| `zaloLogger` | OK | OK | pure JS (upstream) | ✅ |
| `file-utils` | FAIL Unported | **PORTED** | pure JS (`linux.js`): move/copy w/ EXDEV fallback, moveToTrash, isExecutable, findFiles | `native/nativelibs/file-utils/test-linux.js` |
| `file-utilities` | FAIL Unported | **PORTED** | pure JS: `getDirectorySizeSync/Async`, tree/glob variants, hardlink detect, `cancelJob` via fs.readdir | `file-utilities/test-linux.js` |
| `zwalker` | FAIL Unported | **PORTED** | pure JS: `scanDirectory`, `statUnmarkedFiles`, `deleteHomelessFiles`, `deleteEmptyFolders`, `updateReferenceMessageId` (SQLite-aware) | `zwalker/test-linux.js` (604 lines impl) |
| `zfile` | FAIL Unported | **PORTED** | pure JS: `stat`, `diskInfo`/`statFolder` via `statvfs` (`df -kP` fallback chain), `copyFolder`, `cancelCopy`, `canRead/canWrite/canReadWrite` | `zfile/test-linux.js` |
| `v8-profiles` | FAIL Unported | **PORTED** | pure JS over `node:inspector` `Profiler.{start,stop,setSamplingInterval,enableConsoleProfile}` — real CPU profiles, not a stub | `v8-profiles/test-linux.js` |
| `mp4thumb` | FAIL Unported | **PORTED (conditional)** | spawns system `ffmpeg`/`ffprobe` (PATH or bundled); structured `NO_FFMPEG` error otherwise instead of `LIB_ERR` crash | `mp4thumb/test-linux.js` |
| `zimage` | FAIL Unported | **PORTED (fallback)** | Electron `nativeImage` pipeline (thumbnail/resizeQA/quality) for PNG/JPEG/WebP; documented gap: libvips-only extras (tiff raw, composite) need native build | `zimage/test-linux.js` |
| `zjxl` | FAIL Unported | **PARTIAL** | `decodeToJpeg` via `djxl` CLI when present; graceful `NO_JXL` error; full wasm decoder = open item (see Gaps) | `zjxl/test-linux.js` |
| `zcall` | FAIL Unported | **BRIDGE + contract** | `native/qt-call-cap-linux/`: Node call-v2 wire bridge (zcall-agent.js) — control plane speaks the real ZaloCall named-pipe/JSON protocol; media plane documented as proprietary (see Calls) | `zcall/test-linux.js`, `qt-call-cap-linux/test-wire.js`, live session below |

Result shape parity was checked against the consumers in
`main-dist/compact-app.js` / `mainless-worker.js` / preload bundles
(field-for-field, e.g. `{fileNumber,size,…}` for zwalker,
`DirectorySizeResult` for file-utilities).

## Commits (this branch)

```
db10b98 port: all remaining native modules for Linux x64          (43 files, +4599)
fe58541 zcall: fail-fast contract stub + binary/protocol recon
0c59c1a zcall: Linux call-v2 wire bridge (qt-call-cap-linux) + spawn-site patches
2fa6dc1 qt-call-cap-linux: fail-fast makeCall + file logging + outbound capture
df4ca57 qt-call-cap-linux: makeCall gate-release + bubble trace; CALL-LINUX live findings
```

## Calls — what is actually proven

1. **Control plane works.** `zcall-agent.js` implements the call-v2 wire
   protocol (ZaloCall pipe framing, `makeCall` gate-release, bubble trace);
   `test-wire.js` runs the framing loop without native deps.
2. **Live end-to-end voice achieved** on the Wine harness (Windows Zalo
   26.8.20 under Wine + capture plugin): call timer 02:28, **~12 kbps
   symmetric Opus over TCP 49.213.95.26:443**, pcap-captured. Root cause of
   earlier "đang vào cuộc gọi" stuck state: dead mitm proxy (blocker), **not**
   the ZRTP/media handshake — fixed by restoring the proxy. See
   `CALL-LINUX.md`.
3. **Signaling path mapped** from the live mitm flow store:
   `voicecall-wpa.chat.zalo.me/api/voicecall/{requestcall,request,answerack}`
   with envelope `data = b64("VMxU9B58X:" + blob)` — AES-CBC encrypted with
   the app's embedded `common.js` key/iv (per README's crypto description);
   `qos.talk.zing.vn` uploads zipped call QoS logs.

## Android engine disassembly (`Zalo_26.08.02_APKPure.xapk`)

Answer to "can Android share the call package with Linux?" — **no, and here
is the hard evidence:**

- Call engine = `lib/arm64-v8a/libzrtc.so` (6.5 MB stripped ELF, **5953
  exported `zrtc::`/`rtc::` C++ symbols**, readable demangling).
- Transport is **proprietary, not standard WebRTC**: internal ZRTP stack
  (`zRtpEncryptSession`, `zRtpDecryptSession`, `getKeyZrtpProcess`,
  `GetSrtpKeyAndSaltLengths`, `zRtcSrtpTransform*` MbedTLS transform tables,
  full RSA/ECC suite). Custom `SocketHandlerTcp/SocketHandlerTls` — media
  runs over **TCP/TLS tunnels**, matching the pcap (TCP :443, not SRTP/UDP).
  This matches the `Zalopcfirewall.pdf` port matrix from the macOS recon
  (no UDP/STUN in the call matrix).
- **ABI blocks sharing:** `DT_NEEDED` = `libOpenSLES.so`, `libandroid.so`,
  `liblog.so` (bionic/Android only) + ffmpeg/x264/openh264/yuv/turbojpeg +
  versioned `libc.so` (`@LIBC` — NDK bionic versioning, incompatible with
  glibc at link time).
- **ISA blocks sharing:** the XAPK ships only `config.arm64_v8a.apk` +
  `config.hdpi.apk` — **no x86_64 build exists** in the package, and the
  Linux port is Electron x86_64. Even Android-x86/BlissOS cannot load it.

So the Android package contributes **protocol intelligence** (symbol-level
map of the ZRTP state machine, key-schedule hooks, TCP-tunnel framing —
usable to reimplement the media plane cleanly on Linux) but cannot be the
runtime. A clean-room Linux media engine remains the only viable path, and
the symbol map above de-risks it substantially.

## Gaps (honest list)

| Item | State | Needed for full |
|---|---|---|
| `zcall` media plane | bridge + documented | clean-room ZRTP/SRTP engine (symbol map from libzrtc.so; key envelope from `voicecall` API) — proprietary crypto boundary |
| `zjxl` on machines without `djxl` | error path | vendored wasm JXL decoder (~1 MB) or prebuilt `djxl` in AppImage |
| `zimage` tiff/composite | JPEG/PNG/WebP covered | native libvips build matching `zimage_darwin*.node` exports |
| `mp4thumb` without ffmpeg | `NO_FFMPEG` clean error | ship static ffmpeg in AppImage (size vs. feature tradeoff) |

## How to verify

```bash
cd native/nativelibs/<mod> && node test-linux.js   # each ported module
cd native/qt-call-cap-linux && node test-wire.js   # call-v2 framing loop
```

Reference docs: `CALL-LINUX.md` (live call evidence), `CALL-SMOKE.md`
(isolated test instance), `recon-zcall-protocol.md`, `recon-notes.md`.
