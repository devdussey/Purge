// Type definitions for Electron IPC (if converting to Electron app)
export interface ElectronAPI {
  executeScript: (scriptPath: string, parameters?: string[], requiresElevation?: boolean) => Promise<{
    success: boolean;
    output: string;
    error?: string;
  }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}