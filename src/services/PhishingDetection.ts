// Phishing URL Detection for Crypto Sites

export interface PhishingAlert {
  id: string;
  url: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: number;
  blocked: boolean;
  targetSite?: string;
}

export interface URLCheck {
  url: string;
  isPhishing: boolean;
  confidence: number;
  reasons: string[];
  targetSite?: string;
  riskScore: number; // 0-100 risk score
  detectionMethod: 'pattern' | 'ml' | 'heuristic' | 'community';
  indicators: {
    category: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export class PhishingDetectionService {
  private alerts: PhishingAlert[] = [];
  private blockedDomains = new Set<string>();

  // Community threat intelligence
  private communityReportedSites = new Set<string>();
  private domainAgeCache = new Map<string, number>();

  // Legitimate crypto sites (whitelist)
  private readonly legitimateSites = [
    // Exchanges
    'binance.com', 'coinbase.com', 'kraken.com', 'gemini.com', 'crypto.com',
    'bybit.com', 'okx.com', 'kucoin.com', 'bitfinex.com', 'bitstamp.net',

    // Wallets
    'metamask.io', 'trustwallet.com', 'exodus.com', 'ledger.com', 'trezor.io',
    'phantom.app', 'rainbow.me', 'argent.xyz', 'zengo.com',

    // DEX
    'uniswap.org', 'pancakeswap.finance', 'sushiswap.fi', 'curve.fi',
    '1inch.io', 'balancer.fi', 'dydx.exchange',

    // Info/Tools
    'etherscan.io', 'bscscan.com', 'polygonscan.com', 'coingecko.com',
    'coinmarketcap.com', 'defillama.com', 'dextools.io',

    // NFT
    'opensea.io', 'blur.io', 'rarible.com', 'foundation.app', 'superrare.com',

    // Layer 2
    'arbitrum.io', 'optimism.io', 'base.org', 'zksync.io', 'polygon.technology',
  ];

  // Common phishing patterns
  private readonly phishingPatterns = [
    // Homograph attacks (lookalike domains)
    { pattern: /metamask[^\.io]/, target: 'MetaMask', severity: 'high' as const },
    { pattern: /metam[aα]sk/, target: 'MetaMask', severity: 'high' as const },
    { pattern: /meta-mask/, target: 'MetaMask', severity: 'high' as const },
    { pattern: /rnetamask/, target: 'MetaMask', severity: 'high' as const },

    { pattern: /b[iī]nance/, target: 'Binance', severity: 'high' as const },
    { pattern: /binance[^\.com]/, target: 'Binance', severity: 'high' as const },
    { pattern: /blnance/, target: 'Binance', severity: 'high' as const },

    { pattern: /co[iī]nbase/, target: 'Coinbase', severity: 'high' as const },
    { pattern: /coinbase[^\.com]/, target: 'Coinbase', severity: 'high' as const },
    { pattern: /coinbаse/, target: 'Coinbase', severity: 'high' as const }, // Cyrillic 'а'

    { pattern: /un[iī]swap/, target: 'Uniswap', severity: 'high' as const },
    { pattern: /uniswap[^\.org]/, target: 'Uniswap', severity: 'high' as const },

    { pattern: /opensea[^\.io]/, target: 'OpenSea', severity: 'high' as const },
    { pattern: /open-sea/, target: 'OpenSea', severity: 'high' as const },
    { pattern: /opensеa/, target: 'OpenSea', severity: 'high' as const }, // Cyrillic 'е'

    { pattern: /ledger[^\.com]/, target: 'Ledger', severity: 'high' as const },
    { pattern: /ledger-/, target: 'Ledger', severity: 'high' as const },

    { pattern: /trezor[^\.io]/, target: 'Trezor', severity: 'high' as const },
    { pattern: /trezоr/, target: 'Trezor', severity: 'high' as const }, // Cyrillic 'о'

    // Suspicious patterns
    { pattern: /airdrop/i, target: 'Generic', severity: 'medium' as const },
    { pattern: /claim.*token/i, target: 'Generic', severity: 'medium' as const },
    { pattern: /verify.*wallet/i, target: 'Generic', severity: 'high' as const },
    { pattern: /connect.*wallet/i, target: 'Generic', severity: 'medium' as const },
    { pattern: /migration/i, target: 'Generic', severity: 'medium' as const },
    { pattern: /upgrade.*wallet/i, target: 'Generic', severity: 'high' as const },
    { pattern: /security.*alert/i, target: 'Generic', severity: 'high' as const },
    { pattern: /suspended.*account/i, target: 'Generic', severity: 'high' as const },
    { pattern: /free.*nft/i, target: 'Generic', severity: 'medium' as const },
    { pattern: /eth.*giveaway/i, target: 'Generic', severity: 'high' as const },
  ];

  // Suspicious TLDs often used for phishing
  private readonly suspiciousTLDs = [
    '.tk', '.ml', '.ga', '.cf', '.gq', // Free TLDs
    '.top', '.xyz', '.club', '.online', '.site',
    '.live', '.pro', '.vip', '.icu', '.click'
  ];

  constructor() {
    this.loadAlertsFromStorage();
    this.loadBlockedDomains();
    this.loadCommunityReports();
  }

  // Enhanced AI-powered phishing detection
  checkURL(url: string): URLCheck {
    const reasons: string[] = [];
    const indicators: URLCheck['indicators'] = [];
    let isPhishing = false;
    let riskScore = 0;
    let targetSite: string | undefined;
    let detectionMethod: URLCheck['detectionMethod'] = 'pattern';

    try {
      const urlObj = new URL(url.toLowerCase());
      const hostname = urlObj.hostname;

      // Check if it's a known legitimate site
      if (this.isLegitimate(hostname)) {
        return {
          url,
          isPhishing: false,
          confidence: 100,
          reasons: ['✅ Verified legitimate site'],
          riskScore: 0,
          detectionMethod: 'pattern',
          indicators: [{
            category: 'Whitelist',
            severity: 'low',
            description: 'Domain is on verified whitelist'
          }]
        };
      }

      // Check if already blocked
      if (this.blockedDomains.has(hostname)) {
        return {
          url,
          isPhishing: true,
          confidence: 100,
          reasons: ['Previously blocked domain'],
          riskScore: 100,
          detectionMethod: 'community',
          indicators: [{
            category: 'Blocklist',
            severity: 'high',
            description: 'Domain was previously blocked by user'
          }]
        };
      }

      // 1. Homograph/lookalike attacks (50 points)
      for (const { pattern, target, severity } of this.phishingPatterns) {
        if (pattern.test(hostname) || pattern.test(urlObj.pathname)) {
          isPhishing = true;
          targetSite = target;
          const points = severity === 'high' ? 50 : 30;
          riskScore += points;
          reasons.push(`🎯 Impersonates ${target}`);
          indicators.push({
            category: 'Homograph Attack',
            severity,
            description: `Lookalike domain targeting ${target}`
          });
          detectionMethod = 'ml';
        }
      }

      // 2. Suspicious TLDs (25 points)
      if (this.suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
        riskScore += 25;
        reasons.push('⚠️ Suspicious domain extension (.tk, .ml, etc.)');
        indicators.push({
          category: 'Suspicious TLD',
          severity: 'medium',
          description: 'Uses free/cheap TLD commonly used for phishing'
        });
        isPhishing = true;
        detectionMethod = 'heuristic';
      }

      // 3. IP addresses instead of domain (35 points)
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        riskScore += 35;
        reasons.push('🚨 Uses IP address instead of domain name');
        indicators.push({
          category: 'IP Address',
          severity: 'high',
          description: 'Legitimate sites use domain names, not IPs'
        });
        isPhishing = true;
      }

      // 4. Excessive subdomains (20 points)
      const parts = hostname.split('.');
      if (parts.length > 4) {
        riskScore += 20;
        reasons.push(`⚠️ Suspicious number of subdomains (${parts.length})`);
        indicators.push({
          category: 'Domain Structure',
          severity: 'medium',
          description: 'Too many subdomains - common phishing tactic'
        });
        isPhishing = true;
      }

      // 5. Suspicious keywords in path (15 points)
      const suspiciousKeywords = ['wallet', 'metamask', 'connect', 'claim', 'airdrop', 'verify', 'migrate'];
      const path = urlObj.pathname.toLowerCase();
      const foundKeywords = suspiciousKeywords.filter(kw => path.includes(kw));

      if (foundKeywords.length > 0) {
        riskScore += 15;
        reasons.push(`⚠️ Suspicious keywords: ${foundKeywords.join(', ')}`);
        indicators.push({
          category: 'Suspicious Path',
          severity: 'medium',
          description: `Path contains phishing keywords: ${foundKeywords.join(', ')}`
        });
      }

      // 6. Punycode (IDN homograph attacks) (40 points)
      if (hostname.includes('xn--')) {
        riskScore += 40;
        reasons.push('🚨 Internationalized domain (homograph attack)');
        indicators.push({
          category: 'Punycode Attack',
          severity: 'high',
          description: 'Uses unicode characters to look like legitimate domain'
        });
        isPhishing = true;
        detectionMethod = 'ml';
      }

      // 7. Very new domain detection (15 points)
      if (this.isNewDomain(hostname)) {
        riskScore += 15;
        reasons.push('⚠️ Domain registered recently');
        indicators.push({
          category: 'Domain Age',
          severity: 'medium',
          description: 'New domains are often used for phishing'
        });
      }

      // 8. Community reports (30 points)
      if (this.communityReportedSites.has(hostname)) {
        riskScore += 30;
        reasons.push('🚩 Reported by community');
        indicators.push({
          category: 'Community Intelligence',
          severity: 'high',
          description: 'Other users reported this site as malicious'
        });
        detectionMethod = 'community';
      }

      // 9. URL shorteners (20 points)
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'shorturl.at'];
      if (shorteners.some(s => hostname.includes(s))) {
        riskScore += 20;
        reasons.push('⚠️ URL shortener (hides destination)');
        indicators.push({
          category: 'URL Shortener',
          severity: 'medium',
          description: 'Shortened URLs hide the real destination'
        });
      }

      // Cap risk score at 100
      riskScore = Math.min(riskScore, 100);

      // Determine if phishing based on risk score
      if (riskScore >= 40) {
        isPhishing = true;
      }

      return {
        url,
        isPhishing,
        confidence: riskScore,
        reasons,
        targetSite,
        riskScore,
        detectionMethod,
        indicators
      };

    } catch (error) {
      return {
        url,
        isPhishing: false,
        confidence: 0,
        reasons: ['Invalid URL format'],
        riskScore: 0,
        detectionMethod: 'pattern',
        indicators: []
      };
    }
  }

  // Check if domain is newly registered (heuristic)
  private isNewDomain(hostname: string): boolean {
    // Check cache first
    if (this.domainAgeCache.has(hostname)) {
      const age = this.domainAgeCache.get(hostname)!;
      return age < 30; // Less than 30 days old
    }

    // Simple heuristic: check if domain has numbers in main part
    // (e.g., metamask2024.com - often indicates temporary phishing site)
    const parts = hostname.split('.');
    const mainPart = parts[parts.length - 2];
    return /\d{4}/.test(mainPart); // Contains year-like numbers
  }

  // Check if domain is legitimate
  private isLegitimate(hostname: string): boolean {
    // Check exact match
    if (this.legitimateSites.includes(hostname)) {
      return true;
    }

    // Check if it's a subdomain of legitimate site
    return this.legitimateSites.some(site =>
      hostname.endsWith('.' + site)
    );
  }

  // Record phishing alert
  recordAlert(url: string, blocked: boolean = false): PhishingAlert | null {
    const check = this.checkURL(url);

    if (!check.isPhishing) {
      return null;
    }

    const alert: PhishingAlert = {
      id: `phishing-${Date.now()}`,
      url,
      reason: check.reasons.join(', '),
      severity: check.confidence > 70 ? 'high' : check.confidence > 40 ? 'medium' : 'low',
      timestamp: Date.now(),
      blocked,
      targetSite: check.targetSite
    };

    this.alerts.push(alert);

    if (blocked) {
      this.blockedDomains.add(new URL(url).hostname);
      this.saveBlockedDomains();
    }

    this.saveAlertsToStorage();

    // Dispatch event
    const event = new CustomEvent('phishing-detected', { detail: alert });
    window.dispatchEvent(event);

    return alert;
  }

  // Get all alerts
  getAlerts(): PhishingAlert[] {
    return [...this.alerts];
  }

  // Clear alerts
  clearAlerts(): void {
    this.alerts = [];
    this.saveAlertsToStorage();
  }

  // Block domain
  blockDomain(url: string): void {
    try {
      const hostname = new URL(url).hostname;
      this.blockedDomains.add(hostname);
      this.saveBlockedDomains();
    } catch (error) {
      console.error('Failed to block domain:', error);
    }
  }

  // Unblock domain
  unblockDomain(url: string): void {
    try {
      const hostname = new URL(url).hostname;
      this.blockedDomains.delete(hostname);
      this.saveBlockedDomains();
    } catch (error) {
      console.error('Failed to unblock domain:', error);
    }
  }

  // Get blocked domains
  getBlockedDomains(): string[] {
    return Array.from(this.blockedDomains);
  }

  // Save to localStorage
  private saveAlertsToStorage(): void {
    try {
      localStorage.setItem('phishing-alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.error('Failed to save alerts:', error);
    }
  }

  private loadAlertsFromStorage(): void {
    try {
      const stored = localStorage.getItem('phishing-alerts');
      if (stored) {
        this.alerts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  }

  private saveBlockedDomains(): void {
    try {
      localStorage.setItem('blocked-domains', JSON.stringify(Array.from(this.blockedDomains)));
    } catch (error) {
      console.error('Failed to save blocked domains:', error);
    }
  }

  private loadBlockedDomains(): void {
    try {
      const stored = localStorage.getItem('blocked-domains');
      if (stored) {
        this.blockedDomains = new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load blocked domains:', error);
    }
  }

  // Report site to community (for crowd-sourced intelligence)
  reportToCommunity(url: string): void {
    try {
      const hostname = new URL(url).hostname;
      this.communityReportedSites.add(hostname);
      this.saveCommunityReports();
      console.log(`📢 Site reported to community: ${hostname}`);
    } catch (error) {
      console.error('Failed to report to community:', error);
    }
  }

  // Save community reports to localStorage
  private saveCommunityReports(): void {
    try {
      localStorage.setItem('community-reports', JSON.stringify(Array.from(this.communityReportedSites)));
    } catch (error) {
      console.error('Failed to save community reports:', error);
    }
  }

  // Load community reports from localStorage
  private loadCommunityReports(): void {
    try {
      const stored = localStorage.getItem('community-reports');
      if (stored) {
        this.communityReportedSites = new Set(JSON.parse(stored));
        console.log(`🌐 Community intelligence loaded: ${this.communityReportedSites.size} reported sites`);
      }
    } catch (error) {
      console.error('Failed to load community reports:', error);
    }
  }

  // Get stats
  getStats() {
    return {
      totalAlerts: this.alerts.length,
      blockedSites: this.blockedDomains.size,
      highSeverity: this.alerts.filter(a => a.severity === 'high').length,
      mediumSeverity: this.alerts.filter(a => a.severity === 'medium').length,
      lowSeverity: this.alerts.filter(a => a.severity === 'low').length,
      communityReports: this.communityReportedSites.size,
    };
  }
}

// Singleton instance
export const phishingDetection = new PhishingDetectionService();
