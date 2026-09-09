function getLib() {
    let nodeAddon = null;

    if (process.platform === 'win32') {
        nodeAddon = require('./build/win32_ia32/jxl.node');
    } else if (process.platform === 'darwin') {
        if (process.arch === 'arm64') nodeAddon = require('./build/darwin_arm64/jxl.node');
        else nodeAddon = require('./build/darwin_x64/jxl.node');
    } else if (process.platform === 'linux') {
        if (process.arch !== 'x64') return { error: 'not support' };
        nodeAddon = require('./build/linux_x64/jxl.node');
    } else {
        return {
            error: 'not support'
        };
    }

    const createCustomError = (code, message) => {
        const customError = new Error(message);
        customError.code = code;
        return customError;
    }
    const decodeToJpeg = (buffer, quality, options) => {
        options = options ?? {};
        options.outputWidth = options.outputWidth && options.outputWidth > 0 ? options.outputWidth : -1;
        options.outputHeight = options.outputHeight && options.outputHeight > 0 ? options.outputHeight : -1;

        return new Promise((resolve, reject) => {
            nodeAddon.jxlToJpeg({
                buffer,
                quality,
                ...options
            }, (error, data, status_code) => {
                if (error) {
                    console.error('jxlToJpeg error: ', error);
                    reject(createCustomError(status_code, "decodeToJpeg error"));
                } else resolve({
                    data,
                    status_code
                });
            });
        });
    };

    const bitmapToJxl = (buffer, width, height) => {
        return new Promise((resolve, reject) => {
            nodeAddon.bitmapToJxl({
                buffer,
                width,
                height
            }, (error, data, status_code) => {
                if (error) {
                    console.error('bitmapToJxl error: ', error);
                    reject(createCustomError(status_code, "encodeJxl error"));
                } else resolve({
                    data,
                    status_code
                });
            });
        });
    }

    const getJxlInfo = (buffer) => {
        return new Promise((resolve, reject) => {
            nodeAddon.getJxlInfo({
                buffer
            }, (error, data, status_code) => {
                if (error) {
                    console.error('getJxlInfo error: ', error);
                    reject(createCustomError(status_code, "getJxlInfo error"));
                } else {
                    if (typeof data === "object") {
                        resolve({
                            ...data,
                            status_code
                        });
                    } else {
                        reject({
                            error: 'getJxlInfo error'
                        });
                    }
                }
            });
        });
    }

    const resizeJxl = (buffer, width, height) => {
        return new Promise((resolve, reject) => {
            nodeAddon.resizeJxl({
                buffer,
                width,
                height
            }, (error, data, status_code) => {
                if (error) {
                    console.error('resizeJxl error: ', error);
                    reject(createCustomError(status_code, "resizeJxl error"));
                } else resolve({
                    data,
                    status_code
                });
            });
        });
    }

    const resizeJxlLimit = (buffer, width, height, limit) => {
        return new Promise((resolve, reject) => {
            nodeAddon.resizeJxlLimit({
                buffer,
                width,
                height,
                limit
            }, (error, data, status_code) => {
                if (error) {
                    console.error('resizeJxlLimit error: ', error);
                    reject(createCustomError(status_code, "resizeJxlLimit error"));
                } else resolve({
                    data,
                    status_code
                });
            });
        });
    }

    const moduleReady = async () => {
        try {
            return nodeAddon.moduleReady();
        } catch (e) {
            return false;
        }
    }

    const jxlDecompressMulti = (options) => {
        return new Promise((resolve, reject) => {
            nodeAddon.jxlDecompressMulti(options, (error, data, status_code) => {
                if (error) {
                    console.error('jxlDecompressMulti error: ', error);
                    reject(createCustomError(status_code, "jxlDecompressMulti error"));
                } else resolve({
                    data,
                    status_code
                });
            });
        });
    }

    return {
        decodeToJpeg,
        bitmapToJxl,
        getJxlInfo,
        resizeJxl,
        resizeJxlLimit,
        moduleReady,
        jxlDecompressMulti
    };
}

module.exports = getLib();