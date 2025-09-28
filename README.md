# Purge by DevDussey

A comprehensive antivirus and system security application built with React, TypeScript, and Electron.

## Features

- **Quick Scan**: Fast scan of critical system areas
- **Full System Scan**: Complete system malware detection
- **Real-time Protection**: Toggle Windows Defender protection
- **Definition Updates**: Keep virus signatures up to date
- **Quarantine Management**: Manage quarantined threats
- **Emergency Cleanup**: Remove malicious threats immediately
- **System Restore**: Create and restore system restore points
- **Scan Scheduling**: Automated scanning capabilities
- **Scan History**: View previous scan results

## Installation

### Desktop Application (Recommended)

1. Download the latest release from the releases page
2. Run the installer (requires administrator privileges)
3. Launch "Purge by DevDussey" from your desktop or start menu

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd purge-antivirus

# Install dependencies
npm install

# Run in development mode
npm run electron-dev

# Build for production
npm run dist
```

## Building

### Build for Current Platform
```bash
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

## Requirements

- Windows 10/11 (for full functionality)
- PowerShell 5.1 or later
- Administrator privileges (for most operations)
- .NET Framework 4.7.2 or later

## Security Note

This application requires administrator privileges to perform system-level operations. All PowerShell scripts are included in the application package and can be reviewed for security.

## License

Copyright (c) 2024 DevDussey. All rights reserved.

## Support

For support and updates, visit: [Your Support URL]