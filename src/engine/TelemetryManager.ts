import { EventEmitter } from 'events';

export interface TelemetryEvent {
  id: string;
  timestamp: Date;
  type: 'detection' | 'scan' | 'update' | 'error' | 'performance';
  data: any;
  sessionId: string;
}

export interface DetectionTelemetry {
  detectionType: string;
  ruleId: string;
  severity: string;
  confidence: number;
  fileHash: string; // Only hash, never file contents
  osVersion: string;
  cpuInfo: string;
  ramInfo: string;
  scanDuration: number;
  falsePositiveFlag?: boolean;
}

export interface PerformanceTelemetry {
  scanType: 'quick' | 'full' | 'custom';
  filesScanned: number;
  scanDuration: number;
  cpuUsage: number;
  memoryUsage: number;
  diskIoRate: number;
  batteryImpact?: number;
  thermalImpact?: number;
}

export interface TelemetryConfig {
  enabled: boolean;
  endpoint: string;
  batchSize: number;
  flushInterval: number;
  privacyBudget: number;
  backoffMultiplier: number;
  maxRetries: number;
}

export class TelemetryManager extends EventEmitter {
  private config: TelemetryConfig;
  private eventQueue: TelemetryEvent[] = [];
  private sessionId: string;
  private privacyBudgetUsed = 0;
  private backoffDelay = 1000;
  private retryCount = 0;

  constructor(config: TelemetryConfig) {
    super();
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.startPeriodicFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startPeriodicFlush() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.config.flushInterval);
  }

  recordDetection(detection: DetectionTelemetry) {
    if (!this.config.enabled || !this.canRecordEvent()) {
      return;
    }

    const event: TelemetryEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'detection',
      data: {
        ...detection,
        // Ensure no sensitive data is included
        fileHash: detection.fileHash, // Only hash, never file path or contents
        osVersion: this.sanitizeOsVersion(detection.osVersion),
        cpuInfo: this.sanitizeCpuInfo(detection.cpuInfo),
        ramInfo: this.sanitizeRamInfo(detection.ramInfo)
      },
      sessionId: this.sessionId
    };

    this.queueEvent(event);
    this.privacyBudgetUsed++;
  }

  recordPerformance(performance: PerformanceTelemetry) {
    if (!this.config.enabled || !this.canRecordEvent()) {
      return;
    }

    const event: TelemetryEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'performance',
      data: performance,
      sessionId: this.sessionId
    };

    this.queueEvent(event);
    this.privacyBudgetUsed++;
  }

  recordError(error: Error, context?: any) {
    if (!this.config.enabled || !this.canRecordEvent()) {
      return;
    }

    const event: TelemetryEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'), // Limit stack trace
        context: this.sanitizeContext(context)
      },
      sessionId: this.sessionId
    };

    this.queueEvent(event);
    this.privacyBudgetUsed++;
  }

  recordFalsePositive(ruleId: string, fileHash: string, reason?: string) {
    if (!this.config.enabled || !this.canRecordEvent()) {
      return;
    }

    const event: TelemetryEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      type: 'detection',
      data: {
        detectionType: 'false_positive',
        ruleId,
        fileHash,
        reason: reason || 'user_reported',
        falsePositiveFlag: true
      },
      sessionId: this.sessionId
    };

    this.queueEvent(event);
    this.privacyBudgetUsed++;
  }

  private canRecordEvent(): boolean {
    return this.privacyBudgetUsed < this.config.privacyBudget;
  }

  private queueEvent(event: TelemetryEvent) {
    this.eventQueue.push(event);
    
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.sendEvents(eventsToSend);
      this.retryCount = 0;
      this.backoffDelay = 1000;
      this.emit('telemetry-sent', eventsToSend.length);
    } catch (error) {
      // Re-queue events for retry
      this.eventQueue.unshift(...eventsToSend);
      
      this.retryCount++;
      if (this.retryCount <= this.config.maxRetries) {
        this.backoffDelay *= this.config.backoffMultiplier;
        setTimeout(() => this.flushEvents(), this.backoffDelay);
      } else {
        // Drop events after max retries
        this.eventQueue = [];
        this.retryCount = 0;
        this.backoffDelay = 1000;
        this.emit('telemetry-dropped', eventsToSend.length);
      }
    }
  }

  private async sendEvents(events: TelemetryEvent[]) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Purge-Antivirus-Telemetry/1.0'
      },
      body: JSON.stringify({
        events,
        metadata: {
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Telemetry upload failed: ${response.status}`);
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeOsVersion(osVersion: string): string {
    // Remove potentially identifying information
    return osVersion.replace(/\d+\.\d+\.\d+\.\d+/, 'x.x.x.x');
  }

  private sanitizeCpuInfo(cpuInfo: string): string {
    // Keep only general CPU family information
    return cpuInfo.replace(/\d+(\.\d+)?GHz/g, 'X.XGHz');
  }

  private sanitizeRamInfo(ramInfo: string): string {
    // Round to nearest GB to reduce fingerprinting
    const match = ramInfo.match(/(\d+)GB/);
    if (match) {
      const gb = Math.round(parseInt(match[1]) / 4) * 4; // Round to nearest 4GB
      return `${gb}GB`;
    }
    return ramInfo;
  }

  private sanitizeContext(context: any): any {
    if (!context) return null;
    
    // Remove potentially sensitive information
    const sanitized = { ...context };
    delete sanitized.filePath;
    delete sanitized.fileName;
    delete sanitized.userPath;
    delete sanitized.username;
    
    return sanitized;
  }

  resetPrivacyBudget() {
    this.privacyBudgetUsed = 0;
    this.emit('privacy-budget-reset');
  }

  getStatus() {
    return {
      enabled: this.config.enabled,
      queueSize: this.eventQueue.length,
      privacyBudgetUsed: this.privacyBudgetUsed,
      privacyBudgetLimit: this.config.privacyBudget,
      sessionId: this.sessionId
    };
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
    if (!enabled) {
      this.eventQueue = []; // Clear queue when disabled
    }
    this.emit('telemetry-toggled', enabled);
  }
}