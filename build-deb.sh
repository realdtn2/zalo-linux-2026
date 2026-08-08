#!/bin/bash
set -euo pipefail

# --- ALWAYS RUN FROM SCRIPT'S OWN DIRECTORY ---
cd "$(dirname "$0")"

# --- READ CONFIG FROM EXISTING FILES ---
ELECTRON_VERSION=$(grep -m1 'ELECTRON_VERSION=' start.sh | cut -d'"' -f2)
ELECTRON_SHA256=$(grep -m1 'ELECTRON_SHA256=' start.sh | cut -d'"' -f2)
APP_NAME=$(grep -m1 'APP_NAME=' install.sh | cut -d'"' -f2)
EXCLUDE_LIST="$(grep -m1 'EXCLUDE_LIST=' install.sh | cut -d'"' -f2)"
RAW_VERSION=$(tr -d '[:space:]' < version.txt 2>/dev/null) || true
if [ -z "${RAW_VERSION:-}" ]; then
    echo "ERROR: version.txt is missing or empty."
    exit 1
fi
# Debian versions must start with a digit; version.txt carries a leading "v".
DEB_VERSION="${RAW_VERSION#v}"

PKG="zalo"
ARCH="amd64"
INSTALL_PREFIX="/opt/$PKG"
OUTPUT_DIR="$(pwd)/dist"
STAGE="$OUTPUT_DIR/${PKG}_${DEB_VERSION}_${ARCH}"
OUTPUT_FILE="$OUTPUT_DIR/${PKG}_${DEB_VERSION}_${ARCH}.deb"

CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/zalo-linux-build"
mkdir -p "$CACHE_DIR"; chmod 700 "$CACHE_DIR"
ELECTRON_URL="https://github.com/electron/electron/releases/download/$ELECTRON_VERSION/electron-$ELECTRON_VERSION-linux-x64.zip"
ELECTRON_ZIP="$CACHE_DIR/electron-$ELECTRON_VERSION-linux-x64.zip"

ICON_SOURCE="pc-dist/favicon-512x512.png"
ICON_SIZES="16 24 32 48 64 96 128 192 256 512"

print_step() { echo ""; echo ">>> $1"; }
command_exists() { command -v "$1" >/dev/null 2>&1; }

# Same verified-download helper as build-appimage.sh: private cache, digest checked before use.
fetch_verified() {
    local url="$1" dest="$2" want_sha="$3" label="$4"
    if [ -f "$dest" ] && [ "$(sha256sum "$dest" | cut -d' ' -f1)" = "$want_sha" ]; then
        echo "    $label: cached and verified"; return 0
    fi
    rm -f "$dest"
    local tmp; tmp="$(mktemp "$CACHE_DIR/.dl-XXXXXXXX")"
    echo "    Downloading $label..."
    if ! wget -q --show-progress -O "$tmp" "$url"; then
        rm -f "$tmp"; echo "ERROR: failed to download $label"; return 1
    fi
    local got; got="$(sha256sum "$tmp" | cut -d' ' -f1)"
    if [ "$got" != "$want_sha" ]; then
        rm -f "$tmp"
        echo "ERROR: $label checksum mismatch (expected $want_sha, got $got)"; return 1
    fi
    mv "$tmp" "$dest"; echo "    $label: downloaded and verified"
}

echo "============================================"
echo "  Building $APP_NAME .deb"
echo "  Package  : $PKG"
echo "  Version  : $DEB_VERSION"
echo "  Electron : $ELECTRON_VERSION"
echo "  Prefix   : $INSTALL_PREFIX"
echo "  Output   : $OUTPUT_FILE"
echo "============================================"

print_step "Checking dependencies..."
for dep in dpkg-deb fakeroot wget unzip sha256sum python3; do
    command_exists "$dep" || { echo "ERROR: '$dep' is required."; exit 1; }
done

print_step "Fetching Electron $ELECTRON_VERSION..."
fetch_verified "$ELECTRON_URL" "$ELECTRON_ZIP" "$ELECTRON_SHA256" "electron-$ELECTRON_VERSION"

print_step "Staging package tree..."
rm -rf "$STAGE"
mkdir -p "$STAGE/DEBIAN" "$STAGE$INSTALL_PREFIX" "$STAGE/usr/bin" "$STAGE/usr/share/applications"

# App files: same exclusion list the other installers use, plus the packaging-only bits.
# update.sh is deliberately left out — a .deb is managed by apt/dpkg, and self-updating
# into /opt would fight the package manager and fail on a read-only, root-owned tree.
DEB_EXCLUDES="$EXCLUDE_LIST build-deb.sh update.sh toggle-devtools.sh start.sh"
shopt -s dotglob
for item in *; do
    [[ "$item" == "." || "$item" == ".." ]] && continue
    skip=false
    for ex in $DEB_EXCLUDES; do [ "$item" == "$ex" ] && skip=true && break; done
    if ! $skip; then cp -r "$item" "$STAGE$INSTALL_PREFIX/"; else echo "  SKIPPED: $item"; fi
done
shopt -u dotglob

print_step "Bundling Electron..."
mkdir -p "$STAGE$INSTALL_PREFIX/electron"
unzip -q "$ELECTRON_ZIP" -d "$STAGE$INSTALL_PREFIX/electron"
SUB="$STAGE$INSTALL_PREFIX/electron/electron-$ELECTRON_VERSION-linux-x64"
if [ -d "$SUB" ]; then mv "$SUB"/* "$STAGE$INSTALL_PREFIX/electron/"; rmdir "$SUB"; fi
[ -f "$STAGE$INSTALL_PREFIX/electron/electron" ] || { echo "ERROR: electron binary missing"; exit 1; }

print_step "Generating icons..."
python3 - "$ICON_SOURCE" "$STAGE" "$PKG" $ICON_SIZES <<'PY'
import os, sys
from PIL import Image

src, stage, pkg = sys.argv[1], sys.argv[2], sys.argv[3]
sizes = [int(s) for s in sys.argv[4:]]
img = Image.open(src).convert("RGBA")
for s in sizes:
    d = os.path.join(stage, "usr/share/icons/hicolor", f"{s}x{s}", "apps")
    os.makedirs(d, exist_ok=True)
    img.resize((s, s), Image.LANCZOS).save(os.path.join(d, f"{pkg}.png"))
    print(f"    {s}x{s}")
PY

print_step "Writing launcher..."
cat > "$STAGE/usr/bin/$PKG" <<LAUNCH
#!/bin/bash
# Launcher for the system-wide (.deb) install. Unlike start.sh this never self-updates:
# the package manager owns /opt, and writing there as a normal user would fail anyway.
set -e
APP_DIR="$INSTALL_PREFIX"
ELECTRON_BIN="\$APP_DIR/electron/electron"

# Electron 22 always ran through XWayland; Electron 29+ picks native Wayland on a Wayland
# session. This bundle is a macOS build that has only ever been exercised under X11, and
# native Wayland breaks things that used to work — notably globalShortcut, which then has to
# go through the xdg GlobalShortcuts portal ("Failed to call BindShortcuts"). Pin X11 to keep
# the environment the app was working in; override with ZALO_OZONE_PLATFORM=wayland to test.
OZONE="\${ZALO_OZONE_PLATFORM:-x11}"

run_electron() {
    ELECTRON_ENABLE_LOGGING=1 "\$ELECTRON_BIN" --ozone-platform="\$OZONE" "\$@" "\$APP_DIR"
}

if [ "\${ZALO_NO_SANDBOX:-0}" = "1" ]; then
    echo "[!] ZALO_NO_SANDBOX=1 — starting WITHOUT the Chromium sandbox." >&2
    run_electron --no-sandbox
    exit \$?
fi

# postinst installs chrome-sandbox setuid root, so the sandbox works here even where
# unprivileged user namespaces are restricted (Ubuntu 24.04+ default). Fall back only if
# it genuinely fails to come up.
LOG="\$(mktemp "\${TMPDIR:-/tmp}/zalo-launch-XXXXXXXX.log")"
trap 'rm -f "\$LOG"' EXIT INT TERM

set +e
run_electron 2>&1 | tee "\$LOG"
STATUS=\${PIPESTATUS[0]}
set -e

if [ "\$STATUS" -ne 0 ] && grep -qE 'No usable sandbox|SUID sandbox helper|Failed to move to new namespace|clone\(\) failed|namespace sandbox' "\$LOG"; then
    echo "[!] Chromium sandbox failed to start; retrying without it (reduced isolation)." >&2
    run_electron --no-sandbox
    STATUS=\$?
fi
exit "\$STATUS"
LAUNCH
chmod 755 "$STAGE/usr/bin/$PKG"

print_step "Writing desktop entry..."
cat > "$STAGE/usr/share/applications/$PKG.desktop" <<DESK
[Desktop Entry]
Name=$APP_NAME
Comment=Zalo Messenger
Exec=$PKG
Icon=$PKG
Terminal=false
Type=Application
Categories=Network;InstantMessaging;
StartupWMClass=$APP_NAME
DESK

print_step "Writing control files..."
INSTALLED_SIZE=$(du -sk "$STAGE" | cut -f1)
cat > "$STAGE/DEBIAN/control" <<CTRL
Package: $PKG
Version: $DEB_VERSION
Section: net
Priority: optional
Architecture: $ARCH
Installed-Size: $INSTALLED_SIZE
Maintainer: zalo-linux-2026 contributors <noreply@github.com>
Homepage: https://github.com/realdtn2/zalo-linux-2026
Depends: libgtk-3-0 | libgtk-3-0t64, libnss3, libnspr4, libasound2 | libasound2t64, libatk1.0-0 | libatk1.0-0t64, libatk-bridge2.0-0 | libatk-bridge2.0-0t64, libcups2 | libcups2t64, libdrm2, libgbm1, libxkbcommon0, libxcomposite1, libxdamage1, libxfixes3, libxrandr2, libpango-1.0-0, libcairo2, libexpat1, xdg-utils, libsecret-1-0, python3, python3-gi
Recommends: xdg-desktop-portal
Description: Zalo messenger (unofficial Linux port)
 Unofficial Linux port of the Zalo desktop client, bundled with its own
 Electron runtime. Voice and video calls are not supported on Linux.
CTRL

# The Chromium sandbox helper must be setuid root to work; that is only possible from a
# system package. This is what lets the sandbox stay on even where Ubuntu 24.04+ restricts
# unprivileged user namespaces, so it is a security improvement over the AppImage.
cat > "$STAGE/DEBIAN/postinst" <<POST
#!/bin/sh
set -e
SANDBOX="$INSTALL_PREFIX/electron/chrome-sandbox"
if [ -f "\$SANDBOX" ]; then
    chown root:root "\$SANDBOX"
    chmod 4755 "\$SANDBOX"
fi
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database -q /usr/share/applications || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -q -f /usr/share/icons/hicolor || true
fi

# dpkg replaces files on disk but never touches running processes, and killing someone's
# messenger mid-conversation during an upgrade would be worse than the stale build. Say so
# instead: an already-running Zalo keeps executing the code it loaded at startup, so new
# features (and fixes) only appear after it is restarted.
if pgrep -f "$INSTALL_PREFIX/electron/electron" >/dev/null 2>&1; then
    echo ""
    echo "  NOTE: Zalo is currently running and is still using the previously installed"
    echo "        version. Quit it fully (tray icon -> Quit) and start it again to pick"
    echo "        up this update."
    echo ""
fi
exit 0
POST
chmod 755 "$STAGE/DEBIAN/postinst"

cat > "$STAGE/DEBIAN/postrm" <<'POSTRM'
#!/bin/sh
set -e
if [ "$1" = "remove" ] || [ "$1" = "purge" ]; then
    if command -v update-desktop-database >/dev/null 2>&1; then
        update-desktop-database -q /usr/share/applications || true
    fi
    if command -v gtk-update-icon-cache >/dev/null 2>&1; then
        gtk-update-icon-cache -q -f /usr/share/icons/hicolor || true
    fi
fi
exit 0
POSTRM
chmod 755 "$STAGE/DEBIAN/postrm"

print_step "Fixing permissions..."
find "$STAGE$INSTALL_PREFIX" -type f -name '*.sh' -exec chmod 755 {} \;
chmod 755 "$STAGE$INSTALL_PREFIX/electron/electron"
find "$STAGE$INSTALL_PREFIX/electron" -type f ! -name "*.so*" -exec chmod 755 {} \; 2>/dev/null || true

print_step "Building .deb..."
mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_FILE"
# fakeroot so files are owned by root:root inside the archive without needing real root.
fakeroot dpkg-deb --build --root-owner-group "$STAGE" "$OUTPUT_FILE" >/dev/null

echo ""
echo "============================================"
echo "  Done!"
echo "  Output  : $OUTPUT_FILE"
# stat, not du: right after dpkg-deb renames the archive into place du can still report
# stale block usage and print a nonsense size.
echo "  Size    : $(( $(stat -c %s "$OUTPUT_FILE") / 1024 / 1024 )) MiB"
echo "  Install : sudo apt install $OUTPUT_FILE"
echo "  Remove  : sudo apt remove $PKG"
echo "============================================"
echo ""
