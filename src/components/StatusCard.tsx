import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StatusCardProps {
  title: string;
  status: 'active' | 'warning' | 'inactive' | 'error';
  description: string;
  lastUpdate?: string;
}

export function StatusCard({ title, status, description, lastUpdate }: StatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500',
          textColor: 'text-green-400',
          bgSecondary: 'bg-gray-800 border-green-500/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          bgSecondary: 'bg-gray-800 border-yellow-500/20',
        };
      case 'inactive':
        return {
          icon: Shield,
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-400',
          bgSecondary: 'bg-gray-800 border-gray-500/20',
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-red-400',
          bgSecondary: 'bg-gray-800 border-red-500/20',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgSecondary} rounded-lg p-6 border`}>
      <div className="flex items-center space-x-3">
        <div className={`${config.bgColor} p-2 rounded-full`}>
          <IconComponent className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className={`text-sm ${config.textColor}`}>{description}</p>
          {lastUpdate && (
            <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdate}</p>
          )}
        </div>
      </div>
    </div>
  );
}