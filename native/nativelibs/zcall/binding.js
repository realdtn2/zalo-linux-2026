function getLib() {
    if (process.platform === 'win32') {
        if (process.arch === 'x64') return require('./zcall_x64.node');
        return require('./zcall_ia32.node');
    } else if (process.platform === 'darwin') {
        return require('./zcall_mac.node');
    } else if (process.platform === 'linux') {
        // zcall_mac.node is a Mach-O binary for VNG's proprietary VoIP stack —
        // not portable. Route to the no-op stub so the app degrades gracefully
        // (UI shows call unsupported) instead of crashing in vcmac.js.
        return require('./binding-stub.js');
    } else {
        return {
            error: 'not support'
        };
    }
}
module.exports = getLib();