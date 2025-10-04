import { useState } from 'react';
import {
  Shield,
  Search,
  Zap,
  Download,
  Bell,
  Wallet,
  Code,
  Monitor,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  FileDown,
  FileUp,
  Save,
  CheckCircle
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useUITest } from '../contexts/UITestContext';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SettingsSection({ title, description, icon: Icon, children, defaultOpen = false }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-900/30 rounded-xl">
            <Icon className="h-6 w-6 text-red-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-700/30 pt-6">
          {children}
        </div>
      )}
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleSetting({ label, description, value, onChange, disabled = false }: ToggleSettingProps) {
  const { recordButtonClick } = useUITest();

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-white font-medium">{label}</label>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={(e) => {
          if (!disabled) {
            console.log(`[Toggle] ${label}: ${value} → ${!value}`);
            const target = e.currentTarget;
            const buttonId = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

            // Record in UI Test Panel
            recordButtonClick(buttonId, `Toggle: ${label}`);

            // Visual feedback
            target.style.transform = 'scale(0.9)';
            setTimeout(() => {
              if (target) {
                target.style.transform = '';
              }
            }, 100);
            onChange(!value);
          }
        }}
        disabled={disabled}
        className={`relative w-14 h-7 rounded-full transition-all ${
          value ? 'bg-red-500' : 'bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            value ? 'translate-x-7' : ''
          }`}
        />
      </button>
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  description: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: any) => void;
}

function SelectSetting({ label, description, value, options, onChange }: SelectSettingProps) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">{label}</label>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SliderSettingProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

function SliderSetting({ label, description, value, min, max, step = 1, unit = '', onChange }: SliderSettingProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium">{label}</label>
        <span className="text-red-400 font-bold">{value}{unit}</span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red"
      />
    </div>
  );
}

export function Settings() {
  const { settings, updateSettings, resetSettings, exportSettings } = useSettings();
  const { recordButtonClick } = useUITest();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure Purge antivirus protection</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              console.log('[Settings] Export clicked');
              const target = e.currentTarget;

              // Record in UI Test Panel
              recordButtonClick('export-settings', 'Export Settings');

              target.style.transform = 'scale(0.95)';
              setTimeout(() => {
                if (target) {
                  target.style.transform = '';
                }
              }, 100);
              exportSettings();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 hover:bg-gray-700 transition-all hover-lift click-feedback"
          >
            <FileDown className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={(e) => {
              console.log('[Settings] Reset clicked');
              const target = e.currentTarget;

              // Record in UI Test Panel
              recordButtonClick('reset-settings', 'Reset Settings');

              target.style.transform = 'scale(0.95)';
              setTimeout(() => {
                if (target) {
                  target.style.transform = '';
                }
              }, 100);
              if (confirm('Are you sure you want to reset all settings to defaults?')) {
                resetSettings();
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 hover:bg-gray-700 transition-all hover-lift click-feedback"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus === 'saved' && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-medium">Settings saved automatically</span>
        </div>
      )}

      {/* Protection Settings */}
      <SettingsSection
        title="Protection Settings"
        description="Configure real-time protection features"
        icon={Shield}
        defaultOpen={true}
      >
        <ToggleSetting
          label="Real-time Protection"
          description="Continuously monitor system for threats"
          value={settings.realTimeProtection}
          onChange={(value) => updateSettings({ realTimeProtection: value })}
        />
        <ToggleSetting
          label="Cloud Protection"
          description="Use cloud-based threat intelligence"
          value={settings.cloudProtection}
          onChange={(value) => updateSettings({ cloudProtection: value })}
        />
        <ToggleSetting
          label="Behavior Monitoring"
          description="Detect threats based on suspicious behavior"
          value={settings.behaviorMonitoring}
          onChange={(value) => updateSettings({ behaviorMonitoring: value })}
        />
        <ToggleSetting
          label="Ransomware Protection"
          description="Advanced ransomware detection and rollback"
          value={settings.ransomwareProtection}
          onChange={(value) => updateSettings({ ransomwareProtection: value })}
        />
      </SettingsSection>

      {/* Scan Settings */}
      <SettingsSection
        title="Scan Settings"
        description="Configure scanning behavior and depth"
        icon={Search}
      >
        <SelectSetting
          label="Scan Depth"
          description="Balance between scan speed and thoroughness"
          value={settings.scanDepth}
          options={[
            { value: 'quick', label: 'Quick Scan (Critical areas only)' },
            { value: 'normal', label: 'Normal Scan (Recommended)' },
            { value: 'deep', label: 'Deep Scan (Comprehensive)' }
          ]}
          onChange={(value) => updateSettings({ scanDepth: value })}
        />
        <ToggleSetting
          label="Scan Archives"
          description="Scan inside ZIP, RAR, and other archives"
          value={settings.scanArchives}
          onChange={(value) => updateSettings({ scanArchives: value })}
        />
        <ToggleSetting
          label="Scan Removable Media"
          description="Auto-scan USB drives and external devices"
          value={settings.scanRemovableMedia}
          onChange={(value) => updateSettings({ scanRemovableMedia: value })}
        />
        <ToggleSetting
          label="Scan Network Drives"
          description="Include network and mapped drives in scans"
          value={settings.scanNetworkDrives}
          onChange={(value) => updateSettings({ scanNetworkDrives: value })}
        />
        <ToggleSetting
          label="Auto-quarantine Threats"
          description="Automatically isolate detected threats"
          value={settings.autoQuarantine}
          onChange={(value) => updateSettings({ autoQuarantine: value })}
        />
      </SettingsSection>

      {/* Performance Settings */}
      <SettingsSection
        title="Performance Settings"
        description="Optimize system resource usage"
        icon={Zap}
      >
        <SelectSetting
          label="Performance Mode"
          description="Balance protection and system performance"
          value={settings.performanceMode}
          options={[
            { value: 'low-impact', label: 'Low Impact (Minimal CPU usage)' },
            { value: 'balanced', label: 'Balanced (Recommended)' },
            { value: 'maximum-protection', label: 'Maximum Protection (May impact performance)' }
          ]}
          onChange={(value) => updateSettings({ performanceMode: value })}
        />
        <SliderSetting
          label="CPU Usage Limit"
          description="Maximum CPU usage during scans"
          value={settings.cpuUsageLimit}
          min={10}
          max={100}
          step={5}
          unit="%"
          onChange={(value) => updateSettings({ cpuUsageLimit: value })}
        />
        <ToggleSetting
          label="Schedule Scans"
          description="Run automatic scans at scheduled times"
          value={settings.scheduleScans}
          onChange={(value) => updateSettings({ scheduleScans: value })}
        />
        {settings.scheduleScans && (
          <>
            <SelectSetting
              label="Scan Frequency"
              description="How often to run scheduled scans"
              value={settings.scheduledScanDay}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
                { value: 'sunday', label: 'Sunday' }
              ]}
              onChange={(value) => updateSettings({ scheduledScanDay: value })}
            />
            <div>
              <label className="block text-white font-medium mb-2">Scan Time</label>
              <input
                type="time"
                value={settings.scheduledScanTime}
                onChange={(e) => updateSettings({ scheduledScanTime: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </>
        )}
      </SettingsSection>

      {/* Update Settings */}
      <SettingsSection
        title="Update Settings"
        description="Configure automatic updates"
        icon={Download}
      >
        <ToggleSetting
          label="Auto-update Virus Definitions"
          description="Keep threat signatures up to date automatically"
          value={settings.autoUpdateDefinitions}
          onChange={(value) => updateSettings({ autoUpdateDefinitions: value })}
        />
        <ToggleSetting
          label="Auto-update Application"
          description="Install app updates automatically"
          value={settings.autoUpdateApp}
          onChange={(value) => updateSettings({ autoUpdateApp: value })}
        />
        <SelectSetting
          label="Update Check Interval"
          description="How often to check for updates"
          value={settings.updateCheckInterval}
          options={[
            { value: 1, label: 'Every hour' },
            { value: 6, label: 'Every 6 hours (Recommended)' },
            { value: 12, label: 'Every 12 hours' },
            { value: 24, label: 'Daily' }
          ]}
          onChange={(value) => updateSettings({ updateCheckInterval: Number(value) })}
        />
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        title="Notifications"
        description="Manage alerts and notifications"
        icon={Bell}
      >
        <ToggleSetting
          label="Show Threat Notifications"
          description="Alert when threats are detected"
          value={settings.showThreatNotifications}
          onChange={(value) => updateSettings({ showThreatNotifications: value })}
        />
        <ToggleSetting
          label="Show Scan Complete Notifications"
          description="Notify when scans finish"
          value={settings.showScanCompleteNotifications}
          onChange={(value) => updateSettings({ showScanCompleteNotifications: value })}
        />
        <ToggleSetting
          label="Play Sound Alerts"
          description="Audio notification for threats"
          value={settings.playSoundAlerts}
          onChange={(value) => updateSettings({ playSoundAlerts: value })}
        />
      </SettingsSection>

      {/* Crypto Protection Settings */}
      <SettingsSection
        title="Crypto Protection"
        description="Cryptocurrency wallet and transaction protection"
        icon={Wallet}
      >
        <ToggleSetting
          label="Clipboard Monitoring"
          description="Detect crypto address swap attacks"
          value={settings.cryptoClipboardMonitoring}
          onChange={(value) => updateSettings({ cryptoClipboardMonitoring: value })}
        />
        <ToggleSetting
          label="Wallet File Monitoring"
          description="Protect wallet files from unauthorized access"
          value={settings.cryptoWalletFileMonitoring}
          onChange={(value) => updateSettings({ cryptoWalletFileMonitoring: value })}
        />
        <ToggleSetting
          label="Phishing Detection"
          description="Block malicious crypto phishing sites"
          value={settings.cryptoPhishingDetection}
          onChange={(value) => updateSettings({ cryptoPhishingDetection: value })}
        />
        <ToggleSetting
          label="Auto-block Suspicious Addresses"
          description="Automatically block high-risk addresses"
          value={settings.autoBlockSuspiciousAddresses}
          onChange={(value) => updateSettings({ autoBlockSuspiciousAddresses: value })}
        />
        <SliderSetting
          label="Address Swap Risk Threshold"
          description="Risk score needed to block an address swap"
          value={settings.addressSwapThreshold}
          min={40}
          max={90}
          step={5}
          unit="%"
          onChange={(value) => updateSettings({ addressSwapThreshold: value })}
        />
      </SettingsSection>

      {/* Advanced Settings */}
      <SettingsSection
        title="Advanced Settings"
        description="Developer and diagnostic options"
        icon={Code}
      >
        <ToggleSetting
          label="Enable Telemetry"
          description="Send anonymous usage data to improve Purge"
          value={settings.enableTelemetry}
          onChange={(value) => updateSettings({ enableTelemetry: value })}
        />
        <ToggleSetting
          label="Enable Crash Reporting"
          description="Automatically send crash reports"
          value={settings.enableCrashReporting}
          onChange={(value) => updateSettings({ enableCrashReporting: value })}
        />
        <SelectSetting
          label="Log Level"
          description="Verbosity of application logs"
          value={settings.logLevel}
          options={[
            { value: 'error', label: 'Error only' },
            { value: 'warning', label: 'Warning' },
            { value: 'info', label: 'Info (Recommended)' },
            { value: 'debug', label: 'Debug (Verbose)' }
          ]}
          onChange={(value) => updateSettings({ logLevel: value })}
        />
        <SliderSetting
          label="Max Log Size"
          description="Maximum size of log files before rotation"
          value={settings.maxLogSize}
          min={10}
          max={500}
          step={10}
          unit="MB"
          onChange={(value) => updateSettings({ maxLogSize: value })}
        />
        <SliderSetting
          label="Quarantine Retention"
          description="Days to keep quarantined files"
          value={settings.quarantineRetentionDays}
          min={7}
          max={90}
          step={1}
          unit=" days"
          onChange={(value) => updateSettings({ quarantineRetentionDays: value })}
        />
      </SettingsSection>

      {/* UI Settings */}
      <SettingsSection
        title="Interface"
        description="Customize the user interface"
        icon={Monitor}
      >
        <SelectSetting
          label="Theme"
          description="Choose your preferred color scheme"
          value={settings.theme}
          options={[
            { value: 'dark', label: 'Dark (Default)' },
            { value: 'light', label: 'Light' },
            { value: 'auto', label: 'Auto (System)' }
          ]}
          onChange={(value) => updateSettings({ theme: value })}
        />
        <ToggleSetting
          label="Compact Mode"
          description="Reduce spacing for smaller screens"
          value={settings.compactMode}
          onChange={(value) => updateSettings({ compactMode: value })}
        />
        <ToggleSetting
          label="Show Advanced Options"
          description="Display expert-level settings"
          value={settings.showAdvancedOptions}
          onChange={(value) => updateSettings({ showAdvancedOptions: value })}
        />
      </SettingsSection>
    </div>
  );
}
