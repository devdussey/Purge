# Purge by DevDussey

A comprehensive, production-ready antivirus and system security application built with React, TypeScript, and Electron. Features advanced detection engines, ransomware protection, EDR capabilities, and enterprise-grade security.

## Features

### Core Protection
- **Quick Scan**: Fast scan of critical system areas
- **Full System Scan**: Complete system malware detection
- **Real-time Protection**: Toggle Windows Defender protection
- **Definition Updates**: Keep virus signatures up to date
- **Quarantine Management**: Manage quarantined threats
- **Emergency Cleanup**: Remove malicious threats immediately
- **System Restore**: Create and restore system restore points
- **Scan Scheduling**: Automated scanning capabilities
- **Scan History**: View previous scan results

### Advanced Security Features
- **Multi-layered Detection**: YARA signatures, heuristics, and behavior analysis
- **Ransomware Shield**: Real-time protection with automatic rollback capability
- **EDR Timeline**: Process tree analysis and system activity monitoring
- **False Positive Reporting**: One-click reporting with automatic triage
- **Performance Modes**: Gaming, Laptop, and Maximum Protection modes
- **Incremental Scanning**: Hash cache and file timestamp optimization
- **Network Protection**: DNS blocking and C2 detection
- **Behavioral Analysis**: Process injection, LOLBins, and persistence detection

### Enterprise Features
- **Telemetry System**: Privacy-focused analytics with opt-in consent
- **Update Pipeline**: Signed, versioned updates with rollback protection
- **Code Signing**: Full chain of trust with EV certificates
- **Compliance Ready**: GDPR, CPRA, and PIPEDA compliant
- **Crash Reporting**: Symbolicated reports with rate limiting
- **Rule Staging**: Canary deployments with automatic rollback

## Installation

### Quick Download (For Users)

1. **Download the Installer**:
   - Go to the [Releases page](https://github.com/DevDussey/purge-antivirus/releases/latest)
   - Download the latest `.exe` file for Windows
   - Or click the "Download Desktop App" button in the web version

2. **Install the Application**:
   - Run the downloaded `.exe` file
   - Follow the installation wizard
   - The installer will request administrator privileges (required for antivirus functions)
   - Choose installation directory and create shortcuts

3. **Launch the Application**:
   - Use the desktop shortcut or find "Purge by DevDussey" in your Start Menu
   - The application will start with full PowerShell script execution capabilities

### Desktop Application (Recommended)

For the full-featured desktop version with PowerShell script execution:
1. Download from the releases page above
2. Install and run as administrator when needed
3. All antivirus functions will work natively

### Development Setup

For developers who want to build from source:

```bash
# Clone the repository
git clone https://github.com/DevDussey/purge-antivirus.git
cd purge-antivirus

# Install dependencies
npm install

# Run in development mode (React + Electron)
npm run electron-dev

# Build installer for distribution
npm run dist
```

## Building

### For Developers/Contributors

### Build for Current Platform
```bash
# Build React app
npm run build

# Build Electron app and create installer
npm run dist
```

### Build for Specific Platforms
```bash
# Windows
npm run dist -- --win

# macOS
npm run dist -- --mac

# Linux
npm run dist -- --linux
```

### Publishing Releases

1. **Create a Release**:
   ```bash
   # Tag your version
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Build Installers**:
   ```bash
   npm run dist
   ```

3. **Upload to GitHub**:
   - Go to GitHub Releases
   - Create a new release with your tag
   - Upload the installer files from the `release/` folder
   - Users can then download directly from GitHub

## PowerShell Scripts

The application includes comprehensive PowerShell scripts for:

- `quick-scan.ps1` - Quick system scan
- `full-scan.ps1` - Complete system scan
- `update-definitions.ps1` - Update virus definitions
- `toggle-protection.ps1` - Toggle real-time protection
- `schedule-scan.ps1` - Schedule automatic scans
- `scan-history.ps1` - View scan history
- `manage-quarantine.ps1` - Manage quarantined files
- `emergency-cleanup.ps1` - Emergency system cleanup
- `system-restore.ps1` - System restore management

## Detection Engine

### Signature Detection
- YARA-compatible rules for malware identification
- Hot-reloadable rule sets for rapid response
- Modular architecture for easy rule management

### Heuristic Analysis
- File size anomaly detection
- Entropy analysis for packed executables
- Import table analysis for suspicious APIs

### Behavioral Detection
- Process injection monitoring
- LOLBins (Living Off The Land) abuse detection
- Registry persistence mechanism detection
- Network beaconing pattern analysis
- Mass file encryption detection (ransomware)

### Performance Optimization
- Incremental scanning with hash caching
- File timestamp and USN journal integration
- Idle/low-power scan scheduling
- CPU and memory throttling

## Security Architecture

### Code Signing & Trust
- **Windows**: EV certificate for SmartScreen reputation
- **macOS**: Developer ID signing + notarization
- **Linux**: Repository signing with detached signatures
- **Updates**: TUF-compatible signed manifests

### Privacy & Compliance
- Minimal data collection by default
- Privacy budget system for telemetry
- GDPR Article 30 compliant data processing
- Clear consent mechanisms for all data collection

### Supply Chain Security
- Software Bill of Materials (SBOM) generation
- Reproducible builds with attestation
- Dependency pinning and verification
- CI/CD pipeline with Sigstore integration

## Testing & Quality Assurance

### Security Testing
- AMTSO standard compliance testing
- EICAR test file detection
- Archive nesting and solid archive handling
- Large file set performance testing
- Pathological case handling (junctions, symlinks)

### Performance Testing
- Battery impact measurement
- Thermal impact monitoring
- CPU and memory usage profiling
- Network bandwidth optimization

### Platform Testing
- Windows 10/11 compatibility
- macOS 12-14 support
- Ubuntu LTS validation
- Clean vs. heavily loaded system testing
- HDD vs. SSD performance optimization

## Requirements

- Windows 10/11 (for full functionality)
- PowerShell 5.1 or later
- Administrator privileges (for most operations)
- .NET Framework 4.7.2 or later
- 4GB RAM minimum, 8GB recommended
- 2GB free disk space for definitions and quarantine
- Internet connection for updates and telemetry

## API Documentation

### Detection Engine API
```typescript
// Load custom detection rules
engine.loadRules(rules: DetectionRule[])

// Scan file with full analysis
engine.scanFile(filePath: string, fileBuffer: Buffer): Promise<ScanResult>

// Enable/disable specific rules
engine.disableRule(ruleId: string)
engine.enableRule(ruleId: string)
```

### Quarantine Manager API
```typescript
// Quarantine suspicious file
quarantine.quarantineFile(filePath: string, reason: string): Promise<string>

// Restore quarantined file
quarantine.restoreFile(fileId: string, reason: string): Promise<boolean>

// Ransomware rollback
quarantine.rollbackRansomwareChanges(timeWindow: number): Promise<number>
```

### Telemetry API
```typescript
// Record detection event
telemetry.recordDetection(detection: DetectionTelemetry)

// Record performance metrics
telemetry.recordPerformance(metrics: PerformanceTelemetry)

// Report false positive
telemetry.recordFalsePositive(ruleId: string, fileHash: string)
```

## Security Note

This application requires administrator privileges to perform system-level operations. All PowerShell scripts are included in the application package and can be reviewed for security. The application implements defense-in-depth security measures including code signing, update verification, and minimal privilege principles.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Security review process
- Testing requirements
- Documentation standards

### Security Contributions
- Report security issues via our [Security Policy](SECURITY.md)
- Submit detection rules through our rule submission process
- Participate in our bug bounty program

## Transparency & Accountability

- **Quarterly Transparency Reports**: Detection statistics and false positive rates
- **Public Security Audits**: Annual third-party security assessments
- **Open Source Components**: Full disclosure of dependencies and licenses
- **Bug Bounty Program**: Responsible disclosure with researcher recognition

## License

Copyright (c) 2024 DevDussey. All rights reserved.

## Certifications & Compliance

- **AMTSO Testing Standards**: Compliant with industry testing protocols
- **Common Criteria**: Evaluation in progress
- **FIPS 140-2**: Cryptographic module compliance
- **SOC 2 Type II**: Annual compliance audit

## Support

- **Documentation**: [docs.purgeantivirus.com](https://docs.purgeantivirus.com)
- **Community Forum**: [community.purgeantivirus.com](https://community.purgeantivirus.com)
- **Enterprise Support**: [enterprise@purgeantivirus.com](mailto:enterprise@purgeantivirus.com)
- **Security Contact**: [security@purgeantivirus.com](mailto:security@purgeantivirus.com)
- **Bug Reports**: [GitHub Issues](https://github.com/DevDussey/purge-antivirus/issues)