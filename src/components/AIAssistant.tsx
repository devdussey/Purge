import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Lightbulb, Shield, AlertTriangle, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIAssistant({ isOpen, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI security assistant. I can help you with threat analysis, security questions, and explain detection results. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "What is this threat?",
        "How to improve security?",
        "Explain scan results",
        "Is this file safe?"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (input: string): { content: string; suggestions?: string[] } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('threat') || lowerInput.includes('malware') || lowerInput.includes('virus')) {
      return {
        content: "I can help you understand threats! Based on our detection engines, threats are classified by:\n\n• **Signature-based**: Known malware patterns\n• **Heuristic**: Suspicious behavior analysis\n• **AI-powered**: Machine learning classification\n• **Behavioral**: Real-time activity monitoring\n\nWould you like me to explain a specific detection or threat type?",
        suggestions: ["Explain ransomware", "What are false positives?", "How does AI detection work?"]
      };
    }

    if (lowerInput.includes('safe') || lowerInput.includes('clean')) {
      return {
        content: "To determine if a file is safe, our system uses multiple layers:\n\n🔍 **Multi-engine scanning**: Traditional signatures + AI analysis\n🧠 **Behavioral analysis**: Monitors actual file behavior\n🌐 **Threat intelligence**: Cloud-based reputation checking\n📊 **Statistical analysis**: Compares against known patterns\n\nFiles are considered safe when they pass all these checks with high confidence.",
        suggestions: ["Check specific file", "Explain quarantine", "What about unknown files?"]
      };
    }

    if (lowerInput.includes('scan') || lowerInput.includes('result')) {
      return {
        content: "Scan results show comprehensive security analysis:\n\n✅ **Clean**: No threats detected\n⚠️ **Suspicious**: Potential risk, needs review\n🚨 **Malicious**: Confirmed threat, quarantined\n🤖 **AI Detection**: Machine learning identified patterns\n\nEach result includes confidence scores, detection methods, and recommended actions. Need help interpreting specific results?",
        suggestions: ["Explain confidence scores", "What is quarantine?", "How to report false positive?"]
      };
    }

    if (lowerInput.includes('improve') || lowerInput.includes('security') || lowerInput.includes('protect')) {
      return {
        content: "Here are key security improvements:\n\n🛡️ **Enable real-time protection**: Continuous monitoring\n🔄 **Keep definitions updated**: Latest threat signatures\n⚡ **Use performance modes**: Gaming/Laptop optimization\n🔒 **Enable ransomware shield**: Advanced rollback protection\n📱 **Regular scans**: Schedule automatic scanning\n\nWould you like specific guidance on any of these areas?",
        suggestions: ["Setup ransomware protection", "Configure performance mode", "Schedule automatic scans"]
      };
    }

    if (lowerInput.includes('ransomware')) {
      return {
        content: "Ransomware protection includes:\n\n🛡️ **Real-time monitoring**: Detects mass file encryption\n📝 **File journaling**: Tracks all file changes\n🔄 **Automatic rollback**: Restore files from recent backups\n🌐 **Network isolation**: Blocks C2 communications\n⚡ **Behavioral analysis**: Identifies encryption patterns\n\nOur AI can detect ransomware within seconds and automatically protect your files!",
        suggestions: ["Enable ransomware shield", "Test rollback feature", "Configure network protection"]
      };
    }

    if (lowerInput.includes('false positive') || lowerInput.includes('wrong')) {
      return {
        content: "False positives happen when legitimate files are flagged as threats. Here's how to handle them:\n\n📝 **Report it**: Use our one-click false positive reporting\n🔍 **Review detection**: Check why the file was flagged\n✅ **Whitelist**: Add trusted files to exclusions\n🤖 **AI learning**: Our system learns from reports\n\nReporting helps improve detection accuracy for everyone!",
        suggestions: ["Report false positive", "Add file exclusion", "Understand detection reasons"]
      };
    }

    if (lowerInput.includes('ai') || lowerInput.includes('machine learning')) {
      return {
        content: "Our AI detection uses advanced machine learning:\n\n🧠 **Neural networks**: Deep learning for pattern recognition\n📊 **Behavioral analysis**: Monitors file and process behavior\n🔍 **Static analysis**: Examines file structure and code\n🌐 **Threat intelligence**: Cloud-based reputation data\n📈 **Continuous learning**: Improves from new threats\n\nAI detection achieves 94%+ accuracy with minimal false positives!",
        suggestions: ["View AI model status", "Understand confidence scores", "See detection features"]
      };
    }

    // Default response
    return {
      content: "I'm here to help with security questions! I can assist with:\n\n🔍 **Threat analysis**: Understanding detections and results\n🛡️ **Security advice**: Best practices and recommendations\n⚙️ **Feature guidance**: How to use antivirus features\n🤖 **AI explanations**: How our detection systems work\n\nWhat specific security topic would you like to explore?",
      suggestions: ["Analyze recent threats", "Security best practices", "Explain AI detection", "Performance optimization"]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-red-500/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <Bot className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Security Assistant</h3>
            {!isMinimized && (
              <p className="text-xs text-gray-400">Powered by Purge AI</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-400 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-red-600/20' 
                        : 'bg-gray-800/50'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-red-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.type === 'assistant' && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs text-blue-400 hover:text-blue-300 bg-gray-800/30 hover:bg-gray-800/50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Lightbulb className="h-3 w-3 inline mr-2" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-red-500/20">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about security, threats, or scan results..."
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}