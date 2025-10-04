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
    // AI Service methods
    aiChat: (messages, config) => electron_1.ipcRenderer.invoke('ai-chat', messages, config),
    aiAnalyzeThreat: (threatData, config) => electron_1.ipcRenderer.invoke('ai-analyze-threat', threatData, config),
    aiAnalyzeScan: (scanResults, config) => electron_1.ipcRenderer.invoke('ai-analyze-scan', scanResults, config),
    aiGetRecommendations: (systemData, config) => electron_1.ipcRenderer.invoke('ai-get-recommendations', systemData, config),
    aiCheckOllama: (config) => electron_1.ipcRenderer.invoke('ai-check-ollama', config),
    aiGetOllamaModels: (config) => electron_1.ipcRenderer.invoke('ai-get-ollama-models', config),
    // Clipboard API
    readClipboard: () => electron_1.ipcRenderer.invoke('read-clipboard'),
    // Settings API
    getSettings: () => electron_1.ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => electron_1.ipcRenderer.invoke('save-settings', settings),
});
//# sourceMappingURL=preload.js.map