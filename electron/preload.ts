import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  executeScript: (scriptPath: string, parameters?: string[], requiresElevation?: boolean) =>
    ipcRenderer.invoke('execute-script', scriptPath, parameters, requiresElevation),
  
  openExternal: (url: string) =>
    ipcRenderer.invoke('open-external', url),
  
  showMessageBox: (options: any) =>
    ipcRenderer.invoke('show-message-box', options),
  
  showOpenDialog: (options: any) =>
    ipcRenderer.invoke('show-open-dialog', options),
  
  getAppVersion: () =>
    ipcRenderer.invoke('get-app-version'),
  
  getAppPath: () =>
    ipcRenderer.invoke('get-app-path'),
  
  computeHash: (data: ArrayBuffer) =>
    ipcRenderer.invoke('compute-hash', data),
  
  verifySignature: (data: string, signature: string, publicKey: string) =>
    ipcRenderer.invoke('verify-signature', data, signature, publicKey),

  // AI Service methods
  aiChat: (messages: Array<{role: string; content: string}>, config: any) =>
    ipcRenderer.invoke('ai-chat', messages, config),

  aiAnalyzeThreat: (threatData: any, config: any) =>
    ipcRenderer.invoke('ai-analyze-threat', threatData, config),

  aiAnalyzeScan: (scanResults: any, config: any) =>
    ipcRenderer.invoke('ai-analyze-scan', scanResults, config),

  aiGetRecommendations: (systemData: any, config: any) =>
    ipcRenderer.invoke('ai-get-recommendations', systemData, config),

  aiCheckOllama: (config: any) =>
    ipcRenderer.invoke('ai-check-ollama', config),

  aiGetOllamaModels: (config: any) =>
    ipcRenderer.invoke('ai-get-ollama-models', config),

  // Clipboard API
  readClipboard: () =>
    ipcRenderer.invoke('read-clipboard'),

  // Settings API
  getSettings: () =>
    ipcRenderer.invoke('get-settings'),

  saveSettings: (settings: any) =>
    ipcRenderer.invoke('save-settings', settings),
});

// Type definitions for the exposed API
export interface ElectronAPI {
  executeScript: (scriptPath: string, parameters?: string[], requiresElevation?: boolean) => Promise<{
    success: boolean;
    output: string;
    error?: string;
  }>;
  openExternal: (url: string) => Promise<void>;
  showMessageBox: (options: any) => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  getAppVersion: () => Promise<string>;
  getAppPath: () => Promise<string>;
  computeHash: (data: ArrayBuffer) => Promise<string>;
  verifySignature: (data: string, signature: string, publicKey: string) => Promise<boolean>;
  aiChat: (messages: Array<{role: string; content: string}>, config: any) => Promise<{success: boolean; response?: string; error?: string}>;
  aiAnalyzeThreat: (threatData: any, config: any) => Promise<{success: boolean; analysis?: any; error?: string}>;
  aiAnalyzeScan: (scanResults: any, config: any) => Promise<{success: boolean; analysis?: string; error?: string}>;
  aiGetRecommendations: (systemData: any, config: any) => Promise<{success: boolean; recommendations?: string[]; error?: string}>;
  aiCheckOllama: (config: any) => Promise<{success: boolean; available: boolean}>;
  aiGetOllamaModels: (config: any) => Promise<{success: boolean; models: string[]}>;
  readClipboard: () => Promise<string>;
  getSettings: () => any;
  saveSettings: (settings: any) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}