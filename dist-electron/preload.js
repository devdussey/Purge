import electron from 'electron';
const { contextBridge, ipcRenderer } = electron;
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    executeScript: (scriptPath, parameters, requiresElevation) => ipcRenderer.invoke('execute-script', scriptPath, parameters, requiresElevation),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    computeHash: (data) => ipcRenderer.invoke('compute-hash', data),
    verifySignature: (data, signature, publicKey) => ipcRenderer.invoke('verify-signature', data, signature, publicKey),
});
//# sourceMappingURL=preload.js.map