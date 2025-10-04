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
          bgColor: 'bg-primary-500',
          textColor: 'text-primary-400',
          bgSecondary: 'bg-dark-900 border-primary-500/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-accent-500',
          textColor: 'text-accent-400',
          bgSecondary: 'bg-dark-900 border-accent-500/20',
        };
      case 'inactive':
        return {
          icon: Shield,
          bgColor: 'bg-dark-500',
          textColor: 'text-gray-400',
          bgSecondary: 'bg-dark-900 border-dark-500/20',
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-red-400',
          bgSecondary: 'bg-dark-900 border-red-500/20',
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