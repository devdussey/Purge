export interface AppSettings {
  // Protection Settings
  realTimeProtection: boolean;
  cloudProtection: boolean;
  behaviorMonitoring: boolean;
  ransomwareProtection: boolean;

  // Scan Settings
  scanArchives: boolean;
  scanRemovableMedia: boolean;
  scanNetworkDrives: boolean;
  scanDepth: 'quick' | 'normal' | 'deep';
  autoQuarantine: boolean;

  // Performance Settings
  performanceMode: 'low-impact' | 'balanced' | 'maximum-protection';
  cpuUsageLimit: number; // 1-100
  scheduleScans: boolean;
  scheduledScanTime: string; // HH:MM format
  scheduledScanDay: string; // 'daily' | 'monday' | 'tuesday' etc.

  // Update Settings
  autoUpdateDefinitions: boolean;
  autoUpdateApp: boolean;
  updateCheckInterval: number; // hours

  // Notification Settings
  showThreatNotifications: boolean;
  showScanCompleteNotifications: boolean;
  playSoundAlerts: boolean;

  // Crypto Protection Settings
  cryptoClipboardMonitoring: boolean;
  cryptoWalletFileMonitoring: boolean;
  cryptoPhishingDetection: boolean;
  autoBlockSuspiciousAddresses: boolean;
  addressSwapThreshold: number; // 0-100 risk score

  // Advanced Settings
  enableTelemetry: boolean;
  enableCrashReporting: boolean;
  logLevel: 'error' | 'warning' | 'info' | 'debug';
  maxLogSize: number; // MB
  quarantineRetentionDays: number;

  // UI Settings
  theme: 'dark' | 'light' | 'auto';
  compactMode: boolean;
  showAdvancedOptions: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  // Protection Settings
  realTimeProtection: true,
  cloudProtection: true,
  behaviorMonitoring: true,
  ransomwareProtection: true,

  // Scan Settings
  scanArchives: true,
  scanRemovableMedia: true,
  scanNetworkDrives: false,
  scanDepth: 'normal',
  autoQuarantine: true,

  // Performance Settings
  performanceMode: 'balanced',
  cpuUsageLimit: 50,
  scheduleScans: false,
  scheduledScanTime: '02:00',
  scheduledScanDay: 'daily',

  // Update Settings
  autoUpdateDefinitions: true,
  autoUpdateApp: true,
  updateCheckInterval: 6,

  // Notification Settings
  showThreatNotifications: true,
  showScanCompleteNotifications: true,
  playSoundAlerts: true,

  // Crypto Protection Settings
  cryptoClipboardMonitoring: true,
  cryptoWalletFileMonitoring: true,
  cryptoPhishingDetection: true,
  autoBlockSuspiciousAddresses: true,
  addressSwapThreshold: 70,

  // Advanced Settings
  enableTelemetry: true,
  enableCrashReporting: true,
  logLevel: 'info',
  maxLogSize: 100,
  quarantineRetentionDays: 30,

  // UI Settings
  theme: 'dark',
  compactMode: false,
  showAdvancedOptions: false,
};
