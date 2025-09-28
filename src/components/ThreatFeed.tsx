import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Zap, Globe, Clock, TrendingUp } from 'lucide-react';

interface ThreatAlert {
  id: string;
  timestamp: Date;
  type: 'malware' | 'phishing' | 'ransomware' | 'network' | 'behavioral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
  location?: string;
}

export function ThreatFeed() {
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate real-time threat feed
    const mockThreats: ThreatAlert[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000),
        type: 'malware',
        severity: 'critical',
        title: 'Trojan.Win32.Agent detected',
        description: 'Malicious executable blocked in Downloads folder',
        action: 'File quarantined automatically',
        location: 'C:\\Users\\User\\Downloads\\malware.exe'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000),
        type: 'network',
        severity: 'high',
        title: 'Suspicious outbound connection',
        description: 'Process attempting to connect to known C2 server',
        action: 'Connection blocked',
        location: '192.168.1.100 → 45.33.32.156:8080'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000),
        type: 'behavioral',
        severity: 'medium',
        title: 'Process injection detected',
        description: 'Suspicious process injection behavior observed',
        action: 'Process terminated',
        location: 'explorer.exe → malicious.dll'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000),
        type: 'phishing',
        severity: 'high',
        title: 'Phishing website blocked',
        description: 'Attempted access to fraudulent banking site',
        action: 'DNS request blocked',
        location: 'fake-bank-login.com'
      }
    ];

    setThreats(mockThreats);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return AlertTriangle;
      case 'phishing': return Globe;
      case 'ransomware': return Shield;
      case 'network': return Zap;
      case 'behavioral': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const filteredThreats = filter === 'all' ? threats : threats.filter(threat => threat.type === filter);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/30 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Threat Feed</h2>
              <p className="text-sm text-gray-400">Real-time security alerts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-400">Live</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {['all', 'malware', 'network', 'behavioral', 'phishing'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === filterType
                  ? 'bg-red-600/30 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredThreats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No threats detected</p>
              <p className="text-sm">Your system is secure</p>
            </div>
          ) : (
            filteredThreats.map((threat) => {
              const IconComponent = getTypeIcon(threat.type);
              return (
                <div
                  key={threat.id}
                  className={`p-4 rounded-xl border backdrop-blur-sm hover:scale-[1.02] transition-all duration-200 ${getSeverityColor(threat.severity)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-black/30 rounded-lg">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{threat.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{threat.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{threat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded-full">
                          ✓ {threat.action}
                        </span>
                        {threat.location && (
                          <span className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-1 rounded">
                            {threat.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}