# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository actually is

This is **not** an application source tree. It is the extracted contents of the macOS Zalo desktop client's `app.asar` (VNG's proprietary Electron app), plus a thin layer of Linux porting work on top:

- `main-dist/`, `pc-dist/` — prebuilt, minified webpack bundles shipped by VNG. There is no build step that regenerates them, and no `node_modules` (the `dependencies` in `package.json` are the upstream manifest, informational only). Changes here are made by **patching minified code in place**.
- `native/nativelibs/` — the upstream native addon loaders. Most `.node` binaries are Mach-O (macOS) and unusable on Linux; only `sqlite3` and `db-cross-v4` have Linux binaries.
- `generate-addon.py`, `reverse-engineering/` — the port's own work: a clean-room C++ reimplementation of the `db-cross-v4` backup-decryption addon, derived from disassembly of the macOS binary.
- `install.sh`, `start.sh`, `update.sh`, `build-appimage.sh`, `toggle-devtools.sh`, `version.txt` — the port's packaging/launcher layer.

Electron is pinned to **v43.3.0** by version *and* SHA-256 in `start.sh` (`ELECTRON_VERSION`, `ELECTRON_SHA256`), and that is the ABI target for the native addon build. The port previously shipped v22.3.27 (Chromium 108, EOL since 2023); the upgrade is what removed that exposure.

### What the upgrade required

A scan of APIs removed across Electron 23→43 found **exactly one real call site per bundle**: `webContents.incrementCapturerCount()`, removed in Electron 23. (`registerFileProtocol` and `nativeWindowOpen` also appear but still work on v43.) It sits in `bn()` at [main-dist/main.js:110527](main-dist/main.js#L110527) inside a comma expression *before* the `did-finish-load` handler is attached — so the throw meant the handler that calls `B.close()` (closing the login window) was never registered. That is what made the app hang after login on v23+.

Both bundles are patched with a guard, which is a no-op on v22 and short-circuits on v23+:

```js
!Ae.isDestroyed() && Ae.webContents.incrementCapturerCount && Ae.webContents.incrementCapturerCount()
```

Verified on v43 with an isolated `HOME`: zero unhandled rejections, and all four startup windows load — the login page (`wpa.zaloapp.com`), `sqlite.html`, `shared-worker.html`, `znotification.html`. Both native addons are NAPI, so ABI was never the blocker.

**Do not mistake the notification window closing for a bug.** On v43 Chromium emits `display-metrics-changed` during startup, which triggers `doCloseDirty` ([main-dist/main.js:111440](main-dist/main.js#L111440)) — a 1-second timer that closes the notification window so it can be rebuilt with correct display geometry. Its `closed` handler sets `w = false, g = null`, and `onReceiveCreateNoti` re-runs `N()` when the next notification arrives (holding the pending one in `R` for 10s). This is the designed recovery path, not breakage.

`ZALO_ELECTRON_VERSION` still overrides the pin for testing another build; an overridden version has no pinned digest, so `start.sh` verifies it against that release's `SHASUMS256.txt`. **Always pair it with a throwaway `HOME`** — a different Chromium major rewrites the IndexedDB schema in `~/.config/ZaloData`, and going back then deletes it as corrupt, destroying the stored session.

Main branch is `latest` (not `main`); CI checks out `latest` explicitly.

## Commands

```bash
./start.sh                # Download/cache Electron v22.3.27 to ~/.local/electron-v22.3.27, then launch this directory
./toggle-devtools.sh      # Toggle devTools on/off by sed-patching main-dist/main.js and compact-app.js (off by default)
./install.sh              # Install to ~/.local/share/zalo + create .desktop entries
./update.sh               # git-clone latest and replace installed files (zenity GUI)
./build-appimage.sh       # → dist/Zalo-<version>-x86_64.AppImage  (needs wget, unzip, sha256sum)
./build-deb.sh            # → dist/zalo_<version>_amd64.deb        (needs dpkg-deb, fakeroot, python3+PIL)
python3 generate-addon.py # Rebuild the Linux db-cross-v4 addon (needs liblzma-dev, libssl-dev, node + npx)
```

`build-appimage.sh` caches its downloads in `${XDG_CACHE_HOME:-~/.cache}/zalo-linux-build` and verifies both against pinned SHA-256 values before use. It uses the maintained `AppImage/appimagetool` (a static binary, run with `APPIMAGE_EXTRACT_AND_RUN=1`), so **no libfuse2 is needed to build or to run the result** — the retired AppImageKit build required it, which broke on Ubuntu 24.04+. When upstream rotates its rolling `continuous` asset the pinned digest stops matching; verify the new binary, then re-pin `APPIMAGETOOL_SHA256` or override once with `ZALO_APPIMAGETOOL_SHA256=<sha>`.

There is no test suite, linter, or package manager step. Verification is manual: launch with `./start.sh` and watch stdout (`ELECTRON_ENABLE_LOGGING=1` is set by `start.sh`).

Ad-hoc RE helpers live in [reverse-engineering/tools/](reverse-engineering/tools/) (`check_decrypted_db.py`, `offline_decrypt_check.py`, `debug_parse_binnet.js`) — see [reverse-engineering/README.md](reverse-engineering/README.md).

## Runtime architecture

```
start.sh → electron <dir> → bootstrap.js → main-dist/main.js
```

[bootstrap.js](bootstrap.js) loads perf tracing, runs `main-dist/migration.js`, then branches on `--launch-compact-app` and on `app.requestSingleInstanceLock()` (losers go to `second-instance.js`, which quits).

Renderer entry points are HTML files in `pc-dist/`: `index.html` (main), `login.html`, `compact-app.html`, `znotification.html`, `child.html`, plus worker hosts `shared-worker.html` / `sqlite.html`. The renderer is a React 16 + Redux + Recoil SPA with many dedicated workers (search, zd, trust, pdf, dal, opfs, cpu-heavy, preview-thumb, mainless). Bundle filenames carry a content hash (`e08d0d44f38873747a6b`) — do not hardcode it in new code; the HTML files reference it.

## Native module layer

[native/nativelibs/index.js](native/nativelibs/index.js) is a lazy aggregator over 13 modules. Each module's `index.js`/`binding.js` does its own `process.platform` dispatch. Linux status:

| Working on Linux | Stubbed / unsupported |
|---|---|
| `sqlite3` (`binding/napi-v6-linux-x64/node_sqlite3.node`) | `zcall` (calls), `zimage`, `zjxl`, `mp4thumb`, `file-utils`, `file-utilities`, `zwalker`, `zfile`, `v8-profiles` |
| `db-cross-v4` (`prebuilt/linux/electron/x64/`, built by `generate-addon.py`) | |
| `logger` (pure JS) | |

Note: `zcall/binding-stub.js` and `zwalker/index-stub.js` exist but nothing requires them — the live dispatch is in `binding.js` / `index.js`. Wiring a stub in means editing the loader, not just adding the stub file.

### db-cross-v4 (the port's main RE deliverable)

Decrypts Zalo's `ZDB4.0` backup containers so chat history restore works. [generate-addon.py](generate-addon.py) is a single script that **embeds the full C++ source as a string literal**, writes it plus `binding.gyp`/`package.json` to `/tmp/db-cross-build`, builds with `node-gyp --target=22.3.27 --dist-url=https://www.electronjs.org/headers`, and copies the result into `native/nativelibs/db-cross-v4/prebuilt/linux/electron/x64/`. To change addon behavior, edit the C++ inside the Python string, not any `.cc` file on disk.

Exports: `decompressAndDecryptDb_V2` (implemented), `parseBinNet` (implemented TLV parser), `decompressAndDecryptDb` (V1, returns -1).

**Security invariant:** entry names in the container are attacker-controllable, so every join of an entry name onto the output directory must go through `safe_join_under()` (rejects absolute paths, `..`, and symlinked components; returns error code `-16`). Joining with `fs::path::operator/` directly reintroduces arbitrary file write — an absolute name silently discards the base path. Bounds-check the container header before reading the file count at offset 14; the magic check only guarantees 6 bytes.

Key algorithm details that are easy to get wrong: the AES-256 key is the **first 32 ASCII characters of the uppercased private key used verbatim** (not hex-decoded); CBC with a NULL IV that is **reset to zeros every 65536-byte chunk**; payload is LZMA2/XZ; `ZDB4.0` magic follows decryption.

## Patching the upstream bundles

`main-dist/main.js` (~155k lines) and `compact-app.js` (~148k lines) are minified but newline-formatted, so targeted edits are feasible. Existing Linux patches cover: tray icon paths, `process.platform === "linux" ? setApplicationMenu(null) : ...`, image-file pasting (touches all `preload-*.js` plus both main bundles), and auto-launch. Guidelines:

- Any behavior change that must apply to both windows needs the **same edit in `main.js` and `compact-app.js`** — they are separate bundles of overlapping code.
- Minified identifiers (`oe()`, `yn`, `i`, `r`) are bundle-local and will shift if upstream bundles are ever refreshed; prefer anchoring edits on string literals or `process.platform` checks.
- Do not touch macOS binaries (`zcall_mac.node`, `darwin_*/`, any `.dylib`) — they are kept only for reference and RE.

## Packaging invariants

The shell scripts parse each other with `grep`/`cut`, so their formatting is load-bearing:

- `build-appimage.sh` reads `ELECTRON_VERSION` from `start.sh`, and `APP_NAME` / `ICON_SRC` / `EXCLUDE_LIST` from `install.sh`, each via `grep -m1 ... | cut -d'"' -f2`. Keep these as single-line, double-quoted assignments.
- `update.sh` re-reads `EXCLUDE_LIST` from the *freshly cloned* `install.sh`, so the exclusion list is effectively a release artifact: anything new that must not be installed (dev-only files, dirs) has to be added there.
- `start.sh` launches **with the Chromium sandbox** and only falls back to `--no-sandbox` if bring-up actually fails, printing the root-level fix. Do not reintroduce an unconditional `--no-sandbox`: the sandbox works on Ubuntu 24.04+/26.04 despite `kernel.apparmor_restrict_unprivileged_userns=1`. `ZALO_NO_SANDBOX=1` is the deliberate escape hatch.
- **Bump `version.txt` on every build you hand over, even a rebuild of the same change.** Two artifacts that differ but share a version are indistinguishable once installed, and hours get lost debugging a stale build. The helper logs the running version to `~/.config/ZaloData/zalo-cap.log` for the same reason: an app left open across an upgrade keeps running its old in-memory code, which looks exactly like a broken build.
- `version.txt` (e.g. `v1.2.1`) is the update oracle. Both `start.sh` (AppImage path) and `update.sh` fetch `version.txt` from the `latest` branch on GitHub raw and compare with `version_lt`. Bumping it is what triggers user-facing update prompts — bump it in the same commit as a release.
- Release flow: publish a GitHub release → [.github/workflows/build-appimage.yml](.github/workflows/build-appimage.yml) checks out `latest`, runs `build-appimage.sh`, and uploads `dist/*.AppImage` to the release.

## Packaging targets

Three ways to install, sharing `install.sh`'s `EXCLUDE_LIST` and the same pinned/verified Electron download:

| Target | Prefix | Launcher | Self-update | Sandbox |
|---|---|---|---|---|
| `install.sh` | `~/.local/share/zalo` | `start.sh` | yes (`update.sh`) | namespace sandbox |
| `build-appimage.sh` | AppImage mount | `AppRun` → `start.sh` | prompts, opens releases page | namespace sandbox |
| `build-deb.sh` | `/opt/zalo` | `/usr/bin/zalo` | **no** — dpkg owns `/opt` | **SUID `chrome-sandbox`** via postinst |

The `.deb` is the most secure of the three: `postinst` installs `chrome-sandbox` setuid root, so the sandbox works even where unprivileged user namespaces are restricted, without relying on a sysctl change. It deliberately omits `start.sh`/`update.sh`/`toggle-devtools.sh`.

## Screen capture (`native/zalo-cap-linux/`)

Upstream ships the capture UI as a per-platform Qt binary — `ZaloCap.exe` or `ZaloHelper.app` — and [main-dist/main.js](main-dist/main.js) had only those two branches, so on Linux it spawned a path to a macOS `.app` that does not exist. The feature never worked on this port. A Linux branch now resolves to `native/zalo-cap-linux/zalo-cap`, a shim that re-execs the bundled Electron, so the helper adds no runtime of its own.

**Protocol** (reverse-engineered from the `cap:`/`zalo:` command tables in `main.js`):

- main → helper: one JSON line on stdin, `{"cmd":"zalo:capture","data":{...}}`
- helper → main: `@cap_resp@{"id":N,"data":"<json string>"}@end_cap_resp@` on stdout

The outer `data` is a **string** holding the real `{cmd,data}` — the app `JSON.parse`s it twice. Two traps: the app's reader scans each stdout chunk for exactly one frame and discards the rest, so frames must be written one at a time with a gap (see the outbox in the helper); and pixels never cross the protocol — the helper puts the PNG on the **clipboard**, emits `cap:copyScrs` then `cap:acceptScrs`, and the renderer pastes from there.

**Capture backend.** `desktopCapturer` goes through the ScreenCast portal, which opens the "share your screen" picker on every single call and cannot remember the answer (persistence needs a `restore_token` Electron does not expose). The helper instead calls `org.freedesktop.portal.Screenshot`, which *is* backed by the permission store: granted once, then silent (~0.7s per capture, measured). `org.gnome.Shell.Screenshot` is not an option — GNOME denies it with `AccessDenied`.

`portal-shot.py` exists because the portal replies with an async `Response` signal addressed to the exact D-Bus connection that made the request. `gdbus call` exits the moment it sends, so the reply is delivered to a dead name and the call looks like it hung forever. The Python client (PyGObject, a normal desktop package) holds one connection across both halves. Falling back to `desktopCapturer` on a *denial* is deliberately avoided — it would immediately re-prompt through the picker.

## Bundled third-party libraries

`package.json` lists VNG's dependencies, but there is no `node_modules` and nothing installs from it: webpack inlined those libraries into `main-dist/`/`pc-dist/` by numeric module id. Of the 36 `require()` literals in `main-dist/main.js`, only 5 name a third-party package, and all 5 are `ajv/dist/runtime/*` strings emitted by ajv's code generator — never executed (the app runs with no `node_modules` at all). **`npm install` and version bumps in `package.json` change nothing about what ships.** The only ways to fix a bundled library are to patch the bundle directly or rebuild from VNG's source, which this repo does not have.

Confirmed present by distinctive signature: `electron-updater` (`AppImageUpdater`, `isUseMultipleRangeRequest`), `moment` (`_isUTC`), `jszip`. `decompress` and `tough-cookie` appear only as isolated strings with no API markers — inconclusive, do not assume the vulnerable code paths are reachable.

The bundled `electron-updater` shipped with `autoDownload` and `autoInstallOnAppQuit` both enabled — an automatic download-and-install path, redundant here because the port updates through `update.sh`/the package manager. Both are now patched to `!1` in `main.js` and `compact-app.js`.

## Session persistence (why a login can be lost)

Zalo encrypts its session through Electron `safeStorage` and keeps it in the `async-store` table of `Database/_production/SecureLocalstorage.db`, plus IndexedDB (`Partitions/zalo/IndexedDB/zidb_bu`, tracked by `current_idb_manifest`/`current_bu_ver` in `config.json`).

On Linux `safeStorage` is Chromium OSCrypt, and the ciphertext prefix says which key it used: **`v11` = real keyring** (gnome-libsecret/kwallet), **`v10` = "basic"** fallback with a hardcoded key. Verified on this machine: `isEncryptionAvailable()` is true and the prefix is `v11`. That means a launch where the keyring is *not* reachable — bare TTY, ssh, a desktop session where gnome-keyring has not unlocked — degrades to a different key and the stored session can no longer be decrypted, forcing a re-login. That is the first thing to check for "must log in every time"; the `.deb` therefore depends on `libsecret-1-0`.

Wiping IndexedDB has the same effect. Running a different Electron major against the profile does exactly that.

## Dependency pinning policy

Every external artifact this repo fetches is pinned to an exact version **and** a SHA-256, and nothing resolves a rolling tag. Keep it that way when bumping:

| Thing | Pinned in | Version | Why not newer |
|---|---|---|---|
| Electron | `start.sh` (`ELECTRON_VERSION` + `ELECTRON_SHA256`) | v43.3.0 | Current supported line; see the upgrade notes above |
| appimagetool | `build-appimage.sh` | 1.9.1 | Tagged release, not the `continuous` tag whose asset is replaced in place |
| AppImage runtime | `build-appimage.sh` | 20251108 | appimagetool otherwise downloads it from `continuous` unverified and embeds it |
| node-addon-api | `generate-addon.py` | 8.9.1 | Current line; fine now that Electron 43 embeds Node 24.18.1 |
| node-gyp | `generate-addon.py` | 12.4.0 | Build-host only, no ABI effect; 13.x requires Node ^22.22.2 |
| GitHub Actions | `.github/workflows/build-appimage.yml` | commit SHAs | A mutable `@v4` tag can be repointed at new code by the action's owner |

`package.json` is different: it is VNG's upstream manifest for bundles that are already built and shipped in `main-dist/`/`pc-dist/`. Nothing installs from it, so changing versions there has no effect on what runs — do not "upgrade" it expecting a result.

## Further reading

[COMPREHENSIVE_ANALYSIS.md](COMPREHENSIVE_ANALYSIS.md) is a detailed RE writeup (directory map, per-module status, patch inventory, backup format, CSP allowlist). Treat it as a snapshot — verify line numbers and claims against the current tree before relying on them.
