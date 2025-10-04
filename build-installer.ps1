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

# Step 2: Clean release folder (with retry)
Write-Host "[2/5] Cleaning build artifacts..." -ForegroundColor Yellow

# Force unlock and delete using handle.exe alternative
$maxRetries = 3
$retryCount = 0
$cleaned = $false

while (-not $cleaned -and $retryCount -lt $maxRetries) {
    try {
        if (Test-Path "release\win-unpacked") {
            # Kill any process locking files in this folder
            Get-Process | Where-Object {$_.Path -like "*release\win-unpacked*"} | Stop-Process -Force -ErrorAction SilentlyContinue

            Start-Sleep -Seconds 2

            # Try to remove
            Remove-Item -Path "release\win-unpacked" -Recurse -Force -ErrorAction Stop
            $cleaned = $true
            Write-Host "  ✓ Cleaned successfully" -ForegroundColor Green
        } else {
            $cleaned = $true
        }
    } catch {
        $retryCount++
        Write-Host "  Retry $retryCount/$maxRetries..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if (-not $cleaned) {
    Write-Host "  ⚠ Could not clean release folder. Please:" -ForegroundColor Red
    Write-Host "    1. Close all File Explorer windows" -ForegroundColor Yellow
    Write-Host "    2. Check Task Manager for any Electron processes" -ForegroundColor Yellow
    Write-Host "    3. Manually delete: release\win-unpacked" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

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
