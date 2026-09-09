function getLib() {

    let addon = null;
    if (process.platform === 'win32') {
        if (process.arch === 'x64') {
            addon = require('./win64/addon');
        } else {
            addon = require('./win32/addon');
        }
    } else if (process.platform === 'linux') {
        // Pure-JS Linux port (no native addon needed) — see ./linux.js
        return require('./linux.js');
    } else {
        return {
            stat: () => {},
            diskInfo: () => {},
            statFolder: () => {},
        };
    }

    /**
     * Stat thông tin file/folder
     * @param {*} path 
     * @param {*} isFolder 
     * @returns 
     */
    const stat = async (path, isFolder) => {
        return addon.getInfo(path, isFolder);
    }

    /**
     * Hàm này lấy thông tin ổ đĩa hiện có trong máy
     * Note: đang support cho win only
     * @returns 
     */
    const diskInfo = async () => {
        return addon.getDiskInfo();
    }

    /**
     * Hàm này lấy stat folder nhanh chóng
     * @param {*} folderPath 
     */
    const statFolder = async (folderPath) => {
        return addon.getInfo(folderPath, true);
    }

    /**
     * 
     * @param {*} src 
     * @param {*} dest 
     * @param {*} callback (err, results)
     */
    const copyFolder = async (src, dest, callback) => {
        return addon.copyFolder(src, dest, callback);
    }

    /**
     * 
     */
    const cancelCopy = async () => {
        return addon.cancelCopy();
    }

    /**
     * Hàm kiểm tra một file/folder có quyền đọc và ghi hay không
     * @param {*} path 
     * @returns 
     */
    const canReadAndWrite = (path) => {
        return addon.canReadAndWrite(path);
    }

    /**
     * Hàm kiểm tra một file/folder có quyền đọc hay không
     * @param {*} path 
     * @returns 
     */
    const canRead = (path) => {
        return addon.canRead(path);
    }

    /**
     * Hàm kiểm tra một file/folder có quyền ghi hay không
     * @param {*} path 
     * @returns 
     */
    const canWrite = (path) => {
        return addon.canWrite(path);
    }

    return {
        stat,
        diskInfo,
        statFolder,
        copyFolder,
        cancelCopy,
        canReadAndWrite,
        canRead,
        canWrite
    };
}

module.exports = getLib();