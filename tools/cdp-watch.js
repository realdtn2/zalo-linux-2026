#!/usr/bin/env node
'use strict';
// Attaches to a running Zalo (started with ZALO_DEBUG=1) over the Chrome DevTools Protocol
// and prints every JS exception, console error and unhandled rejection from EVERY target —
// page, iframe, service worker and shared worker.
//
// This exists because the login stall produces no output through any Electron-level hook:
// webContents' console-message does not see SharedWorker output, and session.webRequest does
// not see WebSockets. CDP does see all of it.
//
// Usage:  ZALO_DEBUG=1 <launch zalo>   then   node tools/cdp-watch.js [port]

const PORT = Number(process.argv[2] || 9222);
const seen = new Set();

const stamp = () => new Date().toISOString().slice(11, 23);

async function listTargets() {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    return res.json();
}

function attach(target) {
    if (!target.webSocketDebuggerUrl || seen.has(target.id)) return;
    seen.add(target.id);

    const label = `${target.type}:${(target.title || target.url || '').slice(0, 60)}`;
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    let dbgEnableId = -1;
    const send = (method, params) => ws.send(JSON.stringify({ id: ++id, method, params: params || {} }));

    ws.addEventListener('open', () => {
        console.log(`${stamp()}  [attached] ${label}`);
        send('Runtime.enable');
        send('Log.enable');
        send('Network.enable');
        // setPauseOnExceptions is rejected if it races ahead of Debugger.enable's reply, which
        // silently produced "zero caught exceptions" on older Electron. Wait for the ack.
        dbgEnableId = ++id;
        ws.send(JSON.stringify({ id: dbgEnableId, method: 'Debugger.enable', params: {} }));
    });

    ws.addEventListener('message', (ev) => {
        let m;
        try { m = JSON.parse(ev.data) } catch { return }

        if (m.id === dbgEnableId) {
            ws.send(JSON.stringify({ id: ++id, method: 'Debugger.setPauseOnExceptions', params: { state: 'caught' } }));
            console.log(`${stamp()}  [pause-on-caught armed] ${label}`);
        }

        if (m.method === 'Debugger.paused') {
            const d = (m.params && m.params.data) || {};
            const desc = d.description || d.value || d.className || '';
            const top = (m.params.callFrames || []).slice(0, 4)
                .map((fr) => (fr.functionName || '<anon>') + '@' + (fr.location && fr.location.lineNumber));
            console.log(`${stamp()}  [CAUGHT] ${label} :: ${String(desc).split('\n')[0]} | ${top.join(' <- ')}`);
            ws.send(JSON.stringify({ id: ++id, method: 'Debugger.resume' }));
        }

        if (m.method === 'Runtime.exceptionThrown') {
            const d = m.params.exceptionDetails || {};
            const desc = (d.exception && (d.exception.description || d.exception.value)) || d.text;
            console.log(`${stamp()}  [EXCEPTION] ${label}\n            ${String(desc).split('\n').slice(0, 6).join('\n            ')}`);
        }

        if (m.method === 'Log.entryAdded') {
            const e = m.params.entry || {};
            if (e.level === 'error' || e.level === 'warning') {
                console.log(`${stamp()}  [log:${e.level}] ${label}  ${String(e.text).slice(0, 240)}`);
            }
        }

        if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'assert'].includes(m.params.type)) {
            const txt = (m.params.args || []).map((a) => a.description || a.value).join(' ');
            console.log(`${stamp()}  [console:${m.params.type}] ${label}  ${String(txt).slice(0, 240)}`);
        }

        if (m.method === 'Network.loadingFailed') {
            console.log(`${stamp()}  [net-fail] ${label}  ${m.params.errorText} ${m.params.type || ''}`);
        }
    });

    ws.addEventListener('error', () => {});
    ws.addEventListener('close', () => seen.delete(target.id));
}

async function loop() {
    try {
        for (const t of await listTargets()) attach(t);
    } catch (err) {
        if (seen.size === 0) process.stderr.write(`waiting for debugger on ${PORT}...\r`);
    }
    setTimeout(loop, 1000);   // new workers appear over time, so keep polling for targets
}

console.log(`watching CDP on 127.0.0.1:${PORT} — every exception from every target, workers included`);
loop();
