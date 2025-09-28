"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    executeScript: (scriptPath, parameters, requiresElevation) => electron_1.ipcRenderer.invoke('execute-script', scriptPath, parameters, requiresElevation),
    openExternal: (url) => electron_1.ipcRenderer.invoke('open-external', url),
    showMessageBox: (options) => electron_1.ipcRenderer.invoke('show-message-box', options),
    showOpenDialog: (options) => electron_1.ipcRenderer.invoke('show-open-dialog', options),
    getAppVersion: () => electron_1.ipcRenderer.invoke('get-app-version'),
    getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    computeHash: (data) => electron_1.ipcRenderer.invoke('compute-hash', data),
    verifySignature: (data, signature, publicKey) => electron_1.ipcRenderer.invoke('verify-signature', data, signature, publicKey),
});
//# sourceMappingURL=preload.js.map