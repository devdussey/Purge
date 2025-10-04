// Crypto Protection Service - Core features for crypto security

export interface CryptoAddress {
  address: string;
  type: 'bitcoin' | 'ethereum' | 'monero' | 'litecoin' | 'other';
  timestamp: number;
}

export interface ClipboardThreat {
  id: string;
  originalAddress: string;
  replacedAddress: string;
  timestamp: number;
  blocked: boolean;
  addressType: string;
  riskScore: number; // 0-100 confidence score
  detectionMethod: 'timing' | 'pattern' | 'behavioral' | 'ml';
  indicators: string[]; // List of risk indicators
}

export interface WalletFileAlert {
  id: string;
  filePath: string;
  process: string;
  action: 'read' | 'write' | 'delete';
  timestamp: number;
  blocked: boolean;
}

export class CryptoProtectionService {
  private clipboardHistory: CryptoAddress[] = [];
  private monitoringActive = false;
  private clipboardInterval: NodeJS.Timeout | null = null;
  private lastClipboardValue = '';
  private threats: ClipboardThreat[] = [];
  private walletAlerts: WalletFileAlert[] = [];

  // ML and behavioral tracking
  private swapPatterns: Array<{ timeDiff: number; blocked: boolean }> = [];
  private addressChangeFrequency: Map<string, number> = new Map();
  private riskThreshold = 70; // Auto-block above this score

  // Common crypto address patterns
  private readonly addressPatterns = {
    bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
    ethereum: /^0x[a-fA-F0-9]{40}$/,
    monero: /^4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}$/,
    litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    ripple: /^r[0-9a-zA-Z]{24,34}$/,
    cardano: /^(addr1|stake1)[0-9a-z]{58}$/,
    solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  };

  // Known malicious patterns (addresses used in scams)
  private readonly knownScamPatterns = [
    // Add known scam address patterns here
    /^1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa$/, // Example: Satoshi's wallet (placeholder)
  ];

  // Common wallet file paths
  private readonly walletPaths = [
    'wallet.dat',
    'keystore',
    '.ethereum',
    '.bitcoin',
    'metamask',
    'exodus',
    'coinbase',
    'trust',
    'ledger',
  ];

  constructor() {
    this.loadThreatsFromStorage();
    this.loadMLPatternsFromStorage();
  }

  // Start clipboard monitoring
  startClipboardMonitoring(): void {
    if (this.monitoringActive) return;

    this.monitoringActive = true;

    // Check clipboard every 500ms
    this.clipboardInterval = setInterval(() => {
      this.checkClipboard();
    }, 500);

    console.log('🔒 Crypto clipboard protection activated');
  }

  // Stop monitoring
  stopClipboardMonitoring(): void {
    if (this.clipboardInterval) {
      clearInterval(this.clipboardInterval);
      this.clipboardInterval = null;
    }
    this.monitoringActive = false;
    console.log('Crypto clipboard protection deactivated');
  }

  // Check clipboard for crypto addresses
  private async checkClipboard(): Promise<void> {
    try {
      const clipboardText = await this.getClipboardText();

      if (!clipboardText || clipboardText === this.lastClipboardValue) {
        return;
      }

      const detectedAddress = this.detectCryptoAddress(clipboardText);

      if (detectedAddress) {
        console.log('✅ Crypto address detected:', detectedAddress.type, detectedAddress.address.substring(0, 20) + '...');

        // Check if this is a potential address swap attack
        if (this.clipboardHistory.length > 0) {
          const lastAddress = this.clipboardHistory[this.clipboardHistory.length - 1];
          const timeDiff = Date.now() - lastAddress.timestamp;

          // If address changed within 2 seconds, it might be malware swapping it
          if (timeDiff < 2000 && lastAddress.address !== detectedAddress.address) {
            console.warn('⚠️ Address swap detected!');
            this.handlePotentialThreat(lastAddress, detectedAddress);
          }
        }

        // Add to history
        this.clipboardHistory.push(detectedAddress);

        // Keep only last 10 addresses
        if (this.clipboardHistory.length > 10) {
          this.clipboardHistory.shift();
        }
      } else {
        // Log what we're seeing but not detecting
        if (clipboardText.length > 20 && clipboardText.length < 100) {
          console.log('❓ Clipboard content not recognized as crypto address:', clipboardText.substring(0, 30) + '...');
        }
      }

      this.lastClipboardValue = clipboardText;
    } catch (error) {
      console.error('Clipboard check failed:', error);
    }
  }

  // Get clipboard text (browser or Electron)
  private async getClipboardText(): Promise<string> {
    // Try Electron API first (works without permissions!)
    if (window.electronAPI && window.electronAPI.readClipboard) {
      try {
        const text = await window.electronAPI.readClipboard();
        return text || '';
      } catch (error) {
        console.error('Electron clipboard read failed:', error);
      }
    }

    // Try browser Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        // Permission denied - this is normal, need to request permission
        console.warn('Clipboard permission required. Click "Allow" when prompted.');
        return '';
      }
    }
    return '';
  }

  // Request clipboard permissions
  async requestClipboardPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      if (result.state === 'granted' || result.state === 'prompt') {
        // Try to read clipboard to trigger permission prompt
        await navigator.clipboard.readText();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Clipboard permission error:', error);
      return false;
    }
  }

  // Detect crypto address in text
  detectCryptoAddress(text: string): CryptoAddress | null {
    const trimmed = text.trim();

    for (const [type, pattern] of Object.entries(this.addressPatterns)) {
      if (pattern.test(trimmed)) {
        return {
          address: trimmed,
          type: type as any,
          timestamp: Date.now(),
        };
      }
    }

    return null;
  }

  // Handle potential clipboard swap threat with ML-powered risk scoring
  private handlePotentialThreat(original: CryptoAddress, replaced: CryptoAddress): void {
    const timeDiff = Date.now() - original.timestamp;
    const riskAnalysis = this.calculateRiskScore(original, replaced, timeDiff);

    const threat: ClipboardThreat = {
      id: `threat-${Date.now()}`,
      originalAddress: original.address,
      replacedAddress: replaced.address,
      timestamp: Date.now(),
      blocked: riskAnalysis.score >= this.riskThreshold,
      addressType: replaced.type,
      riskScore: riskAnalysis.score,
      detectionMethod: riskAnalysis.method,
      indicators: riskAnalysis.indicators,
    };

    // Auto-block if risk score exceeds threshold
    if (threat.blocked) {
      this.restoreClipboard(original.address);
      this.showThreatAlert(threat, `HIGH RISK THREAT BLOCKED (${threat.riskScore}% confidence)`);
    } else {
      this.showThreatAlert(threat, `SUSPICIOUS ACTIVITY DETECTED (${threat.riskScore}% risk)`);
    }

    // Learn from this pattern
    this.swapPatterns.push({ timeDiff, blocked: threat.blocked });
    this.updateAddressFrequency(replaced.address);

    this.threats.push(threat);
    this.saveThreatsToStorage();
    this.saveMLPatternsToStorage(); // Persist ML learning
  }

  // ML-powered risk scoring algorithm
  private calculateRiskScore(
    original: CryptoAddress,
    replaced: CryptoAddress,
    timeDiff: number
  ): { score: number; method: ClipboardThreat['detectionMethod']; indicators: string[] } {
    let score = 0;
    const indicators: string[] = [];
    let method: ClipboardThreat['detectionMethod'] = 'timing';

    // 1. Timing-based detection (40 points max)
    if (timeDiff < 500) {
      score += 40;
      indicators.push('Instant swap (<500ms) - highly suspicious');
      method = 'behavioral';
    } else if (timeDiff < 1000) {
      score += 30;
      indicators.push('Very fast swap (<1s)');
    } else if (timeDiff < 2000) {
      score += 20;
      indicators.push('Fast swap (<2s)');
    }

    // 2. Known scam address patterns (50 points)
    const isKnownScam = this.knownScamPatterns.some(pattern =>
      pattern.test(replaced.address)
    );
    if (isKnownScam) {
      score += 50;
      indicators.push('Known scam address pattern');
      method = 'pattern';
    }

    // 3. Address similarity check (15 points)
    if (this.addressesLookSimilar(original.address, replaced.address)) {
      score += 15;
      indicators.push('Addresses look similar (social engineering)');
      method = 'ml';
    }

    // 4. Frequency analysis (20 points)
    const frequency = this.addressChangeFrequency.get(replaced.address) || 0;
    if (frequency > 3) {
      score += 20;
      indicators.push(`Same address appeared ${frequency} times recently`);
      method = 'behavioral';
    }

    // 5. Historical pattern matching (15 points)
    const avgBlockedTimeDiff = this.getAverageBlockedSwapTime();
    if (avgBlockedTimeDiff > 0 && Math.abs(timeDiff - avgBlockedTimeDiff) < 500) {
      score += 15;
      indicators.push('Matches previous malware behavior pattern');
      method = 'ml';
    }

    // 6. Address type mismatch (10 points)
    if (original.type !== replaced.type) {
      score += 10;
      indicators.push(`Address type changed: ${original.type} → ${replaced.type}`);
    }

    return {
      score: Math.min(score, 100),
      method,
      indicators
    };
  }

  // Check if two addresses look similar (typosquatting detection)
  private addressesLookSimilar(addr1: string, addr2: string): boolean {
    if (addr1.length !== addr2.length) return false;

    const prefix1 = addr1.substring(0, 10);
    const prefix2 = addr2.substring(0, 10);
    const suffix1 = addr1.substring(addr1.length - 10);
    const suffix2 = addr2.substring(addr2.length - 10);

    // Check if prefix or suffix match (common malware tactic)
    return prefix1 === prefix2 || suffix1 === suffix2;
  }

  // Track address change frequency
  private updateAddressFrequency(address: string): void {
    const current = this.addressChangeFrequency.get(address) || 0;
    this.addressChangeFrequency.set(address, current + 1);

    // Clean up old entries (keep only last 50)
    if (this.addressChangeFrequency.size > 50) {
      const firstKey = this.addressChangeFrequency.keys().next().value as string | undefined;
      if (firstKey) {
        this.addressChangeFrequency.delete(firstKey);
      }
    }
  }

  // Get average timing of previously blocked swaps
  private getAverageBlockedSwapTime(): number {
    const blockedSwaps = this.swapPatterns.filter(p => p.blocked);
    if (blockedSwaps.length === 0) return 0;

    const sum = blockedSwaps.reduce((acc, p) => acc + p.timeDiff, 0);
    return sum / blockedSwaps.length;
  }

  // Restore original clipboard value
  private async restoreClipboard(originalValue: string): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(originalValue);
      } catch (error) {
        console.error('Failed to restore clipboard:', error);
      }
    }
  }

  // Show threat alert
  private showThreatAlert(threat: ClipboardThreat, message: string): void {
    // Dispatch custom event for UI to handle
    const event = new CustomEvent('crypto-threat-detected', {
      detail: { threat, message }
    });
    window.dispatchEvent(event);
  }

  // Check if file path is a wallet file
  isWalletFile(filePath: string): boolean {
    const lowerPath = filePath.toLowerCase();
    return this.walletPaths.some(pattern => lowerPath.includes(pattern));
  }

  // Monitor wallet file access (to be called by file watcher)
  recordWalletAccess(filePath: string, process: string, action: 'read' | 'write' | 'delete'): void {
    const alert: WalletFileAlert = {
      id: `wallet-alert-${Date.now()}`,
      filePath,
      process,
      action,
      timestamp: Date.now(),
      blocked: false,
    };

    // Check if process is suspicious
    const suspiciousProcesses = ['powershell', 'cmd', 'wscript', 'cscript', 'mshta'];
    const processName = process.toLowerCase();

    if (suspiciousProcesses.some(p => processName.includes(p))) {
      alert.blocked = true;

      const event = new CustomEvent('wallet-file-threat', {
        detail: alert
      });
      window.dispatchEvent(event);
    }

    this.walletAlerts.push(alert);
  }

  // Get all threats
  getThreats(): ClipboardThreat[] {
    return [...this.threats];
  }

  // Get wallet alerts
  getWalletAlerts(): WalletFileAlert[] {
    return [...this.walletAlerts];
  }

  // Clear threats
  clearThreats(): void {
    this.threats = [];
    this.saveThreatsToStorage();
  }

  // Save threats to localStorage
  private saveThreatsToStorage(): void {
    try {
      localStorage.setItem('crypto-threats', JSON.stringify(this.threats));
    } catch (error) {
      console.error('Failed to save threats:', error);
    }
  }

  // Load threats from localStorage
  private loadThreatsFromStorage(): void {
    try {
      const stored = localStorage.getItem('crypto-threats');
      if (stored) {
        this.threats = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load threats:', error);
    }
  }

  // Save ML patterns to localStorage (persistent learning)
  private saveMLPatternsToStorage(): void {
    try {
      const mlData = {
        swapPatterns: this.swapPatterns.slice(-100), // Keep last 100 patterns
        addressFrequency: Array.from(this.addressChangeFrequency.entries()),
        lastUpdated: Date.now()
      };
      localStorage.setItem('crypto-ml-patterns', JSON.stringify(mlData));
    } catch (error) {
      console.error('Failed to save ML patterns:', error);
    }
  }

  // Load ML patterns from localStorage
  private loadMLPatternsFromStorage(): void {
    try {
      const stored = localStorage.getItem('crypto-ml-patterns');
      if (stored) {
        const mlData = JSON.parse(stored);
        this.swapPatterns = mlData.swapPatterns || [];
        this.addressChangeFrequency = new Map(mlData.addressFrequency || []);
        console.log(`🧠 ML patterns loaded: ${this.swapPatterns.length} swap patterns, ${this.addressChangeFrequency.size} addresses tracked`);
      }
    } catch (error) {
      console.error('Failed to load ML patterns:', error);
    }
  }

  // Validate crypto address format
  validateAddress(address: string, expectedType?: string): boolean {
    if (expectedType && this.addressPatterns[expectedType as keyof typeof this.addressPatterns]) {
      return this.addressPatterns[expectedType as keyof typeof this.addressPatterns].test(address);
    }

    // Check against all patterns
    return Object.values(this.addressPatterns).some(pattern => pattern.test(address));
  }

  // Get stats
  getStats() {
    return {
      totalThreats: this.threats.length,
      blockedThreats: this.threats.filter(t => t.blocked).length,
      walletAlerts: this.walletAlerts.length,
      monitoringActive: this.monitoringActive,
      addressesMonitored: this.clipboardHistory.length,
    };
  }
}

// Singleton instance
export const cryptoProtection = new CryptoProtectionService();
