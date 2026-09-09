# Zalo Windows Engine (ZaloCall.exe / zrtc) — Live Wire Findings

Captured 2026-09-09 08:44–08:5x (+07) via Wine LD_PRELOAD net shim (`connect/sendmsg/recvmsg`
hex dump), mitmproxy on `--proxy-server=http://127.0.0.1:8080`, and engine `call.log`.
Session: logged-in Windows Zalo 26.8.20 under Wine; Linux port NOT logged in (single-session
kick). 1-on-1 video call, connected, 1280x720.

## 1. Control plane (HTTPS, captured via mitm)

Host: `voicecall-wpa.chat.zalo.me`

| # | path | dir | note |
|---|------|-----|------|
| 1 | `GET /api/voicecall/requestcall?zpw_ver=690&zpw_type=24&params=<enc>` | host→server | call offer |
| 2 | `GET /api/voicecall/conf?params=<enc>` | poll | conference/ICE config |
| 3 | `GET /api/voicecall/request?params=<enc>` | poll | incoming-side state |
| 4 | `GET /api/voicecall/answerack?params=<enc>` | host | answer ack |
| 5 | `GET /api/voicecall/conf?params=<enc>` (repeats) | poll | keepalive/config |

- `zpw_ver=690 zpw_type=24` = client version/type (matches Windows client 26.8.20;
  engine `init` payload carries `clientVersion:"681"` for the Linux agent — version-coupled).
- Request `params` and response `data` are **base64 AES-GCM blobs keyed by the account
  session key `zpw_sek`** (same scheme as all Zalo core APIs). Responses:
  `{"error_code":0,"error_message":"Successful.","data":"<b64>"}`.
- Decryption needs `zpw_sek` of the live session; it is NOT in the Wine Chromium cookie DB
  (Electron session cookies only, `encrypted_value`, no masterkey path). The port app itself
  holds `zpw_sek` in memory at runtime → port can decrypt its own requestcall/conf responses.

## 2. Peer discovery / media server

- Server-allocated ZRTC media server this session: **`171.244.25.109:4200`** (previous
  capture: `42.119.138.76:4200` — round-robin/DNS-pooled VNG zrtc gateways).
- Appears as PLAINTEXT inside the engine's own session log `ZaloData/call.log`:

```
["version", 1]
[4,[[690,"Windows_NT_10.0.19045_win32_ia32;AMD Ryzen 7 5800X ...;3800","caller",1],
     ["opus/48000/2",20],["171.244.25.109:4200"],[3,0,0,0,1],
     ["171.244.25.109:4200"],["8.8.8.8:33433"],[0]]]
```

  → field map: `[version, {clientOffer, audioCodec, serverA, flags, serverB, stunReflexive, ...}]`.
  Offered audio codec: **opus/48000/2** (20 ms packetization); video observed at **1280x720**
  (H.264 frame stats in `[5,...]`/`[6,...]` stat rows).
- `8.8.8.8:33433` = STUN reflexive address probe (Google STUN port 33433).
- call.log stat rows `[N,[seq,[...]]]` keep streaming while connected (rtt/loss/bitrate blocks).

## 3. Media plane (UDP, socket-level truth)

- Engine opens ONE UDP socket (`ss`: `ZaloCall.exe fd=254 → 0.0.0.0:54689 UNCONN`),
  **connect() bypasses libc shim** (direct syscall — shim only saw pipe fds).
- Shim still recorded all 31 700 datagrams via `sendmsg/recvmsg`. Frame census:
  - OUT: `7f 00 00 9a …` bulk media (17 155 pkts), `01 01 …` 20-byte control/heartbeat
    (794), `03 7a …` (93+69 pkts, 28/38 B) handshake-ish, `05 7a …` (≈28 pkts) — these carry
    `0a 27 b1 9a` (10.39.177.154) candidates + ports.
  - IN: `7f 00 01 9a …` bulk media (47 141 pkts incl. video), `01 01/02 01 …` control,
    `04 90 71 4f …`, `0e 90 e1 2e …` (16/30 pkts, one-shot; bytes decode as IPv4
    candidates, e.g. 14.144.225.46 — relay/peer-reflexive advertisement).
  - The 4-byte header `7f0000xx`/`7f0001xx` = proprietary framing (direction/len/type).
- **Server IP `ab f4 (19 6d)` found embedded in 280 inbound media frames** — frames carry the
  zrtc gateway address internally.
- **No ZRTP magic (`PZRTP`/`hmac`/`conf`) anywhere** this session, and media payloads are not
  decodable with the engine-pipe AES key → media is **SRTP with per-call keys transported
  server-side** (inside the `voicecall/*` encrypted blobs). ZRTP only appears in the
  direct-P2P fallback mode (previously observed `PZRTP` magic at host↔server on :4200 when
  engine ran with `ZALO_ZCALL_MEDIA=0` test).
- Mitmproxy saw the UDP plane NOT at all (UDP bypasses `--proxy-server`), matching a
  direct-UDP engine; TCP 4200 CONNECT tunnels through mitm DID occur in an earlier capture.

## 4. Host↔engine pipe protocol (JSON, plaintext) — full contract observed

Pipes: `\\.\pipe\PipeZCallRecv` / `PipeZCallSend` (Wine: `~/.zalopc-wine/y-*` unix sockets;
Linux port: `zcall-cap-linux` shim + `call-proxy` Node server on :8080-adjacent, cdp 18765).

Messages (`zcall-capture.jsonl`, live):

```jsonc
// host → engine
{"type":"update","command":"init","data":{ "local":{"id","avatar","name"},
   "osInfo":"Linux_..._x64;...","mainWindowId","logPath","zrtcLogPath","dumpPath",
   "clientVersion":"681","language":"vi","timeoutMakeCall2ZRtp":0,
   "enablePreviewDeviceOutgoing":1,"enablePreviewDeviceIncall":1, ... }}
{"type":"update","command":"updateLocal",...}
{"type":"request","command":"makeCall","data":{"partner":[{"id","avatar","name"}],"type":1}}
// engine → host
{"type":"update","command":"native-ready"}
{"type":"update","command":"listDevice","data":{"autoAudioInput":true,"autoAudioOutput":true,
   "defaultAudOutputDevice":{"id":"alsa_output.pci-0000_23_00.1.hdmi-stereo-extra2", ...},
   "otherAudInputDevice":[...],"otherAudOutputDevice":[...],"defaultVidDevice":...}}
{"type":"update","command":"callState","data":{"state":"ringing"}}   // ringing|free|...
{"type":"sendSignal","command":"end","data":null}
```

This is the **complete porting contract**: a Linux `zcall-agent` must accept
`init/updateLocal/makeCall` and emit `native-ready/listDevice/callState/sendSignal`, then
itself perform: (a) voicecall API signaling with the app's `zpw_sek`, (b) zrtc UDP to the
server-allocated `ip:4200`, (c) opus 48k/2 + H.264 720p SRTP media with server-delivered
per-call keys (ZRTP only as fallback), (d) ALSA/PulseAudio + V4L2 devices enumerated in
`listDevice` (ALSA device ids verbatim from PipeZCallSend traffic).

## 5. Port feasibility verdict (updated)

- Signal API: **portable** (plain HTTPS + zpw_sek, already inside the port's session).
- Media transport: **portable IF** per-call SRTP keys are extractable from the
  `voicecall/*` responses (encrypted, but keyed by `zpw_sek` the port possesses) —
  no ZRTP handshake cracking required in server-relay mode.
- ZRTP fallback path: need one more capture in P2P-direct mode to confirm the handshake
  (magic bytes already seen once in prior sessions).
- Engine itself: closed Windows binary; contract above is sufficient to replace it.
- Net shim trick for future captures: hook `connect` via **vsyscall/pehash on ntdll
  (`sendto`/`WSASendTo` in ws2_32)** or capture `udp:54689↔ip:4200` with `sudo tcpdump -i any
  'udp and port 54689'` (root needed; ptrace_scope=1 blocks strace-attach).
