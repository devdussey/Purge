# Build Purge Installer
# This script properly closes all processes and builds the installer

Write-Host "Purge Installer Build Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all Electron processes
Write-Host "[1/5] Stopping running processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM "Purge by DevDussey.exe" /T 2>$null
Start-Sleep -Seconds 2

# Step 2: Clean release folder
Write-Host "[2/5] Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path "release\win-unpacked") {
    Remove-Item -Path "release\win-unpacked" -Recurse -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 1

# Step 3: Build
Write-Host "[3/5] Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Build Electron
Write-Host "[4/5] Building Electron..." -ForegroundColor Yellow
npm run build-electron
if ($LASTEXITCODE -ne 0) {
    Write-Host "Electron build failed!" -ForegroundColor Red
    exit 1
}

# Step 5: Create installer
Write-Host "[5/5] Creating installer..." -ForegroundColor Yellow
npx electron-builder
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installer build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host "Installer location: release\Purge Setup 1.0.0.exe" -ForegroundColor Green
