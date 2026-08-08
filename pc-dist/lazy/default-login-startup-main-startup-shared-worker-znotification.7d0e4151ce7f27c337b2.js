(this.webpackJsonp = this.webpackJsonp || []).push([
    [3], {
        v5OU: function(e, E, t) {
            "use strict";
            var S = t("VTBJ");
            let _ = function(e) {
                    return e.NOTIFY = "NOTIFY", e.REQUEST = "REQUEST", e.REQUEST_SYNC = "REQUEST_SYNC", e.SUBSCRIBE = "SUBSCRIBE", e.UNSUBSCRIBE = "UNSUBSCRIBE", e.ONCE = "SUBSCRIBE_ONCE", e.PROVIDE = "PROVIDE", e.STOP_PROVIDE = "STOP_PROVIDE", e.RAW_SEND = "RAW_SEND", e.SUBSCRIBE_V2 = "SUBSCRIBE_V2", e
                }({}),
                a = function(e) {
                    return e.RENDERER_READY = "renderer-ready", e.APP_STARTED = "app-started", e.REQUEST_SHOW_PREFERENCE = "preferences", e.REQUEST_SHOW_ABOUT = "about", e.BEFORE_QUIT_APP = "app-before-quit", e.NETWORK_TIMEOUT_ERR = "CHECK_NETWORK_TIMEOUT_ERR", e.BEFORE_CLOSE_APP = "before-close", e.SHOW_FROM_TRAY = "show-from-tray", e.NOTI_CLICK = "noti-click", e.NOTI_CREATE = "noti-create", e.NOTI_READY = "noti-ready", e.DB_FAIL = "signal-db-fail", e.DB_CORRUPTION = "signal-db-corruption", e.HIDE_APP_BEFORE_QUIT = "z-hide-app-before-quit", e.RESTART_APP_FOR_BACKUP = "bu-ask-restart", e.OS_RESTART = "os-force-restart", e.QUIT_APP_NOW = "do-quit", e.QUIT_APP_CANCEL = "cancel-quit", e.OS_CONFIRM_RESTART = "os-confirm-restart", e.ZAM_RESET_DB = "ZAM_RESET_DB", e.CONFIRM_QUIT = "before-quit", e.Z_NET_ERR = "znet-error-code", e.SHOW_OPEN_FILE_POPUP = "zfile-popup", e.RECEIVE_ARGUMENTS = "receive-arguments", e.SHOW_TOAST_FROM_MAIN = "show-toast-from-main", e.REGISTER_PROCESS = "zmain_register_process", e.PING = "zping", e.RECEIVE_RELAUNCH_MODE = "receive-relaunch-mode", e.LANGUAGE_CHANGE = "language-change", e.ENABLE_NET_HANDLER = "enable-net-handler", e.MONITOR_MEMORY = "start-monitor-app-memory-usage", e.UPDATE_CURRENT_USERID = "ChatApp-receive-userId", e.GET_PROXY_CONFIG = "proxy-get", e.SET_PROXY_CONFIG = "proxy-set", e.BADGE_COUNT = "badge-count", e.CERT_CONFIG = "cert-config", e.BEFORE_APP_RESTART_SILENTLY = "app-before-restart-silently", e.AFTER_APP_RESTART_SILENTLY = "app-after-restart-silently", e.START_IDLE = "start-idle", e.END_IDLE = "end-idle", e.REGISTER_IDLE_CHECK_INTERVAL = "register-idle-check-interval", e.SET_MAIN_WINDOW_RESIZABLE = "set-main-window-resizable", e.SWITCH_TAB = "switch_tab", e.REQUEST_RELAUNCH = "request_relaunch", e.APP_VISIBILITY_CHANGE = "app-visibility-change", e.GET_APP_VISIBILITY = "get-app-visibility", e
                }({});
            const R = {
                notifyRendererReady: {
                    apiKey: a.RENDERER_READY,
                    type: _.NOTIFY
                },
                notifyAppStarted: {
                    apiKey: a.APP_STARTED,
                    type: _.NOTIFY
                },
                onRequestShowAbout: {
                    apiKey: a.REQUEST_SHOW_ABOUT,
                    type: _.SUBSCRIBE
                },
                onRequestShowPreference: {
                    apiKey: a.REQUEST_SHOW_PREFERENCE,
                    type: _.SUBSCRIBE
                },
                removeListenShowAbout: {
                    apiKey: a.REQUEST_SHOW_ABOUT,
                    type: _.UNSUBSCRIBE
                },
                removeListenShowPreference: {
                    apiKey: a.REQUEST_SHOW_PREFERENCE,
                    type: _.UNSUBSCRIBE
                },
                beforeAppQuit: {
                    apiKey: a.BEFORE_QUIT_APP,
                    type: _.SUBSCRIBE
                },
                removeListenBeforeAppQuit: {
                    apiKey: a.BEFORE_QUIT_APP,
                    type: _.UNSUBSCRIBE
                },
                beforeAppClose: {
                    apiKey: a.BEFORE_CLOSE_APP,
                    type: _.SUBSCRIBE
                },
                removeListenBeforeAppClose: {
                    apiKey: a.BEFORE_CLOSE_APP,
                    type: _.UNSUBSCRIBE
                },
                checkNetworkTimeout: {
                    apiKey: a.NETWORK_TIMEOUT_ERR,
                    type: _.REQUEST
                },
                requestShowFromTray: {
                    apiKey: a.SHOW_FROM_TRAY,
                    type: _.SUBSCRIBE
                },
                removeListenRequestShowFromTray: {
                    apiKey: a.SHOW_FROM_TRAY,
                    type: _.UNSUBSCRIBE
                },
                notifyClickNoti: {
                    apiKey: a.NOTI_CLICK,
                    type: _.NOTIFY
                },
                onClickNoti: {
                    apiKey: a.NOTI_CLICK,
                    type: _.SUBSCRIBE
                },
                removeListenClickNoti: {
                    apiKey: a.NOTI_CLICK,
                    type: _.UNSUBSCRIBE
                },
                onRequestRestartAppForBackup: {
                    apiKey: a.RESTART_APP_FOR_BACKUP,
                    type: _.SUBSCRIBE
                },
                removeListenBackupRestartReq: {
                    apiKey: a.RESTART_APP_FOR_BACKUP,
                    type: _.UNSUBSCRIBE
                },
                notifyDbFail: {
                    apiKey: a.DB_FAIL,
                    type: _.NOTIFY
                },
                notifyDbCorruption: {
                    apiKey: a.DB_CORRUPTION,
                    type: _.NOTIFY
                },
                requestHideBeforeQuit: {
                    apiKey: a.HIDE_APP_BEFORE_QUIT,
                    type: _.RAW_SEND
                },
                onOsRequestRestart: {
                    apiKey: a.OS_RESTART,
                    type: _.SUBSCRIBE
                },
                removeListenOsRestart: {
                    apiKey: a.OS_RESTART,
                    type: _.UNSUBSCRIBE
                },
                requestQuitAppImmediately: {
                    apiKey: a.QUIT_APP_NOW,
                    type: _.REQUEST
                },
                cancelQuitApp: {
                    apiKey: a.QUIT_APP_CANCEL,
                    type: _.REQUEST
                },
                osConfirmRestart: {
                    apiKey: a.OS_CONFIRM_RESTART,
                    type: _.REQUEST
                },
                restartByZAM: {
                    apiKey: a.ZAM_RESET_DB,
                    type: _.REQUEST
                },
                onConfirmAppQuit: {
                    apiKey: a.CONFIRM_QUIT,
                    type: _.SUBSCRIBE
                },
                removeListenConfirmAppQuit: {
                    apiKey: a.CONFIRM_QUIT,
                    type: _.UNSUBSCRIBE
                },
                onNetErr: {
                    apiKey: a.Z_NET_ERR,
                    type: _.SUBSCRIBE
                },
                removeListenNetErr: {
                    apiKey: a.Z_NET_ERR,
                    type: _.UNSUBSCRIBE
                },
                onRequestShowOpenFile: {
                    apiKey: a.SHOW_OPEN_FILE_POPUP,
                    type: _.SUBSCRIBE
                },
                removeListenShowOpenFile: {
                    apiKey: a.SHOW_OPEN_FILE_POPUP,
                    type: _.UNSUBSCRIBE
                },
                onReceiveArgument: {
                    apiKey: a.RECEIVE_ARGUMENTS,
                    type: _.SUBSCRIBE
                },
                removeListenReceiveArguments: {
                    apiKey: a.RECEIVE_ARGUMENTS,
                    type: _.UNSUBSCRIBE
                },
                onShowToastFromMain: {
                    apiKey: a.SHOW_TOAST_FROM_MAIN,
                    type: _.SUBSCRIBE
                },
                removeListenToastFromMain: {
                    apiKey: a.SHOW_TOAST_FROM_MAIN,
                    type: _.UNSUBSCRIBE
                },
                registerProcess: {
                    apiKey: a.REGISTER_PROCESS,
                    type: _.NOTIFY
                },
                onPing: {
                    apiKey: a.PING,
                    type: _.PROVIDE
                },
                removeListenPing: {
                    apiKey: a.PING,
                    type: _.STOP_PROVIDE
                },
                requestCreateNoti: {
                    apiKey: a.NOTI_CREATE,
                    type: _.REQUEST
                },
                onRequestShowNoti: {
                    apiKey: a.NOTI_CREATE,
                    type: _.SUBSCRIBE
                },
                notifyNotiReady: {
                    apiKey: a.NOTI_READY,
                    type: _.REQUEST
                },
                notifyRelaunchMode: {
                    apiKey: a.RECEIVE_RELAUNCH_MODE,
                    type: _.RAW_SEND
                },
                changeLanguage: {
                    apiKey: a.LANGUAGE_CHANGE,
                    type: _.RAW_SEND
                },
                enableNetHandler: {
                    apiKey: a.ENABLE_NET_HANDLER,
                    type: _.REQUEST
                },
                updateCurrentUserId: {
                    apiKey: a.UPDATE_CURRENT_USERID,
                    type: _.RAW_SEND
                },
                getProxyConfig: {
                    apiKey: a.GET_PROXY_CONFIG,
                    type: _.REQUEST
                },
                setProxyConfig: {
                    apiKey: a.SET_PROXY_CONFIG,
                    type: _.RAW_SEND
                },
                updateBadgeCount: {
                    apiKey: a.BADGE_COUNT,
                    type: _.REQUEST
                },
                updateCertConfig: {
                    apiKey: a.CERT_CONFIG,
                    type: _.NOTIFY
                },
                beforeAppRestartSilently: {
                    apiKey: a.BEFORE_APP_RESTART_SILENTLY,
                    type: _.SUBSCRIBE
                },
                removeListenBeforeAppRestartSilently: {
                    apiKey: a.BEFORE_APP_RESTART_SILENTLY,
                    type: _.UNSUBSCRIBE
                },
                afterAppRestartSilently: {
                    apiKey: a.AFTER_APP_RESTART_SILENTLY,
                    type: _.SUBSCRIBE
                },
                removeListenAfterAppRestartSilently: {
                    apiKey: a.AFTER_APP_RESTART_SILENTLY,
                    type: _.UNSUBSCRIBE
                },
                registerIdleCheckInterval: {
                    apiKey: a.REGISTER_IDLE_CHECK_INTERVAL,
                    type: _.NOTIFY
                },
                onStartIdle: {
                    apiKey: a.START_IDLE,
                    type: _.SUBSCRIBE
                },
                removeListenStartIdle: {
                    apiKey: a.START_IDLE,
                    type: _.UNSUBSCRIBE
                },
                onEndIdle: {
                    apiKey: a.END_IDLE,
                    type: _.SUBSCRIBE
                },
                removeListenEndIdle: {
                    apiKey: a.END_IDLE,
                    type: _.UNSUBSCRIBE
                },
                setMainWindowResizable: {
                    apiKey: a.SET_MAIN_WINDOW_RESIZABLE,
                    type: _.NOTIFY
                },
                onListenSwitchTab: {
                    apiKey: a.SWITCH_TAB,
                    type: _.SUBSCRIBE
                },
                requestRelaunch: {
                    apiKey: a.REQUEST_RELAUNCH,
                    type: _.REQUEST
                },
                onAppVisibilityChanged: {
                    apiKey: a.APP_VISIBILITY_CHANGE,
                    type: _.SUBSCRIBE
                },
                removeListenAppVisibilityChanged: {
                    apiKey: a.APP_VISIBILITY_CHANGE,
                    type: _.UNSUBSCRIBE
                },
                getAppVisibilityStatus: {
                    apiKey: a.GET_APP_VISIBILITY,
                    type: _.REQUEST
                }
            };
            let p = function(e) {
                return e.CREATE_BACKUP = "create-backup", e.DESTROY_BACKUP = "destroy-backup", e.ABORT_CREATING_BACKUP = "abort-creating-backup", e.ENABLE_CREATING_BACKUP = "enable-creating-backup", e.DISABLE_CREATING_BACKUP = "disable-creating-backup", e.RESTART_AND_RESTORE_BACKUP = "restart-and-restore-backup", e.RESTART_WITHOUT_RESTORING_BACKUP = "restart-without-restoring-backup", e.REJECT_CURRENT_BACKUP = "reject-current-backup", e.CHANGE_BU_INTERVAL = "change-bu-interval", e.WRITE_LATEST_BACK_UP_LOG = "write-latest-back-up-log", e
            }({});
            const i = {
                    createBackup: {
                        apiKey: p.CREATE_BACKUP,
                        type: _.REQUEST
                    },
                    destroyBackup: {
                        apiKey: p.DESTROY_BACKUP,
                        type: _.REQUEST
                    },
                    abortCreatingBackup: {
                        apiKey: p.ABORT_CREATING_BACKUP,
                        type: _.REQUEST
                    },
                    enableCreatingBackup: {
                        apiKey: p.ENABLE_CREATING_BACKUP,
                        type: _.NOTIFY
                    },
                    disableCreatingBackup: {
                        apiKey: p.DISABLE_CREATING_BACKUP,
                        type: _.NOTIFY
                    },
                    restartAndRestoreBackup: {
                        apiKey: p.RESTART_AND_RESTORE_BACKUP,
                        type: _.REQUEST
                    },
                    restartWithoutRestoringBackup: {
                        apiKey: p.RESTART_WITHOUT_RESTORING_BACKUP,
                        type: _.REQUEST
                    },
                    rejectCurrentBackup: {
                        apiKey: p.REJECT_CURRENT_BACKUP,
                        type: _.NOTIFY
                    },
                    changeBuInterval: {
                        apiKey: p.CHANGE_BU_INTERVAL,
                        type: _.NOTIFY
                    },
                    onWriteLatestBackUpLog: {
                        apiKey: p.WRITE_LATEST_BACK_UP_LOG,
                        type: _.SUBSCRIBE
                    },
                    removeOnWriteLatestBackUpLog: {
                        apiKey: p.WRITE_LATEST_BACK_UP_LOG,
                        type: _.UNSUBSCRIBE
                    }
                },
                T = "__Z_I2M__";
            let n = function(e) {
                return e.GET_PHOTOVIEWER_URL = "get-photo-viewer-url", e.GET_CHILD_WINDOW_URL = "get-child-url", e.CLIPBOARD_CHANGE = "clipboard-change", e.GET_IMEI = "get-imei", e.GET_RESOURCE_DIR = "get-resource-dir", e.CHECK_IDLE_UPDATE_BUSY = "check-updater-busy", e.GET_RECENT_FILE = "get-recent-file", e.GET_AUTH_DOMAIN = "get-auth-domain", e.GET_AUTH_DOMAIN_READY = "get-auth-domain-ready", e.GET_AUTH_DOMAIN_REPLY = "get-auth-domain-reply", e.BACKUP_APP_STATE = "backup-app-state", e.RESTORE_APP_STATE = "restore-app-state", e
            }({});
            const o = {
                getPhotoviewerUrl: {
                    apiKey: n.GET_PHOTOVIEWER_URL,
                    type: _.REQUEST
                },
                getChildUrl: {
                    apiKey: n.GET_CHILD_WINDOW_URL,
                    type: _.REQUEST
                },
                onClipboardChange: {
                    apiKey: n.CLIPBOARD_CHANGE,
                    type: _.SUBSCRIBE
                },
                removeListenClipboardChange: {
                    apiKey: n.CLIPBOARD_CHANGE,
                    type: _.UNSUBSCRIBE
                },
                onRequestImei: {
                    apiKey: n.GET_IMEI,
                    type: _.PROVIDE
                },
                removeListenRequestImei: {
                    apiKey: n.GET_IMEI,
                    type: _.STOP_PROVIDE
                },
                getResourceDir: {
                    apiKey: n.GET_RESOURCE_DIR,
                    type: _.REQUEST
                },
                onCheckIdleUpdaterBusy: {
                    apiKey: n.CHECK_IDLE_UPDATE_BUSY,
                    type: _.PROVIDE
                },
                removeListenCheckIdleUpdateBusy: {
                    apiKey: n.CHECK_IDLE_UPDATE_BUSY,
                    type: _.STOP_PROVIDE
                },
                getRecentFiles: {
                    apiKey: n.GET_RECENT_FILE,
                    type: _.REQUEST
                },
                authError: {
                    apiKey: n.GET_AUTH_DOMAIN,
                    type: _.NOTIFY
                },
                getAuthDomainReady: {
                    apiKey: n.GET_AUTH_DOMAIN_READY,
                    type: _.NOTIFY
                },
                getAuthDomainReply: {
                    apiKey: n.GET_AUTH_DOMAIN_REPLY,
                    type: _.PROVIDE
                },
                onBackupAppState: {
                    apiKey: n.BACKUP_APP_STATE,
                    type: _.PROVIDE
                },
                removeListenBackupAppState: {
                    apiKey: n.BACKUP_APP_STATE,
                    type: _.STOP_PROVIDE
                },
                onRestoreAppState: {
                    apiKey: n.RESTORE_APP_STATE,
                    type: _.PROVIDE
                },
                removeListenRestoreAppState: {
                    apiKey: n.RESTORE_APP_STATE,
                    type: _.STOP_PROVIDE
                }
            };
            var C = t("R2CK");
            const y = {
                sendRequest: {
                    apiKey: C.a.REQUEST_CHANNEL,
                    type: _.REQUEST
                },
                processRequest: {
                    apiKey: C.a.REQUEST_CHANNEL,
                    type: _.SUBSCRIBE
                },
                removeListenNewRequest: {
                    apiKey: C.a.REQUEST_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                sendResponse: {
                    apiKey: C.a.RESPONSE_CHANNEL,
                    type: _.REQUEST
                },
                processResponse: {
                    apiKey: C.a.RESPONSE_CHANNEL,
                    type: _.SUBSCRIBE
                },
                removeListenNewResponse: {
                    apiKey: C.a.RESPONSE_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                onFailedLoadSqlite: {
                    apiKey: C.a.FAIL_LOAD_LIB_SQLITE3,
                    type: _.SUBSCRIBE
                },
                checkFailedLoadSqlite: {
                    apiKey: C.a.FAIL_LOAD_LIB_SQLITE3,
                    type: _.REQUEST
                },
                updateAvailableSqliteState: {
                    apiKey: C.a.NOTIFY_STATUS_LOAD_LIB_SQLITE3,
                    type: _.NOTIFY
                },
                notifyOpenDBFailed: {
                    apiKey: C.a.OPEN_DB_FAIL,
                    type: _.NOTIFY
                },
                authenticateDb: {
                    apiKey: C.a.IPC_DB_AUTHENTICATED,
                    type: _.NOTIFY
                },
                onReceiveSession: {
                    apiKey: C.a.IPC_DB_AUTHENTICATED,
                    type: _.SUBSCRIBE
                },
                removeListenNewSession: {
                    apiKey: C.a.IPC_DB_AUTHENTICATED,
                    type: _.UNSUBSCRIBE
                },
                notifyDbConnected: {
                    apiKey: C.a.IPC_DB_CLIENT_CONNECTED,
                    type: _.NOTIFY
                },
                requestCloseDbs: {
                    apiKey: C.a.IPC_START_CLOSE_DBS,
                    type: _.NOTIFY
                },
                onRequestCloseDbs: {
                    apiKey: C.a.IPC_START_CLOSE_DBS,
                    type: _.SUBSCRIBE
                },
                removeListenRequestCloseDbs: {
                    apiKey: C.a.IPC_START_CLOSE_DBS,
                    type: _.UNSUBSCRIBE
                },
                notifyFinishCloseDb: {
                    apiKey: C.a.IPC_FINISH_CLOSE_DBS,
                    type: _.NOTIFY
                },
                abortSyncMsg: {
                    apiKey: C.a.SYNC_MSG_ABORT,
                    type: _.NOTIFY
                },
                getIDBDatabaseHealthStatus: {
                    apiKey: C.a.DB_CORRUPTION_DETECTOR,
                    type: _.REQUEST
                },
                canIUseSQLite: {
                    apiKey: C.a.SQLITE_AVAILABLE,
                    type: _.REQUEST
                },
                showSQLite: {
                    apiKey: C.a.SHOW_SQLITE,
                    type: _.NOTIFY
                },
                getNameOfTargetScriptForDALChannelFromHost: {
                    apiKey: C.a.GET_NAME_OF_TARGET_SCRIPT_FOR_DAL_CHANNEL_FROM_HOST,
                    type: _.REQUEST
                }
            };
            let A = function(e) {
                return e.DOWNLOAD_CONTROLLER_CHANNEL = "new-download-channel", e.DOWNLOAD_CONFIG_CHANGE = "download-config-change", e.INVALID_EXTS_CHANGE = "invalid-file-exts-change", e.DOWNLOAD_THUMB_TEMP = "download-thumb-temp", e
            }({});
            const I = {
                sendDownloadRequest: {
                    apiKey: A.DOWNLOAD_CONTROLLER_CHANNEL,
                    type: _.REQUEST
                },
                onDownloadResp: {
                    apiKey: A.DOWNLOAD_CONTROLLER_CHANNEL,
                    type: _.SUBSCRIBE
                },
                removeListenDownloadResp: {
                    apiKey: A.DOWNLOAD_CONTROLLER_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                updateDownloadConfig: {
                    apiKey: A.DOWNLOAD_CONFIG_CHANGE,
                    type: _.REQUEST
                },
                updateInvalidFileExts: {
                    apiKey: A.INVALID_EXTS_CHANGE,
                    type: _.REQUEST
                },
                downloadThumbTemp: {
                    apiKey: A.DOWNLOAD_THUMB_TEMP,
                    type: _.REQUEST
                }
            };
            let r = function(e) {
                return e.SETUP = "active-deactive:setup", e.ACTIVE = "active-deactive:active", e.DEACTIVE = "active-deactive:deactive", e.CREATE_TIMER = "active-deactive:create-timer", e.CLEAR_TIMER = "active-deactive:clear-timer", e.GET_IDLE_TIME = "active-deactive:get-idle-time", e
            }({});
            const N = {
                getIdleTime: {
                    apiKey: r.GET_IDLE_TIME,
                    type: _.REQUEST
                },
                setup: {
                    apiKey: r.SETUP,
                    type: _.NOTIFY
                },
                createTimer: {
                    apiKey: r.CREATE_TIMER,
                    type: _.NOTIFY
                },
                clearTimer: {
                    apiKey: r.CLEAR_TIMER,
                    type: _.NOTIFY
                },
                onActiveFromBackground: {
                    apiKey: r.ACTIVE,
                    type: _.SUBSCRIBE
                },
                onDeactiveFromBackground: {
                    apiKey: r.DEACTIVE,
                    type: _.SUBSCRIBE
                },
                offActiveFromBackground: {
                    apiKey: r.ACTIVE,
                    type: _.UNSUBSCRIBE
                },
                offDeactiveFromBackground: {
                    apiKey: r.DEACTIVE,
                    type: _.UNSUBSCRIBE
                }
            };
            let U = function(e) {
                return e.EXEC = "exec", e.EXEC_RAW = "exec_raw", e.REMOTE_EVENTS = "remote_events", e.CANCEL = "cancel", e
            }({});
            const O = {
                cancel: {
                    apiKey: U.CANCEL,
                    type: _.REQUEST
                },
                execRaw: {
                    apiKey: U.EXEC_RAW,
                    type: _.REQUEST
                },
                exec: {
                    apiKey: U.EXEC,
                    type: _.REQUEST
                },
                onRemoteEvents: {
                    apiKey: U.REMOTE_EVENTS,
                    type: _.SUBSCRIBE
                }
            };
            let s = function(e) {
                return e.TRIGGER_AUTO_DOWNLOAD = "trigger-auto-download", e
            }({});
            const L = {
                onRequestTriggerAutoDownload: {
                    apiKey: s.TRIGGER_AUTO_DOWNLOAD,
                    type: _.SUBSCRIBE
                },
                removeListenTriggerAutoDownload: {
                    apiKey: s.TRIGGER_AUTO_DOWNLOAD,
                    type: _.UNSUBSCRIBE
                }
            };
            let B = function(e) {
                return e.COLLECT_DIR_STATS = "zwalker-collect-dir-stats", e.UPDATE_FILE_STATS = "zwalker-update-file-stats", e.DELETE_UNMARKED_FILES = "zwalker-del-unmarked-files", e.STAT_UNMARKED_FILES = "zwalker-stat-unmarked-files", e.DELETE_EMPTY_FOLDERS = "zwalker-delete-empty-folders", e
            }({});
            const K = {
                collectDirectoryStats: {
                    apiKey: B.COLLECT_DIR_STATS,
                    type: _.REQUEST
                },
                updateFileStats: {
                    apiKey: B.UPDATE_FILE_STATS,
                    type: _.REQUEST
                },
                deleteUnmarkedFiles: {
                    apiKey: B.DELETE_UNMARKED_FILES,
                    type: _.REQUEST
                },
                statUnmarkedFiles: {
                    apiKey: B.STAT_UNMARKED_FILES,
                    type: _.REQUEST
                },
                deleteEmptyFolders: {
                    apiKey: B.DELETE_EMPTY_FOLDERS,
                    type: _.REQUEST
                }
            };
            let c = function(e) {
                return e.START = "file-walker-stream-start", e.BUILD_INDEX = "file-walker-stream-build-index", e.ACK = "file-walker-stream-ack", e.CHUNK = "file-walker-stream-chunk", e.END = "file-walker-stream-end", e.ERROR = "file-walker-stream-error", e.CANCEL = "file-walker-stream-cancel", e
            }({});
            const l = {
                startStream: {
                    apiKey: c.START,
                    type: _.REQUEST
                },
                ackStreamChunk: {
                    apiKey: c.ACK,
                    type: _.RAW_SEND
                },
                cancelStream: {
                    apiKey: c.CANCEL,
                    type: _.REQUEST
                },
                buildInodeIndex: {
                    apiKey: c.BUILD_INDEX,
                    type: _.REQUEST
                },
                onStreamChunk: {
                    apiKey: c.CHUNK,
                    type: _.SUBSCRIBE
                },
                removeStreamChunk: {
                    apiKey: c.CHUNK,
                    type: _.UNSUBSCRIBE
                },
                onStreamEnd: {
                    apiKey: c.END,
                    type: _.SUBSCRIBE
                },
                removeStreamEnd: {
                    apiKey: c.END,
                    type: _.UNSUBSCRIBE
                },
                onStreamError: {
                    apiKey: c.ERROR,
                    type: _.SUBSCRIBE
                },
                removeStreamError: {
                    apiKey: c.ERROR,
                    type: _.UNSUBSCRIBE
                }
            };
            let D = function(e) {
                return e.OPEN_OAUTH_WINDOW = "kiki-open-oauth-window", e.OAUTH_COMPLETED = "kiki-oauth-completed", e.REMOVE_LISTENER_OAUTH_COMPLETED = "kiki-remove-oauth-completed", e.OAUTH_FAILED = "kiki-oauth-failed", e.REMOVE_LISTENER_OAUTH_FAILED = "kiki-remove-oauth-failed", e.START_CSP_MONITOR = "kiki-start-csp-monitor", e.STOP_CSP_MONITOR = "kiki-stop-csp-monitor", e.CSP_BLOCKED = "kiki-csp-blocked", e.REMOVE_LISTENER_CSP_BLOCKED = "kiki-remove-csp-blocked", e
            }({});
            const P = {
                openOAuthWindow: {
                    apiKey: D.OPEN_OAUTH_WINDOW,
                    type: _.REQUEST
                },
                onOAuthCompleted: {
                    apiKey: D.OAUTH_COMPLETED,
                    type: _.SUBSCRIBE
                },
                removeListenerOAuthCompleted: {
                    apiKey: D.REMOVE_LISTENER_OAUTH_COMPLETED,
                    type: _.UNSUBSCRIBE
                },
                onOAuthFailed: {
                    apiKey: D.OAUTH_FAILED,
                    type: _.SUBSCRIBE
                },
                removeListenerOAuthFailed: {
                    apiKey: D.REMOVE_LISTENER_OAUTH_FAILED,
                    type: _.UNSUBSCRIBE
                },
                startCSPMonitor: {
                    apiKey: D.START_CSP_MONITOR,
                    type: _.REQUEST
                },
                stopCSPMonitor: {
                    apiKey: D.STOP_CSP_MONITOR,
                    type: _.REQUEST
                },
                onCSPBlocked: {
                    apiKey: D.CSP_BLOCKED,
                    type: _.SUBSCRIBE
                },
                removeListenerCSPBlocked: {
                    apiKey: D.REMOVE_LISTENER_CSP_BLOCKED,
                    type: _.UNSUBSCRIBE
                }
            };
            let u = function(e) {
                return e.SIGNAL_OS_CLOSE_MAIN_CHANNEL = "signal_OS_CLOSE_MAIN", e.CROSS_LOG_QOS_CHANNEL = "cross_OS_LOG_QOS", e.CROSS_LOG_QOS_CONFIG = "cross_OS_LOG_QOS_config", e.CROSS_LOG_QOS_READY_CHANNEL = "cross_OS_LOG_QOS_READY", e.CROSS_LOG_ACTION_CHANNEL = "cross_OS_LOG_ACTION", e.CROSS_LOG_ACTION_READY_CHANNEL = "cross_OS_LOG_ACTION_READY", e.CROSS_ACTION_LOG_999_CHANNEL = "cross_ACTION_LOG_999_CHANNEL", e.LOAD_SHELL_QOS = "load-shell-qos", e.RECENT_CRASH = "check-recently-crash", e.MAIN_UNCAUGHT_ERROR = "main-process-uncaught-error", e.LOG = "log", e.LOG_GA = "log-ga", e.SEND_VIEWKEY = "receive-viewerkey", e
            }({});
            const d = {
                crossQosLog: {
                    apiKey: u.CROSS_LOG_QOS_CHANNEL,
                    type: _.REQUEST
                },
                crossQosConfig: {
                    apiKey: u.CROSS_LOG_QOS_CONFIG,
                    type: _.NOTIFY
                },
                notifyOsCloseMain: {
                    apiKey: u.SIGNAL_OS_CLOSE_MAIN_CHANNEL,
                    type: _.NOTIFY
                },
                notifyQosReady: {
                    apiKey: u.CROSS_LOG_QOS_READY_CHANNEL,
                    type: _.NOTIFY
                },
                onQosLog: {
                    apiKey: u.CROSS_LOG_QOS_CHANNEL,
                    type: _.SUBSCRIBE
                },
                onActionLog999: {
                    apiKey: u.CROSS_ACTION_LOG_999_CHANNEL,
                    type: _.SUBSCRIBE
                },
                removeListenActionLog999: {
                    apiKey: u.CROSS_ACTION_LOG_999_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                removeListenQosLog: {
                    apiKey: u.CROSS_LOG_QOS_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                notifyActionLogReady: {
                    apiKey: u.CROSS_LOG_ACTION_READY_CHANNEL,
                    type: _.NOTIFY
                },
                onActionLog: {
                    apiKey: u.CROSS_LOG_ACTION_CHANNEL,
                    type: _.SUBSCRIBE
                },
                removeListenActionLog: {
                    apiKey: u.CROSS_LOG_ACTION_CHANNEL,
                    type: _.UNSUBSCRIBE
                },
                onMainUncaughtError: {
                    apiKey: u.MAIN_UNCAUGHT_ERROR,
                    type: _.SUBSCRIBE
                },
                removeListenMainUncaughtError: {
                    apiKey: u.MAIN_UNCAUGHT_ERROR,
                    type: _.UNSUBSCRIBE
                },
                sendLog: {
                    apiKey: u.LOG,
                    type: _.NOTIFY
                },
                sendLogGa: {
                    apiKey: u.LOG_GA,
                    type: _.NOTIFY
                },
                sendViewerkey: {
                    apiKey: u.SEND_VIEWKEY,
                    type: _.NOTIFY
                },
                onReceiveViewerkey: {
                    apiKey: u.SEND_VIEWKEY,
                    type: _.SUBSCRIBE
                },
                removeListenViewerkey: {
                    apiKey: u.SEND_VIEWKEY,
                    type: _.UNSUBSCRIBE
                },
                loadShellQos: {
                    apiKey: u.LOAD_SHELL_QOS,
                    type: _.REQUEST
                },
                checkRecentCrash: {
                    apiKey: u.RECENT_CRASH,
                    type: _.REQUEST
                }
            };
            let m = function(e) {
                return e.LOGIN = "login", e.LOGIN_STEP = "login-step", e.USER_NOT_LOGGED_IN = "signal_USER_NOT_LOGGED_IN", e.LOGIN_SUCCESS = "login-success", e.LOGIN_AFTER_INSTALL = "login-after-install", e.REQUEST_SHOW_ABOUT = "about", e
            }({});
            const H = {
                login: {
                    apiKey: m.LOGIN,
                    type: _.RAW_SEND
                },
                updateLoginStep: {
                    apiKey: m.LOGIN_STEP,
                    type: _.RAW_SEND
                },
                loginAfterInstall: {
                    apiKey: m.LOGIN_AFTER_INSTALL,
                    type: _.RAW_SEND
                },
                onUserNotLogged: {
                    apiKey: m.USER_NOT_LOGGED_IN,
                    type: _.SUBSCRIBE
                },
                removeListenUserNotLogged: {
                    apiKey: m.USER_NOT_LOGGED_IN,
                    type: _.UNSUBSCRIBE
                },
                notifyLoginSuccess: {
                    apiKey: m.LOGIN_SUCCESS,
                    type: _.REQUEST
                },
                onLoginSuccess: {
                    apiKey: m.LOGIN_SUCCESS,
                    type: _.SUBSCRIBE
                },
                removeListenLoginSuccess: {
                    apiKey: m.LOGIN_SUCCESS,
                    type: _.UNSUBSCRIBE
                },
                onRequestShowAbout: {
                    apiKey: m.REQUEST_SHOW_ABOUT,
                    type: _.SUBSCRIBE
                },
                removeListenShowAbout: {
                    apiKey: m.REQUEST_SHOW_ABOUT,
                    type: _.UNSUBSCRIBE
                }
            };
            let F = function(e) {
                return e.SEND_METRICS = "send-metrics", e.RESPONSE_METRICS = "response-metrics", e
            }({});
            const M = {
                sendMessage: {
                    apiKey: F.SEND_METRICS,
                    type: _.NOTIFY
                },
                onMessage: {
                    apiKey: F.RESPONSE_METRICS,
                    type: _.SUBSCRIBE
                }
            };
            var G = t("3xbP");
            const g = Object(S.a)(Object(S.a)({}, G.a), {}, {
                    CLOSE_ALL_CHILDS: "close-all-childs"
                }),
                v = {
                    onChildWindowClose: {
                        apiKey: g.CHILD_WINDOW_CLOSED,
                        type: _.SUBSCRIBE
                    },
                    removeListenChildWindowClose: {
                        apiKey: g.CHILD_WINDOW_CLOSED,
                        type: _.UNSUBSCRIBE
                    },
                    closeAllChilds: {
                        apiKey: g.CLOSE_ALL_CHILDS,
                        type: _.REQUEST
                    }
                };
            let h = function(e) {
                return e.START_SCREENCAP = "screen-capture", e.START_SCREEN_CAPTURE = "start-screen-capture", e.GET_CLIPBOARD = "get-clipboard", e.RESTART_SCREENCAP = "restart-cap", e.REWRITE_CLIPBOARD = "rewrite-clipboard", e.CHANGE_SCREENCAP_STATUS = "change-screencap-status", e.SCREENSHOT_SHORTCUT_RESULT = "screenshot-shortcut-result", e.SCREENSHOT_CAPTURE_SHORTCUT = "screen-capture-shortcut", e.SCREEN_CAPTURE_RESPONSE_ACCEPT = "screen-capture-response-accept", e.SCREEN_CAPTURE_RESPONSE_NO_PERMISSION = "screen-capture-response-no-permission", e.EVENT_OS_CHANGED = "event-os-changed", e.SCREEN_CAPTURE_RESPONSE_SEND2ME = "screen-capture-response-send2me", e.FORWARD_SCREENCAP = "forward_screencap", e.WARNING_INSTALL_ROSETTA = "warning_install_rosetta", e
            }({});
            const W = {
                start: {
                    apiKey: h.START_SCREENCAP,
                    type: _.REQUEST
                },
                getClipboard: {
                    apiKey: h.GET_CLIPBOARD,
                    type: _.REQUEST
                },
                restart: {
                    apiKey: h.RESTART_SCREENCAP,
                    type: _.REQUEST
                },
                rewriteClipboard: {
                    apiKey: h.REWRITE_CLIPBOARD,
                    type: _.REQUEST
                },
                onChangeStatus: {
                    apiKey: h.CHANGE_SCREENCAP_STATUS,
                    type: _.SUBSCRIBE
                },
                removeListenChangeStatus: {
                    apiKey: h.CHANGE_SCREENCAP_STATUS,
                    type: _.UNSUBSCRIBE
                },
                onScreenshotShortcut: {
                    apiKey: h.SCREENSHOT_SHORTCUT_RESULT,
                    type: _.SUBSCRIBE
                },
                removeScreenshotShortcut: {
                    apiKey: h.SCREENSHOT_SHORTCUT_RESULT,
                    type: _.UNSUBSCRIBE
                },
                onStartScreenCapture: {
                    apiKey: h.START_SCREEN_CAPTURE,
                    type: _.SUBSCRIBE
                },
                removeListenStartScreenCapture: {
                    apiKey: h.START_SCREEN_CAPTURE,
                    type: _.UNSUBSCRIBE
                },
                onScreenCapture: {
                    apiKey: h.SCREENSHOT_CAPTURE_SHORTCUT,
                    type: _.SUBSCRIBE
                },
                removeListenScreenCapture: {
                    apiKey: h.SCREENSHOT_CAPTURE_SHORTCUT,
                    type: _.UNSUBSCRIBE
                },
                onCaptureAccept: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_ACCEPT,
                    type: _.SUBSCRIBE
                },
                removeListenCaptureAccept: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_ACCEPT,
                    type: _.UNSUBSCRIBE
                },
                onCaptureNoPermission: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_NO_PERMISSION,
                    type: _.SUBSCRIBE
                },
                removeListenCaptureNoPermission: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_NO_PERMISSION,
                    type: _.UNSUBSCRIBE
                },
                onEventOs: {
                    apiKey: h.EVENT_OS_CHANGED,
                    type: _.SUBSCRIBE
                },
                removeListenEventOs: {
                    apiKey: h.EVENT_OS_CHANGED,
                    type: _.UNSUBSCRIBE
                },
                onSend2Me: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_SEND2ME,
                    type: _.SUBSCRIBE
                },
                removeListenSend2Me: {
                    apiKey: h.SCREEN_CAPTURE_RESPONSE_SEND2ME,
                    type: _.UNSUBSCRIBE
                },
                onForwardScreencap: {
                    apiKey: h.FORWARD_SCREENCAP,
                    type: _.SUBSCRIBE
                },
                removeListenForwardScreencap: {
                    apiKey: h.FORWARD_SCREENCAP,
                    type: _.UNSUBSCRIBE
                },
                onWarningInstallRosetta: {
                    apiKey: h.WARNING_INSTALL_ROSETTA,
                    type: _.SUBSCRIBE
                },
                removeListenWarningInstallRosetta: {
                    apiKey: h.WARNING_INSTALL_ROSETTA,
                    type: _.UNSUBSCRIBE
                }
            };
            let Q = function(e) {
                return e.OPEN_IN_APP_PAYMENT = "open-in-app-payment", e.CLOSE_IN_APP_PAYMENT = "close-in-app-payment", e.INAPP_WINDOW_EVENT = "event-in-app-payment", e.REMOVE_LISTENER_INAPP_WINDOW_EVENT = "remove-event-in-app-payment", e
            }({});
            const k = {
                openUrl: {
                    apiKey: Q.OPEN_IN_APP_PAYMENT,
                    type: _.REQUEST
                },
                closeInAppPayment: {
                    apiKey: Q.CLOSE_IN_APP_PAYMENT,
                    type: _.REQUEST
                },
                onInAppWindowEvent: {
                    apiKey: Q.INAPP_WINDOW_EVENT,
                    type: _.SUBSCRIBE
                },
                removeListenerInAppWindowEvent: {
                    apiKey: Q.REMOVE_LISTENER_INAPP_WINDOW_EVENT,
                    type: _.UNSUBSCRIBE
                }
            };
            const f = {
                notifyScriptConnected: {
                    apiKey: t("KoSx").a.SCRIPT_CONNECTED,
                    type: _.NOTIFY
                }
            };
            var w = t("fsQs");
            let Y = function(e) {
                return e.SHOW_SHARED_WORKER = "show-shared-worker", e.HIDE_SHARED_WORKER = "hide-shared-worker", e.SHARED_WORKER_START = "shared-worker-start", e.SHARED_WORKER_HANDLE = "shared-worker-handle", e.SHARED_WORKER_PING = "shared-worker-ping", e.SHARED_WORKER_DISPOSE = "shared-worker-dispose", e.SHARED_WORKER_PROGRESS = "shared-worker-progress", e.SHARED_WORKER_RESP = "shared-worker-resp", e.SHARED_WORKER_RUN = "shared-worker-run", e.SHARED_WORKER_ABORT = "shared-worker-abort", e.SHARED_WORKER_UPDATE_PARAMS = "shared-worker-update-params", e[e.UNLOAD_ZLOG = w.s] = "UNLOAD_ZLOG", e.REMOTE_CONFIG_CHANGE = "shared-worker-remote-config-change", e
            }({});
            const V = {
                show: {
                    apiKey: Y.SHOW_SHARED_WORKER,
                    type: _.NOTIFY
                },
                hide: {
                    apiKey: Y.HIDE_SHARED_WORKER,
                    type: _.NOTIFY
                },
                start: {
                    apiKey: Y.SHARED_WORKER_START,
                    type: _.NOTIFY
                },
                register: {
                    apiKey: Y.SHARED_WORKER_HANDLE,
                    type: _.NOTIFY
                },
                ping: {
                    apiKey: Y.SHARED_WORKER_PING,
                    type: _.NOTIFY
                },
                dispose: {
                    apiKey: Y.SHARED_WORKER_DISPOSE,
                    type: _.NOTIFY
                },
                updateProgress: {
                    apiKey: Y.SHARED_WORKER_PROGRESS,
                    type: _.NOTIFY
                },
                onReceiveUpdateProgress: {
                    apiKey: Y.SHARED_WORKER_PROGRESS,
                    type: _.SUBSCRIBE
                },
                removeListenUpdateProgress: {
                    apiKey: Y.SHARED_WORKER_PROGRESS,
                    type: _.UNSUBSCRIBE
                },
                responseResult: {
                    apiKey: Y.SHARED_WORKER_RESP,
                    type: _.NOTIFY
                },
                onReceiveResult: {
                    apiKey: Y.SHARED_WORKER_RESP,
                    type: _.SUBSCRIBE
                },
                removeListenResult: {
                    apiKey: Y.SHARED_WORKER_RESP,
                    type: _.UNSUBSCRIBE
                },
                runTask: {
                    apiKey: Y.SHARED_WORKER_RUN,
                    type: _.NOTIFY
                },
                onRequestRunTask: {
                    apiKey: Y.SHARED_WORKER_RUN,
                    type: _.SUBSCRIBE
                },
                removeListenRunTask: {
                    apiKey: Y.SHARED_WORKER_RUN,
                    type: _.UNSUBSCRIBE
                },
                abortTask: {
                    apiKey: Y.SHARED_WORKER_ABORT,
                    type: _.NOTIFY
                },
                onRequestAbortTask: {
                    apiKey: Y.SHARED_WORKER_ABORT,
                    type: _.SUBSCRIBE
                },
                removeListenAbortTask: {
                    apiKey: Y.SHARED_WORKER_ABORT,
                    type: _.UNSUBSCRIBE
                },
                updateTaskParams: {
                    apiKey: Y.SHARED_WORKER_UPDATE_PARAMS,
                    type: _.NOTIFY
                },
                onRequestUpdateTaskParams: {
                    apiKey: Y.SHARED_WORKER_UPDATE_PARAMS,
                    type: _.SUBSCRIBE
                },
                removeListenUpdateTaskParams: {
                    apiKey: Y.SHARED_WORKER_UPDATE_PARAMS,
                    type: _.UNSUBSCRIBE
                },
                onUnloadZLog: {
                    apiKey: Y.UNLOAD_ZLOG,
                    type: _.SUBSCRIBE
                },
                removeListenUnloadZLog: {
                    apiKey: Y.UNLOAD_ZLOG,
                    type: _.UNSUBSCRIBE
                },
                updateRemoteConfig: {
                    apiKey: Y.REMOTE_CONFIG_CHANGE,
                    type: _.NOTIFY
                },
                onRemoteConfigChange: {
                    apiKey: Y.REMOTE_CONFIG_CHANGE,
                    type: _.SUBSCRIBE
                },
                removeListenRemoteConfigChange: {
                    apiKey: Y.REMOTE_CONFIG_CHANGE,
                    type: _.UNSUBSCRIBE
                }
            };
            let b = function(e) {
                return e.REQUEST_UPDATE = "update-is-avail", e.BINARY_UPDATED = "binary-updated", e.REQUEST_CHECK_UPDATE = "z-check-for-update", e.MANUAL_BINARY_UPDATED = "z-manual-binary-updated", e.FALLBACK_UPDATE = "fallback-update", e.RESOURCE_UPDATE = "resources-updated", e.RESOURCE_RELOAD_SAFE = "resources-reload-safe", e.BINARY_RELOAD_SAFE = "binary-reload-safe", e.MANUAL_BINARY_RELOAD_SAFE = "manual-binary-reload-safe", e.RECEIVE_UPDATE_INFO = "receive-update-info", e.MANUAL_UPDATE_INSTALLING = "z-manual-update-installing", e.MANUAL_UPDATE_DOWNLOADING = "z-manual-update-downloading", e.MANUAL_UPDATE_CHECKED = "z-manual-update-checked", e.MANUAL_UPDATE_CHECKED_ONLY = "z-manual-update-checked-only", e.MANUAL_UPDATE_CHECKED_ONLY_ERR = "z-manual-update-checked-only-err", e.MANUAL_UPDATE_ERR = "z-manual-update-err", e.MANUAL_UPDATE_DOWNLOAD_CHECK = "z-manual-check-download-update", e.MANUAL_UPDATE_DOWNLOAD_CHECK_ONLY = "z-manual-check-download-update-only", e.OPEN_UPDATE_PAGE = "OPEN_UPDATE_PAGE", e.UNCAUGHT_ERR = "updater-uncaught-error", e
            }({});
            const z = {
                requestUpdate: {
                    apiKey: b.REQUEST_UPDATE,
                    type: _.REQUEST
                },
                requestCheckUpdate: {
                    apiKey: b.REQUEST_CHECK_UPDATE,
                    type: _.NOTIFY
                },
                onNewUpdate: {
                    apiKey: b.BINARY_UPDATED,
                    type: _.SUBSCRIBE
                },
                onNewManualUpdate: {
                    apiKey: b.MANUAL_BINARY_UPDATED,
                    type: _.SUBSCRIBE
                },
                onFallbackUpdate: {
                    apiKey: b.FALLBACK_UPDATE,
                    type: _.SUBSCRIBE
                },
                removeListenNewUpdate: {
                    apiKey: b.BINARY_UPDATED,
                    type: _.UNSUBSCRIBE
                },
                removeListenNewManualUpdate: {
                    apiKey: b.MANUAL_BINARY_UPDATED,
                    type: _.UNSUBSCRIBE
                },
                removeListenFallbackUpdate: {
                    apiKey: b.FALLBACK_UPDATE,
                    type: _.UNSUBSCRIBE
                },
                onResourceUpdate: {
                    apiKey: b.RESOURCE_UPDATE,
                    type: _.SUBSCRIBE
                },
                removeResourceUpdate: {
                    apiKey: b.REQUEST_UPDATE,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateInstalling: {
                    apiKey: b.MANUAL_UPDATE_INSTALLING,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateInstalling: {
                    apiKey: b.MANUAL_UPDATE_INSTALLING,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateDownloading: {
                    apiKey: b.MANUAL_UPDATE_DOWNLOADING,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateDownloading: {
                    apiKey: b.MANUAL_UPDATE_DOWNLOADING,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateChecked: {
                    apiKey: b.MANUAL_UPDATE_CHECKED,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateChecked: {
                    apiKey: b.MANUAL_UPDATE_CHECKED,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateCheckedOnly: {
                    apiKey: b.MANUAL_UPDATE_CHECKED_ONLY,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateCheckedOnly: {
                    apiKey: b.MANUAL_UPDATE_CHECKED_ONLY,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateCheckOnlyErr: {
                    apiKey: b.MANUAL_UPDATE_CHECKED_ONLY_ERR,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateCheckOnlyErr: {
                    apiKey: b.MANUAL_UPDATE_CHECKED_ONLY_ERR,
                    type: _.UNSUBSCRIBE
                },
                onManualUpdateErr: {
                    apiKey: b.MANUAL_UPDATE_ERR,
                    type: _.SUBSCRIBE
                },
                removeListenManualUpdateErr: {
                    apiKey: b.MANUAL_UPDATE_ERR,
                    type: _.UNSUBSCRIBE
                },
                requestCheckDownloadUpdate: {
                    apiKey: b.MANUAL_UPDATE_DOWNLOAD_CHECK,
                    type: _.RAW_SEND
                },
                requestCheckDownloadUpdateOnly: {
                    apiKey: b.MANUAL_UPDATE_DOWNLOAD_CHECK_ONLY,
                    type: _.NOTIFY
                },
                requestResourceReload: {
                    apiKey: b.RESOURCE_RELOAD_SAFE,
                    type: _.NOTIFY
                },
                requestBinaryReload: {
                    apiKey: b.BINARY_RELOAD_SAFE,
                    type: _.NOTIFY
                },
                requestManualBinaryReload: {
                    apiKey: b.MANUAL_BINARY_RELOAD_SAFE,
                    type: _.NOTIFY
                },
                openUpdatePage: {
                    apiKey: b.OPEN_UPDATE_PAGE,
                    type: _.NOTIFY
                },
                onReceiveUpdateInfo: {
                    apiKey: b.RECEIVE_UPDATE_INFO,
                    type: _.ONCE
                },
                onUncaughtError: {
                    apiKey: b.UNCAUGHT_ERR,
                    type: _.UNSUBSCRIBE
                },
                removeListenUncaughtError: {
                    apiKey: b.UNCAUGHT_ERR,
                    type: _.UNSUBSCRIBE
                }
            };
            let $ = function(e) {
                return e.MINIMIZE = "minimize", e.MAXIMIZE_TOGGLER = "toggle-maximize", e.SET_LOGIN_SIZE = "set-login-size", e.EXPAND_MAIN_WINDOW = "main-window-expand", e.IS_MAXIMIZED = "check-maximize", e.IS_FULLSCREEN = "check-fullscreen", e.FULLSCREEN_TOGGLER = "toggle-fullscreen", e.FLASH_FRAME = "flash-frame", e.FOCUS = "focus-window", e.CLOSE_WINDOW = "close-window", e.HIDE = "hide-window", e.SHOW_INACTIVE = "show-inactive", e.SHOW = "show", e.QUIT = "quit", e.SHOW_OPEN_DIALOG = "show-open-dialog", e.SHOW_SAVE_DIALOG = "show-save-dialog", e.SHOW_OPEN_DIALOG_SYNC = "show-open-dialog-sync", e.SHOW_SAVE_DIALOG_SYNC = "show-save-dialog-sync", e.VISIBILITY_CHANGE = "visibility-change", e.HIDE_WINDOW_COMPLETE = "hide-window-complete", e.OPEN_PHOTO_VIEWER_DEVTOOL = "open-photo-viewer-devtool", e[e.UNLOAD_ZLOG = w.s] = "UNLOAD_ZLOG", e.CLOSE_MEDIA_VIEWER = "close-media-viewer", e
            }({});
            const q = {
                minimize: {
                    apiKey: $.MINIMIZE,
                    type: _.REQUEST
                },
                maximizeToggler: {
                    apiKey: $.MAXIMIZE_TOGGLER,
                    type: _.REQUEST
                },
                setLoginSize: {
                    apiKey: $.SET_LOGIN_SIZE,
                    type: _.REQUEST
                },
                expandMainWindow: {
                    apiKey: $.EXPAND_MAIN_WINDOW,
                    type: _.REQUEST
                },
                isMaximized: {
                    apiKey: $.IS_MAXIMIZED,
                    type: _.REQUEST
                },
                isFullScreen: {
                    apiKey: $.IS_FULLSCREEN,
                    type: _.REQUEST
                },
                fullscreenToggler: {
                    apiKey: $.FULLSCREEN_TOGGLER,
                    type: _.REQUEST
                },
                flashFrame: {
                    apiKey: $.FLASH_FRAME,
                    type: _.REQUEST
                },
                focus: {
                    apiKey: $.FOCUS,
                    type: _.REQUEST
                },
                closeWindow: {
                    apiKey: $.CLOSE_WINDOW,
                    type: _.REQUEST
                },
                hide: {
                    apiKey: $.HIDE,
                    type: _.REQUEST
                },
                showInactive: {
                    apiKey: $.SHOW_INACTIVE,
                    type: _.REQUEST
                },
                show: {
                    apiKey: $.SHOW,
                    type: _.REQUEST
                },
                quit: {
                    apiKey: $.QUIT,
                    type: _.REQUEST
                },
                showOpenDialog: {
                    apiKey: $.SHOW_OPEN_DIALOG,
                    type: _.REQUEST
                },
                showSaveDialog: {
                    apiKey: $.SHOW_SAVE_DIALOG,
                    type: _.REQUEST
                },
                showOpenDialogSync: {
                    apiKey: $.SHOW_OPEN_DIALOG_SYNC,
                    type: _.REQUEST
                },
                showSaveDialogSync: {
                    apiKey: $.SHOW_SAVE_DIALOG_SYNC,
                    type: _.REQUEST
                },
                onVisibilityChange: {
                    apiKey: $.VISIBILITY_CHANGE,
                    type: _.SUBSCRIBE
                },
                removeListenVisibilityChange: {
                    apiKey: $.VISIBILITY_CHANGE,
                    type: _.UNSUBSCRIBE
                },
                onHideWindowComplete: {
                    apiKey: $.HIDE_WINDOW_COMPLETE,
                    type: _.SUBSCRIBE
                },
                removeListenHideWindowComplete: {
                    apiKey: $.HIDE_WINDOW_COMPLETE,
                    type: _.UNSUBSCRIBE
                },
                openPhotoViewerDevtool: {
                    apiKey: $.OPEN_PHOTO_VIEWER_DEVTOOL,
                    type: _.REQUEST
                },
                onUnloadZLog: {
                    apiKey: $.UNLOAD_ZLOG,
                    type: _.SUBSCRIBE
                },
                removeListenUnloadZLog: {
                    apiKey: $.UNLOAD_ZLOG,
                    type: _.UNSUBSCRIBE
                },
                onCloseMediaViewer: {
                    apiKey: $.CLOSE_MEDIA_VIEWER,
                    type: _.SUBSCRIBE
                },
                removeListenCloseMediaViewer: {
                    apiKey: $.CLOSE_MEDIA_VIEWER,
                    type: _.UNSUBSCRIBE
                }
            };
            let Z = function(e) {
                return e.Z_URI_REQUEST = "z-uri-request", e.Z_URI_OPEN_CONV = "z-uri-open-conv", e.CHECK_ON_START_UP = "check-startup-open-conv-request", e.CHECK_ARG_LINK = "check-arg-link", e
            }({});
            const x = {
                onNewRequest: {
                    apiKey: Z.Z_URI_REQUEST,
                    type: _.SUBSCRIBE
                },
                removeListenNewRequest: {
                    apiKey: Z.Z_URI_REQUEST,
                    type: _.UNSUBSCRIBE
                },
                onRequestOpenConv: {
                    apiKey: Z.Z_URI_OPEN_CONV,
                    type: _.SUBSCRIBE
                },
                removeListenRequestOpenConv: {
                    apiKey: Z.Z_URI_OPEN_CONV,
                    type: _.UNSUBSCRIBE
                },
                checkOpenConvReq: {
                    apiKey: Z.CHECK_ON_START_UP,
                    type: _.REQUEST
                },
                checkArgvLink: {
                    apiKey: Z.CHECK_ARG_LINK,
                    type: _.RAW_SEND
                }
            };
            let X = function(e) {
                return e.CALL_REQUEST = "call-request", e.CALL_SEND_SIGNAL = "call-send-signal", e.CALL_SERVER_REQUEST = "call-server-request", e.CALL_LOCAL_REQUEST = "call-local-request", e.CALL_UPDATE = "call-update", e.CALL_ACTIVE_NATIVE_APP = "call_active_native_app", e.PC_SHUTTING_DOWN = "pc-shutting-down", e.STOP_SHARING = "stop-sharing", e.SEND_TO_NATIVE = "call-send-to-native", e.CALL_INIT = "call-init", e.CALL_RESPONSE_LIST_DEVICE = "call-response-listDevice", e
            }({});
            const j = {
                onRequestCallFromServer: {
                    apiKey: X.CALL_SERVER_REQUEST,
                    type: _.SUBSCRIBE
                },
                removeListenRequestCallFromServer: {
                    apiKey: X.CALL_SERVER_REQUEST,
                    type: _.UNSUBSCRIBE
                },
                onRequestCallFromLocal: {
                    apiKey: X.CALL_LOCAL_REQUEST,
                    type: _.SUBSCRIBE
                },
                removeListenRequestCallFromLocal: {
                    apiKey: X.CALL_LOCAL_REQUEST,
                    type: _.UNSUBSCRIBE
                },
                onCallUpdate: {
                    apiKey: X.CALL_UPDATE,
                    type: _.SUBSCRIBE
                },
                removeListenCallUpdate: {
                    apiKey: X.CALL_UPDATE,
                    type: _.UNSUBSCRIBE
                },
                onCallActiveNative: {
                    apiKey: X.CALL_ACTIVE_NATIVE_APP,
                    type: _.SUBSCRIBE
                },
                removeListenCallActiveNative: {
                    apiKey: X.CALL_ACTIVE_NATIVE_APP,
                    type: _.UNSUBSCRIBE
                },
                onPcShuttingDown: {
                    apiKey: X.PC_SHUTTING_DOWN,
                    type: _.SUBSCRIBE
                },
                removeListenPcShuttingDown: {
                    apiKey: X.PC_SHUTTING_DOWN,
                    type: _.UNSUBSCRIBE
                },
                onStopSharing: {
                    apiKey: X.STOP_SHARING,
                    type: _.SUBSCRIBE
                },
                removeListenStopSharing: {
                    apiKey: X.STOP_SHARING,
                    type: _.UNSUBSCRIBE
                },
                onCallSignal: {
                    apiKey: X.CALL_SEND_SIGNAL,
                    type: _.SUBSCRIBE
                },
                removeListenCallSignal: {
                    apiKey: X.CALL_SEND_SIGNAL,
                    type: _.UNSUBSCRIBE
                },
                onCallRequest: {
                    apiKey: X.CALL_REQUEST,
                    type: _.SUBSCRIBE
                },
                removeListenCallRequest: {
                    apiKey: X.CALL_REQUEST,
                    type: _.UNSUBSCRIBE
                },
                initCall: {
                    apiKey: X.CALL_INIT,
                    type: _.RAW_SEND
                },
                sendDataToNative: {
                    apiKey: X.SEND_TO_NATIVE,
                    type: _.RAW_SEND
                },
                onCallResponseDevices: {
                    apiKey: X.CALL_RESPONSE_LIST_DEVICE,
                    type: _.ONCE
                },
                removeListenCallDevices: {
                    apiKey: X.CALL_RESPONSE_LIST_DEVICE,
                    type: _.UNSUBSCRIBE
                }
            };
            var J = t("MPV0");
            const ee = {
                onChannelEstablished: {
                    apiKey: J.a.CHANNEL_ESTATBLISHED,
                    type: _.SUBSCRIBE
                },
                removeListenChannelEstablished: {
                    apiKey: J.a.CHANNEL_ESTATBLISHED,
                    type: _.UNSUBSCRIBE
                },
                onChannelDisconnected: {
                    apiKey: J.a.CHANNEL_DISCONNECTED,
                    type: _.SUBSCRIBE
                },
                removeListenChannelDisconnected: {
                    apiKey: J.a.CHANNEL_DISCONNECTED,
                    type: _.UNSUBSCRIBE
                },
                onChannelTerminated: {
                    apiKey: J.a.CHANNEL_TERMINATED,
                    type: _.SUBSCRIBE
                },
                removeListenChannelTerminated: {
                    apiKey: J.a.CHANNEL_TERMINATED,
                    type: _.UNSUBSCRIBE
                },
                onReceiveTransferredPort: {
                    apiKey: J.a.PORT_TRANSFERRED,
                    type: _.SUBSCRIBE
                },
                removeListenReceiveTransferredPort: {
                    apiKey: J.a.PORT_TRANSFERRED,
                    type: _.UNSUBSCRIBE
                },
                onReceiveTransferredPortV2: {
                    apiKey: J.a.PORT_TRANSFERRED_V2,
                    type: _.SUBSCRIBE_V2
                },
                removeListenReceiveTransferredPortV2: {
                    apiKey: J.a.PORT_TRANSFERRED_V2,
                    type: _.UNSUBSCRIBE
                },
                notifyPortDelivered: {
                    apiKey: J.a.PORT_DELIVERED,
                    type: _.NOTIFY
                },
                requestOpenChannelTo: {
                    apiKey: J.a.OPEN_CHANNEL_TO,
                    type: _.NOTIFY
                }
            };
            let Ee = function(e) {
                return e.INIT_MODEL_RESOURCE = "tf-models:ss:resource:init", e.GET_STICKER_2_SCORE = "tf-models:ss:sticker-2-score:get", e.SET_STICKER_2_SCORE = "tf-models:ss:sticker-2-score:set", e.GET_KWD_2_STICKERS = "tf-models:ss:kwd-2-stickers:get", e.SET_KWD_2_STICKERS = "tf-models:ss:kwd-2-stickers:set", e.GET_SS_CONFIG = "tf-models:ss:config:get", e.SET_SS_CONFIG = "tf-models:ss:config:set", e.GET_ITEM_2_STICKER = "tf-models:ss:item-2-sticker:get", e.SET_ITEM_2_STICKER = "tf-models:ss:item-2-sticker:set", e
            }({});
            const te = {
                initSSResource: {
                    apiKey: Ee.INIT_MODEL_RESOURCE,
                    type: _.NOTIFY
                },
                getSticker2Score: {
                    apiKey: Ee.GET_STICKER_2_SCORE,
                    type: _.REQUEST
                },
                setSticker2Score: {
                    apiKey: Ee.SET_STICKER_2_SCORE,
                    type: _.REQUEST
                },
                getKwd2Sticker: {
                    apiKey: Ee.GET_KWD_2_STICKERS,
                    type: _.REQUEST
                },
                setKwd2Sticker: {
                    apiKey: Ee.SET_KWD_2_STICKERS,
                    type: _.REQUEST
                },
                getSSConfig: {
                    apiKey: Ee.GET_SS_CONFIG,
                    type: _.REQUEST
                },
                setSSConfig: {
                    apiKey: Ee.SET_SS_CONFIG,
                    type: _.REQUEST
                },
                getItem2Sticker: {
                    apiKey: Ee.GET_ITEM_2_STICKER,
                    type: _.REQUEST
                },
                setItem2Sticker: {
                    apiKey: Ee.SET_ITEM_2_STICKER,
                    type: _.REQUEST
                }
            };
            let Se = function(e) {
                return e.GET_HEAP = "gett-heap", e.WRITE_HEAP = "write-heap", e.DENOISE_FILE = "denoise-file", e.NOISE_FILE = "noise-file", e.REMOVE_FILE = "remove-file", e.WRITE_BLOB_TO_FILE = "write-blob-to-file", e.VIDEO_THUMB_GENERATE = "video-thumb-generate", e.MATCH_CHECKSUM = "match-checksum", e.CLONE_AND_MATCH_CHECKSUM = "clone-and-match-checksum", e.CLEAN_UP_LOG = "clean-up-log", e.APPEND_FILE = "append-file", e.CAN_STORE_BIG_FILE = "can-store-big-file", e
            }({});
            const _e = {
                getHeap: {
                    apiKey: Se.GET_HEAP,
                    type: _.REQUEST
                },
                writeHeap: {
                    apiKey: Se.WRITE_HEAP,
                    type: _.NOTIFY
                },
                denoiseFile: {
                    apiKey: Se.DENOISE_FILE,
                    type: _.REQUEST
                },
                noiseFile: {
                    apiKey: Se.NOISE_FILE,
                    type: _.REQUEST
                },
                removeFile: {
                    apiKey: Se.REMOVE_FILE,
                    type: _.REQUEST
                },
                writeBufferToFile: {
                    apiKey: Se.WRITE_BLOB_TO_FILE,
                    type: _.REQUEST
                },
                matchChecksum: {
                    apiKey: Se.MATCH_CHECKSUM,
                    type: _.REQUEST
                },
                cloneAndMatchChecksum: {
                    apiKey: Se.CLONE_AND_MATCH_CHECKSUM,
                    type: _.REQUEST
                },
                AppendLog: {
                    apiKey: Se.APPEND_FILE,
                    type: _.REQUEST
                }
            };
            let ae = function(e) {
                return e.LAUNCH_COMPACT_APP = "_electron_launch-compact-app", e.GET_RELAUNCH_STATE = "_electron_get-relaunch-state", e
            }({});
            const Re = {
                launchCompactApp: {
                    apiKey: ae.LAUNCH_COMPACT_APP,
                    type: _.REQUEST
                },
                getRelaunchState: {
                    apiKey: ae.GET_RELAUNCH_STATE,
                    type: _.REQUEST
                }
            };
            var pe = t("W+DE");
            const ie = {
                authenticate: {
                    apiKey: pe.a.NEW_SESSION,
                    type: _.NOTIFY
                },
                onReceiveSession: {
                    apiKey: pe.a.NEW_SESSION,
                    type: _.SUBSCRIBE
                },
                removeListenReceiveSession: {
                    apiKey: pe.a.NEW_SESSION,
                    type: _.UNSUBSCRIBE
                }
            };
            let Te = function(e) {
                return e.GET_ESTIMATED_COPY_TIME = "GET_ESTIMATED_COPY_TIME", e.WRITE_CURRENT_DRIVE_PATH_TO_FILE = "WRITE_CURRENT_DRIVE_PATH_TO_FILE", e.GET_CURRENT_DRIVE_PATH_FROM_FILE = "GET_CURRENT_DRIVE_PATH_FROM_FILE", e
            }({});
            const ne = {
                getEstimatedCopyTime: {
                    apiKey: Te.GET_ESTIMATED_COPY_TIME,
                    type: _.REQUEST
                },
                writePathToRegistry: {
                    apiKey: Te.WRITE_PATH_TO_REGISTRY,
                    type: _.REQUEST
                },
                getPathFromRegistry: {
                    apiKey: Te.GET_PATH_FROM_REGISTRY,
                    type: _.REQUEST
                },
                writeCurrentDrivePathToFile: {
                    apiKey: Te.WRITE_CURRENT_DRIVE_PATH_TO_FILE,
                    type: _.REQUEST
                },
                getCurrentDrivePathFromFile: {
                    apiKey: Te.GET_CURRENT_DRIVE_PATH_FROM_FILE,
                    type: _.REQUEST
                }
            };
            let oe = function(e) {
                return e.NET_START_MONITOR = "net-start-monitor", e.NET_STOP_MONITOR = "net-stop-monitor", e.NET_ON_MONITOR_DATA = "net-on-monitor-data", e
            }({});
            const Ce = {
                    startMonitor: {
                        apiKey: oe.NET_START_MONITOR,
                        type: _.NOTIFY
                    },
                    stopMonitor: {
                        apiKey: oe.NET_STOP_MONITOR,
                        type: _.NOTIFY
                    },
                    onMonitorData: {
                        apiKey: oe.NET_ON_MONITOR_DATA,
                        type: _.SUBSCRIBE
                    },
                    removeListenOnMonitorData: {
                        apiKey: oe.NET_ON_MONITOR_DATA,
                        type: _.UNSUBSCRIBE
                    }
                },
                ye = {
                    listeners: {},
                    provider: {}
                };

            function Ae(e, E) {
                let t = e.split("."),
                    S = E;
                for (let _ of t) S[_] = S[_] || {}, S = S[_];
                return S
            }

            function Ie(e, E, t) {
                const {
                    apiKey: S
                } = t, _ = ye.listeners[S];
                Ae(e, $zsub)[t.name] = e => {
                    -1 == _.indexOf(e) && _.push(e), ye.provider[S] || (ye.provider[S] = E[t.name](((...e) => {
                        for (let E of _) E(...e)
                    })))
                }
            }

            function re(e, E, t) {
                const {
                    apiKey: S
                } = t, _ = ye.listeners[S];
                Ae(e, $zsub)[t.name] = e => {
                    const S = _.indexOf(e); - 1 != S && _.splice(S, 1), _.length <= 0 && (E[t.name](), delete ye.provider[t.apiKey])
                }
            }
            globalThis.$zsub = {};
            const Ne = {};

            function Ue(e, E, t) {
                let _ = Ne[E];
                void 0 === _ && (_ = {}), _ = Object(S.a)(Object(S.a)({}, _), t), Ne[E] = _;
                const {
                    args: a,
                    ports: R
                } = _;
                if (void 0 !== a && void 0 !== R) {
                    const t = ye.listeners[e];
                    for (const e of t) {
                        const [E, ...t] = a;
                        E.ports = R, e(E, ...t)
                    }
                    delete Ne[E]
                }
            }

            function Oe(e, E, t) {
                const {
                    apiKey: S
                } = t, _ = ye.listeners[S];
                Ae(e, $zsub)[t.name] = e => {
                    if (-1 == _.indexOf(e) && _.push(e), !ye.provider[S]) {
                        const e = (e, ...E) => {
                            Ue(S, e, {
                                args: E
                            })
                        };
                        ye.provider[S] = E[t.name](e)
                    }
                }
            }
            let se = !1;

            function Le() {
                if (se) return;
                se = !0;
                const e = e => {
                    if (e.source === window && function(e) {
                            // Chromium gives file:// documents an opaque origin, so a same-window
                            // postMessage arrives as origin "null" rather than "file://". This check
                            // used to drop the transferred MessagePort, so the DAL channel never
                            // opened and every SQLite-backed read hung forever. e.source === window
                            // (checked above) is the real guard; only relax it for a file: document.
                            const E = "file://";
                            return e === E || (e === "null" && location.protocol === "file:")
                        }(e.origin) && e.data) {
                        const {
                            zChannelId: E,
                            apiKey: t,
                            key: S
                        } = e.data;
                        if (E === T) {
                            const {
                                ports: E
                            } = e;
                            Ue(t, S, {
                                ports: [...E]
                            })
                        }
                    }
                };
                window.addEventListener("message", e), window.addEventListener("beforeunload", (() => {
                    window.removeEventListener("message", e)
                }))
            }

            function Be(e, E, t) {
                for (let R in t) {
                    var a;
                    const p = t[R];
                    switch (ye.listeners[p.apiKey] = null !== (a = ye.listeners[p.apiKey]) && void 0 !== a ? a : [], p.type) {
                        case _.SUBSCRIBE:
                            Ie(e, E, Object(S.a)({
                                name: R
                            }, p));
                            break;
                        case _.UNSUBSCRIBE:
                            re(e, E, Object(S.a)({
                                name: R
                            }, p));
                            break;
                        case _.SUBSCRIBE_V2:
                            Le(), Oe(e, E, Object(S.a)({
                                name: R
                            }, p))
                    }
                }
            }
            Be("$zwindow", $zwindow, q), Be("$zuri", $zuri, x), Be("$zapp", $zapp, R), Be("$zresource", $zresource, o), Be("$zdownload", $zdownload, I), Be("$zdb", $zdb, y), Be("$zsessionManager", $zsessionManager, ie), Be("$zupdater", $zupdater, z), Be("$zsharedWorker", $zsharedWorker, V), Be("$zlogger", $zlogger, d), Be("$zlogin", $zlogin, H), Be("$zMetric", $zMetric, M), Be("$zmulti", $zmulti, v), Be("$zscreencap", $zscreencap, W), Be("$zcall", $zcall, j), Be("$zFeatures.activeDeactive", $zFeatures.activeDeactive, N), Be("$zFeatures.mainless", $zFeatures.mainless, O), Be("$zFeatures.syncDownload", $zFeatures.syncDownload, L), Be("$zFeatures.zwalker", $zFeatures.zwalker, K), Be("$zFeatures.fileWalkerStream", $zFeatures.fileWalkerStream, l), Be("$zFeatures.kikiAssistant", $zFeatures.kikiAssistant, P), Be("$zcloud", $zcloud, _e), Be("$zInAppPayment", $zInAppPayment, k), Be("$capp", $capp, Re), Be("$zMigrateDrive", $zMigrateDrive, ne), Be("$zMsgChannel", $zMsgChannel, ee), Be("$zscript", $zscript, f), Be("$zbackup", $zbackup, i), Be("$zTFModels.ss", $zTFModels.ss, te), Be("$znetwork", $znetwork, Ce)
        }
    }
]);
//# sourceMappingURL=../sourcemaps/lazy/default-login-startup-main-startup-shared-worker-znotification.7d0e4151ce7f27c337b2.js.map