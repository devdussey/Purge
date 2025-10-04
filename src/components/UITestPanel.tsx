import { useState, useEffect } from 'react';
import {
  TestTube,
  MousePointer,
  Hand,
  Keyboard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useUITest } from '../contexts/UITestContext';

interface ButtonTest {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'toggle' | 'icon' | 'link';
  tested: boolean;
  responsive: boolean;
  timestamp?: number;
  notes?: string;
}

export function UITestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const { testMode, setTestMode, testResults, clearResults } = useUITest();

  // Clear current test indicator after 2 seconds
  useEffect(() => {
    if (currentTest) {
      const timer = setTimeout(() => setCurrentTest(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTest]);

  // Update current test when new results come in
  useEffect(() => {
    const lastButton = Object.keys(testResults).pop();
    if (lastButton) {
      setCurrentTest(lastButton);
    }
  }, [testResults]);

  // Track button clicks in real-time
  const handleTestClick = (buttonId: string, buttonName: string) => {
    const startTime = performance.now();

    return {
      onMouseEnter: () => {
        if (testMode) {
          console.log(`[UI Test] Hover detected on: ${buttonName}`);
        }
      },
      onClick: () => {
        const endTime = performance.now();
        const delay = endTime - startTime;

        setTestResults(prev => ({
          ...prev,
          [buttonId]: {
            clickDelay: delay,
            visualFeedback: true,
            hoverEffect: true
          }
        }));

        setCurrentTest(buttonId);
        console.log(`[UI Test] Button clicked: ${buttonName}, Delay: ${delay.toFixed(2)}ms`);
      }
    };
  };

  // Common button categories to test
  const testCategories = [
    {
      name: 'Primary Actions',
      buttons: ['quick-scan', 'full-scan', 'update-definitions']
    },
    {
      name: 'Secondary Actions',
      buttons: ['toggle-protection', 'schedule-scan', 'scan-history', 'settings']
    },
    {
      name: 'Emergency Tools',
      buttons: ['quarantine-manager', 'emergency-cleanup', 'system-restore']
    },
    {
      name: 'Navigation Tabs',
      buttons: ['dashboard', 'crypto', 'analytics', 'ransomware', 'timeline', 'performance', 'ai', 'settings']
    },
    {
      name: 'Settings Controls',
      buttons: ['toggle-real-time', 'toggle-cloud', 'toggle-behavior', 'theme-select', 'export-settings', 'reset-settings']
    }
  ];

  const getTotalButtons = () => {
    return testCategories.reduce((sum, cat) => sum + cat.buttons.length, 0);
  };

  const getTestedButtons = () => {
    return Object.keys(testResults).length;
  };

  const getAverageResponseTime = () => {
    const delays = Object.values(testResults).map(r => r.clickDelay);
    if (delays.length === 0) return 0;
    return delays.reduce((sum, d) => sum + d, 0) / delays.length;
  };

  const getSlowButtons = () => {
    return Object.entries(testResults)
      .filter(([_, result]) => result.clickDelay > 100)
      .map(([id, _]) => id);
  };

  return (
    <>
      {/* Floating Test Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 border-2 border-purple-400/50"
        title="UI Test Panel"
      >
        <TestTube className="h-6 w-6" />
      </button>

      {/* Test Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-gradient-to-br from-gray-900/98 to-black/98 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl w-96 max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border-b border-purple-500/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <TestTube className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-white text-lg">UI Test Panel</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white font-medium">Test Mode</span>
              </div>
              <button
                onClick={() => setTestMode(!testMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  testMode ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    testMode ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-gray-700/30">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">
                  {getTestedButtons()}/{getTotalButtons()}
                </div>
                <div className="text-xs text-gray-400">Buttons Tested</div>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">
                  {getAverageResponseTime().toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-400">Avg Response</div>
              </div>
            </div>

            {/* Slow Buttons Warning */}
            {getSlowButtons().length > 0 && (
              <div className="mt-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">
                    {getSlowButtons().length} slow buttons detected (&gt;100ms)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Button Clicks - Live View */}
          <div className="p-4 border-b border-gray-700/30">
            <h4 className="text-sm font-bold text-white mb-2">Recently Clicked</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(testResults).slice(-10).reverse().map(([id, result]) => (
                <div key={id} className="flex items-center justify-between bg-green-900/20 rounded p-2 text-xs">
                  <span className="text-green-400 font-mono">{id}</span>
                  <span className="text-green-300 font-bold">{result.clickDelay.toFixed(1)}ms</span>
                </div>
              ))}
              {Object.keys(testResults).length === 0 && (
                <div className="text-center text-gray-500 text-xs py-2">
                  No buttons clicked yet
                </div>
              )}
            </div>
          </div>

          {/* Test Categories */}
          <div className="overflow-y-auto max-h-96 p-4 space-y-3">
            {testCategories.map((category) => (
              <div key={category.name} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <Hand className="h-4 w-4 text-purple-400" />
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-400">
                    ({category.buttons.filter(b => testResults[b]).length}/{category.buttons.length})
                  </span>
                </h4>
                <div className="space-y-1">
                  {category.buttons.map((buttonId) => {
                    const result = testResults[buttonId];
                    return (
                      <div
                        key={buttonId}
                        className={`flex items-center justify-between p-2 rounded text-xs ${
                          result
                            ? result.clickDelay > 100
                              ? 'bg-yellow-900/20 text-yellow-400'
                              : 'bg-green-900/20 text-green-400'
                            : 'bg-gray-700/20 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {result ? (
                            result.clickDelay > 100 ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span className="font-mono">{buttonId}</span>
                        </div>
                        {result && (
                          <span className="font-bold">{result.clickDelay.toFixed(1)}ms</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-700/30 p-4 bg-gray-800/20">
            <div className="text-xs text-gray-400 space-y-1">
              <p className="flex items-center space-x-2">
                <Keyboard className="h-3 w-3" />
                <span>Toggle Test Mode and click buttons to test</span>
              </p>
              <p className="flex items-center space-x-2">
                <MousePointer className="h-3 w-3" />
                <span>Response times &lt;100ms are optimal</span>
              </p>
              <p className="flex items-center space-x-2">
                <AlertCircle className="h-3 w-3" />
                <span>Yellow = slow response (&gt;100ms)</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-700/30 p-4 flex space-x-2">
            <button
              onClick={clearResults}
              className="flex-1 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-colors text-sm font-medium"
            >
              Clear Results
            </button>
            <button
              onClick={() => {
                const report = {
                  timestamp: new Date().toISOString(),
                  totalButtons: getTotalButtons(),
                  testedButtons: getTestedButtons(),
                  averageResponseTime: getAverageResponseTime(),
                  slowButtons: getSlowButtons(),
                  results: testResults
                };
                console.log('UI Test Report:', report);
                navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                alert('Test report copied to clipboard!');
              }}
              className="flex-1 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-sm font-medium"
            >
              Export Report
            </button>
          </div>
        </div>
      )}

      {/* Test Mode Indicator */}
      {testMode && (
        <div className="fixed top-4 right-4 z-50 bg-purple-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-purple-500/50 shadow-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <TestTube className="h-4 w-4" />
            <span className="text-sm font-bold">UI Test Mode Active</span>
          </div>
        </div>
      )}

      {/* Click Feedback */}
      {testMode && currentTest && (
        <div className="fixed top-16 right-4 z-50 bg-green-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-green-500/50 shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">
              Tested: <strong>{currentTest}</strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
