//credit by taivlc,binhlq2

const LIB_NOT_FOUND = -1;
const NOT_SUPPORT = -2;
const LIB_EXTRACT_NOT_FOUND = -3;
const EXTRACT_LIB_RENAME_ERROR = -4;
const EXTRACT_ERROR = -5;
const LIB_ZIP_NOT_FOUND = -6;
const REQUIRE_LIB_ERROR = -7;
// const EXTRACT_LIB_ERROR = -3;

let getInstance = null;
let os = null;
let isInit = false;
let decompress;
let rimraf;

function init() {
    if (!isInit) {
        isInit = true;
        getOS();
    }
}

function getOS() {
    if (process.platform === 'win32') {
        os = 'ia32';
        // if (process.arch === 'x64') {
        //     os = 'x64';
        // } else {
        //     os = 'ia32';
        // }
    } else if (process.platform === 'darwin') {
        if (process.arch === 'arm64') {
            os = 'darwin_arm64';
        } else {
            os = 'darwin_x64';
        }
    }
}

function getLib(options) {
    decompress = options ? options.decompress : null;
    rimraf = options ? options.rimraf : null;
    init();

    const getLibInstance = () => {
        return new Promise((resolve, reject) => {
            if (process.platform === 'linux') {
                // Pure-JS port (nativeImage / sharp / vips CLI) — see ./linux.js
                require('./linux.js')(options).then(resolve, reject);
                return;
            }
            if (!os) {
                reject({
                    error: NOT_SUPPORT
                });
                return;
            }

            if (isFileAvailabe(`${__dirname}/${os}/zimage.node`)) {
                const zimage = require(`${__dirname}/${os}/zimage.node`);

                const thumbnail = (buffer, width, height, format, quality) => {
                    return new Promise((resolve, reject) => {
                        const args = [{
                                buffer,
                                width,
                                height,
                                format,
                                quality,
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            },
                        ];
                        zimage.thumbnail.apply(null, args);
                    });
                };

                // thumbnail using file path
                const resizeQA = (inputPath, outputPath, width, height, quality, _, callback) => {
                    return new Promise((resolve, reject) => {
                        const args = [{
                                inputPath,
                                outputPath,
                                width,
                                height,
                                quality,
                            },
                            callback,
                        ];
                        zimage.thumbnailFs.apply(null, args);
                    });
                };

                resolve({
                    Image: {
                        thumbnail,
                        resizeQA
                    }
                });
            } else {
                // if (isFileAvailabe(`${__dirname}/${os}.za`)) {
                //     if(!decompress || !rimraf) {
                //         reject({error: REQUIRE_LIB_ERROR});
                //         return;
                //     }
                //     preExtractLib(os);
                //     extractLib(os).then(files => {
                //         resolve(require(`${__dirname}/${os}/zimage.node`));
                //     }).catch(err => {
                //         reject({ error: err });
                //     });
                // } else {
                reject({
                    error: LIB_NOT_FOUND
                });
                // }
            }
        });
    };

    return new Promise((resolve, reject) => {
        if (getInstance) {
            return resolve(getInstance);
        }
        if (!getInstance) {
            getInstance = getLibInstance;
            getInstance()
                .then((result) => {
                    resolve(result);
                    getInstance = null;
                })
                .catch((err) => {
                    getInstance = null;
                    reject(err);
                });
        }
    });
}

// function preExtractLib(os) {
// 	try {
// 		rimraf.sync(`${__dirname}/${os}_temp`);
// 		rimraf.sync(`${__dirname}/${os}`);
// 	} catch (err) {}
// }

function isFileAvailabe(path) {
    try {
        const fs = require('fs');
        let stat = fs.statSync(path);
        if (stat) return true;
        return false;
    } catch (err) {
        return false;
    }
}

// function extractLib(os) {
// 	return new Promise((resolve, reject) => {
// 		if (!decompress) {
// 			reject(LIB_EXTRACT_NOT_FOUND);
// 			return;
// 		}
// 		if (isFileAvailabe(`${__dirname}/${os}.za`)) {
// 			decompress(`${__dirname}/${os}.za`, `${__dirname}/${os}_temp`, { strip: 1 })
// 				.then((files) => {
// 					const fs = require('fs');
// 					fs.rename(`${__dirname}/${os}_temp`, `${__dirname}/${os}`, (error) => {
// 						if (error) {
// 							try {
// 								fs.unlink(`${__dirname}/${os}_temp`);
// 							} catch (err) {}

// 							reject(EXTRACT_LIB_RENAME_ERROR);
// 							return;
// 						}
// 						resolve();
// 					});
// 				})
// 				.catch((err) => {
// 					reject(EXTRACT_ERROR);
// 				});
// 		} else {
// 			reject(LIB_ZIP_NOT_FOUND);
// 		}
// 	});
// }

module.exports = getLib;