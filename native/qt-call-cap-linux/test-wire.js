"use strict";
// Wire regression test: emulates main.js's call-v2 host against zcall-agent
// through the real ZaloCall launcher. Covers: native-ready gating, host->engine
// chunk reassembly + ACK discipline (init padded >4000 hex), listDevice
// update + response, numeric sendSignal -> deterministic end, killMe -> exit.
const net = require("net");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const agent = require("./zcall-agent.js");
const { encrypt, decryptHex, buildListMsgs } = agent;

const R = "/tmp/ztest-recv-" + process.pid;
const S = "/tmp/ztest-send-" + process.pid;
for (const p of [R, S]) try { fs.unlinkSync(p); } catch (e) { }

const devices = {
    autoAudioInput: true, autoAudioOutput: true,
    defaultAudInputDevice: { id: "in0", name: "In", guid: "g0" },
    defaultAudOutputDevice: { id: "out0", name: "Out", guid: "g1" },
    defaultVidDevice: { id: "/dev/video0", name: "/dev/video0", guid: "g2" },
    otherAudInputDevice: [{ id: "in0", name: "In", guid: "g0" }],
    otherAudOutputDevice: [{ id: "out0", name: "Out", guid: "g1" }],
    otherVidDevice: [{ id: "/dev/video0", name: "/dev/video0", guid: "g2" }],
};

let failures = [];
const ok = (cond, name) => {
    console.log((cond ? "PASS" : "FAIL") + "  " + name);
    if (!cond) failures.push(name);
};

// ---- host emulation ---------------------------------------------------------
// serverRecv (g): agent connects and WRITES frames; we parse like Y().
// serverSend (y): agent connects; we write chunked frames, pop on ACK like G/$.
let recvMsgs = [];
const waiters = [];
const onMsg = (m) => { recvMsgs.push(m); waiters.splice(0).forEach((w) => w()); };

const parseRecv = (bufState) => (d) => {
    bufState.s += d.toString();
    let i;
    while ((i = bufState.s.indexOf("$")) >= 0) {
        const frame = bufState.s.slice(0, i);
        bufState.s = bufState.s.slice(i + 1);
        if (!frame) continue;
        // Y has no chunk reassembly; reassemble host-side here so multi-frame
        // agent replies are observed as single messages.
        const m = frame.match(/^(.*)#(\d+)#(\d+)#(\d+)#$/);
        if (m) {
            const key = m[2] + ":" + m[3];
            const parts = (hostChunks.get(key) || []).concat([{ index: +m[4], hex: m[1] }]);
            if (parts.length < +m[3]) { hostChunks.set(key, parts); continue; }
            hostChunks.delete(key);
            const full = parts.sort((a, b) => a.index - b.index).map((p) => p.hex).join("");
            try { onMsg(JSON.parse(decryptHex(full).replace(/[\0]/g, ""))); } catch (e) { console.error("host parse fail:", e.message); }
            continue;
        }
        try {
            onMsg(JSON.parse(decryptHex(frame).replace(/[\0]/g, "")));
        } catch (e) { console.error("host parse fail:", e.message); }
    }
};

const recvBuf = { s: "" };
const hostChunks = new Map();
let sendConn = null;
let ackCount = 0;

const serverRecv = net.createServer((c) => c.on("data", parseRecv(recvBuf)));
const serverSend = net.createServer((c) => {
    sendConn = c;
    c.on("data", () => { ackCount++; });
});

function waitFor(pred, ms, name) {
    return new Promise((res, rej) => {
        const t = setTimeout(() => rej(new Error("timeout: " + name)), ms);
        const check = () => { if (pred()) { clearTimeout(t); res(); } };
        check();
        if (!pred()) waiters.push(check);
    });
}

// Host send, faithful to V/G/$: queue chunks, in-flight gate, ACK pops next.
function hostSend(msg) {
    const chunks = buildListMsgs(encrypt(msg));
    return new Promise((res, rej) => {
        let idx = 0, inflight = false;
        const pump = () => {
            if (inflight || !sendConn) return;
            if (idx >= chunks.length) return res();
            inflight = true;
            const before = ackCount;
            sendConn.write(chunks[idx++], () => {
                // wait for agent ACK (any data) before next chunk
                const poll = setInterval(() => {
                    if (ackCount > before) { clearInterval(poll); inflight = false; pump(); }
                }, 5);
            });
        };
        pump();
        setTimeout(() => rej(new Error("hostSend stalled after " + idx + "/" + chunks.length)), 8000);
    });
}

async function main() {
    await Promise.all([
        new Promise((r) => serverRecv.listen(R, r)),
        new Promise((r) => serverSend.listen(S, r)),
    ]);

    const child = spawn(path.join(__dirname, "ZaloCall"), [R, S], {
        env: { ...process.env, ZALO_ZCALL_DEVICES: JSON.stringify(devices), ZALO_ZCALL_LOG: "1" },
        stdio: ["ignore", "inherit", "inherit"],
    });
    let exitCode = null;
    child.on("exit", (c) => { exitCode = c; });

    // 1. native-ready arrives on recv
    await waitFor(() => recvMsgs.some((m) => m.type === "update" && m.command === "native-ready"), 5000, "native-ready");
    ok(true, "native-ready received");

    // 2. chunked init (>4000 hex) -> agent ACKs each chunk, then answers listDevice
    const pad = "x".repeat(2600);
    await hostSend({ type: "update", command: "init", data: { local: { id: 123, avatar: pad }, osInfo: "linux", clientVersion: "26.05.02", timeoutMakeCall12ZRtp: 20000 } });
    ok(ackCount >= 2, "chunk ACK round-trips (ack=" + ackCount + ")");
    await waitFor(() => recvMsgs.some((m) => m.type === "update" && m.command === "listDevice"), 5000, "init->listDevice");
    const ld = recvMsgs.find((m) => m.command === "listDevice");
    ok(ld && ld.data && ld.data.defaultAudInputDevice && ld.data.defaultAudInputDevice.id === "in0" && ld.data.otherVidDevice.length === 1, "init-announce listDevice shape");

    // 3. request/listDevice -> response/listDevice (renderer "call-response-listDevice")
    await hostSend({ type: "request", command: "listDevice", data: {} });
    await waitFor(() => recvMsgs.some((m) => m.type === "response" && m.command === "listDevice"), 5000, "response/listDevice");
    const rsp = recvMsgs.find((m) => m.type === "response");
    ok(rsp && rsp.data.autoAudioInput === true && Array.isArray(rsp.data.otherAudOutputDevice), "response/listDevice shape");

    // 4. numeric sendSignal -> deterministic end (callState free + signal end)
    await hostSend({ type: "sendSignal", command: 401, data: { to: "peer" } });
    await waitFor(() => recvMsgs.some((m) => m.type === "update" && m.command === "callState" && m.data && m.data.state === "free"), 5000, "callState free");
    ok(true, "sendSignal 401 -> callState free");
    ok(recvMsgs.some((m) => m.type === "sendSignal" && m.command === "end"), "sendSignal 401 -> end echo");

    // 5. killMe is host-handled (H killMe -> N.kill SIGINT). Agent must stay
    // silent on it; the SIGINT then ends the process with code 0.
    const nBefore = recvMsgs.length;
    await hostSend({ type: "request", command: "killMe", data: null });
    await new Promise((r) => setTimeout(r, 120));
    // H would now SIGINT the child; emulate that.
    child.kill("SIGINT");
    await new Promise((r) => { const w = setInterval(() => { if (exitCode !== null) { clearInterval(w); r(); } }, 20); });
    await new Promise((r) => setTimeout(r, 100));
    ok(recvMsgs.length === nBefore, "killMe -> agent stays silent");
    ok(exitCode === 0, "killMe SIGINT -> clean exit (code=" + exitCode + ")");
    child.kill("SIGKILL");

    serverRecv.close(); serverSend.close();
    for (const p of [R, S]) try { fs.unlinkSync(p); } catch (e) { }
    console.log(failures.length ? "WIRE-TEST FAILURES: " + failures.join(", ") : "WIRE-TEST ALL PASS");
    process.exit(failures.length ? 1 : 0);
}

main().catch((e) => { console.error("WIRE-TEST ERROR:", e.message); process.exit(1); });
