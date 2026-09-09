# Recon notes: unported native modules (zalo-linux-2026)

## Q1 zwalker
- Shim native/nativelibs/zwalker/index.js: exports scanDirectory, updateReferenceMessageId, deleteHomelessFiles, statUnmarkedFiles, deleteEmptyFolders; darwin-only binding selection (android64.electron1_8_x64/arm64), throws on linux: platform/arch.
- IPC API keys (enum Hn, compact-app.js:45897-45903): COLLECT_DIR_STATS="zwalker-collect-dir-stats", UPDATE_FILE_STATS="zwalker-update-file-stats", DELETE_UNMARKED_FILES="zwalker-del-unmarked-files", STAT_UNMARKED_FILES="zwalker-stat-unmarked-files", DELETE_EMPTY_FOLDERS="zwalker-delete-empty-folders"; handler map Yn {collectDirectoryStats/updateFileStats/deleteUnmarkedFiles/statUnmarkedFiles/deleteEmptyFolders} type REQUEST (compact-app.js:45910).
- Main handler (compact-app.js:45918): collectDirectoryStats: async (e,t,r=[]) => { a=path.resolve(t); s=await EXGp.zwalker(); const e = await s.scanDirectory(a, r); return { fileNumber: e?.fileNumber ?? 0, size: Number(e?.size ?? 0), trackingFolderData: e?.trackingPath ? JSON.parse(e.trackingPath) : {} } }; catch: if err.code==="GenericFailure" throw JSON.parse(err.message).
- updateFileStats (compact-app.js:45936 area): updateReferenceMessageId(a, r) -> { updateCount: e?.fileNumber ?? 0 }.
- deleteUnmarkedFiles handler (compact-app.js:45952): async (e,t,r=[],i=[],o=true) => deleteHomelessFiles(c,r,i,o) -> { fileNumber, size, failedFileNumber, failedSize, trackingFolderData: JSON.parse(trackingPath) }.
- statUnmarkedFiles handler (compact-app.js:45972): async (e,t,r=[],i=[]) => statUnmarkedFiles(c,r,i,o) -> { fileNumber, size, trackingFolderData, trackingATime: JSON.parse(trackingATime) }.
- Renderer (shared-worker.js): apiKey consts at :31951-31993; $zfeatures.zwalker.collectDirectoryStats(rootPath, getTrackingFolderPaths(e)) at :31961/31971/31993/32361; updateFileStats(root, items) items = array of { filePath, uid, eid } objects (getFilePaths mapping, :32341 region); deleteUnmarkedFiles(root, ignore[], tracking[], s bool) :32591-32681 (deleteStatCache flag); statUnmarkedFiles(root, ignore[], tracking[], a) :32751/32761 with a=[259200,604800,1209600] (3/7/14 days seconds).
- Result consumers: trackingFolderData = JSON.parse(trackingPath): object keyed by absolute folderPath -> { file_number, size } (shared-worker.js:32771 reads s.file_number, default 1; :32791 joins folder names via $znode.path.join(userZaloDownloadsDir, "Cache"|"zcloud", ...)); trackingATime keyed by threshold-seconds -> { file_number, size } (shared-worker.js:3285-3302 scanMessages consumer reads statsAfter {size,rSize,count} etc).
- Native strings (strings -a zwalker.darwin-x64.node): src/crawler/stat_unmarked_files.rs, src/garbage_collector/delete_homeless_files.rs, delete_empty_folders.rs; "Error trying to unwrap tracking paths"; AtimeInRange/Tracked/Time went backwards; reference_message; confirms: 2nd arg of scanDirectory/updateReferenceMessageId = tracking paths (paths[] / file entries), 4th arg deleteHomelessFiles = delete-stat-cache bool, statUnmarkedFiles 4th = thresholds[].

## Q2 file-utils
- ONLY method used: getDiskUsage(path). Sites: compact-app-pc:102147 (try{ $znode.nativelibs.fileUtils() }catch{}), :102152 wrapper getDiskUsage, :102424 result: n.free = n.available; return n; duplicated search-worker:102340/102617 and lazy default-login bundle:87022/87299.
- Properties read off result: .available (source), .free (assigned+consumed as free bytes). Native win x64 uses GetDiskFreeSpaceEx -> node-file-utils returns { total, free, available }.

## Q3 zfile
- Shim zfile/index.js (read full): stat(path,isFolder)->addon.getInfo(path,isFolder); diskInfo()->addon.getDiskInfo(); statFolder(p)->addon.getInfo(p,true); copyFolder(src,dest,callback(err,results))->addon.copyFolder; cancelCopy(); canReadAndWrite/canRead/canWrite sync. NON-win32 fallback returns ONLY {stat:()=>{}, diskInfo:()=>{}, statFolder:()=>{}} (no copyFolder/cancelCopy/can* -> undefined on linux).
- diskInfo consumers (compact-app-pc:41822-41823): result iterated/keyed by drive; Proxy normalizes keys to uppercase "X:\\\\" form; reads entry .label. getDrivesInfo module WDks (compact-app-pc:375543) wraps diskInfo with normalize Proxy.
- statFolder consumers (main compact-app.js:31637, 31860): { fileCount } read (migration file counting: getNumFiles).
- copyFolder: renderer E.a.copyFolder compact-app-pc:124990/125005/125251 (migration, callback (err,results)); main migrateDrive compact-app.js:81146-81184.
- $zpc.zfile.getChecksum/compareChecksum/readFileByChunksForUpload: gated by config.async_forward.enable_de_noise_in_forward ? $zpc.zfile.X(...) : JS fallback (compact-app-pc:48382 readFileByChunksForUpload, :116949 compareChecksum vs $zFileManager.testChecksum JS crypto). $zpc.zfile is the main-registered zfile ipc wrapper over win64/addon.node.
- addon.node strings (win64): getInfo, getDiskInfo, canRead, canReadAndWrite, canWrite, copyFolder, GetDiskFreeSpaceExA, fileCount, totalSpace, size, status -> per-drive fields label (observed code) + totalSpace/free/available [INFERENCE].

## Q4 mp4thumb
- Shim mp4thumb/index.js: MP4Thumb.generateThumbnailAsync({inputPath,outputPath,maxWidth,maxHeight,mediaId}): if lib not loaded -> reject {error:\'LIB_ERR\', message:\'Failed to load mp4thumb module\'}; else ok=thumb.generateThumbnail(...) boolean -> resolve(ok); CachableModule cache + cancel(mediaId).
- Renderer queue (search-worker/preload genThumb ipc): resolve payload { thumbPath: <native result>, queueId }; native binary prints "Usage: generateThumbnail(inputPath, outputPath [, maxWidth, maxHeight])" + MJPEG encoder strings -> output at outputPath is JPEG; callers construct outputPath themselves (main-startup lazy join(thumbDir, name-timestamp.jpg)); caller deletes temp (upload flow OutputPath cleanup).

## Q5 zjxl
- Consumers compact-app-pc:70539: $zFeatures.libjxl.decodeToJpeg(buf, quality, {outputWidth, outputHeight, timeout:jxl.jxl_task_timeout}) -> i?.data; null data -> throw coded Resize_NativeLibs; :379374 decodeToJpeg(r, quality, {timeout}) -> a?.data, !data || byteLength==0 -> throw; Blob([data], type image/jpeg). data IS Buffer (Uint8Array).
- Preload wrapper (preload-render.js:27112-27236): jxlDecompressMulti built via a.a({localPath})(buffers, opts, moduleReady), 30s timeout, resolves {data,status}; coded errors Be(150000+i)/150100+(code-1000) [100 for wasm], error passthrough source:\'nativelibs\'; gate: moduleReady() checked in wrapper.
- Shim zjxl/index.js: nodeAddon.jxlToJpeg(buffer, quality, ...options3, (error,data,status_code)); customError.code = status_code; SUCCESS_STATUS===1 pass-through check in preload; exports decodeToJpeg, bitmapToJxl, getJxlInfo, resizeJxl, resizeJxlLimit, moduleReady, jxlDecompressMulti.

## Q6 zimage
- Exposed via $znode.nativelibs.zimage() (getter index.js options=>require(\'./zimage/index.js\')(options)). 3 preload call sites (preload-render.js, preload-noti.js pattern "nativelibs"===e -> coded error xe(150000,e) Be).
- libvips preload wrapper (preload-render.js ~14493 maxProperties/EXGp region): exposes resizeImage(t,width,height,quality,outputFormat,maxWidth,metaFormat,startTimer,stopTimer) only; Image.thumbnail(buffer,w,h,format,quality) shim: inner resizeImage(e,t,n,r,a) signature=image,width,height,quality,format; outer thumbnail args (buffer,w,h,format,quality) -> 4th/5th swapped (format string vs numeric quality) — reimpl keeps order: pass format string then quality number as shim does.
- Image.resizeQA: NO callers in any main-dist/pc-dist/lazy bundle (scans F3, N1 empty).
- Reject {error:-2 NOT_SUPPORT}: shim const LIB_NOT_SUPPORT=-2 when os not win32/darwin; init reject -> preload try/catch -> coded error / JS canvas fallback path.

## Q7 v8-profiles
- NONE. No matches for v8Profiles|process.profiler|startProfiling|setSamplingInterval|CpuProfile across pc-dist/*.js, pc-dist/lazy/*.js, main-dist/*.js (scan22 S2).

## Q8 $znode.nativelibs exposure
- Exposed in preloads: EXGp webpack module = require("../native/nativelibs") (preload-render.js:2256, preload-noti.js:14104, compact-app-preload.js); merged into $znode: nativelibs: Object(r.a)({asyncSqlite: w}, n("EXGp")) (preload-noti.js:2205).
- native/nativelibs/index.js exposes LAZY getters (fileUtils: () => require(...), v8Profiles, zimage, zaloLogger, zjxl, zwalker, zfile, fileUtilities, mp4thumb) -> requiring whole index at startup is SAFE; modules load only when getter called.
- v8-profiles/index.js requires the mac .node at top level -> its getter throws on linux, but nothing calls v8Profiles() (Q7) -> no startup crash. Per-module errors: zwalker/file-utils/file-utilities rethrow loadError inside getter; callers try/catch (e.g. compact-app-pc:102147); mp4thumb shim console.errors then throws {error LIB_ERR}; zfile silently stubs non-win.

## Q9 fileUtilities
- Consumers: compact-app-pc:102516/528405 (+ search-worker 102709/540362, lazy 87391/432371): getDirectorySizeByGlobAsync(glob).totalSize and .fileCount accumulated into {size, numberOfFiles, type}; getDirectorySizeAsync(path, {deep:{maxDepth:3}}) result consumed as tree (resource_management.enable_use_native_scan flag gate at :528409).
- Result fields: totalSize, fileCount, durationMs (binary strings: "workers on DirectorySizeOptions.workerstotalSizefileCountdurationMsgetDirectorySizeSync"); deep tree = DirectoryTreeResult (children nodes; per-node name/path/size [INFERENCE from napi-rs struct]).
- cancelJob/AbortSignal: implemented purely in shim file-utilities/index.js (jobId counter, abortSignal.aborted pre-check -> DOMException AbortError, addEventListener(abort)->cancelJob(jobId), sync+deep validation errors: "Numeric worker count is no longer supported", "deep.maxDepth is required and must be a number", "AbortSignal is only supported for async operations"). NO bundle passes abortSignal/calls cancelJob (scan M4 hits were unrelated upload AbortControllers) -> cancellation never exercised.
