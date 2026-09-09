let CachedModule = {};

function getLib() {
    let thumbModule = null;
    try {
        if (process.platform === 'win32') {
            thumbModule = require(`./win32/${process.arch}/mp4thumb.node`);
        } else if (process.platform === 'linux') {
            // ffmpeg-CLI port (spawns ffmpeg/avconv; LIB_ERR-shaped reject when absent)
            thumbModule = require('./linux.js');
        } else if (process.arch === 'arm64') {
            // thumbModule = require('./darwin-arm64/mp4thumb.node');
            thumbModule = require('./darwin-arm64/mp4thumb.node');
        } else {
            thumbModule = require('./darwin-x64/mp4thumb.node');
        }
    } catch (e) {
        console.error(`Failed to load mp4thumb module: ${e.message}`);
        // throw new Error(`Module mp4thumb cannot be loaded for ${process.platform}-${process.arch}`);
        thumbModule = new class {
            MP4Thumb() {
                return {
                    generateThumbnailAsync: () => {
                        throw {
                            error: 'LIB_ERR',
                            message: 'Failed to load mp4thumb module'
                        };
                    },
                    generateThumbnail: () => {
                        throw {
                            error: 'LIB_ERR',
                            message: 'Failed to load mp4thumb module'
                        };
                    },
                    cancel: () => {
                        throw {
                            error: 'LIB_ERR',
                            message: 'Failed to load mp4thumb module'
                        };
                    }
                }
            }
        }();
    }

    /**
     * Generate a thumbnail from a video file path
     * @param {string} inputPath - Path to the input video file
     * @param {string} outputPath - Path where the thumbnail should be saved
     * @param {number} [maxWidth] - Optional max width for this specific thumbnail
     * @param {number} [maxHeight] - Optional max height for this specific thumbnail
     * @param {string} mediaId - Media ID
     * @returns {Promise<boolean>} - True if successful
     */
    const generateThumbnail = async (inputPath, outputPath, maxWidth, maxHeight, mediaId) => {
        return new Promise((resolve, reject) => {
            const thumb = new thumbModule.MP4Thumb();
            if (mediaId != null) {
                CachedModule[mediaId] = thumb;
            }
            const done = () => {
                if (mediaId != null) {
                    delete CachedModule[mediaId];
                }
            };
            try {
                if (typeof thumb.generateThumbnailAsync === 'function') {
                    thumb.generateThumbnailAsync(inputPath, outputPath, maxWidth, maxHeight)
                        .then((ok) => {
                            done();
                            resolve(ok);
                        })
                        .catch((err) => {
                            done();
                            reject(err);
                        });
                } else {
                    const ok = thumb.generateThumbnail(inputPath, outputPath, maxWidth, maxHeight);
                    done();
                    resolve(ok);
                }
            } catch (error) {
                done();
                reject(new Error(`Failed to generate thumbnail: ${error.message}`));
            }
        });
    }

    const cancel = (mediaId) => {
        const thumb = CachedModule[mediaId];
        if (thumb) {
            thumb.cancel();
            delete CachedModule[mediaId];
        }
    }

    return {
        generateThumbnail,
        cancel
    };
}

module.exports = getLib();