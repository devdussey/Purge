import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Search, Ban, CheckCircle, XCircle } from 'lucide-react';
import { phishingDetection, PhishingAlert } from '../services/PhishingDetection';

export function PhishingChecker() {
  const [url, setUrl] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [alerts, setAlerts] = useState<PhishingAlert[]>([]);
  const [stats, setStats] = useState(phishingDetection.getStats());
  const [blockedDomains, setBlockedDomains] = useState<string[]>([]);

  useEffect(() => {
    // Listen for phishing detection events
    const handlePhishingDetected = (event: CustomEvent) => {
      setAlerts(prev => [event.detail, ...prev]);
    };

    window.addEventListener('phishing-detected' as any, handlePhishingDetected);

    // Load initial data
    setAlerts(phishingDetection.getAlerts());
    setBlockedDomains(phishingDetection.getBlockedDomains());

    // Update stats periodically
    const interval = setInterval(() => {
      setStats(phishingDetection.getStats());
    }, 2000);

    return () => {
      window.removeEventListener('phishing-detected' as any, handlePhishingDetected);
      clearInterval(interval);
    };
  }, []);

  const handleCheck = () => {
    if (!url.trim()) return;

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http')) {
      fullUrl = 'https://' + fullUrl;
    }

    const result = phishingDetection.checkURL(fullUrl);
    setCheckResult(result);

    if (result.isPhishing) {
      phishingDetection.recordAlert(fullUrl, false);
    }
  };

  const handleBlock = () => {
    if (checkResult && checkResult.isPhishing) {
      phishingDetection.blockDomain(checkResult.url);
      phishingDetection.recordAlert(checkResult.url, true);
      setBlockedDomains(phishingDetection.getBlockedDomains());
      setCheckResult({ ...checkResult, blocked: true });
    }
  };

  const handleUnblock = (domain: string) => {
    phishingDetection.unblockDomain(`https://${domain}`);
    setBlockedDomains(phishingDetection.getBlockedDomains());
  };

  const handleClear = () => {
    phishingDetection.clearAlerts();
    setAlerts([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-2xl border border-orange-500/30 backdrop-blur-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-orange-600/20 rounded-xl">
            <Shield className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Phishing Protection</h2>
            <p className="text-orange-300">Detect fake crypto sites before you connect</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4">
            <AlertTriangle className="h-5 w-5 text-red-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalAlerts}</div>
            <div className="text-sm text-gray-400">Total Alerts</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <XCircle className="h-5 w-5 text-red-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.highSeverity}</div>
            <div className="text-sm text-gray-400">High Risk</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <Ban className="h-5 w-5 text-orange-400 mb-2" />
            <div className="text-2xl font-bold text-white">{stats.blockedSites}</div>
            <div className="text-sm text-gray-400">Blocked Sites</div>
          </div>

          <div className="bg-black/20 rounded-xl p-4">
            <CheckCircle className="h-5 w-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">Protected</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
        </div>
      </div>

      {/* URL Checker */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2 text-blue-400" />
          Check URL Safety
        </h3>

        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Enter URL to check (e.g., metamask.io)"
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleCheck}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            Check
          </button>
        </div>

        {/* Check Result */}
        {checkResult && (
          <div className={`p-4 rounded-xl border ${
            checkResult.isPhishing
              ? checkResult.confidence > 70
                ? 'bg-red-900/20 border-red-500/30'
                : 'bg-yellow-900/20 border-yellow-500/30'
              : 'bg-green-900/20 border-green-500/30'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {checkResult.isPhishing ? (
                    checkResult.confidence > 70 ? (
                      <>
                        <XCircle className="h-6 w-6 text-red-400" />
                        <span className="text-xl font-bold text-red-400">⚠️ DANGEROUS - DO NOT VISIT</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                        <span className="text-xl font-bold text-yellow-400">⚠️ SUSPICIOUS</span>
                      </>
                    )
                  ) : (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <span className="text-xl font-bold text-green-400">✓ SAFE</span>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-400">URL: <span className="text-white font-mono">{checkResult.url}</span></div>
                  {checkResult.targetSite && (
                    <div className="text-sm text-red-400">⚠️ Impersonates: <span className="font-bold">{checkResult.targetSite}</span></div>
                  )}
                  <div className="grid grid-cols-2 gap-3 my-2">
                    <div className="bg-black/30 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Risk Score</div>
                      <div className={`text-lg font-bold ${
                        checkResult.riskScore >= 70 ? 'text-red-400' :
                        checkResult.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'
                      }`}>{checkResult.riskScore}%</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Detection Method</div>
                      <div className="text-lg font-bold text-purple-400 uppercase">{checkResult.detectionMethod}</div>
                    </div>
                  </div>
                  {checkResult.indicators && checkResult.indicators.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-400 mb-2">🔍 Detection Indicators:</div>
                      <div className="space-y-2">
                        {checkResult.indicators.map((indicator: any, i: number) => (
                          <div key={i} className={`p-2 rounded-lg border ${
                            indicator.severity === 'high' ? 'bg-red-900/20 border-red-500/30' :
                            indicator.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500/30' :
                            'bg-gray-800/50 border-gray-600/30'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold uppercase ${
                                indicator.severity === 'high' ? 'text-red-400' :
                                indicator.severity === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                              }`}>{indicator.category}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                indicator.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                indicator.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>{indicator.severity}</span>
                            </div>
                            <div className="text-xs text-gray-300">{indicator.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {checkResult.reasons.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-400 mb-1">Summary:</div>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {checkResult.reasons.map((reason: string, i: number) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {checkResult.isPhishing && !checkResult.blocked && (
                <button
                  onClick={handleBlock}
                  className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Block Site
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Common Phishing Tactics */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎯 Common Phishing Tactics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Lookalike domains:</strong> metamаsk.io (Cyrillic 'а')</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Wrong TLD:</strong> metamask.com instead of .io</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Hyphens:</strong> meta-mask.io or ledger-wallet.com</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Urgent messages:</strong> "Verify wallet or lose funds"</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Free offers:</strong> "Claim free NFT/tokens"</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <span className="text-sm text-gray-300"><strong>Suspicious TLDs:</strong> .tk, .ml, .xyz, .top</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Domains */}
      {blockedDomains.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
          <h3 className="text-lg font-bold text-white mb-4">🚫 Blocked Domains</h3>
          <div className="space-y-2">
            {blockedDomains.map((domain) => (
              <div key={domain} className="flex items-center justify-between p-3 bg-red-900/10 rounded-lg border border-red-500/20">
                <span className="text-gray-300 font-mono text-sm">{domain}</span>
                <button
                  onClick={() => handleUnblock(domain)}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Phishing Attempts</h3>
            <button
              onClick={handleClear}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${
                  alert.severity === 'high'
                    ? 'bg-red-900/20 border-red-500/30'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-900/20 border-yellow-500/30'
                    : 'bg-orange-900/20 border-orange-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-bold text-sm ${
                        alert.severity === 'high' ? 'text-red-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      {alert.blocked && <Ban className="h-4 w-4 text-red-400" />}
                    </div>
                    <div className="text-xs text-gray-400 font-mono break-all mb-1">{alert.url}</div>
                    <div className="text-xs text-gray-500">{alert.reason}</div>
                    {alert.targetSite && (
                      <div className="text-xs text-red-400 mt-1">Impersonates: {alert.targetSite}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

