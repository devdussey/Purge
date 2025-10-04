import { Search, HardDrive, Download, Shield, Clock, History, Trash2, AlertTriangle, RotateCcw, Settings, Activity } from 'lucide-react';
import { useUITest } from '../contexts/UITestContext';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  badge?: string;
}

function QuickActionCard({ title, description, icon: Icon, onClick, variant = 'primary', disabled = false, badge }: QuickActionProps) {
  const { recordButtonClick } = useUITest();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 hover:from-red-600/30 hover:to-red-800/30 hover:border-red-400/50';
      case 'secondary':
        return 'bg-gradient-to-br from-gray-700/20 to-gray-900/20 border-gray-600/30 hover:from-gray-700/30 hover:to-gray-900/30 hover:border-gray-500/50';
      case 'danger':
        return 'bg-gradient-to-br from-red-700/20 to-red-900/20 border-red-600/30 hover:from-red-700/30 hover:to-red-900/30 hover:border-red-500/50';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30 hover:from-yellow-600/30 hover:to-yellow-800/30 hover:border-yellow-400/50';
      case 'success':
        return 'bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 hover:from-green-600/30 hover:to-green-800/30 hover:border-green-400/50';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary': return 'text-red-400';
      case 'secondary': return 'text-gray-400';
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
    }
  };

  return (
    <button
      onClick={(e) => {
        console.log(`[QuickAction] Button clicked: ${title}`);
        // Save reference before async operations
        const target = e.currentTarget;
        const buttonId = title.toLowerCase().replace(/\s+/g, '-');

        // Record click in test panel
        recordButtonClick(buttonId, title);

        // Visual feedback
        target.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (target) {
            target.style.transform = '';
          }
        }, 100);
        // Call the actual handler
        onClick();
      }}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg button-feedback click-feedback'}
        relative w-full p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 text-left group
      `}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          {badge}
        </div>
      )}
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl bg-black/30 ${getIconColor()} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  );
}

interface QuickActionsProps {
  onQuickScan: () => void;
  onFullScan: () => void;
  onUpdateDefinitions: () => void;
  onToggleProtection: () => void;
  onScheduleScan: () => void;
  onViewHistory: () => void;
  onManageQuarantine: () => void;
  onEmergencyCleanup: () => void;
  onSystemRestore: () => void;
  onSettings: () => void;
  isScanning: boolean;
}

export function QuickActions({
  onQuickScan,
  onFullScan,
  onUpdateDefinitions,
  onToggleProtection,
  onScheduleScan,
  onViewHistory,
  onManageQuarantine,
  onEmergencyCleanup,
  onSystemRestore,
  onSettings,
  isScanning
}: QuickActionsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-red-400" />
          <span className="text-sm text-gray-400">All systems operational</span>
        </div>
      </div>
      
      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <QuickActionCard
          title="Quick Scan"
          description="Rapid scan of critical system areas and active processes"
          icon={Search}
          onClick={onQuickScan}
          disabled={isScanning}
          variant="primary"
        />
        <QuickActionCard
          title="Full System Scan"
          description="Comprehensive deep scan of entire system and all files"
          icon={HardDrive}
          onClick={onFullScan}
          variant="secondary"
          disabled={isScanning}
        />
        <QuickActionCard
          title="Update Definitions"
          description="Download latest virus signatures and threat intelligence"
          icon={Download}
          onClick={onUpdateDefinitions}
          variant="success"
        />
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickActionCard
          title="Toggle Protection"
          description="Enable/disable real-time protection"
          icon={Shield}
          onClick={onToggleProtection}
          variant="warning"
        />
        <QuickActionCard
          title="Schedule Scan"
          description="Set up automatic scanning"
          icon={Clock}
          onClick={onScheduleScan}
          variant="secondary"
        />
        <QuickActionCard
          title="Scan History"
          description="View previous scan results"
          icon={History}
          onClick={onViewHistory}
          variant="secondary"
        />
        <QuickActionCard
          title="Settings"
          description="Configure antivirus options"
          icon={Settings}
          onClick={onSettings}
          variant="secondary"
        />
      </div>

      {/* Emergency Actions */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Emergency Tools</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Quarantine Manager"
            description="Manage quarantined files"
            icon={Trash2}
            onClick={onManageQuarantine}
            variant="warning"
            badge="3"
          />
          <QuickActionCard
            title="Emergency Cleanup"
            description="Remove malicious threats"
            icon={AlertTriangle}
            onClick={onEmergencyCleanup}
            variant="danger"
          />
          <QuickActionCard
            title="System Restore"
            description="Restore system to clean state"
            icon={RotateCcw}
            onClick={onSystemRestore}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}
