import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Copy, Wallet, CheckCircle, XCircle, Activity, Lock } from 'lucide-react';
import { cryptoProtection, ClipboardThreat } from '../services/CryptoProtection';
import { PhishingChecker } from './PhishingChecker';
import { useSettings } from '../hooks/useSettings';
import { DownloadPromptModal } from './DownloadPromptModal';
import { isWeb, getFeatureDisplayName } from '../utils/platform';

export function CryptoProtection() {
  const { settings } = useSettings();
  const [isActive, setIsActive] = useState(false);
  const [threats, setThreats] = useState<ClipboardThreat[]>([]);
  const [stats, setStats] = useState(cryptoProtection.getStats());
  const [showAlert, setShowAlert] = useState(false);
  const [currentThreat, setCurrentThreat] = useState<ClipboardThreat | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState<string>('Clipboard Monitoring');

  const runningOnWeb = isWeb();

  useEffect(() => {
    // Start monitoring based on settings
    if (settings.cryptoClipboardMonitoring) {
      cryptoProtection.startClipboardMonitoring();
      setIsActive(true);
    }

    // Listen for threats
    const handleThreat = (event: CustomEvent) => {
      const { threat } = event.detail;
      setCurrentThreat(threat);
      setShowAlert(true);

      // Auto-hide after 10 seconds
      setTimeout(() => setShowAlert(false), 10000);
    };

    const handleWalletThreat = () => {
      setStats(cryptoProtection.getStats());
    };

    window.addEventListener('crypto-threat-detected' as any, handleThreat);
    window.addEventListener('wallet-file-threat' as any, handleWalletThreat);

    // Update stats every 2 seconds
    const statsInterval = setInterval(() => {
      setThreats(cryptoProtection.getThreats());
      setStats(cryptoProtection.getStats());
    }, 2000);

    return () => {
      cryptoProtection.stopClipboardMonitoring();
      window.removeEventListener('crypto-threat-detected' as any, handleThreat);
      window.removeEventListener('wallet-file-threat' as any, handleWalletThreat);
      clearInterval(statsInterval);
    };
  }, [settings.cryptoClipboardMonitoring]);

  const toggleProtection = () => {
    // If running on web, show download prompt
    if (runningOnWeb) {
      setRequestedFeature(getFeatureDisplayName('clipboard-monitoring'));
      setShowDownloadModal(true);
      return;
    }

    // Desktop app - actually toggle protection
    if (isActive) {
      cryptoProtection.stopClipboardMonitoring();
      setIsActive(false);
    } else {
      cryptoProtection.startClipboardMonitoring();
      setIsActive(true);
    }
  };

  const clearThreats = () => {
    cryptoProtection.clearThreats();
    setThreats([]);
  };

  return (
    <div className="space-y-6">
      {/* Download Prompt Modal */}
      <DownloadPromptModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        featureName={requestedFeature}
      />
      {/* Threat Alert */}
      {showAlert && currentThreat && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500 rounded-2xl p-6 shadow-2xl animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {currentThreat.blocked ? '🛡️ THREAT BLOCKED!' : '⚠️ SUSPICIOUS ACTIVITY'}
              </h3>
              <p className="text-red-200 text-sm mb-3">
                {currentThreat.blocked
                  ? 'Malware attempted to swap your crypto address. Original address restored!'
                  : 'Your clipboard crypto address changed unexpectedly. Verify before sending!'}
              </p>
              <div className="bg-black/30 rounded-lg p-3 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-gray-400">Original:</span>
                  <div className="text-green-400 break-all">{currentThreat.originalAddress}</div>
                </div>
                <div>
                  <span className="text-gray-400">Replaced with:</span>
                  <div className="text-red-400 break-all">{currentThreat.replacedAddress}</div>
                </div>
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Risk Score:</span>
                    <span className={`font-bold ${
                      currentThreat.riskScore >= 70 ? 'text-red-400' :
                      currentThreat.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{currentThreat.riskScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Detection:</span>
                    <span className="text-purple-400 uppercase text-xs">{currentThreat.detectionMethod}</span>
                  </div>
                </div>
                {currentThreat.indicators && currentThreat.indicators.length > 0 && (
                  <div className="pt-2 border-t border-gray-600">
                    <span className="text-gray-400 block mb-1">Indicators:</span>
                    <ul className="space-y-1">
                      {currentThreat.indicators.map((indicator, i) => (
                        <li key={i} className="text-gray-300 text-xs">• {indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <Wallet className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white">Crypto Protection</h2>
                {runningOnWeb && (
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300">
                    WEB DEMO
                  </span>
                )}
              </div>
              <p className="text-purple-300">
                {runningOnWeb
                  ? 'Download desktop app for real-time protection'
                  : 'Advanced protection for crypto assets'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleProtection}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isActive
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {isActive ? '✓ Active' : 'Activate'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.addressesMonitored}</div>
            <div className="text-sm text-gray-400">Addresses Monitored</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalThreats}</div>
            <div className="text-sm text-gray-400">Threats Detected</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <Shield className="h-5 w-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.blockedThreats}</div>
            <div className="text-sm text-gray-400">Threats Blocked</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <Lock className="h-5 w-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.walletAlerts}</div>
            <div className="text-sm text-gray-400">Wallet Alerts</div>
          </div>
        </div>
      </div>

      {/* Protection Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Copy className="h-5 w-5 mr-2 text-blue-400" />
            Clipboard Protection
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Real-time clipboard monitoring</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Detects address swap attacks</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Supports BTC, ETH, XMR, LTC, SOL, ADA</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Auto-restore original addresses</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-purple-400" />
            Wallet File Protection
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Monitors wallet.dat and keystore files</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Alerts on unauthorized access</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">Detects suspicious process activity</span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <span className="text-gray-300">MetaMask, Exodus, Ledger support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Threat History */}
      {threats.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Threat History</h3>
            <button
              onClick={clearThreats}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {threats.slice().reverse().map((threat) => (
              <div
                key={threat.id}
                className={`p-4 rounded-xl border ${
                  threat.blocked
                    ? 'bg-red-900/20 border-red-500/30'
                    : 'bg-yellow-900/20 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {threat.blocked ? (
                      <XCircle className="h-5 w-5 text-red-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                    <span className={`font-semibold ${threat.blocked ? 'text-red-400' : 'text-yellow-400'}`}>
                      {threat.blocked ? 'BLOCKED' : 'DETECTED'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(threat.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-gray-500">Original:</span>
                    <div className="text-green-400 break-all">{threat.originalAddress}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Replaced:</span>
                    <div className="text-red-400 break-all">{threat.replacedAddress}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-500">Risk:</span>
                    <span className={`font-bold ${
                      threat.riskScore >= 70 ? 'text-red-400' :
                      threat.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>{threat.riskScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Method:</span>
                    <span className="text-purple-400 uppercase">{threat.detectionMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phishing URL Checker */}
      <PhishingChecker />
    </div>
  );
}


