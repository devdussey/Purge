// Type definitions for Electron IPC (if converting to Electron app)
export interface ElectronAPI {
  executeScript: (
    scriptPath: string,
    parameters?: string[],
    requiresElevation?: boolean
  ) => Promise<{
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
  aiChat: (
    messages: Array<{ role: string; content: string }>,
    config: any
  ) => Promise<{ success: boolean; response?: string; error?: string }>;
  aiAnalyzeThreat: (
    threatData: any,
    config: any
  ) => Promise<{ success: boolean; analysis?: any; error?: string }>;
  aiAnalyzeScan: (
    scanResults: any,
    config: any
  ) => Promise<{ success: boolean; analysis?: string; error?: string }>;
  aiGetRecommendations: (
    systemData: any,
    config: any
  ) => Promise<{ success: boolean; recommendations?: string[]; error?: string }>;
  aiCheckOllama: (config: any) => Promise<{ success: boolean; available: boolean }>;
  aiGetOllamaModels: (config: any) => Promise<{ success: boolean; models: string[] }>;
  readClipboard: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};