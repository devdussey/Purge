import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

type OllamaModule = typeof import('ollama');
type OllamaConstructor = OllamaModule['Ollama'];
type OllamaClient = InstanceType<OllamaConstructor>;
type OllamaListResponse = Awaited<ReturnType<OllamaClient['list']>>;

// Dynamic import for Ollama to avoid browser compatibility issues
let OllamaCtor: OllamaConstructor | null = null;
if (typeof window === 'undefined' || window.electronAPI) {
  // Only import Ollama in Node.js/Electron environment
  import('ollama')
    .then(module => {
      OllamaCtor = module.Ollama;
    })
    .catch(() => {
      console.warn('Ollama not available');
    });
}

export type AIProvider = 'ollama' | 'openai' | 'claude';

export interface AIConfig {
  provider: AIProvider;
  useLocal: boolean;
  openaiApiKey?: string;
  claudeApiKey?: string;
  ollamaModel?: string;
  ollamaBaseUrl?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ThreatAnalysis {
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  technicalDetails: string;
  confidence: number;
}

export class AIService {
  private config: AIConfig;
  private openai?: OpenAI;
  private claude?: Anthropic;
  private ollama?: OllamaClient;

  constructor(config: AIConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Ollama (local)
    if (this.config.useLocal && OllamaCtor) {
      this.ollama = new OllamaCtor({
        host: this.config.ollamaBaseUrl || 'http://localhost:11434',
      });
    } else {
      this.ollama = undefined;
    }

    // Initialize OpenAI
    if (this.config.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: this.config.openaiApiKey,
        dangerouslyAllowBrowser: true // Only for demo - should use backend in production
      });
    }

    // Initialize Claude
    if (this.config.claudeApiKey) {
      this.claude = new Anthropic({
        apiKey: this.config.claudeApiKey,
        dangerouslyAllowBrowser: true // Only for demo - should use backend in production
      });
    }
  }

  updateConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
    this.initializeProviders();
  }

  async chat(messages: AIMessage[]): Promise<string> {
    if (this.config.useLocal && this.ollama) {
      return this.chatWithOllama(messages);
    } else if (this.config.provider === 'claude' && this.claude) {
      return this.chatWithClaude(messages);
    } else if (this.config.provider === 'openai' && this.openai) {
      return this.chatWithOpenAI(messages);
    }

    throw new Error('No AI provider configured');
  }

  private async chatWithOllama(messages: AIMessage[]): Promise<string> {
    if (!this.ollama) throw new Error('Ollama not initialized');

    const response = await this.ollama.chat({
      model: this.config.ollamaModel || 'llama3.2',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    return response.message.content;
  }

  private async chatWithClaude(messages: AIMessage[]): Promise<string> {
    if (!this.claude) throw new Error('Claude not initialized');

    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await this.claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemMessage?.content || 'You are a helpful security assistant for Purge Antivirus.',
      messages: chatMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  }

  private async chatWithOpenAI(messages: AIMessage[]): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not initialized');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map(m => ({
        role: m.role === 'system' ? 'system' : m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      max_tokens: 1024
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeThreat(threatData: {
    fileName: string;
    filePath: string;
    fileHash?: string;
    detectionType: string;
    signatures?: string[];
    behaviorFlags?: string[];
  }): Promise<ThreatAnalysis> {
    const systemPrompt = `You are a cybersecurity expert analyzing potential threats. Provide concise, actionable analysis.`;

    const userPrompt = `Analyze this potential threat:
File: ${threatData.fileName}
Path: ${threatData.filePath}
${threatData.fileHash ? `Hash: ${threatData.fileHash}` : ''}
Detection Type: ${threatData.detectionType}
${threatData.signatures ? `Signatures Matched: ${threatData.signatures.join(', ')}` : ''}
${threatData.behaviorFlags ? `Behavioral Flags: ${threatData.behaviorFlags.join(', ')}` : ''}

Provide:
1. Brief summary (2-3 sentences)
2. Severity level (low/medium/high/critical)
3. 2-3 key recommendations
4. Technical details (1 paragraph)
5. Confidence level (0-100%)

Format as JSON: {summary, severity, recommendations[], technicalDetails, confidence}`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(response);
        return {
          summary: parsed.summary || response,
          severity: parsed.severity || 'medium',
          recommendations: parsed.recommendations || ['Review the file manually', 'Consider quarantining'],
          technicalDetails: parsed.technicalDetails || 'Analysis pending',
          confidence: parsed.confidence || 75
        };
      } catch {
        // Fallback if not JSON
        return {
          summary: response,
          severity: 'medium',
          recommendations: ['Review the detection', 'Verify with multiple scanners'],
          technicalDetails: response,
          confidence: 70
        };
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        summary: 'AI analysis unavailable. Please configure an AI provider.',
        severity: 'medium',
        recommendations: ['Configure AI provider in settings', 'Review detection manually'],
        technicalDetails: 'AI service not configured or unavailable.',
        confidence: 0
      };
    }
  }

  async analyzeScanResults(results: {
    filesScanned: number;
    threatsFound: number;
    threats: Array<{ name: string; type: string; severity: string }>;
  }): Promise<string> {
    const systemPrompt = `You are a security advisor providing insights on antivirus scan results. Be concise and actionable.`;

    const userPrompt = `Scan results:
- Files scanned: ${results.filesScanned}
- Threats found: ${results.threatsFound}
${results.threats.length > 0 ? `\nThreats detected:\n${results.threats.map(t => `- ${t.name} (${t.type}, ${t.severity})`).join('\n')}` : ''}

Provide a brief analysis (3-4 sentences) with:
1. Overall system security status
2. Key concerns if any
3. Recommended next steps`;

    try {
      return await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return 'AI analysis unavailable. Configure an AI provider in settings to get intelligent insights.';
    }
  }

  async getSecurityRecommendations(systemData: {
    realtimeProtection: boolean;
    lastScanDate?: Date;
    definitionsUpToDate: boolean;
    quarantinedItems: number;
  }): Promise<string[]> {
    const systemPrompt = `You are a security advisor. Provide 3-5 specific, actionable security recommendations.`;

    const userPrompt = `System status:
- Real-time protection: ${systemData.realtimeProtection ? 'Enabled' : 'Disabled'}
- Last scan: ${systemData.lastScanDate ? systemData.lastScanDate.toLocaleDateString() : 'Never'}
- Definitions up to date: ${systemData.definitionsUpToDate ? 'Yes' : 'No'}
- Quarantined items: ${systemData.quarantinedItems}

Provide 3-5 specific security recommendations. Return as JSON array of strings.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Parse line by line
        return response.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
      }
    } catch (error) {
      console.error('AI recommendations failed:', error);
    }

    return [
      'Enable real-time protection for continuous monitoring',
      'Schedule regular full system scans',
      'Keep virus definitions updated',
      'Review and clean quarantined items regularly'
    ];
  }

  async isOllamaAvailable(): Promise<boolean> {
    if (!this.ollama) return false;

    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }

  async getAvailableOllamaModels(): Promise<string[]> {
    if (!this.ollama) return [];

    try {
      const response: OllamaListResponse = await this.ollama.list();
      return response.models.map(model => model.name);
    } catch {
      return [];
    }
  }
}
