import { EventEmitter } from 'events';
import { createHash } from 'crypto';

export interface DetectionRule {
  id: string;
  name: string;
  type: 'signature' | 'heuristic' | 'behavior';
  pattern: string | RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  version: string;
  metadata: {
    author: string;
    description: string;
    references?: string[];
    tags: string[];
  };
}

export interface ScanResult {
  filePath: string;
  hash: string;
  detections: Detection[];
  scanTime: number;
  fileSize: number;
}

export interface Detection {
  ruleId: string;
  ruleName: string;
  type: string;
  severity: string;
  confidence: number;
  metadata: any;
}

export interface ScanCache {
  hash: string;
  timestamp: number;
  size: number;
  lastScanResult: ScanResult | null;
}

export class DetectionEngine extends EventEmitter {
  private rules: Map<string, DetectionRule> = new Map();
  private scanCache: Map<string, ScanCache> = new Map();
  private behaviorWatchdog: BehaviorWatchdog;
  private isScanning = false;

  constructor() {
    super();
    this.behaviorWatchdog = new BehaviorWatchdog();
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    // YARA-style signature rules
    const signatureRules: DetectionRule[] = [
      {
        id: 'sig_001',
        name: 'Generic Trojan Pattern',
        type: 'signature',
        pattern: /\x4D\x5A.{58}\x50\x45\x00\x00/,
        severity: 'high',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects common trojan executable patterns',
          tags: ['trojan', 'malware', 'executable']
        }
      },
      {
        id: 'sig_002',
        name: 'Ransomware File Extension Pattern',
        type: 'signature',
        pattern: /\.(locked|encrypted|crypto|vault|secure)$/i,
        severity: 'critical',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects common ransomware file extensions',
          tags: ['ransomware', 'encryption', 'file-extension']
        }
      }
    ];

    // Heuristic rules
    const heuristicRules: DetectionRule[] = [
      {
        id: 'heur_001',
        name: 'Suspicious Executable Size',
        type: 'heuristic',
        pattern: 'size_anomaly',
        severity: 'medium',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects executables with suspicious sizes',
          tags: ['heuristic', 'size', 'executable']
        }
      }
    ];

    // Behavior rules
    const behaviorRules: DetectionRule[] = [
      {
        id: 'behav_001',
        name: 'Process Injection Detection',
        type: 'behavior',
        pattern: 'process_injection',
        severity: 'high',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects process injection techniques',
          tags: ['behavior', 'injection', 'process']
        }
      },
      {
        id: 'behav_002',
        name: 'LOLBins Abuse',
        type: 'behavior',
        pattern: 'lolbins_abuse',
        severity: 'high',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects abuse of Living Off The Land binaries',
          tags: ['behavior', 'lolbins', 'abuse']
        }
      },
      {
        id: 'behav_003',
        name: 'Registry Persistence',
        type: 'behavior',
        pattern: 'registry_persistence',
        severity: 'medium',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects registry-based persistence mechanisms',
          tags: ['behavior', 'persistence', 'registry']
        }
      },
      {
        id: 'behav_004',
        name: 'Suspicious Network Beacon',
        type: 'behavior',
        pattern: 'network_beacon',
        severity: 'high',
        enabled: true,
        version: '1.0',
        metadata: {
          author: 'Purge Security Team',
          description: 'Detects suspicious network beaconing patterns',
          tags: ['behavior', 'network', 'beacon', 'c2']
        }
      }
    ];

    [...signatureRules, ...heuristicRules, ...behaviorRules].forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  async scanFile(filePath: string, fileBuffer: Buffer): Promise<ScanResult> {
    const startTime = Date.now();
    const hash = createHash('sha256').update(fileBuffer).digest('hex');
    const fileSize = fileBuffer.length;

    // Check cache first
    const cached = this.scanCache.get(hash);
    if (cached && cached.lastScanResult) {
      this.emit('scan-progress', { filePath, status: 'cached' });
      return cached.lastScanResult;
    }

    const detections: Detection[] = [];

    // Run signature detection
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      try {
        const detection = await this.runRule(rule, filePath, fileBuffer);
        if (detection) {
          detections.push(detection);
        }
      } catch (error) {
        console.error(`Error running rule ${rule.id}:`, error);
      }
    }

    const scanTime = Date.now() - startTime;
    const result: ScanResult = {
      filePath,
      hash,
      detections,
      scanTime,
      fileSize
    };

    // Update cache
    this.scanCache.set(hash, {
      hash,
      timestamp: Date.now(),
      size: fileSize,
      lastScanResult: result
    });

    this.emit('scan-complete', result);
    return result;
  }

  private async runRule(rule: DetectionRule, filePath: string, fileBuffer: Buffer): Promise<Detection | null> {
    switch (rule.type) {
      case 'signature':
        return this.runSignatureRule(rule, filePath, fileBuffer);
      case 'heuristic':
        return this.runHeuristicRule(rule, filePath, fileBuffer);
      case 'behavior':
        return this.runBehaviorRule(rule, filePath, fileBuffer);
      default:
        return null;
    }
  }

  private runSignatureRule(rule: DetectionRule, filePath: string, fileBuffer: Buffer): Detection | null {
    const pattern = rule.pattern as RegExp;
    
    if (pattern instanceof RegExp) {
      const match = pattern.test(fileBuffer.toString('binary'));
      if (match) {
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          type: rule.type,
          severity: rule.severity,
          confidence: 0.9,
          metadata: { ...rule.metadata, filePath }
        };
      }
    }

    return null;
  }

  private runHeuristicRule(rule: DetectionRule, filePath: string, fileBuffer: Buffer): Detection | null {
    const pattern = rule.pattern as string;

    switch (pattern) {
      case 'size_anomaly':
        // Detect suspiciously small executables
        if (filePath.endsWith('.exe') && fileBuffer.length < 1024) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            type: rule.type,
            severity: rule.severity,
            confidence: 0.7,
            metadata: { ...rule.metadata, fileSize: fileBuffer.length }
          };
        }
        break;
    }

    return null;
  }

  private runBehaviorRule(rule: DetectionRule, filePath: string, fileBuffer: Buffer): Detection | null {
    // Behavior rules would typically monitor system events
    // For now, we'll simulate based on file characteristics
    const pattern = rule.pattern as string;

    switch (pattern) {
      case 'process_injection':
        // Check for common injection APIs in imports
        if (fileBuffer.includes(Buffer.from('CreateRemoteThread', 'ascii')) ||
            fileBuffer.includes(Buffer.from('WriteProcessMemory', 'ascii'))) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            type: rule.type,
            severity: rule.severity,
            confidence: 0.8,
            metadata: { ...rule.metadata, technique: 'dll_injection' }
          };
        }
        break;

      case 'lolbins_abuse':
        // Check for suspicious LOLBins usage patterns
        const lolbins = ['powershell.exe', 'cmd.exe', 'wscript.exe', 'cscript.exe', 'mshta.exe'];
        const fileName = filePath.toLowerCase();
        if (lolbins.some(lolbin => fileName.includes(lolbin))) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            type: rule.type,
            severity: rule.severity,
            confidence: 0.6,
            metadata: { ...rule.metadata, binary: fileName }
          };
        }
        break;
    }

    return null;
  }

  loadRules(rules: DetectionRule[]) {
    rules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
    this.emit('rules-updated', rules.length);
  }

  disableRule(ruleId: string) {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = false;
      this.emit('rule-disabled', ruleId);
    }
  }

  enableRule(ruleId: string) {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = true;
      this.emit('rule-enabled', ruleId);
    }
  }

  getRules(): DetectionRule[] {
    return Array.from(this.rules.values());
  }

  clearCache() {
    this.scanCache.clear();
    this.emit('cache-cleared');
  }
}

class BehaviorWatchdog extends EventEmitter {
  private patterns: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializePatterns();
  }

  private initializePatterns() {
    // Ransomware detection patterns
    this.patterns.set('mass_file_encryption', {
      threshold: 10,
      timeWindow: 60000, // 1 minute
      extensions: ['.encrypted', '.locked', '.crypto']
    });

    // Process injection patterns
    this.patterns.set('process_injection', {
      apis: ['CreateRemoteThread', 'WriteProcessMemory', 'VirtualAllocEx']
    });
  }

  detectRansomware(fileOperations: any[]) {
    const pattern = this.patterns.get('mass_file_encryption');
    const recentOps = fileOperations.filter(op => 
      Date.now() - op.timestamp < pattern.timeWindow
    );

    if (recentOps.length >= pattern.threshold) {
      this.emit('ransomware-detected', {
        type: 'mass_encryption',
        operations: recentOps,
        confidence: 0.9
      });
    }
  }
}