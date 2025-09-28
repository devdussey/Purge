#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log('🚀 Creating release for Purge Antivirus');
console.log(`📦 Current version: ${currentVersion}`);

// Prompt for version type or use current version
const args = process.argv.slice(2);
let newVersion;

if (args.includes('--patch')) {
  const versionParts = currentVersion.split('.').map(Number);
  versionParts[2]++; // Increment patch version
  newVersion = versionParts.join('.');
} else if (args.includes('--minor')) {
  const versionParts = currentVersion.split('.').map(Number);
  versionParts[1]++; // Increment minor version
  versionParts[2] = 0; // Reset patch
  newVersion = versionParts.join('.');
} else if (args.includes('--major')) {
  const versionParts = currentVersion.split('.').map(Number);
  versionParts[0]++; // Increment major version
  versionParts[1] = 0; // Reset minor
  versionParts[2] = 0; // Reset patch
  newVersion = versionParts.join('.');
} else {
  // Use current version if no increment specified
  newVersion = currentVersion;
}

const tagName = `v${newVersion}`;

console.log(`🏷️  New version: ${newVersion}`);
console.log(`🏷️  Tag name: ${tagName}`);

try {
  // Update package.json version only if it changed
  if (newVersion !== currentVersion) {
    packageJson.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Updated package.json version');
    
    // Commit the version change
    execSync('git add package.json', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
    console.log('✅ Committed version change');
  }

  // Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Built React application');
  
  execSync('npm run build-electron', { stdio: 'inherit' });
  console.log('✅ Built Electron application');
  
  execSync('npm run dist', { stdio: 'inherit' });
  console.log('✅ Created installers');

  // Check if release directory exists and has files
  const releaseDir = path.join(process.cwd(), 'release');
  if (!fs.existsSync(releaseDir)) {
    throw new Error('Release directory not found. Build may have failed.');
  }
  
  const releaseFiles = fs.readdirSync(releaseDir).filter(file => 
    file.endsWith('.exe') || file.endsWith('.dmg') || file.endsWith('.AppImage') || 
    file.endsWith('.deb') || file.endsWith('.rpm')
  );
  
  if (releaseFiles.length === 0) {
    throw new Error('No installer files found in release directory.');
  }
  
  console.log(`📦 Found ${releaseFiles.length} installer files:`);
  releaseFiles.forEach(file => console.log(`   - ${file}`));

  // Create and push tag
  execSync(`git tag ${tagName}`, { stdio: 'inherit' });
  execSync(`git push origin main`, { stdio: 'inherit' });
  execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
  console.log('✅ Created and pushed tag');

  // Create GitHub release with files
  console.log('🚀 Creating GitHub release...');
  const releaseNotes = `
## Purge Antivirus v${newVersion}

### 🛡️ Features
- Real-time protection with Windows Defender integration
- Quick and full system scans with advanced detection
- AI-powered malware analysis and behavioral detection
- Ransomware shield with automatic rollback protection
- EDR timeline and process tree analysis
- Performance modes (Gaming, Laptop, Maximum Protection)
- AI security assistant for guidance and support
- Comprehensive quarantine and threat management
- Emergency cleanup and system restore tools
- False positive reporting with one-click submission

### 📥 Installation
- **Windows**: Download and run the \`.exe\` installer (requires administrator privileges)
- **macOS**: Download and install the \`.dmg\` file
- **Linux**: Download the \`.AppImage\` file and make it executable

### 🔧 System Requirements
- Windows 10/11, macOS 12+, or Ubuntu 20.04+
- 4GB RAM minimum, 8GB recommended
- 2GB free disk space
- Administrator/root privileges for full functionality

### 🔒 Security Note
This application requires elevated privileges to perform system-level antivirus operations. All PowerShell scripts are included and can be reviewed for security.

### 📋 What's New
- Enhanced detection engine with multi-layered analysis
- Improved performance optimization
- Better user interface and experience
- Updated threat intelligence integration
`;

  // Create release with GitHub CLI
  const releaseCommand = `gh release create ${tagName} ${releaseFiles.map(f => `"release/${f}"`).join(' ')} --title "Purge Antivirus v${newVersion}" --notes "${releaseNotes.replace(/"/g, '\\"')}"`;
  
  try {
    execSync(releaseCommand, { stdio: 'inherit' });
    console.log('✅ Created GitHub release with installers');
  } catch (ghError) {
    console.log('⚠️  GitHub CLI not available or failed. You can create the release manually.');
    console.log('📋 Release files are ready in the release/ directory');
  }
  console.log('\n🎉 Release created successfully!');
  console.log(`📦 Release will be available at: https://github.com/devdussey/purged/releases/tag/${tagName}`);
  console.log(`🔗 Direct download: https://github.com/devdussey/purged/releases/latest`);

} catch (error) {
  console.error('❌ Error creating release:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you have git configured and GitHub access');
  console.log('2. Install GitHub CLI: https://cli.github.com/');
  console.log('3. Run: gh auth login');
  console.log('4. Make sure your repository exists on GitHub');
  process.exit(1);
}