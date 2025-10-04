import { contextBridge, ipcRenderer } from 'electron';
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
    // AI Service methods
    aiChat: (messages, config) => ipcRenderer.invoke('ai-chat', messages, config),
    aiAnalyzeThreat: (threatData, config) => ipcRenderer.invoke('ai-analyze-threat', threatData, config),
    aiAnalyzeScan: (scanResults, config) => ipcRenderer.invoke('ai-analyze-scan', scanResults, config),
    aiGetRecommendations: (systemData, config) => ipcRenderer.invoke('ai-get-recommendations', systemData, config),
    aiCheckOllama: (config) => ipcRenderer.invoke('ai-check-ollama', config),
    aiGetOllamaModels: (config) => ipcRenderer.invoke('ai-get-ollama-models', config),
    // Clipboard API
    readClipboard: () => ipcRenderer.invoke('read-clipboard'),
});
//# sourceMappingURL=preload.js.map