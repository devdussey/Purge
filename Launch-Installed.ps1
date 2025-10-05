# Purge Installed Client Launcher
$installedPath = "C:\Program Files\Purge\Purge.exe"

if (Test-Path $installedPath) {
    Start-Process $installedPath
} else {
    Write-Host "Purge is not installed yet. Run 'npm run dist' to create installer first." -ForegroundColor Yellow
    Write-Host "Then install from the release/ folder." -ForegroundColor Yellow
    pause
}
