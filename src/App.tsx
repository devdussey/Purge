import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatusCard } from './components/StatusCard';
import { ActionButton } from './components/ActionButton';
import { LogViewer } from './components/LogViewer';
import { ScriptConfigPanel } from './components/ScriptConfigPanel';
import { FalsePositiveReporter } from './components/FalsePositiveReporter';
import { RansomwareShield } from './components/RansomwareShield';
import { EDRTimeline } from './components/EDRTimeline';
import { PerformanceModeSelector } from './components/PerformanceModeSelector';
import { executeScript, getCommandLineExecution } from './utils/scriptRunner';
import { 
  Search, 
  HardDrive, 
  Download, 
  Shield, 
  Clock, 
  History, 
  Settings,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Activity,
  Zap
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform indicator */}
        {!isElectron && (
          <div className="mb-6 bg-primary-900/20 border border-primary-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-primary-400" />
              <p className="text-primary-300 text-sm">
                You're using the web version. For full functionality including script execution, please download the desktop app.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-dark-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: Shield },
                { id: 'ransomware', name: 'Ransomware Shield', icon: AlertTriangle },
                { id: 'timeline', name: 'EDR Timeline', icon: Activity },
                { id: 'performance', name: 'Performance', icon: Zap }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
        {/* Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatusCard
              title="Real-time Protection"
              status="active"
              description="Active and monitoring"
              lastUpdate="2 minutes ago"
            />
            <StatusCard
              title="Virus Definitions"
              status="active"
              description="Up to date"
              lastUpdate="1 hour ago"
            />
            <StatusCard
              title="Last Full Scan"
              status="warning"
              description="3 days ago"
              lastUpdate="3 days ago"
            />
            <StatusCard
              title="Quarantine Items"
              status="inactive"
              description="2 items in quarantine"
              lastUpdate="Yesterday"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionButton
              title="Quick Scan"
              description="Scan critical system areas"
              icon={Search}
              onClick={handleQuickScan}
              disabled={isScanning}
            />
            <ActionButton
              title="Full System Scan"
              description="Complete system scan"
              icon={HardDrive}
              onClick={handleFullScan}
              variant="secondary"
              disabled={isScanning}
            />
            <ActionButton
              title="Update Definitions"
              description="Download latest virus signatures"
              icon={Download}
              onClick={handleUpdateDefinitions}
              variant="secondary"
            />
            <ActionButton
              title="Toggle Protection"
              description="Enable/disable real-time protection"
              icon={Shield}
              onClick={handleToggleRealTimeProtection}
            />
            <ActionButton
              title="Schedule Scan"
              description="Set up automatic scanning"
              icon={Clock}
              onClick={handleScheduleScan}
              variant="secondary"
            />
            <ActionButton
              title="Scan History"
              description="View previous scan results"
              icon={History}
              onClick={handleViewHistory}
              variant="secondary"
            />
          </div>
        </div>

        {/* Advanced Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Advanced Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton
              title="Quarantine Manager"
              description="Manage quarantined files"
              icon={Trash2}
              onClick={handleManageQuarantine}
              variant="warning"
            />
            <ActionButton
              title="Emergency Cleanup"
              description="Remove malicious threats"
              icon={AlertTriangle}
              onClick={handleEmergencyCleanup}
              variant="danger"
            />
            <ActionButton
              title="System Restore"
              description="Restore system to clean state"
              icon={RotateCcw}
              onClick={handleSystemRestore}
              variant="secondary"
            />
            <ActionButton
              title="Settings"
              description="Configure antivirus options"
              icon={Settings}
              onClick={handleSettings}
              variant="secondary"
            />
          </div>
        </div>

        {/* Log Viewer */}
        <LogViewer />
          </>
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

        {/* Script Configuration Panel */}
        <ScriptConfigPanel />

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
          <div className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span className="font-medium">Scanning in progress...</span>
            </div>
          </div>
        )}

        {/* Output Display */}
        {lastOutput && (
          <div className="fixed bottom-20 right-6 bg-dark-900 text-primary-400 p-4 rounded-lg shadow-lg max-w-md border border-dark-700">
            <h4 className="font-medium mb-2">Script Output:</h4>
            <pre className="text-xs overflow-auto max-h-32">{lastOutput}</pre>
            {/* Add false positive reporting button for detections */}
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
              className="mt-2 text-xs text-primary-300 hover:text-primary-200 underline"
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