import {useState} from 'react';
import { Bot, Key, Server, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAI } from '../hooks/useAI';

export function AISettings() {
  const { config, updateConfig, isOllamaAvailable, ollamaModels, checkOllamaStatus } = useAI();
  const [showKeys, setShowKeys] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckOllama = async () => {
    setIsChecking(true);
    await checkOllamaStatus();
    setIsChecking(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-700/30 backdrop-blur-sm p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Bot className="h-6 w-6 text-red-400" />
        <h2 className="text-2xl font-bold text-white">AI Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">AI Provider</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => updateConfig({ useLocal: true, provider: 'ollama' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                config.useLocal
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Server className="h-5 w-5 mx-auto mb-2" />
              <div className="text-sm font-medium">Ollama (Local)</div>
              <div className="text-xs opacity-70">Privacy-focused</div>
            </button>

            <button
              onClick={() => updateConfig({ useLocal: false, provider: 'openai' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                !config.useLocal && config.provider === 'openai'
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Bot className="h-5 w-5 mx-auto mb-2" />
              <div className="text-sm font-medium">OpenAI</div>
              <div className="text-xs opacity-70">GPT-4 models</div>
            </button>

            <button
              onClick={() => updateConfig({ useLocal: false, provider: 'claude' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                !config.useLocal && config.provider === 'claude'
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Bot className="h-5 w-5 mx-auto mb-2" />
              <div className="text-sm font-medium">Claude</div>
              <div className="text-xs opacity-70">Anthropic AI</div>
            </button>
          </div>
        </div>

        {/* Ollama Settings */}
        {config.useLocal && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ollama Status</label>
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="flex items-center space-x-3">
                  {isOllamaAvailable ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-red-400">Not Available</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleCheckOllama}
                  disabled={isChecking}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {!isOllamaAvailable && (
                <p className="text-sm text-gray-400 mt-2">
                  Install Ollama from{' '}
                  <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                    ollama.ai
                  </a>{' '}
                  and run: <code className="bg-gray-800 px-2 py-1 rounded">ollama pull llama3.2</code>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ollama Base URL</label>
              <input
                type="text"
                value={config.ollamaBaseUrl || 'http://localhost:11434'}
                onChange={(e) => updateConfig({ ollamaBaseUrl: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="http://localhost:11434"
              />
            </div>

            {ollamaModels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <select
                  value={config.ollamaModel || 'llama3.2'}
                  onChange={(e) => updateConfig({ ollamaModel: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {ollamaModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* OpenAI Settings */}
        {!config.useLocal && config.provider === 'openai' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              OpenAI API Key
            </label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={config.openaiApiKey || ''}
              onChange={(e) => updateConfig({ openaiApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="sk-..."
            />
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs text-gray-400 hover:text-white mt-2"
            >
              {showKeys ? 'Hide' : 'Show'} API Key
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Get your API key from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                platform.openai.com
              </a>
            </p>
          </div>
        )}

        {/* Claude Settings */}
        {!config.useLocal && config.provider === 'claude' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              Claude API Key
            </label>
            <input
              type={showKeys ? 'text' : 'password'}
              value={config.claudeApiKey || ''}
              onChange={(e) => updateConfig({ claudeApiKey: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="sk-ant-..."
            />
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="text-xs text-gray-400 hover:text-white mt-2"
            >
              {showKeys ? 'Hide' : 'Show'} API Key
            </button>
            <p className="text-sm text-gray-400 mt-2">
              Get your API key from{' '}
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                console.anthropic.com
              </a>
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-blue-400 font-medium mb-2">AI Features</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Real-time threat analysis and explanations</li>
            <li>• Intelligent scan result insights</li>
            <li>• Security recommendations tailored to your system</li>
            <li>• Interactive security assistant chat</li>
            <li>• Behavioral pattern detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
