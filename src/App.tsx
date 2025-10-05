import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { SystemStatus } from './components/SystemStatus';
import { QuickActions } from './components/QuickActions';
import { ThreatFeed } from './components/ThreatFeed';
import { LogViewer } from './components/LogViewer';
import { ScriptConfigPanel } from './components/ScriptConfigPanel';
import { FalsePositiveReporter } from './components/FalsePositiveReporter';
import { RansomwareShield } from './components/RansomwareShield';
import { EDRTimeline } from './components/EDRTimeline';
import { PerformanceModeSelector } from './components/PerformanceModeSelector';
import { AIAssistant } from './components/AIAssistant';
import { AIDetectionPanel } from './components/AIDetectionPanel';
import { AISettings } from './components/AISettings';
import { Settings } from './components/Settings';
import { CryptoProtection } from './components/CryptoProtection';
import { BetaAnalyticsDashboard } from './components/BetaAnalyticsDashboard';
import { BetaFeedbackWidget } from './components/BetaFeedbackWidget';
import { AuthScreen } from './components/Auth/AuthScreen';
import { authService } from './services/AuthService';
import { AIDetectionEngine } from './engine/AIDetectionEngine';
import { DetectionEngine } from './engine/DetectionEngine';
import { executeScript, getCommandLineExecution } from './utils/scriptRunner';
import { useSettings } from './hooks/useSettings';
import { UITestPanel } from './components/UITestPanel';
import { useUITest } from './contexts/UITestContext';
import {
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  BarChart3,
  Settings as SettingsIcon,
  Brain,
  Wallet,
  TestTube2
} from 'lucide-react';

function App() {
  const { settings, updateSettings } = useSettings();
  const { recordButtonClick } = useUITest();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastOutput, setLastOutput] = useState<string>('');
  const [isElectron] = useState(!!window.electronAPI);
  const [showFPReporter, setShowFPReporter] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [ransomwareShieldActive, setRansomwareShieldActive] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiEngine] = useState(() => {
    const baseEngine = new DetectionEngine();
    return new AIDetectionEngine(baseEngine, 'demo-api-key');
  });
  const [aiModels, setAiModels] = useState(() => aiEngine.getModelStatus());

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply theme to document root whenever settings.theme changes
  useEffect(() => {
    let effectiveTheme: 'brand' | 'dark' | 'light' = 'brand';

    if (settings.theme === 'auto') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        effectiveTheme = 'light';
      } else {
        effectiveTheme = 'brand';
      }
    } else if (settings.theme === 'light') {
      effectiveTheme = 'light';
    } else if (settings.theme === 'dark') {
      effectiveTheme = 'dark';
    } else {
      effectiveTheme = 'brand';
    }

    // Apply to document root
    document.documentElement.classList.remove('brand', 'dark', 'light');
    document.documentElement.classList.add(effectiveTheme);

    console.log('Theme applied:', effectiveTheme, 'from settings.theme:', settings.theme);
  }, [settings, settings.theme]); // Watch both settings object AND settings.theme
  const handleQuickScan = async () => {
    setIsScanning(true);

    try {
      const result = await executeScript('quickScan');
      setLastOutput(result.output);

      if (!isElectron) {
        const command = getCommandLineExecution('quickScan');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFullScan = async () => {
    setIsScanning(true);

    try {
      const result = await executeScript('fullScan');
      setLastOutput(result.output);

      if (!isElectron) {
        const command = getCommandLineExecution('fullScan');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateDefinitions = async () => {
    try {
      const result = await executeScript('updateDefinitions');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('updateDefinitions');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleToggleRealTimeProtection = async () => {
    try {
      const result = await executeScript('toggleProtection');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('toggleProtection');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleScheduleScan = async () => {
    try {
      const result = await executeScript('scheduleScan');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('scheduleScan');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleViewHistory = async () => {
    try {
      const result = await executeScript('viewHistory');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('viewHistory');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleManageQuarantine = async () => {
    try {
      const result = await executeScript('manageQuarantine');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('manageQuarantine');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleEmergencyCleanup = async () => {
    try {
      const result = await executeScript('emergencyCleanup');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('emergencyCleanup');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleSystemRestore = async () => {
    try {
      const result = await executeScript('systemRestore');
      setLastOutput(result.output);
      
      if (!isElectron) {
        const command = getCommandLineExecution('systemRestore');
        console.log('Run this command:', command);
      }
    } catch (error) {
      console.error('Script execution failed:', error);
    }
  };

  const handleSettings = () => {
    setActiveTab('settings');
  };

  const handleFalsePositiveReport = async (report: any) => {
    console.log('False positive report:', report);
    // In a real implementation, send to telemetry system
  };

  const handleRansomwareRollback = async (timeWindow: number) => {
    console.log(`Rolling back ransomware changes for ${timeWindow}ms`);
    // In a real implementation, trigger quarantine manager rollback
  };

  const handleUpdateAIModel = async (modelId: string) => {
    const success = await aiEngine.updateModel(modelId);
    if (success) {
      setAiModels(aiEngine.getModelStatus());
    }
  };

  const handleToggleAIModel = (modelId: string, enabled: boolean) => {
    // In a real implementation, enable/disable the model
    console.log(`Toggle AI model ${modelId}: ${enabled}`);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Shield },
    { id: 'crypto', name: 'Crypto Protection', icon: Wallet },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'ransomware', name: 'Ransomware Shield', icon: AlertTriangle },
    { id: 'timeline', name: 'EDR Timeline', icon: Activity },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'ai', name: 'AI', icon: Brain },
    { id: 'beta', name: 'Beta', icon: TestTube2 },
    { id: 'settings', name: 'Settings', icon: SettingsIcon }
  ];

  // Determine theme classes
  const getThemeClasses = () => {
    if (settings.theme === 'light') {
      return 'min-h-screen';
    } else if (settings.theme === 'dark') {
      return 'min-h-screen';
    }
    // Brand theme (default)
    return 'min-h-screen';
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <img src="/purge-icon-64.png" alt="Purge Logo" className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`${getThemeClasses()} ${settings.compactMode ? 'compact-mode' : ''}`}>
      <Header
        onNotificationsClick={() => console.log('Notifications clicked')}
        onSettingsClick={() => setActiveTab('settings')}
        onProfileClick={() => console.log('Profile clicked')}
      />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Platform indicator */}
        {!isElectron && (
          <div className="mb-8 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div>
                <p className="text-red-300 font-semibold">Web Version Limitations</p>
                <p className="text-red-200/80 text-sm">
                  You're using the web version. For full functionality including script execution, please download the desktop app.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm p-2 overflow-x-auto">
            <nav className="flex space-x-2 min-w-min">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={(e) => {
                      console.log(`[Navigation] Tab clicked: ${tab.name}`);
                      const target = e.currentTarget;

                      // Record in UI Test Panel
                      recordButtonClick(`nav-${tab.id}`, `Navigation: ${tab.name}`);

                      target.style.transform = 'scale(0.97)';
                      setTimeout(() => {
                        if (target) {
                          target.style.transform = '';
                        }
                      }, 100);
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 click-feedback whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 text-red-400 border border-red-500/30 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <DashboardStats />
            <SystemStatus />
            <QuickActions
              onQuickScan={handleQuickScan}
              onFullScan={handleFullScan}
              onUpdateDefinitions={handleUpdateDefinitions}
              onToggleProtection={handleToggleRealTimeProtection}
              onScheduleScan={handleScheduleScan}
              onViewHistory={handleViewHistory}
              onManageQuarantine={handleManageQuarantine}
              onEmergencyCleanup={handleEmergencyCleanup}
              onSystemRestore={handleSystemRestore}
              onSettings={handleSettings}
              isScanning={isScanning}
            />
          </div>
        )}

        {activeTab === 'crypto' && (
          <CryptoProtection />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ThreatFeed />
            <LogViewer />
          </div>
        )}

        {activeTab === 'ransomware' && (
          <RansomwareShield
            isActive={ransomwareShieldActive}
            onToggle={setRansomwareShieldActive}
            onRollback={handleRansomwareRollback}
          />
        )}

        {activeTab === 'timeline' && (
          <EDRTimeline />
        )}

        {activeTab === 'performance' && (
          <PerformanceModeSelector
            currentMode={settings.performanceMode}
            onModeChange={(mode) => updateSettings({ performanceMode: mode as any })}
            batteryLevel={85}
            isFullscreen={false}
            isGameRunning={false}
          />
        )}

        {activeTab === 'ai' && (
          <div className="space-y-8">
            <AIDetectionPanel
              models={aiModels}
              onUpdateModel={handleUpdateAIModel}
              onToggleModel={handleToggleAIModel}
            />
            <AISettings />
          </div>
        )}

        {activeTab === 'beta' && (
          <BetaAnalyticsDashboard />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}

        {/* Script Configuration Panel */}
        <ScriptConfigPanel />

        {/* AI Assistant */}
        <AIAssistant
          isOpen={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
        />

        {/* False Positive Reporter */}
        {showFPReporter && selectedDetection && (
          <FalsePositiveReporter
            detection={selectedDetection}
            onReport={handleFalsePositiveReport}
            onClose={() => setShowFPReporter(false)}
          />
        )}

        {/* Scanning Status */}
        {isScanning && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm text-white p-6 rounded-2xl shadow-2xl border border-red-500/30">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                <div className="absolute inset-0 rounded-full bg-red-400/20 animate-pulse"></div>
              </div>
              <div>
                <p className="font-bold text-lg">Scanning in progress...</p>
                <p className="text-red-200 text-sm">Please wait while we secure your system</p>
              </div>
            </div>
          </div>
        )}

        {/* Output Display */}
        {lastOutput && (
          <div className="fixed bottom-6 left-6 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm text-red-400 p-6 rounded-2xl shadow-2xl max-w-md border border-red-500/30">
            <h4 className="font-bold text-lg mb-3 text-white">Script Output</h4>
            <pre className="text-sm overflow-auto max-h-32 text-gray-300 bg-black/30 p-3 rounded-lg">{lastOutput}</pre>
            <button
              onClick={() => {
                setSelectedDetection({
                  ruleId: 'test_rule',
                  ruleName: 'Test Detection',
                  filePath: 'C:\\test\\file.exe',
                  fileHash: 'abc123',
                  severity: 'medium'
                });
                setShowFPReporter(true);
              }}
              className="mt-3 text-sm text-red-400 hover:text-red-300 underline font-medium"
            >
              Report False Positive
            </button>
          </div>
        )}

        {/* Beta Feedback Widget */}
        <BetaFeedbackWidget />

        {/* UI Test Panel - Debug */}
        <div className="fixed bottom-6 right-6 z-50">
          <UITestPanel />
        </div>

        {/* Temporary Debug Indicator */}
        <div className="fixed bottom-24 right-6 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs">
          Test Panel Mounted
        </div>
      </main>
    </div>
  );
}

export default App;