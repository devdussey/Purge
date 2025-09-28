// Type definitions for Electron IPC (if converting to Electron app)
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
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}