import React, { useState } from 'react';
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
import { AIDetectionEngine } from './engine/AIDetectionEngine';
import { DetectionEngine } from './engine/DetectionEngine';
import { executeScript, getCommandLineExecution } from './utils/scriptRunner';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Zap,
  BarChart3,
  Settings as SettingsIcon,
  Brain
} from 'lucide-react';

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastOutput, setLastOutput] = useState<string>('');
  const [isElectron] = useState(!!window.electronAPI);
  const [showFPReporter, setShowFPReporter] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [ransomwareShieldActive, setRansomwareShieldActive] = useState(true);
  const [performanceMode, setPerformanceMode] = useState('balanced');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiEngine] = useState(() => {
    const baseEngine = new DetectionEngine();
    return new AIDetectionEngine(baseEngine, 'demo-api-key');
  });
  const [aiModels, setAiModels] = useState(() => aiEngine.getModelStatus());

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
    console.log('Opening settings...');
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
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'ransomware', name: 'Ransomware Shield', icon: AlertTriangle },
    { id: 'timeline', name: 'EDR Timeline', icon: Activity },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'ai', name: 'AI Detection', icon: Brain },
    { id: 'settings', name: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
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
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm p-2">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
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
            currentMode={performanceMode}
            onModeChange={setPerformanceMode}
            batteryLevel={85}
            isFullscreen={false}
            isGameRunning={false}
          />
        )}

        {activeTab === 'ai' && (
          <AIDetectionPanel
            models={aiModels}
            onUpdateModel={handleUpdateAIModel}
            onToggleModel={handleToggleAIModel}
          />
        )}

        {activeTab === 'settings' && (
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            <p className="text-gray-400">Settings panel coming soon...</p>
          </div>
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
      </main>
    </div>
  );
}

export default App;