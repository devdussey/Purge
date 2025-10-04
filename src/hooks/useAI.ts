import { useState, useEffect, useCallback } from 'react';
import { AIService, AIConfig, AIMessage, ThreatAnalysis } from '../services/AIService';

const DEFAULT_CONFIG: AIConfig = {
  provider: 'ollama',
  useLocal: true,
  ollamaModel: 'llama3.2',
  ollamaBaseUrl: 'http://localhost:11434'
};

export function useAI() {
  const [config, setConfig] = useState<AIConfig>(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('ai-config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [aiService] = useState(() => new AIService(config));
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);

  useEffect(() => {
    // Save config to localStorage
    localStorage.setItem('ai-config', JSON.stringify(config));
    aiService.updateConfig(config);
  }, [config, aiService]);

  useEffect(() => {
    // Check Ollama availability on mount
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = useCallback(async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.aiCheckOllama(config);
      setIsOllamaAvailable(result.available);

      if (result.available) {
        const modelsResult = await window.electronAPI.aiGetOllamaModels(config);
        setOllamaModels(modelsResult.models);
      }
    } else {
      // Browser mode - direct API call
      const available = await aiService.isOllamaAvailable();
      setIsOllamaAvailable(available);

      if (available) {
        const models = await aiService.getAvailableOllamaModels();
        setOllamaModels(models);
      }
    }
  }, [config, aiService]);

  const updateConfig = useCallback((updates: Partial<AIConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const chat = useCallback(async (messages: AIMessage[]): Promise<string> => {
    if (window.electronAPI) {
      const result = await window.electronAPI.aiChat(messages, config);
      if (!result.success) {
        throw new Error(result.error || 'AI chat failed');
      }
      return result.response || '';
    } else {
      // Browser mode
      return aiService.chat(messages);
    }
  }, [config, aiService]);

  const analyzeThreat = useCallback(async (threatData: {
    fileName: string;
    filePath: string;
    fileHash?: string;
    detectionType: string;
    signatures?: string[];
    behaviorFlags?: string[];
  }): Promise<ThreatAnalysis> => {
    if (window.electronAPI) {
      const result = await window.electronAPI.aiAnalyzeThreat(threatData, config);
      if (!result.success) {
        throw new Error(result.error || 'Threat analysis failed');
      }
      return result.analysis;
    } else {
      return aiService.analyzeThreat(threatData);
    }
  }, [config, aiService]);

  const analyzeScanResults = useCallback(async (results: {
    filesScanned: number;
    threatsFound: number;
    threats: Array<{ name: string; type: string; severity: string }>;
  }): Promise<string> => {
    if (window.electronAPI) {
      const result = await window.electronAPI.aiAnalyzeScan(results, config);
      if (!result.success) {
        throw new Error(result.error || 'Scan analysis failed');
      }
      return result.analysis || '';
    } else {
      return aiService.analyzeScanResults(results);
    }
  }, [config, aiService]);

  const getSecurityRecommendations = useCallback(async (systemData: {
    realtimeProtection: boolean;
    lastScanDate?: Date;
    definitionsUpToDate: boolean;
    quarantinedItems: number;
  }): Promise<string[]> => {
    if (window.electronAPI) {
      const result = await window.electronAPI.aiGetRecommendations(systemData, config);
      if (!result.success) {
        throw new Error(result.error || 'Recommendations failed');
      }
      return result.recommendations || [];
    } else {
      return aiService.getSecurityRecommendations(systemData);
    }
  }, [config, aiService]);

  return {
    config,
    updateConfig,
    isOllamaAvailable,
    ollamaModels,
    checkOllamaStatus,
    chat,
    analyzeThreat,
    analyzeScanResults,
    getSecurityRecommendations
  };
}
