# Zalo Linux Port 2026
⚠️ **Work in Progress** - This project is under active development.
A Linux port of Zalo, bringing the popular Vietnamese messaging application to the Linux platform.

<img width="1280" height="799" alt="image" src="https://github.com/user-attachments/assets/7f3000e2-6d5d-4bc1-a4c1-d334f4d7a3e9" />

## How It Works

This is an unofficial port of the **Zalo macOS desktop client** to Linux — not a web wrapper. Calls are not supported yet.

The port was created by:
1. Extracting the `.dmg` from the macOS version
2. Locating `app.asar` at `/Applications/Zalo.app/Contents/Resources/`
3. Extracting it with `asar extract app.asar app`
4. Running the extracted app with Electron 22.3.27 (`electron .`)

> Note: Newer versions of Electron cause errors — v22.3.27 is required.

## Installation

### Option 1: Install script
1. **Clone the repository**:
   ```bash
   git clone https://github.com/realdtn2/zalo-linux-2026.git
   cd zalo-linux-2026
   ```
2. **Run the install script**:
   ```bash
   ./install.sh
   ```

### Option 2: AppImage
Download the latest AppImage from the [Releases](https://github.com/realdtn2/zalo-linux-2026/releases/latest) page, then:
```bash
chmod +x Zalo-*.AppImage
./Zalo-*.AppImage
```
No installation needed — fully self-contained, just run it.

### Building the AppImage yourself
```bash
git clone https://github.com/realdtn2/zalo-linux-2026.git
cd zalo-linux-2026
./build-appimage.sh
# output: dist/Zalo-<version>-x86_64.AppImage
```
Requires: `wget`, `unzip`

## Usage

**Launch the application**:
- Open Zalo from your application launcher or desktop launcher

**Start manually**:
```bash
./start.sh
```

**Update the application**:
- Update through the desktop launcher or app launcher
- Or manually run:
```bash
./update.sh
```
## Features

### `zcall` (Audio & Video Calling)

**Status:** ❌ Unported (Stubbed — degrades gracefully)

**Description:**  
A massive proprietary VoIP and WebRTC stack built around custom ZRTP-based encryption. Implemented through `zcall_mac.node` and responsible for all voice and video calling functionality.
**State:**
`zcall_mac.node` is a Mach-O binary and cannot run on Linux. Call **signalling/ringing** (WebSocket `voicecall/*`) is pure JS and fully working. The Linux binding routes to a contract stub (device enumeration returns the native JSON-string contract; call setup rejects through the same path a macOS config-fetch failure uses), and `native/qt-call-cap-linux/` ships a real call-v2 **wire-protocol bridge**: a Node agent + POSIX launcher that speaks the actual two-socket `$`-framed AES protocol (chunking, per-frame ACK, `native-ready`, `listDevice`, `update`, deterministic `sendSignal 401` end, `killMe` discipline), verified against a host emulator under both Node 22 and Electron 22's Node 16 (`node native/qt-call-cap-linux/test-wire.js`). **Media (voice/video I/O) still requires VNG's proprietary ZRTP-variant stack and is not implemented** — the bridge fails calls fast and correctly instead of hanging. Binary analysis + rationale: `recon-zcall-protocol.md`; protocol invariants: `CALL-LINUX.md`; contract regression: `native/nativelibs/zcall/test-linux.js`.

---


### `db-cross-v4` (Backup Decryption Engine)

**Status:** ✅ Ported

**Description:**  
Replaces the original macOS Mach-O binary. Intercepts backup restoration calls to decompress and decrypt proprietary ZDB4.0 backup containers using AES-256-CBC and LZMA2, enabling full chat history recovery.

**State:**  
Fully reverse-engineered and reimplemented in C++. The Linux replacement is complete and currently active.

---

### `zjxl` (JPEG-XL Codec Support)

**Status:** ✅ Ported

**Description:**  
Replaces the macOS binary with a Linux x64 NAPI addon (`build/linux_x64/jxl.node`) built against libjxl 0.11. All runtime dependencies (libjxl, brotli, highway, libjpeg, lcms2) are bundled next to the addon with `$ORIGIN` RUNPATH, so no system packages are required. Full API parity: `decodeToJpeg`, `bitmapToJxl`, `getJxlInfo`, `resizeJxl`, `resizeJxlLimit`, `jxlDecompressMulti`, `moduleReady`.

---

### `zimage` (Advanced Image Processing)

**Status:** ✅ Ported

**Description:**  
Pure-JS port of the thumbnail pipeline: prefers Electron `nativeImage` (zero dependencies, always available in the main process), falls back to `sharp` if the app ever bundles it, then to the system `vips thumbnail` CLI. Matches the macOS semantics consumers use (`Image.thumbnail` / `resizeQA`, fit-inside, JPEG quality, alpha flattened onto white).

---

### `mp4thumb` (Video Thumbnail Generation)

**Status:** ✅ Ported

**Description:**  
Spawns ffmpeg (`ZALO_FFMPEG` override → Electron's bundled ffmpeg → `PATH`) to extract one scaled frame, mirroring the static-FFmpeg macOS wrapper. When no ffmpeg binary exists the port rejects with the same `{ error: 'LIB_ERR' }` shape the loader fallback already produced, so callers are unaffected.

---

### `file-utilities` (Fast Directory Sizing)

**Status:** ✅ Ported

**Description:**  
Rust NAPI-RS module rebuilt for Linux x64 (`linux-x64/file-utilities.node`, sources under `native/`). Exposes the full surface: `getDirectorySize(Async|Sync)`, `detectHardlinks(Async|Sync)`, `detectFilesystem(Async|Sync)`, `getDirectorySizeByGlob(Async|Sync)`.

---

### `zwalker` (Recursive Directory Scanner)

**Status:** ✅ Ported

**Description:**  
Pure-JS reimplementation of the napi-rs crawler: `scanDirectory`, `updateReferenceMessageId`, `deleteHomelessFiles` (conservative/aggressive), `statUnmarkedFiles`, `deleteEmptyFolders`. Parity-tested against the macOS binary's observed semantics (`.zwalker.json` marker format, atime buckets, homeless math, error codes 1016/1017).

---

### `file-utils` (Low-Level File System Utilities)

**Status:** ✅ Ported

**Description:**  
Pure-JS port: `moveFileToTrash` (FreeDesktop.org Trash spec — files/info layout, collision renaming, `.trashinfo`), `copyFileSync`, `ensureDirSync`, `isFileExecutable`. No "not support" fallback on Linux anymore.

---

### `v8-profiles` (CPU Profiling)

**Status:** ✅ Ported

**Description:**  
Pure-JS shim over Node's core `inspector` module (V8 `Profiler.start/stop/setSamplingInterval`). Provides the same `profiles` map, `startProfiling`/`stopProfiling`/`setSamplingInterval`/`deleteAllProfiles` surface as the macOS profiler addon.

---

### `zfile` (Disk Information)

**Status:** ✅ Ported

**Description:**  
Pure-JS port: `stat`/`statFolder` (size, fileCount, mtime), `diskInfo()` keyed by mount point (statvfs/df), `copyFolder`/`cancelCopy` (cancellable recursive copy), `canRead`/`canWrite`/`canReadAndWrite`.
---

### `sqlite3` (Local Database Engine)

**Status:** ✅ Supported

**Description:**  
The native database engine used to access local message shard databases (`.db` files).

**State:**  
The original macOS binary has been replaced with a Linux ELF build (`node_sqlite3.node`) bundled within the application. Functionality is fully operational.

---

### `zaloLogger` (IPC Logging)

**Status:** ✅ Supported

**Description:**  
Custom logging infrastructure utilizing an IPC transport layer.

**State:**  
Implemented entirely in cross-platform JavaScript and requires no platform-specific porting work.

## Contributing

This is an active work-in-progress project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Disclaimer

⚠️ This is a community port and is not officially affiliated with Zalo or VNG Corporation.

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub Issues](https://github.com/realdtn2/zalo-linux-2026/issues) page.
