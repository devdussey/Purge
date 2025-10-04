# Create GitHub Release for Purge
# This script creates a new release and uploads the installer

param(
    [string]$version = "1.0.1",
    [string]$releaseNotes = "🎨 New Icon & Branding`n`n- Updated to professional shield+P logo with brand colors`n- Cyan to purple gradient (#00D4FF → #6B2FFF)`n- Multi-resolution ICO for crisp display`n- Auto-update functionality enabled"
)

Write-Host "🚀 Creating GitHub Release v$version" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
$ghPath = Get-Command gh -ErrorAction SilentlyContinue

if (-not $ghPath) {
    Write-Host "❌ GitHub CLI (gh) is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install it:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://cli.github.com/" -ForegroundColor Cyan
    Write-Host "  2. Download and install" -ForegroundColor Cyan
    Write-Host "  3. Run: gh auth login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or create the release manually:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/devdussey/Purge/releases/new" -ForegroundColor Cyan
    Write-Host "  2. Tag: v$version" -ForegroundColor Cyan
    Write-Host "  3. Title: Purge v$version - New Icon & Branding" -ForegroundColor Cyan
    Write-Host "  4. Upload: release\Purge Setup $version.exe" -ForegroundColor Cyan
    Write-Host "  5. Publish release" -ForegroundColor Cyan
    exit 1
}

# Check if authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not authenticated with GitHub!" -ForegroundColor Red
    Write-Host "Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if installer exists
$installerPath = "release\Purge Setup $version.exe"
if (-not (Test-Path $installerPath)) {
    Write-Host "❌ Installer not found: $installerPath" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Found installer: $installerPath" -ForegroundColor Green
$fileSize = [math]::Round((Get-Item $installerPath).Length / 1MB, 2)
Write-Host "   Size: $fileSize MB" -ForegroundColor Gray
Write-Host ""

# Create release
Write-Host "📝 Creating release v$version..." -ForegroundColor Yellow

try {
    # Create the release with notes
    gh release create "v$version" `
        --repo devdussey/Purge `
        --title "Purge v$version - New Icon & Branding" `
        --notes $releaseNotes `
        $installerPath

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Release created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 View release: https://github.com/devdussey/Purge/releases/tag/v$version" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📥 To test auto-update:" -ForegroundColor Yellow
        Write-Host "  1. Open your installed Purge v1.0.0 app" -ForegroundColor White
        Write-Host "  2. Wait 3 seconds" -ForegroundColor White
        Write-Host "  3. You should see update notification!" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ Failed to create release" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
