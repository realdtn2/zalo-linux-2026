'use strict';
// Linux replacement for Zalo's screen-capture helper.
//
// Upstream ships a Qt binary per platform (ZaloCap.exe on Windows, ZaloHelper.app on macOS)
// and has no Linux branch at all, so this feature never worked on the port. This process
// speaks the same stdio protocol the main app already implements, so no app-side rewrite is
// needed beyond pointing at this launcher.
//
// Wire format (see main-dist/main.js, the `cap:`/`zalo:` command tables):
//   main -> helper : one JSON line on stdin,  {"cmd":"zalo:capture","data":{...}}
//   helper -> main : @cap_resp@{"id":N,"data":"<json string>"}@end_cap_resp@ on stdout
// The outer `data` is a *string* holding the real {cmd,data} payload — it gets JSON.parse'd
// twice on the other side. The reader does not buffer across chunks, so every frame must go
// out in a single write().

const { app, BrowserWindow, desktopCapturer, screen, clipboard, nativeImage, ipcMain } = require('electron');
const path = require('path');

const START = '@cap_resp@';
const END = '@end_cap_resp@';

// Inbound (from the app)
const CMD_CAPTURE = 'zalo:capture';
const CMD_CONVERT_BITMAP = 'zalo:convertBitmap';
const CMD_GET_CLIPBOARD = 'zalo:getDataClipboard';
const CMD_RECV_ACK = 'zalo:recvAck';
const CMD_EDIT_PHOTO = 'zalo:editPhoto';

// Outbound (to the app)
const OUT_INIT_SUCCESS = 'cap:initSuccess';
const OUT_RUNNING = 'cap:running';
const OUT_ACK_REQ = 'cap:recvReq';
const OUT_ACCEPT = 'cap:acceptScrs';
const OUT_SEND2ME = 'cap:send2meScrs';
const OUT_COPY = 'cap:copyScrs';
const OUT_SAVE = 'cap:saveScrs';
const OUT_CANCEL = 'cap:cancelScrs';
const OUT_QUIT = 'cap:quitAction';
const OUT_NO_PERMISSION = 'cap:noPermission';
const OUT_GET_CLIPBOARD = 'cap:getClipboard';
const OUT_CONVERT_BITMAP = 'cap:convertBitmap';

let frameId = 0;
let overlay = null;
let busy = false;

// The app's reader scans each stdout chunk for exactly one @cap_resp@...@end_cap_resp@ pair
// and drops the rest of that chunk, so two frames written back-to-back can lose the second.
// Frames go out one at a time with a gap, which keeps each in its own read.
const outbox = [];
let flushing = false;

function flush() {
    if (flushing) return;
    const frame = outbox.shift();
    if (!frame) return;
    flushing = true;
    process.stdout.write(frame, () => {
        setTimeout(() => { flushing = false; flush(); }, 20);
    });
}

function send(cmd, data) {
    const inner = JSON.stringify({ cmd, data: data === undefined ? '' : data });
    outbox.push(START + JSON.stringify({ id: ++frameId, data: inner }) + END + '\n');
    flush();
}

// stdout carries the protocol, so diagnostics go to stderr *and* to a file — the app is
// normally launched from a desktop entry where stderr is not visible anywhere.
const LOG_FILE = (() => {
    try {
        const os = require('os');
        const base = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
        return path.join(base, 'ZaloData', 'zalo-cap.log');
    } catch (_) { return null; }
})();

function log(...args) {
    const line = '[' + new Date().toISOString() + '] ' + args.join(' ') + '\n';
    try { process.stderr.write('[zalo-cap] ' + line); } catch (_) {}
    if (!LOG_FILE) return;
    try {
        const fs = require('fs');
        fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
        fs.appendFileSync(LOG_FILE, line);
    } catch (_) {}
}

// ---------------------------------------------------------------- capture

// Preferred path on Wayland: org.freedesktop.portal.Screenshot.
//
// desktopCapturer goes through the ScreenCast portal, which opens the "share your screen"
// picker on *every* call and has no way to remember the answer (persistence needs a
// restore_token that Electron does not expose). The Screenshot portal is backed by the
// permission store instead, so the user is asked once and the grant is remembered.
//
// Delegated to portal-shot.py: the portal replies with an async signal aimed at the exact
// D-Bus connection that made the request, so the requester has to stay alive to hear it.
// `gdbus call` exits as soon as the request is sent and the reply is lost, which looks
// exactly like a hung permission dialog. The Python client holds one connection for both.
function portalScreenshot(timeoutMs = 130000) {
    return new Promise((resolve, reject) => {
        const { execFile } = require('child_process');
        const child = execFile('python3', [path.join(__dirname, 'portal-shot.py')],
            { timeout: timeoutMs },
            (err, stdout, stderr) => {
                if (err) {
                    // Exit 2 is a denial or a cancelled dialog — a decision, not a failure to
                    // reach the portal, so it must not trigger the ScreenCast fallback.
                    const denied = child.exitCode === 2;
                    const e = new Error((stderr || err.message).trim().split('\n')[0] || 'portal failed');
                    e.denied = denied;
                    return reject(e);
                }
                const file = String(stdout).trim();
                if (!file) return reject(new Error('portal returned no path'));
                resolve(file);
            });
    });
}

async function grabViaPortal() {
    const fs = require('fs');
    const file = await portalScreenshot();
    try {
        const img = nativeImage.createFromPath(file);
        if (img.isEmpty()) throw new Error('portal returned an unreadable image');
        return img;
    } finally {
        // The portal drops the PNG in a temp/document dir; do not leave screen contents behind.
        try { fs.unlinkSync(file); } catch (_) {}
    }
}

async function grabDisplay(display) {
    const { width, height } = display.size;
    const scale = display.scaleFactor || 1;
    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: Math.round(width * scale), height: Math.round(height * scale) },
        fetchWindowIcons: false,
    });
    if (!sources.length) throw new Error('no screen sources');

    // display_id is the reliable match when the compositor reports it; otherwise fall back to
    // ordering, which lines up with Electron's display list on single-GPU setups.
    const byId = sources.find((s) => String(s.display_id) === String(display.id));
    const chosen = byId || sources[0];
    if (chosen.thumbnail.isEmpty()) throw new Error('empty thumbnail');
    return chosen.thumbnail;
}

async function startCapture(opts) {
    if (busy) { log('capture already in progress'); return; }
    busy = true;
    send(OUT_ACK_REQ, CMD_CAPTURE);

    try {
        // The app hides its own windows before asking for WithoutZalo mode; give the
        // compositor a moment to actually paint without them.
        await new Promise((r) => setTimeout(r, 250));

        const cursor = screen.getCursorScreenPoint();
        const display = screen.getDisplayNearestPoint(cursor);

        let shot;
        try {
            shot = await grabViaPortal();
            // The portal hands back the whole desktop. With more than one monitor that is
            // wider than the display we are about to overlay, so cut out our slice — the
            // overlay derives its scale factor from image width vs. window width.
            const sf = display.scaleFactor || 1;
            const want = { width: Math.round(display.size.width * sf), height: Math.round(display.size.height * sf) };
            const got = shot.getSize();
            if (got.width !== want.width || got.height !== want.height) {
                shot = shot.crop({
                    x: Math.round(display.bounds.x * sf),
                    y: Math.round(display.bounds.y * sf),
                    width: Math.min(want.width, got.width),
                    height: Math.min(want.height, got.height),
                });
            }
        } catch (err) {
            const msg = (err && err.message) || String(err);
            if (err && err.denied) {
                // The user said no (or dismissed the one-time dialog). Falling back to
                // desktopCapturer here would immediately ask again through the ScreenCast
                // picker, which is precisely the repeated prompting we are avoiding.
                log('screenshot permission denied by user');
                send(OUT_CANCEL, '');
                finishCapture();
                return;
            }
            // No portal at all (plain X11, or no Screenshot backend): desktopCapturer works
            // there and does not prompt.
            log('portal screenshot unavailable, falling back:', msg);
            shot = await grabDisplay(display);
        }

        send(OUT_RUNNING, '');
        await openOverlay(display, shot, opts || {});
    } catch (err) {
        log('capture failed:', err && err.message);
        // Wayland denies the portal request when the user cancels the picker, which is the
        // same user-visible outcome as "no permission" on the other platforms.
        send(OUT_NO_PERMISSION, '');
        finishCapture();
    }
}

function finishCapture() {
    busy = false;
    if (overlay && !overlay.isDestroyed()) {
        const w = overlay;
        overlay = null;
        w.destroy();
    }
}

function openOverlay(display, image, opts) {
    return new Promise((resolve) => {
        overlay = new BrowserWindow({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            frame: false,
            transparent: false,
            backgroundColor: '#000000',
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: true,
            alwaysOnTop: true,
            show: false,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
                backgroundThrottling: false,
            },
        });

        overlay.setAlwaysOnTop(true, 'screen-saver');
        overlay.loadFile(path.join(__dirname, 'overlay.html'));

        overlay.webContents.once('did-finish-load', () => {
            overlay.webContents.send('capture-init', {
                dataUrl: image.toDataURL(),
                width: display.bounds.width,
                height: display.bounds.height,
                lang: opts.language === '_en' ? 'en' : 'vi',
                enableSend2Me: Number(opts.enableSend2Me) === 1,
            });
            overlay.show();
            overlay.focus();
        });

        overlay.on('closed', () => { overlay = null; resolve(); });
    });
}

// ------------------------------------------------------- overlay -> here

ipcMain.on('cap-result', (_e, payload) => {
    try {
        const img = nativeImage.createFromDataURL(payload.dataUrl);
        clipboard.writeImage(img);
        // The app never receives pixels over the protocol: it reads them back off the
        // clipboard once it sees copyScrs, so the order here matters.
        send(OUT_COPY, '');
        if (payload.action === 'send2me') send(OUT_SEND2ME, '');
        else if (payload.action === 'save') send(OUT_SAVE, '');
        else send(OUT_ACCEPT, '');
        // acceptScrs/send2meScrs do NOT clear the app's state machine — only cancelScrs and
        // quitAction reset it from BUSY back to READY. Without this the next screenshot is
        // silently swallowed by the `if (C == BUSY) return` guard in startScreenshot.
        send(OUT_QUIT, '');
    } catch (err) {
        log('failed to publish capture:', err && err.message);
        send(OUT_CANCEL, '');
    }
    finishCapture();
});

ipcMain.on('cap-cancel', () => {
    send(OUT_CANCEL, '');
    send(OUT_QUIT, '');
    finishCapture();
});

// -------------------------------------------------------------- protocol

function handle(cmd, data) {
    // Logged unconditionally: if the button "does nothing", the first thing to establish is
    // whether the request ever reaches this process at all.
    if (cmd !== CMD_RECV_ACK) log('<- ' + cmd + ' ' + JSON.stringify(data || ''));
    switch (cmd) {
        case CMD_CAPTURE:
            startCapture(data);
            break;
        case CMD_RECV_ACK:
            // The app acks every frame we send; nothing to do.
            break;
        case CMD_GET_CLIPBOARD: {
            const idReq = (data && data.idReq) || '';
            const text = clipboard.readText() || '';
            const urls = text ? text.split(/\s+/).filter(Boolean) : [];
            send(OUT_GET_CLIPBOARD, JSON.stringify({ idReq, urls }));
            break;
        }
        case CMD_CONVERT_BITMAP: {
            const idReq = (data && data.idReq) || '';
            // Linux clipboards already hand out PNG; re-writing the image normalises the
            // flavour list so the renderer's paste path sees something it recognises.
            let ok = false;
            try {
                const img = clipboard.readImage();
                if (img && !img.isEmpty()) { clipboard.writeImage(img); ok = true; }
            } catch (err) { log('convertBitmap failed:', err && err.message); }
            send(OUT_CONVERT_BITMAP, JSON.stringify({ idReq, isSuccess: ok }));
            break;
        }
        case CMD_EDIT_PHOTO:
            // Standalone photo editor is not implemented; tell the app we are done so it
            // does not sit waiting on a reply that will never come.
            send(OUT_QUIT, '');
            break;
        default:
            log('unhandled cmd', cmd);
    }
}

function readStdin() {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
        buf += chunk;
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line) continue;
            try {
                const msg = JSON.parse(line);
                if (msg && msg.cmd) handle(msg.cmd, msg.data);
            } catch (err) {
                log('bad inbound line:', err && err.message);
            }
        }
    });
    process.stdin.on('end', () => app.quit());
}

app.commandLine.appendSwitch('disable-features', 'UseChromeOSDirectVideoDecoder');
app.disableHardwareAcceleration();

app.whenReady().then(() => {
    readStdin();
    send(OUT_INIT_SUCCESS, '');
    // Stamp the build so the log identifies which version is actually *running* — an app
    // left open across an upgrade keeps executing the code it loaded at startup, and that
    // is indistinguishable from a broken build unless the version is recorded here.
    let version = 'unknown';
    try {
        version = require('fs')
            .readFileSync(path.join(__dirname, '..', '..', 'version.txt'), 'utf8')
            .trim();
    } catch (_) {}
    log('ready (zalo ' + version + ', electron ' + process.versions.electron + ')');
});

// The helper is a background service for the main app: no windows must not quit it.
app.on('window-all-closed', () => {});
