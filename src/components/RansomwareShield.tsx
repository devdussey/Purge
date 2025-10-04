import {useState, useEffect} from 'react';
import { Shield, AlertTriangle, RotateCcw, Network, Clock } from 'lucide-react';

interface RansomwareShieldProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onRollback: (timeWindow: number) => void;
}

interface RansomwareActivity {
  timestamp: Date;
  type: 'mass_encryption' | 'suspicious_network' | 'registry_modification';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  filesAffected?: number;
}

export function RansomwareShield({ isActive, onToggle, onRollback }: RansomwareShieldProps) {
  const [recentActivity, setRecentActivity] = useState<RansomwareActivity[]>([]);
  const [networkIsolated, setNetworkIsolated] = useState(false);
  const [rollbackTimeWindow, setRollbackTimeWindow] = useState(30);

  useEffect(() => {
    // Simulate ransomware activity monitoring
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of activity
        const activities: RansomwareActivity[] = [
          {
            timestamp: new Date(),
            type: 'mass_encryption',
            severity: 'critical',
            details: 'Detected mass file encryption in Documents folder',
            filesAffected: Math.floor(Math.random() * 50) + 10
          },
          {
            timestamp: new Date(),
            type: 'suspicious_network',
            severity: 'high',
            details: 'Suspicious outbound connections to known C2 servers'
          },
          {
            timestamp: new Date(),
            type: 'registry_modification',
            severity: 'medium',
            details: 'Registry modifications detected in startup keys'
          }
        ];

        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleEmergencyRollback = () => {
    onRollback(rollbackTimeWindow * 60 * 1000); // Convert minutes to milliseconds
  };

  const handleNetworkIsolation = () => {
    setNetworkIsolated(!networkIsolated);
    // In a real implementation, this would isolate network connections
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mass_encryption': return AlertTriangle;
      case 'suspicious_network': return Network;
      case 'registry_modification': return Shield;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="bg-dark-900 rounded-lg shadow-lg border border-dark-700">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className={`h-6 w-6 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
            <div>
              <h2 className="text-xl font-semibold text-white">Ransomware Shield</h2>
              <p className="text-sm text-gray-400">
                Advanced ransomware protection with rollback capability
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? 'bg-primary-900 text-primary-300' : 'bg-dark-700 text-gray-300'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => onToggle(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-primary-600' : 'bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Emergency Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
            <h3 className="font-medium text-red-400 mb-3">Emergency Rollback</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-300">Rollback window:</span>
                <select
                  value={rollbackTimeWindow}
                  onChange={(e) => setRollbackTimeWindow(Number(e.target.value))}
                  className="px-2 py-1 bg-dark-700 text-white text-sm rounded border border-dark-600"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <button
                onClick={handleEmergencyRollback}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Emergency Rollback</span>
              </button>
            </div>
          </div>

          <div className="bg-primary-900/20 border border-primary-500/20 rounded-lg p-4">
            <h3 className="font-medium text-primary-400 mb-3">Network Isolation</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4 text-primary-400" />
                <span className="text-sm text-primary-300">
                  Status: {networkIsolated ? 'Isolated' : 'Connected'}
                </span>
              </div>
              <button
                onClick={handleNetworkIsolation}
                className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  networkIsolated 
                    ? 'bg-accent-600 text-white hover:bg-accent-700' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Network className="h-4 w-4" />
                <span>{networkIsolated ? 'Restore Network' : 'Isolate Network'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-medium text-white mb-4">Recent Ransomware Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No ransomware activity detected</p>
                <p className="text-sm">Your system is protected</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(activity.severity)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs opacity-75">
                            {activity.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1 opacity-90">{activity.details}</p>
                        {activity.filesAffected && (
                          <p className="text-xs mt-1 opacity-75">
                            Files affected: {activity.filesAffected}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Protection Features */}
        <div className="bg-dark-blue-950 rounded-lg p-4">
          <h4 className="font-medium text-white mb-3">Active Protection Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">File system monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">Behavior analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">Network monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">Registry protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">Shadow copy protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-400' : 'bg-gray-400'}`} />
              <span className="text-gray-300">Automatic journaling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}