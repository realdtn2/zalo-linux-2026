#!/bin/bash
set -e

# --- CONFIG ---
APP_NAME="Zalo"
INSTALL_DIR="$HOME/.local/share/zalo"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_SRC="./pc-dist/favicon-96x96.v1.png"
ICON_DEST="$HOME/.local/share/icons/zalo.png"

# Files/folders in the current directory that should NOT be installed.
# Add or remove entries as you like. Use exact names (no paths, no wildcards).
EXCLUDE_LIST=".git .github .gitignore .remember install.sh reverse-engineering generate-addon.py dist build-appimage.sh build-deb.sh README.md COMPREHENSIVE_ANALYSIS.md CLAUDE.md"

# --- HELPERS ---
command_exists() { command -v "$1" >/dev/null 2>&1; }
print_step() { echo ""; echo ">>> $1"; }

# --- DEPENDENCY INSTALL ---
install_dependencies() {
    # Add xclip for X11 clipboard support if on X11
    local EXTRA=""
    if [ "$XDG_SESSION_TYPE" = "x11" ] || ( [ -z "$WAYLAND_DISPLAY" ] && [ -n "$DISPLAY" ] ); then
        EXTRA=" xclip"
    fi
    print_step "Installing missing dependencies: wget unzip curl git zenity$EXTRA..."
    if command_exists apt-get; then
        sudo apt-get update -y && sudo apt-get install -y wget unzip curl git zenity$EXTRA
    elif command_exists dnf; then
        sudo dnf install -y wget unzip curl git zenity$EXTRA
    elif command_exists yum; then
        sudo yum install -y wget unzip curl git zenity$EXTRA
    elif command_exists pacman; then
        sudo pacman -Sy --noconfirm wget unzip curl git zenity$EXTRA
    elif command_exists zypper; then
        sudo zypper install -y wget unzip curl git zenity$EXTRA
    elif command_exists apk; then
        sudo apk add wget unzip curl git zenity$EXTRA
    elif command_exists xbps-install; then
        sudo xbps-install -Sy wget unzip curl git zenity$EXTRA
    elif command_exists emerge; then
        EMERGE_EXTRA=$([ -n "$EXTRA" ] && echo " x11-misc/xclip" || echo "")
        sudo emerge --ask=n net-misc/wget app-arch/unzip net-misc/curl dev-vcs/git gnome-extra/zenity$EMERGE_EXTRA
    else
        echo "ERROR: No supported package manager found."
        echo "Please manually install 'wget', 'unzip', 'curl', 'git', and 'zenity', then re-run this script."
        exit 1
    fi
}

# --- CHECK DEPS ---
MISSING=0
command_exists wget   || MISSING=1
command_exists unzip  || MISSING=1
command_exists curl   || MISSING=1
command_exists git    || MISSING=1
command_exists zenity || MISSING=1
[ "$MISSING" -eq 1 ] && install_dependencies

# Install xclip on X11 if missing
if { [ "$XDG_SESSION_TYPE" = "x11" ] || ( [ -z "$WAYLAND_DISPLAY" ] && [ -n "$DISPLAY" ] ); } && ! command_exists xclip; then
    print_step "Installing xclip for X11 clipboard support..."
    if command_exists apt-get; then sudo apt-get install -y xclip
    elif command_exists dnf; then sudo dnf install -y xclip
    elif command_exists yum; then sudo yum install -y xclip
    elif command_exists pacman; then sudo pacman -Sy --noconfirm xclip
    elif command_exists zypper; then sudo zypper install -y xclip
    elif command_exists apk; then sudo apk add xclip
    elif command_exists xbps-install; then sudo xbps-install -Sy xclip
    elif command_exists emerge; then sudo emerge --ask=n x11-misc/xclip
    fi
fi

# --- CLEAN PREVIOUS INSTALL ---
print_step "Removing previous installation if exists..."
rm -rf "$INSTALL_DIR"
rm -f  "$DESKTOP_DIR/$APP_NAME.desktop"
rm -f  "$DESKTOP_DIR/${APP_NAME}Update.desktop"
[ -d "$HOME/Desktop" ] && rm -f "$HOME/Desktop/$APP_NAME.desktop"
[ -d "$HOME/Desktop" ] && rm -f "$HOME/Desktop/${APP_NAME}Update.desktop"

# --- COPY ALL FILES EXCEPT EXCLUSIONS ---
print_step "Copying app files to $INSTALL_DIR (excluding: $EXCLUDE_LIST)..."
mkdir -p "$INSTALL_DIR"

# Make * match hidden files/directories as well
shopt -s dotglob

for item in *; do
    # Skip . and .. explicitly
    [[ "$item" == "." || "$item" == ".." ]] && continue

    skip=false
    for excluded in $EXCLUDE_LIST; do
        if [ "$item" == "$excluded" ]; then
            echo "  SKIPPED: $item"
            skip=true
            break
        fi
    done

    if ! $skip; then
        echo "  COPYING: $item"
        cp -r "$item" "$INSTALL_DIR/"
    fi
done

# Make sure every shell script is executable
find "$INSTALL_DIR" -type f -name '*.sh' -exec chmod +x {} \;

# --- INSTALL ICON ---
print_step "Installing icon..."
mkdir -p "$HOME/.local/share/icons"
if [ -f "$ICON_SRC" ]; then
    cp "$ICON_SRC" "$ICON_DEST"
else
    echo "WARNING: Icon not found at $ICON_SRC — desktop entries will have no icon."
    ICON_DEST=""
fi

# --- GENERATE DESKTOP FILES ---
print_step "Generating desktop entries..."
mkdir -p "$DESKTOP_DIR"

cat > "$DESKTOP_DIR/$APP_NAME.desktop" <<DESK
[Desktop Entry]
Name=$APP_NAME
Comment=Zalo Messenger
Exec=bash $INSTALL_DIR/start.sh
Icon=$ICON_DEST
Terminal=false
Type=Application
Categories=Network;InstantMessaging;
StartupWMClass=Zalo
DESK

chmod +x "$DESKTOP_DIR/$APP_NAME.desktop"

if [ -d "$HOME/Desktop" ]; then
    cp "$DESKTOP_DIR/$APP_NAME.desktop"         "$HOME/Desktop/$APP_NAME.desktop"
    chmod +x "$HOME/Desktop/$APP_NAME.desktop"
    if command_exists gio; then
        gio set "$HOME/Desktop/$APP_NAME.desktop"         metadata::trusted true 2>/dev/null || true
    fi
fi

command_exists gio && gio set "$DESKTOP_DIR/$APP_NAME.desktop"         metadata::trusted true 2>/dev/null || true
command_exists update-desktop-database && update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true

# --- DONE ---
echo ""
echo "============================================"
echo "  $APP_NAME installed successfully!"
echo "  Location : $INSTALL_DIR"
echo "  Launch   : $DESKTOP_DIR/$APP_NAME.desktop"
echo "============================================"
echo ""
