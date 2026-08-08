#!/bin/bash
set -euo pipefail

# --- ALWAYS RUN FROM SCRIPT'S OWN DIRECTORY ---
cd "$(dirname "$0")"

# --- READ CONFIG FROM EXISTING FILES ---
ELECTRON_VERSION=$(grep -m1 'ELECTRON_VERSION=' start.sh | cut -d'"' -f2)
ELECTRON_SHA256=$(grep -m1 'ELECTRON_SHA256=' start.sh | cut -d'"' -f2)
APP_NAME=$(grep -m1 'APP_NAME=' install.sh | cut -d'"' -f2)
ICON_SRC=$(grep -m1 'ICON_SRC=' install.sh | cut -d'"' -f2 | sed 's|\./||')
EXCLUDE_LIST="$(grep -m1 'EXCLUDE_LIST=' install.sh | cut -d'"' -f2)"
VERSION=$(tr -d '[:space:]' < version.txt 2>/dev/null) || true
# `set -e` would otherwise abort here with no explanation if version.txt were missing.
if [ -z "${VERSION:-}" ]; then
    echo "ERROR: version.txt is missing or empty — cannot name the output AppImage."
    exit 1
fi

APP_ID="${APP_NAME,,}"
ARCH="x86_64"
OUTPUT_DIR="$(pwd)/dist"
APPDIR="$OUTPUT_DIR/${APP_NAME}.AppDir"

# Build downloads live in a user-private cache, never in world-writable /tmp.
# A fixed /tmp path lets any local user pre-place a binary that this script then EXECUTES.
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/zalo-linux-build"
mkdir -p "$CACHE_DIR"
chmod 700 "$CACHE_DIR"

# AppImageKit is retired upstream and its runtime needs libfuse2, which Ubuntu 24.04+ no longer
# ships. The maintained AppImage/appimagetool is a static binary (no FUSE needed to *run* it)
# and embeds a runtime that works with FUSE3, so the AppImages it produces start on Ubuntu 24+.
# Pinned to a tagged release, never the rolling "continuous" tag, whose asset upstream
# replaces in place. Version and digest are both pinned, so the build is reproducible and a
# swapped asset fails closed. To move to a newer appimagetool: bump the version, download it,
# verify it yourself, and update the digest.
APPIMAGETOOL_VERSION="1.9.1"
APPIMAGETOOL="$CACHE_DIR/appimagetool-$APPIMAGETOOL_VERSION-x86_64"
APPIMAGETOOL_URL="https://github.com/AppImage/appimagetool/releases/download/$APPIMAGETOOL_VERSION/appimagetool-x86_64.AppImage"
APPIMAGETOOL_SHA256="ed4ce84f0d9caff66f50bcca6ff6f35aae54ce8135408b3fa33abfc3cb384eb0"

# The AppImage runtime is the first code that executes on a user's machine, so it must not be
# fetched implicitly. Left alone, appimagetool downloads it from the rolling "continuous" tag
# with no integrity check and embeds it. We fetch a dated release ourselves, verify the digest,
# and hand it over with --runtime-file. This runtime also speaks FUSE3, which is what lets the
# resulting AppImage start on Ubuntu 24.04+ (no libfuse2).
RUNTIME_VERSION="20251108"
RUNTIME_FILE="$CACHE_DIR/appimage-runtime-$RUNTIME_VERSION-x86_64"
RUNTIME_URL="https://github.com/AppImage/type2-runtime/releases/download/$RUNTIME_VERSION/runtime-x86_64"
RUNTIME_SHA256="2fca8b443c92510f1483a883f60061ad09b46b978b2631c807cd873a47ec260d"

ELECTRON_URL="https://github.com/electron/electron/releases/download/$ELECTRON_VERSION/electron-$ELECTRON_VERSION-linux-x64.zip"
ELECTRON_ZIP="$CACHE_DIR/electron-$ELECTRON_VERSION-linux-x64.zip"

# --- HELPERS ---
print_step() { echo ""; echo ">>> $1"; }
command_exists() { command -v "$1" >/dev/null 2>&1; }
debug() { echo "    [DEBUG] $1"; }

# Download to a private temp file, check the digest, and only then publish into the cache.
# This way an interrupted or tampered download never becomes a trusted cached artifact.
fetch_verified() {
    local url="$1" dest="$2" want_sha="$3" label="$4"

    if [ -f "$dest" ]; then
        local have_sha
        have_sha="$(sha256sum "$dest" | cut -d' ' -f1)"
        if [ "$have_sha" = "$want_sha" ]; then
            debug "$label: cached and verified"
            return 0
        fi
        echo "    [DEBUG] $label: cached copy has unexpected digest, re-downloading"
        rm -f "$dest"
    fi

    local tmp
    tmp="$(mktemp "$CACHE_DIR/.dl-XXXXXXXX")"

    echo "    Downloading $label..."
    if ! wget -q --show-progress -O "$tmp" "$url"; then
        rm -f "$tmp"
        echo "ERROR: failed to download $label from $url"
        return 1
    fi

    local got_sha
    got_sha="$(sha256sum "$tmp" | cut -d' ' -f1)"
    if [ "$got_sha" != "$want_sha" ]; then
        rm -f "$tmp"
        echo "ERROR: $label checksum mismatch — refusing to use this download."
        echo "  url     : $url"
        echo "  expected: $want_sha"
        echo "  actual  : $got_sha"
        return 1
    fi

    mv "$tmp" "$dest"
    debug "$label: downloaded and verified"
}

echo "============================================"
echo "  Building $APP_NAME AppImage"
echo "  CWD            : $(pwd)"
echo "  Version        : $VERSION"
echo "  Electron       : $ELECTRON_VERSION"
echo "  Icon source    : $ICON_SRC"
echo "  Excluded items : $EXCLUDE_LIST"
echo "  OUTPUT_DIR     : $OUTPUT_DIR"
echo "  APPDIR         : $APPDIR"
echo "  Download cache : $CACHE_DIR"
echo "============================================"

# --- CHECK DEPS ---
print_step "Checking dependencies..."
for dep in wget unzip sha256sum; do
    if command_exists "$dep"; then
        debug "$dep: OK ($(command -v "$dep"))"
    else
        echo "ERROR: '$dep' is required but not installed."; exit 1
    fi
done

# --- DOWNLOAD TOOLING ---
print_step "Fetching appimagetool..."
fetch_verified "$APPIMAGETOOL_URL" "$APPIMAGETOOL" "$APPIMAGETOOL_SHA256" "appimagetool"
chmod +x "$APPIMAGETOOL"

print_step "Fetching AppImage runtime $RUNTIME_VERSION..."
fetch_verified "$RUNTIME_URL" "$RUNTIME_FILE" "$RUNTIME_SHA256" "appimage-runtime"

print_step "Fetching Electron $ELECTRON_VERSION..."
fetch_verified "$ELECTRON_URL" "$ELECTRON_ZIP" "$ELECTRON_SHA256" "electron-$ELECTRON_VERSION"

# --- CLEAN & PREPARE APPDIR ---
print_step "Preparing AppDir..."
rm -rf "$APPDIR"
mkdir -p "$APPDIR"
debug "AppDir created: $APPDIR"

# --- COPY APP FILES ---
print_step "Copying app files (excluding: $EXCLUDE_LIST)..."
shopt -s dotglob
for item in *; do
    [[ "$item" == "." || "$item" == ".." ]] && continue
    skip=false
    for excluded in $EXCLUDE_LIST; do
        [ "$item" == "$excluded" ] && skip=true && break
    done
    if ! $skip; then
        echo "  COPYING: $item"
        cp -r "$item" "$APPDIR/"
    else
        echo "  SKIPPED: $item"
    fi
done
shopt -u dotglob
debug "AppDir contents after copy:"
ls "$APPDIR"

find "$APPDIR" -type f -name '*.sh' -exec chmod +x {} \;

# --- BUNDLE ELECTRON ---
print_step "Bundling Electron $ELECTRON_VERSION..."
mkdir -p "$APPDIR/electron"
unzip -q "$ELECTRON_ZIP" -d "$APPDIR/electron"

SUBDIR="$APPDIR/electron/electron-$ELECTRON_VERSION-linux-x64"
if [ -d "$SUBDIR" ]; then
    debug "Subdirectory detected, flattening..."
    mv "$SUBDIR"/* "$APPDIR/electron/"
    rmdir "$SUBDIR"
fi

if [ ! -f "$APPDIR/electron/electron" ]; then
    echo "ERROR: electron binary not found after extraction!"
    ls -la "$APPDIR/electron"
    exit 1
fi

chmod +x "$APPDIR/electron/electron"
find "$APPDIR/electron" -type f ! -name "*.so*" -exec chmod +x {} \; 2>/dev/null || true
debug "electron binary: OK ($(du -sh "$APPDIR/electron/electron" | cut -f1))"
debug "Total electron dir: $(du -sh "$APPDIR/electron" | cut -f1)"

# --- ICON ---
print_step "Setting up icon..."
if [ -f "$ICON_SRC" ]; then
    cp "$ICON_SRC" "$APPDIR/$APP_ID.png"
    debug "Icon copied: $ICON_SRC → $APPDIR/$APP_ID.png"
else
    echo "  WARNING: Icon not found at $ICON_SRC"
fi

# --- AppRun ---
print_step "Creating AppRun..."
printf '#!/bin/bash\nSELF_DIR="$(dirname "$(readlink -f "$0")")"\nexec bash "$SELF_DIR/start.sh" "$@"\n' > "$APPDIR/AppRun"
chmod +x "$APPDIR/AppRun"

# --- .desktop FILE ---
print_step "Creating .desktop entry..."
printf '[Desktop Entry]\nName=%s\nComment=Zalo Messenger\nExec=AppRun\nIcon=%s\nTerminal=false\nType=Application\nCategories=Network;InstantMessaging;\nStartupWMClass=%s\n' \
    "$APP_NAME" "$APP_ID" "$APP_NAME" > "$APPDIR/$APP_ID.desktop"
debug ".desktop created:"
cat "$APPDIR/$APP_ID.desktop"

# --- FINAL APPDIR OVERVIEW ---
print_step "Final AppDir overview..."
echo "  Total AppDir size: $(du -sh "$APPDIR" | cut -f1)"

# --- BUILD ---
print_step "Building AppImage..."
mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="$OUTPUT_DIR/${APP_NAME}-${VERSION}-${ARCH}.AppImage"
debug "Output file: $OUTPUT_FILE"

rm -f "$OUTPUT_FILE"
# APPIMAGE_EXTRACT_AND_RUN lets appimagetool work on hosts without libfuse2 (Ubuntu 24.04+).
ARCH=$ARCH APPIMAGE_EXTRACT_AND_RUN=1 "$APPIMAGETOOL" --runtime-file "$RUNTIME_FILE" "$APPDIR" "$OUTPUT_FILE"
chmod +x "$OUTPUT_FILE"

echo ""
echo "============================================"
echo "  Done!"
echo "  Output : $OUTPUT_FILE"
echo "  Size   : $(du -sh "$OUTPUT_FILE" | cut -f1)"
echo "  Run    : $OUTPUT_FILE"
echo "============================================"
echo ""
