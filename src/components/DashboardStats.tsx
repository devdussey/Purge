import { Shield, Zap, Clock, AlertTriangle, TrendingUp, Database } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'red' | 'green' | 'yellow' | 'blue';
}

function StatCard({ title, value, change, icon: Icon, trend = 'neutral', color = 'red' }: StatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'from-green-600/20 to-green-800/20 border-green-500/30 text-green-400';
      case 'yellow':
        return 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30 text-yellow-400';
      case 'blue':
        return 'from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-400';
      default:
        return 'from-red-600/20 to-red-800/20 border-red-500/30 text-red-400';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />;
    return null;
  };

  return (
    <div className={`bg-gradient-to-br ${getColorClasses()} backdrop-blur-sm rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses().split(' ')[0]} ${getColorClasses().split(' ')[1]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className="text-sm font-medium text-gray-300">{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <StatCard
        title="Threats Blocked"
        value="1,247"
        change="+12%"
        icon={Shield}
        trend="up"
        color="green"
      />
      <StatCard
        title="Files Scanned"
        value="89.2K"
        change="+5%"
        icon={Database}
        trend="up"
        color="blue"
      />
      <StatCard
        title="Scan Speed"
        value="2.3s"
        change="-15%"
        icon={Zap}
        trend="down"
        color="yellow"
      />
      <StatCard
        title="Last Scan"
        value="2h ago"
        icon={Clock}
        color="red"
      />
      <StatCard
        title="Quarantined"
        value="3"
        icon={AlertTriangle}
        color="yellow"
      />
      <StatCard
        title="System Health"
        value="98%"
        change="+2%"
        icon={TrendingUp}
        trend="up"
        color="green"
      />
    </div>
  );
}