# Purge Antivirus - Installation & Distribution Guide

## 🚀 Quick Start

### Option 1: Create Installable Exe (Recommended)

```bash
npm run dist
```

This creates:
- `release/Purge Setup 1.0.0.exe` - Windows installer
- Desktop shortcut
- Start menu entry
- Auto-update capability

**Output location:** `release/` folder

### Option 2: Run from Source (Development)

```bash
npm run electron-dev
```

## 📦 Distribution Options

### 1. **Local Installation**
Just run the installer from `release/` folder. It will:
- Install to `C:\Program Files\Purge by DevDussey\`
- Create shortcuts
- Register with Windows

### 2. **GitHub Releases (Auto-Updates Enabled)**

**Setup:**
1. Create a GitHub release
2. Upload the installer from `release/`
3. Tag with version (e.g., `v1.0.1`)

**Auto-updates will:**
- Check GitHub for new releases
- Prompt user to download
- Install automatically on next restart

**Commands:**
```bash
# Patch version (1.0.0 → 1.0.1)
npm run release-patch

# Minor version (1.0.0 → 1.1.0)
npm run release-minor

# Major version (1.0.0 → 2.0.0)
npm run release-major
```

### 3. **Manual Distribution**
Share the `.exe` file from `release/` folder. Users just double-click to install.

## 🔧 What's Included in the Installer

✅ **Full Electron app** with all features
✅ **PowerShell scripts** for scanning
✅ **Auto-update system** (checks GitHub)
✅ **Settings persistence** (saved to `%APPDATA%/Purge/`)
✅ **Desktop & Start Menu shortcuts**
✅ **Admin privileges** (required for antivirus operations)

## 🎯 Next Steps to Make Fully Operational

### Current Features (Working Now):
- ✅ Crypto clipboard monitoring (detects address swaps)
- ✅ Settings persistence
- ✅ UI Test Panel
- ✅ Theme switching
- ✅ Compact mode

### To Add (Phase 2):
1. **Real-time Protection Engine**
   - Windows service for background monitoring
   - File system watcher
   - Process injection detection

2. **Virus Signature Database**
   - Integrate ClamAV or custom signatures
   - Auto-update definitions

3. **Network Monitoring**
   - DNS filtering
   - Phishing URL blocking
   - HTTPS inspection

4. **Windows Integration**
   - Windows Security Center registration
   - Windows Defender API integration
   - Right-click context menu

## 🛠️ Building for Production

### Full Build Process:
```bash
# 1. Install dependencies
npm install

# 2. Build React app + Electron + Create installer
npm run dist

# 3. Installer will be in release/
```

### Build Options:

```bash
# Windows only (fastest)
npm run dist

# All platforms (requires macOS/Linux for those builds)
npm run dist -- --win --mac --linux
```

## 📊 File Sizes

- **Installer:** ~150-200 MB (includes Electron runtime)
- **Installed:** ~300-400 MB
- **Updates:** Only changed files (typically 5-50 MB)

## 🔐 Code Signing (Optional)

For production releases, sign your code to avoid Windows SmartScreen warnings:

1. Get a code signing certificate
2. Add to `package.json`:
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your-password"
}
```

## 🚨 Known Limitations

1. **Admin privileges required** - Antivirus needs elevated access
2. **Windows Defender may flag** - Common for new AVs
3. **Firewall rules** - May need manual configuration
4. **Background service** - Not yet implemented (Phase 2)

## 📞 Support

For issues, check:
- GitHub Issues: https://github.com/devdussey/Purge/issues
- Documentation: `AI_DEVELOPMENT_PLAN.md`
