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