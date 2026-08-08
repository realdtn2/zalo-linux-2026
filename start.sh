#!/bin/bash
set -e

# --- CONFIG ---
ELECTRON_VERSION="v43.3.0"
ELECTRON_DIR="$HOME/.local/electron-$ELECTRON_VERSION"
ELECTRON_BIN="$ELECTRON_DIR/electron"
DOWNLOAD_URL="https://github.com/electron/electron/releases/download/$ELECTRON_VERSION/electron-$ELECTRON_VERSION-linux-x64.zip"
# Pinned SHA-256 of electron-v22.3.27-linux-x64.zip, taken from the release's SHASUMS256.txt.
# Pinning (rather than just fetching the sums file) means a replaced release asset is caught too.
ELECTRON_SHA256="f4987e9f045e46b117f0805d6ba4dc524e2abb2c2e33660f175bb39564bd3dae"
VERSION_URL="https://raw.githubusercontent.com/realdtn2/zalo-linux-2026/latest/version.txt"
INSTALL_DIR="$(cd "$(dirname "$0")" && pwd)"

# Opt-in override for evaluating a different Electron build (see the Electron lock notes in
# CLAUDE.md). Kept BELOW the literal assignments above so `grep -m1 'ELECTRON_VERSION='` in
# build-appimage.sh / build-deb.sh still reads the pinned default. An overridden version has
# no pinned digest, so we verify against the release's own SHASUMS256.txt instead of skipping
# the integrity check entirely.
ELECTRON_PINNED=1
if [ -n "${ZALO_ELECTRON_VERSION:-}" ] && [ "$ZALO_ELECTRON_VERSION" != "$ELECTRON_VERSION" ]; then
    echo "[!] ZALO_ELECTRON_VERSION=$ZALO_ELECTRON_VERSION overrides the tested $ELECTRON_VERSION." >&2
    echo "[!] Only $ELECTRON_VERSION is verified to work; anything else is experimental." >&2
    ELECTRON_VERSION="$ZALO_ELECTRON_VERSION"
    ELECTRON_SHA256=""
    ELECTRON_PINNED=0
    ELECTRON_DIR="$HOME/.local/electron-$ELECTRON_VERSION"
    ELECTRON_BIN="$ELECTRON_DIR/electron"
    DOWNLOAD_URL="https://github.com/electron/electron/releases/download/$ELECTRON_VERSION/electron-$ELECTRON_VERSION-linux-x64.zip"
fi

# Use bundled electron if available (AppImage), otherwise use/download from ~/.local
if [ -f "$INSTALL_DIR/electron/electron" ]; then
    ELECTRON_BIN="$INSTALL_DIR/electron/electron"
fi

# --- SEMVER COMPARE ---
# Returns 0 if $1 < $2
version_lt() {
    local a="${1#v}" b="${2#v}"
    IFS='.' read -r a1 a2 a3 <<< "$a"
    IFS='.' read -r b1 b2 b3 <<< "$b"
    a1=${a1:-0}; a2=${a2:-0}; a3=${a3:-0}
    b1=${b1:-0}; b2=${b2:-0}; b3=${b3:-0}
    if [ "$a1" -lt "$b1" ]; then return 0
    elif [ "$a1" -gt "$b1" ]; then return 1
    elif [ "$a2" -lt "$b2" ]; then return 0
    elif [ "$a2" -gt "$b2" ]; then return 1
    elif [ "$a3" -lt "$b3" ]; then return 0
    else return 1
    fi
}

# Only ever feed version_lt strings we have checked, so a malformed remote value
# cannot abort the launcher through `set -e` on an arithmetic comparison.
is_valid_version() {
    [[ "$1" =~ ^v?[0-9]+(\.[0-9]+){0,2}$ ]]
}

# --- DOWNLOAD ELECTRON IF NOT EXISTS (non-AppImage only) ---
if [ ! -f "$ELECTRON_BIN" ]; then
    echo "[*] Electron $ELECTRON_VERSION not found. Downloading..."

    # A fixed /tmp path is world-writable and predictable: another local user can pre-create it
    # as a symlink and redirect our write. mktemp gives us a private, unguessable file.
    TMP_DL_DIR="$(mktemp -d "${TMPDIR:-/tmp}/zalo-electron-XXXXXXXX")"
    TMP_ZIP="$TMP_DL_DIR/electron.zip"

    trap 'rm -rf "$TMP_DL_DIR"' EXIT INT TERM

    if ! wget -O "$TMP_ZIP" "$DOWNLOAD_URL"; then
        echo "ERROR: Failed to download Electron."
        exit 1
    fi

    echo "[*] Verifying download integrity..."
    if [ "$ELECTRON_PINNED" != "1" ]; then
        # No pinned digest for an overridden version: fall back to the release's published sums.
        SUMS="$TMP_DL_DIR/SHASUMS256.txt"
        if ! wget -q -O "$SUMS" "https://github.com/electron/electron/releases/download/$ELECTRON_VERSION/SHASUMS256.txt"; then
            echo "ERROR: could not fetch SHASUMS256.txt for $ELECTRON_VERSION."
            exit 1
        fi
        ELECTRON_SHA256="$(grep " \*electron-$ELECTRON_VERSION-linux-x64.zip\$" "$SUMS" | cut -d' ' -f1)"
        if [ -z "$ELECTRON_SHA256" ]; then
            echo "ERROR: no checksum published for electron-$ELECTRON_VERSION-linux-x64.zip."
            exit 1
        fi
    fi
    ACTUAL_SHA256="$(sha256sum "$TMP_ZIP" | cut -d' ' -f1)"
    if [ "$ACTUAL_SHA256" != "$ELECTRON_SHA256" ]; then
        echo "ERROR: Electron checksum mismatch — refusing to run this download."
        echo "  expected: $ELECTRON_SHA256"
        echo "  actual  : $ACTUAL_SHA256"
        exit 1
    fi

    # Extract to a staging dir and move into place only on success, so an interrupted run
    # never leaves a half-populated $ELECTRON_DIR that later launches would trust.
    STAGING="$TMP_DL_DIR/staging"
    mkdir -p "$STAGING"
    if ! unzip -q "$TMP_ZIP" -d "$STAGING"; then
        echo "ERROR: Failed to extract Electron (zip may be corrupt)."
        exit 1
    fi

    if [ -d "$STAGING/electron-$ELECTRON_VERSION-linux-x64" ]; then
        STAGING="$STAGING/electron-$ELECTRON_VERSION-linux-x64"
    fi

    rm -rf "$ELECTRON_DIR"
    mkdir -p "$(dirname "$ELECTRON_DIR")"
    mv "$STAGING" "$ELECTRON_DIR"

    rm -rf "$TMP_DL_DIR"
    trap - EXIT INT TERM

    chmod +x "$ELECTRON_BIN"
    echo "[*] Electron downloaded and verified."
fi


# --- VERSION CHECK ---
if [ -n "$APPIMAGE" ]; then
    if command -v curl >/dev/null 2>&1 && command -v zenity >/dev/null 2>&1; then
        REMOTE_VERSION=$(curl -sf --max-time 5 "$VERSION_URL" | tr -d '[:space:]' || echo "")
        LOCAL_VERSION=$(tr -d '[:space:]' < "$INSTALL_DIR/version.txt" 2>/dev/null || echo "v0.0.0")
        if is_valid_version "$REMOTE_VERSION" && is_valid_version "$LOCAL_VERSION" \
           && version_lt "$LOCAL_VERSION" "$REMOTE_VERSION"; then
            zenity --question \
                --title="Zalo Update Available" \
                --text="A new version of Zalo is available.\n\nInstalled: <b>$LOCAL_VERSION</b>\nLatest:    <b>$REMOTE_VERSION</b>\n\nOpen download page?" \
                --ok-label="Download" \
                --cancel-label="Skip" \
                --width=320 2>/dev/null \
            && xdg-open "https://github.com/realdtn2/zalo-linux-2026/releases/tag/$REMOTE_VERSION" || true
        fi
    fi
else
    STARTUP_CHECK=1 bash "$INSTALL_DIR/update.sh"
fi

# --- RUN APP ---
# The Chromium sandbox is the main thing standing between a renderer exploit and the user's
# files, so we start WITH it and only give it up if it genuinely cannot initialise. The old
# behaviour — passing --no-sandbox on every Debian-derived distro — disabled it even on
# systems where it works fine (verified working on Ubuntu 24.04+ / 26.04).
echo "[*] Launching with Electron $ELECTRON_VERSION..."

# Electron 22 always ran through XWayland; Electron 29+ picks native Wayland on a Wayland
# session. This bundle is a macOS build that has only ever been exercised under X11, and
# native Wayland breaks things that used to work — notably globalShortcut, which then has to
# go through the xdg GlobalShortcuts portal ("Failed to call BindShortcuts"). Pin X11 to keep
# the environment the app was working in; override with ZALO_OZONE_PLATFORM=wayland to test.
OZONE="${ZALO_OZONE_PLATFORM:-x11}"

run_electron() {
    ELECTRON_ENABLE_LOGGING=1 "$ELECTRON_BIN" --ozone-platform="$OZONE" "$@" "$INSTALL_DIR"
}

if [ "${ZALO_NO_SANDBOX:-0}" = "1" ]; then
    echo "[!] ZALO_NO_SANDBOX=1 set — starting WITHOUT the Chromium sandbox."
    run_electron --no-sandbox
    exit $?
fi

SANDBOX_LOG="$(mktemp "${TMPDIR:-/tmp}/zalo-launch-XXXXXXXX.log")"
trap 'rm -f "$SANDBOX_LOG"' EXIT INT TERM

# Pipe rather than use process substitution: this guarantees tee has flushed the log
# before we inspect it, and PIPESTATUS still gives us Electron's own exit code.
set +e
run_electron 2>&1 | tee "$SANDBOX_LOG"
STATUS=${PIPESTATUS[0]}
set -e

# Distinguish a fatal sandbox bring-up failure from the benign
# "InitializeSandbox() called with multiple threads" GPU warning.
SANDBOX_FATAL='No usable sandbox|SUID sandbox helper|Failed to move to new namespace|clone\(\) failed|namespace sandbox'

if [ "$STATUS" -ne 0 ] && grep -qE "$SANDBOX_FATAL" "$SANDBOX_LOG"; then
    cat >&2 <<'WARN'

[!] WARNING: Chromium could not start its sandbox on this system.
[!] Restarting WITHOUT the sandbox — this removes a major security boundary.
[!]
[!] To fix it properly, pick ONE (both need root, once):
[!]   a) Allow unprivileged user namespaces for this app (Ubuntu 24.04+ default-denies them):
[!]        sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
[!]        # persist: echo 'kernel.apparmor_restrict_unprivileged_userns=0' | sudo tee /etc/sysctl.d/60-zalo-userns.conf
[!]   b) Or install the SUID sandbox helper:
WARN
    echo "[!]        sudo chown root:root '$(dirname "$ELECTRON_BIN")/chrome-sandbox' && sudo chmod 4755 '$(dirname "$ELECTRON_BIN")/chrome-sandbox'" >&2
    echo "" >&2
    run_electron --no-sandbox
    STATUS=$?
fi

exit "$STATUS"
