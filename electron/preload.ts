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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}