import { useState } from 'react';
import { Brain, Zap, TrendingUp, Database, Cloud, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AIModel } from '../engine/AIDetectionEngine';

interface AIDetectionPanelProps {
  models: AIModel[];
  onUpdateModel: (modelId: string) => void;
  onToggleModel: (modelId: string, enabled: boolean) => void;
}

export function AIDetectionPanel({ models, onUpdateModel, onToggleModel }: AIDetectionPanelProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{ [key: string]: 'updating' | 'success' | 'error' }>({});

  const handleUpdateModel = async (modelId: string) => {
    setUpdateStatus(prev => ({ ...prev, [modelId]: 'updating' }));
    
    try {
      await onUpdateModel(modelId);
      setUpdateStatus(prev => ({ ...prev, [modelId]: 'success' }));
      setTimeout(() => {
        setUpdateStatus(prev => {
          const { [modelId]: _removed, ...rest } = prev;
          return rest;
        });
      }, 3000);
    } catch (error) {
      setUpdateStatus(prev => ({ ...prev, [modelId]: 'error' }));
      setTimeout(() => {
        setUpdateStatus(prev => {
          const { [modelId]: _removed, ...rest } = prev;
          return rest;
        });
      }, 3000);
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'classification': return Brain;
      case 'anomaly': return TrendingUp;
      case 'nlp': return Database;
      case 'vision': return Zap;
      default: return Brain;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.95) return 'text-green-400';
    if (accuracy >= 0.90) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getUpdateStatusIcon = (status: 'updating' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'updating': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-red-500/30 backdrop-blur-sm">
      <div className="p-6 border-b border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/30 rounded-xl">
              <Brain className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Detection Models</h2>
              <p className="text-sm text-gray-400">Machine learning powered threat detection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">AI Active</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {models.map((model) => {
            const IconComponent = getModelIcon(model.type);
            const status = updateStatus[model.id];
            
            return (
              <div
                key={model.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-900/30 rounded-lg">
                      <IconComponent className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{model.name}</h3>
                      <p className="text-xs text-gray-400">v{model.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {model.local ? (
                      <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        Local
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-purple-900/20 text-purple-400 text-xs rounded-full border border-purple-500/30 flex items-center space-x-1">
                        <Cloud className="h-3 w-3" />
                        <span>Cloud</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Accuracy:</span>
                    <span className={`text-sm font-medium ${getAccuracyColor(model.accuracy)}`}>
                      {Math.round(model.accuracy * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Type:</span>
                    <span className="text-sm text-white capitalize">{model.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last Updated:</span>
                    <span className="text-sm text-gray-300">
                      {model.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateModel(model.id);
                    }}
                    disabled={status === 'updating'}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50"
                  >
                    {getUpdateStatusIcon(status) || <Zap className="h-4 w-4" />}
                    <span className="text-sm">
                      {status === 'updating' ? 'Updating...' : 'Update'}
                    </span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Enabled:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleModel(model.id, !model.local); // Simplified toggle logic
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        model.local ? 'bg-red-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          model.local ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model Details Modal */}
        {selectedModel && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl max-w-2xl w-full mx-4 border border-red-500/30">
              <div className="p-6 border-b border-red-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{selectedModel.name}</h3>
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Model Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white">{selectedModel.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{selectedModel.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deployment:</span>
                        <span className="text-white">{selectedModel.local ? 'Local' : 'Cloud'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className={getAccuracyColor(selectedModel.accuracy)}>
                          {Math.round(selectedModel.accuracy * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-3">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">False Positives:</span>
                        <span className="text-green-400">0.02%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Detection Rate:</span>
                        <span className="text-green-400">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Processing:</span>
                        <span className="text-white">45ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory Usage:</span>
                        <span className="text-white">128MB</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-3">Capabilities</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Real-time scanning</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Behavioral analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Zero-day detection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Polymorphic malware</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Statistics */}
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4">AI Detection Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">94.2%</div>
              <div className="text-sm text-gray-400">Overall Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">1,247</div>
              <div className="text-sm text-gray-400">Threats Detected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">0.02%</div>
              <div className="text-sm text-gray-400">False Positive Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">45ms</div>
              <div className="text-sm text-gray-400">Avg. Detection Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}