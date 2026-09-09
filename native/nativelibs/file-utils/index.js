function getLib() {
    if (process.platform === 'win32') {
        if (process.arch === 'x64')
            return require('./x64/file-utils.node');
        return require('./ia32/file-utils.node');
    } else if (process.platform === 'darwin') {
        if (process.arch === 'arm64') {
            return require('./darwin-arm/file-utils.node');
        } else {
            return require('./darwin/file-utils.node');
        }
    } else if (process.platform === 'linux') {
        // Pure-JS port (XDG trash / copy / ensureDir / exec-bit) — see ./linux.js
        return require('./linux.js');
    } else {
        return {
            error: 'not support'
        };
    }
}
module.exports = getLib();