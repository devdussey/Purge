// PowerShell script execution utilities
export interface ScriptConfig {
  name: string;
  path: string;
  description: string;
  requiresElevation?: boolean;
}

// Configure your PowerShell script paths here
export const SCRIPT_CONFIGS: Record<string, ScriptConfig> = {
  quickScan: {
    name: 'Quick Scan',
    path: './scripts/antivirus/quick-scan.ps1',
    description: 'Performs a quick system scan',
    requiresElevation: true
  },
  fullScan: {
    name: 'Full System Scan',
    path: './scripts/antivirus/full-scan.ps1',
    description: 'Complete system scan',
    requiresElevation: true
  },
  updateDefinitions: {
    name: 'Update Definitions',
    path: './scripts/antivirus/update-definitions.ps1',
    description: 'Downloads latest virus signatures',
    requiresElevation: false
  },
  toggleProtection: {
    name: 'Toggle Real-time Protection',
    path: './scripts/antivirus/toggle-protection.ps1',
    description: 'Enable/disable real-time protection',
    requiresElevation: true
  },
  scheduleScan: {
    name: 'Schedule Scan',
    path: './scripts/antivirus/schedule-scan.ps1',
    description: 'Set up automatic scanning',
    requiresElevation: true
  },
  viewHistory: {
    name: 'View Scan History',
    path: './scripts/antivirus/scan-history.ps1',
    description: 'View previous scan results',
    requiresElevation: false
  },
  manageQuarantine: {
    name: 'Manage Quarantine',
    path: './scripts/antivirus/manage-quarantine.ps1',
    description: 'Manage quarantined files',
    requiresElevation: true
  },
  emergencyCleanup: {
    name: 'Emergency Cleanup',
    path: './scripts/antivirus/emergency-cleanup.ps1',
    description: 'Remove malicious threats',
    requiresElevation: true
  },
  systemRestore: {
    name: 'System Restore',
    path: './scripts/antivirus/system-restore.ps1',
    description: 'Restore system to clean state',
    requiresElevation: true
  }
};

// For web-based execution (if running as Electron app or with backend)
export async function executeScript(scriptKey: string, parameters?: string[]): Promise<{ success: boolean; output: string; error?: string }> {
  const config = SCRIPT_CONFIGS[scriptKey];
  if (!config) {
    return { success: false, output: '', error: 'Script not found' };
  }

  try {
    // Electron app execution
    if (window.electronAPI) {
      return await window.electronAPI.executeScript(config.path, parameters, config.requiresElevation);
    }

    // Fallback for web version
    return { 
      success: false, 
      output: '', 
      error: 'Script execution not available in web version. Please use the desktop app.' 
    };

  } catch (error) {
    return { 
      success: false, 
      output: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// For direct command line execution (copy these commands)
export function getCommandLineExecution(scriptKey: string, parameters?: string[]): string {
  const config = SCRIPT_CONFIGS[scriptKey];
  if (!config) return '';

  const paramString = parameters ? ` ${parameters.join(' ')}` : '';
  
  if (config.requiresElevation) {
    return `Start-Process PowerShell -ArgumentList "-ExecutionPolicy Bypass -File '${config.path}'${paramString}" -Verb RunAs`;
  } else {
    return `PowerShell -ExecutionPolicy Bypass -File "${config.path}"${paramString}`;
  }
}