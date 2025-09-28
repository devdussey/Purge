import React, { useState, useEffect } from 'react';
import { Gamepad2, Laptop, Zap, Settings } from 'lucide-react';

interface PerformanceMode {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  settings: {
    scanPriority: 'low' | 'normal' | 'high';
    realtimeProtection: boolean;
    backgroundScans: boolean;
    networkMonitoring: boolean;
    behaviorAnalysis: boolean;
    cpuThrottle: number; // Percentage
    batteryThreshold?: number; // Percentage below which to defer scans
  };
}

interface PerformanceModeSelectorProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  batteryLevel?: number;
  isFullscreen?: boolean;
  isGameRunning?: boolean;
}

export function PerformanceModeSelector({ 
  currentMode, 
  onModeChange, 
  batteryLevel = 100,
  isFullscreen = false,
  isGameRunning = false 
}: PerformanceModeSelectorProps) {
  const [autoModeEnabled, setAutoModeEnabled] = useState(true);
  const [customSettings, setCustomSettings] = useState<any>({});

  const performanceModes: PerformanceMode[] = [
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Optimal balance of protection and performance',
      icon: Zap,
      settings: {
        scanPriority: 'normal',
        realtimeProtection: true,
        backgroundScans: true,
        networkMonitoring: true,
        behaviorAnalysis: true,
        cpuThrottle: 50
      }
    },
    {
      id: 'gaming',
      name: 'Gaming Mode',
      description: 'Minimal interruptions during gaming',
      icon: Gamepad2,
      settings: {
        scanPriority: 'low',
        realtimeProtection: true,
        backgroundScans: false,
        networkMonitoring: false,
        behaviorAnalysis: true,
        cpuThrottle: 25
      }
    },
    {
      id: 'laptop',
      name: 'Laptop Mode',
      description: 'Battery-optimized protection',
      icon: Laptop,
      settings: {
        scanPriority: 'low',
        realtimeProtection: true,
        backgroundScans: false,
        networkMonitoring: true,
        behaviorAnalysis: false,
        cpuThrottle: 30,
        batteryThreshold: 30
      }
    },
    {
      id: 'maximum',
      name: 'Maximum Protection',
      description: 'Full protection with all features enabled',
      icon: Settings,
      settings: {
        scanPriority: 'high',
        realtimeProtection: true,
        backgroundScans: true,
        networkMonitoring: true,
        behaviorAnalysis: true,
        cpuThrottle: 100
      }
    }
  ];

  useEffect(() => {
    if (autoModeEnabled) {
      // Auto-switch modes based on system state
      if (isGameRunning || isFullscreen) {
        if (currentMode !== 'gaming') {
          onModeChange('gaming');
        }
      } else if (batteryLevel < 30) {
        if (currentMode !== 'laptop') {
          onModeChange('laptop');
        }
      } else if (currentMode === 'gaming' || currentMode === 'laptop') {
        // Switch back to balanced when conditions no longer apply
        onModeChange('balanced');
      }
    }
  }, [isGameRunning, isFullscreen, batteryLevel, autoModeEnabled, currentMode, onModeChange]);

  const getCurrentModeSettings = () => {
    const mode = performanceModes.find(m => m.id === currentMode);
    return mode ? mode.settings : performanceModes[0].settings;
  };

  const handleModeChange = (modeId: string) => {
    onModeChange(modeId);
    setAutoModeEnabled(false); // Disable auto mode when manually selecting
  };

  return (
    <div className="bg-dark-blue-900 rounded-lg shadow-lg border border-dark-700">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-accent-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Performance Mode</h2>
              <p className="text-sm text-gray-400">
                Optimize protection based on your usage
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={autoModeEnabled}
                onChange={(e) => setAutoModeEnabled(e.target.checked)}
                className="rounded border-dark-600 bg-dark-700 text-primary-600 focus:ring-primary-500"
              />
              <span>Auto Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* System Status */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-blue-950 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Battery Level</span>
              <span className={`text-sm font-medium ${
                batteryLevel < 30 ? 'text-red-400' : 
                batteryLevel < 60 ? 'text-yellow-400' : 'text-accent-400'
              }`}>
                {batteryLevel}%
              </span>
            </div>
          </div>
          
          <div className="bg-dark-blue-950 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Gaming Detected</span>
              <span className={`text-sm font-medium ${
                isGameRunning ? 'text-accent-400' : 'text-gray-400'
              }`}>
                {isGameRunning ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          <div className="bg-dark-blue-950 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Fullscreen App</span>
              <span className={`text-sm font-medium ${
                isFullscreen ? 'text-accent-400' : 'text-gray-400'
              }`}>
                {isFullscreen ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {performanceModes.map((mode) => {
            const IconComponent = mode.icon;
            const isActive = currentMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isActive 
                    ? 'border-accent-500 bg-accent-900/20' 
                    : 'border-dark-600 bg-dark-blue-950 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <IconComponent className={`h-6 w-6 ${
                    isActive ? 'text-accent-400' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    isActive ? 'text-accent-400' : 'text-white'
                  }`}>
                    {mode.name}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{mode.description}</p>
              </button>
            );
          })}
        </div>

        {/* Current Mode Settings */}
        <div className="bg-dark-blue-950 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Current Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(getCurrentModeSettings()).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </span>
                <span className={`font-medium ${
                  typeof value === 'boolean' 
                    ? (value ? 'text-accent-400' : 'text-red-400')
                    : 'text-white'
                }`}>
                  {typeof value === 'boolean' 
                    ? (value ? 'Enabled' : 'Disabled')
                    : typeof value === 'number' && key.includes('Threshold')
                    ? `${value}%`
                    : typeof value === 'number' && key.includes('Throttle')
                    ? `${value}%`
                    : value
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Auto Mode Info */}
        {autoModeEnabled && (
          <div className="mt-4 bg-primary-900/20 border border-primary-500/20 rounded-lg p-4">
            <h4 className="font-medium text-primary-400 mb-2">Auto Mode Active</h4>
            <p className="text-sm text-primary-300">
              Performance mode will automatically adjust based on:
            </p>
            <ul className="text-sm text-primary-300 mt-2 space-y-1">
              <li>• Gaming/fullscreen application detection</li>
              <li>• Battery level (switches to Laptop mode below 30%)</li>
              <li>• System resource usage</li>
              <li>• Network connectivity status</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}