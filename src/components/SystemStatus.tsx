import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, Wifi, HardDrive, Cpu } from 'lucide-react';

interface StatusItemProps {
  title: string;
  status: 'active' | 'warning' | 'inactive' | 'error';
  description: string;
  lastUpdate?: string;
  icon: React.ComponentType<any>;
  details?: string;
}

function StatusItem({ title, status, description, lastUpdate, icon: Icon, details }: StatusItemProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          bgColor: 'from-green-600/20 to-green-800/20',
          borderColor: 'border-green-500/30',
          iconColor: 'text-green-400',
          statusColor: 'text-green-400',
          statusText: 'Active'
        };
      case 'warning':
        return {
          bgColor: 'from-yellow-600/20 to-yellow-800/20',
          borderColor: 'border-yellow-500/30',
          iconColor: 'text-yellow-400',
          statusColor: 'text-yellow-400',
          statusText: 'Warning'
        };
      case 'inactive':
        return {
          bgColor: 'from-gray-600/20 to-gray-800/20',
          borderColor: 'border-gray-500/30',
          iconColor: 'text-gray-400',
          statusColor: 'text-gray-400',
          statusText: 'Inactive'
        };
      case 'error':
        return {
          bgColor: 'from-red-600/20 to-red-800/20',
          borderColor: 'border-red-500/30',
          iconColor: 'text-red-400',
          statusColor: 'text-red-400',
          statusText: 'Error'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`bg-gradient-to-br ${config.bgColor} ${config.borderColor} rounded-2xl p-6 border backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-black/30 ${config.iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.statusColor} bg-black/30`}>
            {config.statusText}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        {details && (
          <p className="text-xs text-gray-400 bg-black/20 rounded-lg p-2">{details}</p>
        )}
        {lastUpdate && (
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated: {lastUpdate}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function SystemStatus() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">System Status</h2>
        <div className="flex items-center space-x-2 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">All Systems Operational</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusItem
          title="Real-time Protection"
          status="active"
          description="Monitoring all system activity"
          lastUpdate="2 minutes ago"
          icon={Shield}
          details="Behavioral analysis active, 1,247 threats blocked today"
        />
        <StatusItem
          title="Virus Definitions"
          status="active"
          description="Latest signatures installed"
          lastUpdate="1 hour ago"
          icon={HardDrive}
          details="Version 2024.01.15.03 - 8.2M signatures loaded"
        />
        <StatusItem
          title="Network Protection"
          status="active"
          description="DNS filtering active"
          lastUpdate="5 minutes ago"
          icon={Wifi}
          details="Blocked 23 malicious domains, C2 detection active"
        />
        <StatusItem
          title="System Performance"
          status="warning"
          description="CPU usage elevated"
          lastUpdate="Just now"
          icon={Cpu}
          details="Background scan in progress - 15% CPU usage"
        />
      </div>
    </div>
  );
}