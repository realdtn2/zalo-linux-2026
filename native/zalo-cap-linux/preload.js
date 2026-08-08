'use strict';
// Minimal bridge so the overlay can run with contextIsolation on and nodeIntegration off,
// matching how the rest of the app configures its renderers. The overlay only ever needs
// to receive one payload and report one result.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('capAPI', {
    onInit: (cb) => ipcRenderer.on('capture-init', (_e, data) => cb(data)),
    result: (payload) => ipcRenderer.send('cap-result', payload),
    cancel: () => ipcRenderer.send('cap-cancel'),
});
