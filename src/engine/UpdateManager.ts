import { EventEmitter } from 'events';

export interface UpdateManifest {
  version: string;
  timestamp: string;
  components: {
    signatures: ComponentUpdate;
    engine: ComponentUpdate;
    rules: ComponentUpdate;
  };
  signature: string;
  rollbackVersion?: string;
}

export interface ComponentUpdate {
  version: string;
  url: string;
  hash: string;
  size: number;
  critical: boolean;
}

export interface UpdateConfig {
  updateServerUrl: string;
  publicKey: string;
  checkInterval: number;
  autoUpdate: boolean;
  allowBeta: boolean;
}

export class UpdateManager extends EventEmitter {
  private config: UpdateConfig;
  private currentVersion: string;
  private lastCheckTime: Date | null = null;
  private updateInProgress = false;

  constructor(config: UpdateConfig, currentVersion: string) {
    super();
    this.config = config;
    this.currentVersion = currentVersion;
    this.startPeriodicChecks();
  }

  private startPeriodicChecks() {
    setInterval(() => {
      if (!this.updateInProgress) {
        this.checkForUpdates();
      }
    }, this.config.checkInterval);
  }

  async checkForUpdates(): Promise<UpdateManifest | null> {
    try {
      this.emit('update-check-started');
      
      const manifestUrl = `${this.config.updateServerUrl}/manifest.json`;
      const response = await fetch(manifestUrl, {
        headers: {
          'User-Agent': `Purge-Antivirus/${this.currentVersion}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.status}`);
      }

      const manifest: UpdateManifest = await response.json();
      
      // Verify manifest signature
      const signatureValid = await this.verifyManifestSignature(manifest);
      if (!signatureValid) {
        throw new Error('Invalid manifest signature');
      }

      this.lastCheckTime = new Date();
      
      if (this.isUpdateAvailable(manifest)) {
        this.emit('update-available', manifest);
        
        if (this.config.autoUpdate && this.shouldAutoUpdate(manifest)) {
          await this.performUpdate(manifest);
        }
        
        return manifest;
      } else {
        this.emit('no-updates-available');
        return null;
      }
    } catch (error) {
      this.emit('update-check-failed', error);
      console.error('Update check failed:', error);
      return null;
    }
  }

  private async verifyManifestSignature(manifest: UpdateManifest): Promise<boolean> {
    if (!window.electronAPI) {
      throw new Error('Electron API not available - this application must run in Electron environment');
    }
    
    const manifestData = JSON.stringify({
      version: manifest.version,
      timestamp: manifest.timestamp,
      components: manifest.components
    });
    
    return window.electronAPI.verifySignature(manifestData, manifest.signature, this.config.publicKey);
  }

  private isUpdateAvailable(manifest: UpdateManifest): boolean {
    return this.compareVersions(manifest.version, this.currentVersion) > 0;
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  private shouldAutoUpdate(manifest: UpdateManifest): boolean {
    // Auto-update only critical updates or if explicitly enabled
    return Object.values(manifest.components).some(component => component.critical) ||
           this.config.autoUpdate;
  }

  async performUpdate(manifest: UpdateManifest): Promise<boolean> {
    if (this.updateInProgress) {
      throw new Error('Update already in progress');
    }

    this.updateInProgress = true;
    this.emit('update-started', manifest);

    try {
      // Create rollback point
      await this.createRollbackPoint();

      // Download and verify components
      for (const [componentName, component] of Object.entries(manifest.components)) {
        await this.updateComponent(componentName, component);
      }

      // Apply updates
      await this.applyUpdates(manifest);

      this.currentVersion = manifest.version;
      this.emit('update-completed', manifest);
      
      return true;
    } catch (error) {
      this.emit('update-failed', error);
      
      // Attempt rollback
      try {
        await this.rollbackUpdate();
        this.emit('update-rolled-back');
      } catch (rollbackError) {
        this.emit('rollback-failed', rollbackError);
      }
      
      return false;
    } finally {
      this.updateInProgress = false;
    }
  }

  private async updateComponent(name: string, component: ComponentUpdate): Promise<void> {
    this.emit('component-download-started', { name, component });

    try {
      const response = await fetch(component.url, {
        headers: {
          'User-Agent': `Purge-Antivirus/${this.currentVersion}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to download ${name}: ${response.status}`);
      }

      const componentData = await response.arrayBuffer();
      const buffer = Buffer.from(componentData);

      // Verify hash
      let actualHash: string;
      if (window.electronAPI) {
        actualHash = await window.electronAPI.computeHash(componentData);
      } else {
        throw new Error('Electron API not available - this application must run in Electron environment');
      }
      
      if (actualHash !== component.hash) {
        throw new Error(`Hash mismatch for ${name}: expected ${component.hash}, got ${actualHash}`);
      }

      // Verify size
      if (buffer.length !== component.size) {
        throw new Error(`Size mismatch for ${name}: expected ${component.size}, got ${buffer.length}`);
      }

      // Store component for later application
      await this.storeComponent(name, buffer, component);
      
      this.emit('component-download-completed', { name, component });
    } catch (error) {
      this.emit('component-download-failed', { name, component, error });
      throw error;
    }
  }

  private async storeComponent(name: string, data: Buffer, _component: ComponentUpdate): Promise<void> {
    // In a real implementation, store the component securely
    console.log(`Storing component ${name} (${data.length} bytes)`);
  }

  private async applyUpdates(manifest: UpdateManifest): Promise<void> {
    this.emit('applying-updates');
    
    // Apply signature updates first (most critical)
    if (manifest.components.signatures) {
      await this.applySignatureUpdate(manifest.components.signatures);
    }

    // Apply rule updates
    if (manifest.components.rules) {
      await this.applyRuleUpdate(manifest.components.rules);
    }

    // Apply engine updates last (requires restart)
    if (manifest.components.engine) {
      await this.applyEngineUpdate(manifest.components.engine);
    }
  }

  private async applySignatureUpdate(component: ComponentUpdate): Promise<void> {
    // In a real implementation, update signature database
    console.log(`Applying signature update: ${component.version}`);
    this.emit('signatures-updated', component);
  }

  private async applyRuleUpdate(component: ComponentUpdate): Promise<void> {
    // In a real implementation, hot-reload detection rules
    console.log(`Applying rule update: ${component.version}`);
    this.emit('rules-updated', component);
  }

  private async applyEngineUpdate(component: ComponentUpdate): Promise<void> {
    // In a real implementation, stage engine update for next restart
    console.log(`Staging engine update: ${component.version}`);
    this.emit('engine-update-staged', component);
  }

  private async createRollbackPoint(): Promise<void> {
    // In a real implementation, create a system restore point or backup
    console.log('Creating rollback point');
    this.emit('rollback-point-created');
  }

  private async rollbackUpdate(): Promise<void> {
    // In a real implementation, restore from rollback point
    console.log('Rolling back update');
    this.emit('rollback-started');
  }

  async forceUpdate(manifest: UpdateManifest): Promise<boolean> {
    return this.performUpdate(manifest);
  }

  getUpdateStatus(): any {
    return {
      currentVersion: this.currentVersion,
      lastCheckTime: this.lastCheckTime,
      updateInProgress: this.updateInProgress,
      autoUpdateEnabled: this.config.autoUpdate
    };
  }

  setAutoUpdate(enabled: boolean) {
    this.config.autoUpdate = enabled;
    this.emit('auto-update-changed', enabled);
  }
}