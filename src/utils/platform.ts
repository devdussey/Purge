/**
 * Platform detection utilities
 */

/**
 * Check if running in Electron desktop app
 */
export const isElectron = (): boolean => {
  // Check if window.electron is available (Electron preload script)
  return !!(window as any).electron;
};

/**
 * Check if running in web browser
 */
export const isWeb = (): boolean => {
  return !isElectron();
};

/**
 * Get platform name
 */
export const getPlatform = (): 'electron' | 'web' => {
  return isElectron() ? 'electron' : 'web';
};

/**
 * Features that require desktop app
 */
export const DESKTOP_ONLY_FEATURES = [
  'clipboard-monitoring',
  'file-scanning',
  'real-time-protection',
  'scheduled-scans',
  'quarantine',
  'wallet-monitoring',
  'background-protection',
] as const;

export type DesktopOnlyFeature = typeof DESKTOP_ONLY_FEATURES[number];

/**
 * Check if a feature requires desktop app
 */
export const requiresDesktop = (feature: string): boolean => {
  return DESKTOP_ONLY_FEATURES.includes(feature as DesktopOnlyFeature);
};

/**
 * Get feature display name for download prompt
 */
export const getFeatureDisplayName = (feature: DesktopOnlyFeature): string => {
  const names: Record<DesktopOnlyFeature, string> = {
    'clipboard-monitoring': 'Clipboard Monitoring',
    'file-scanning': 'File Scanning',
    'real-time-protection': 'Real-time Protection',
    'scheduled-scans': 'Scheduled Scans',
    'quarantine': 'Quarantine Management',
    'wallet-monitoring': 'Wallet File Monitoring',
    'background-protection': 'Background Protection',
  };
  return names[feature] || feature;
};
