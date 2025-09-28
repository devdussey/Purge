import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatusCard } from './components/StatusCard';
import { ActionButton } from './components/ActionButton';
import { LogViewer } from './components/LogViewer';
import { ScriptConfigPanel } from './components/ScriptConfigPanel';
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
  RotateCcw
} from 'lucide-react';

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastOutput, setLastOutput] = useState<string>('');
  const [isElectron] = useState(!!window.electronAPI);

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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform indicator */}
        {!isElectron && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="text-yellow-300 text-sm">
                You're using the web version. For full functionality including script execution, please download the desktop app.
              </p>
            </div>
          </div>
        )}

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

        {/* Script Configuration Panel */}
        <ScriptConfigPanel />

        {/* Scanning Status */}
        {isScanning && (
          <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span className="font-medium">Scanning in progress...</span>
            </div>
          </div>
        )}

        {/* Output Display */}
        {lastOutput && (
          <div className="fixed bottom-20 right-6 bg-gray-800 text-green-400 p-4 rounded-lg shadow-lg max-w-md border border-gray-700">
            <h4 className="font-medium mb-2">Script Output:</h4>
            <pre className="text-xs overflow-auto max-h-32">{lastOutput}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;