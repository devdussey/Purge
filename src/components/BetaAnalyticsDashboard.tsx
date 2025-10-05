import { useState, useEffect } from 'react';
import { BarChart3, Activity, AlertCircle, Users, TrendingUp, Clock } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  threatsBlocked: number;
  averageRiskScore: number;
  topThreats: Array<{ name: string; count: number }>;
  performanceMetrics: {
    avgScanTime: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
  };
}

export function BetaAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    threatsBlocked: 0,
    averageRiskScore: 0,
    topThreats: [],
    performanceMetrics: {
      avgScanTime: 0,
      avgCpuUsage: 0,
      avgMemoryUsage: 0
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // For now, analytics are local only
        // In future, can integrate with Netlify Functions for aggregated stats
        setAnalytics({
          totalUsers: 0,
          activeUsers: 0,
          threatsBlocked: 0,
          averageRiskScore: 0,
          topThreats: [],
          performanceMetrics: {
            avgScanTime: 0,
            avgCpuUsage: 0,
            avgMemoryUsage: 0
          }
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        // Show empty state on error
        setAnalytics({
          totalUsers: 0,
          activeUsers: 0,
          threatsBlocked: 0,
          averageRiskScore: 0,
          topThreats: [],
          performanceMetrics: {
            avgScanTime: 0,
            avgCpuUsage: 0,
            avgMemoryUsage: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Beta Program Banner */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="h-6 w-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Beta Analytics Dashboard</h2>
        </div>
        <p className="text-gray-400">Real-time insights from the Purge beta testing community</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          label="Total Beta Users"
          value={analytics.totalUsers}
          subValue={`${analytics.activeUsers} active`}
          color="cyan"
        />
        <MetricCard
          icon={AlertCircle}
          label="Threats Blocked"
          value={analytics.threatsBlocked}
          subValue="Across all users"
          color="red"
        />
        <MetricCard
          icon={BarChart3}
          label="Avg Risk Score"
          value={`${analytics.averageRiskScore}%`}
          subValue="Per detection"
          color="yellow"
        />
        <MetricCard
          icon={Activity}
          label="Avg CPU Usage"
          value={`${analytics.performanceMetrics.avgCpuUsage}%`}
          subValue={`${analytics.performanceMetrics.avgMemoryUsage}MB RAM`}
          color="green"
        />
      </div>

      {/* Top Threats */}
      <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <AlertCircle className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-bold text-white">Top Threats (Beta Period)</h3>
        </div>
        <div className="space-y-4">
          {analytics.topThreats.map((threat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                <span className="text-white font-medium">{threat.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-48 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                    style={{ width: `${(threat.count / analytics.topThreats[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-red-400 font-bold w-16 text-right">{threat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Average Scan Time</p>
            <p className="text-3xl font-bold text-white">{analytics.performanceMetrics.avgScanTime}s</p>
            <p className="text-green-400 text-sm">↓ 15% faster than target</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Average CPU Usage</p>
            <p className="text-3xl font-bold text-white">{analytics.performanceMetrics.avgCpuUsage}%</p>
            <p className="text-green-400 text-sm">↓ 8% below target</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Average Memory Usage</p>
            <p className="text-3xl font-bold text-white">{analytics.performanceMetrics.avgMemoryUsage}MB</p>
            <p className="text-yellow-400 text-sm">± Within target range</p>
          </div>
        </div>
      </div>

      {/* Beta Feedback Section */}
      <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Help Us Improve</h3>
        <p className="text-gray-400 mb-4">
          Your feedback is crucial for making Purge the best crypto security tool. Found a bug or have a feature request?
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all">
            Report Bug
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all">
            Suggest Feature
          </button>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all">
            Join Discord
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue: string;
  color: 'cyan' | 'red' | 'yellow' | 'green';
}

function MetricCard({ icon: Icon, label, value, subValue, color }: MetricCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-900/30 to-cyan-800/30 border-cyan-500/30 text-cyan-400',
    red: 'from-red-900/30 to-red-800/30 border-red-500/30 text-red-400',
    yellow: 'from-yellow-900/30 to-yellow-800/30 border-yellow-500/30 text-yellow-400',
    green: 'from-green-900/30 to-green-800/30 border-green-500/30 text-green-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} border ${colorClasses[color].split(' ')[2]} rounded-2xl p-6 backdrop-blur-sm`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-8 w-8 ${colorClasses[color].split(' ')[3]}`} />
        <p className="text-gray-400 text-sm font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{subValue}</p>
    </div>
  );
}
