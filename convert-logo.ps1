# Convert SVG logos to PNG and ICO for installer
Write-Host "Converting Purge logos..." -ForegroundColor Cyan

# Check if ImageMagick is installed
$magickPath = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickPath) {
    Write-Host "ImageMagick not found. Using online converter..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please visit: https://cloudconvert.com/svg-to-png" -ForegroundColor Green
    Write-Host "Upload: public\purge-logo-512.svg" -ForegroundColor Yellow
    Write-Host "Convert to PNG (512x512)" -ForegroundColor Yellow
    Write-Host "Save as: public\purge-icon-512.png" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then visit: https://cloudconvert.com/png-to-ico" -ForegroundColor Green
    Write-Host "Upload: public\purge-icon-512.png" -ForegroundColor Yellow
    Write-Host "Convert to ICO (256x256, 128x128, 64x64, 32x32, 16x16)" -ForegroundColor Yellow
    Write-Host "Save as: public\purge-icon.ico" -ForegroundColor Yellow
    exit 0
}

# Convert SVG to PNG using ImageMagick
Write-Host "Converting SVG to PNG..." -ForegroundColor Yellow
magick "public\purge-logo-512.svg" -resize 512x512 -background none "public\purge-icon-512.png"
magick "public\purge-logo-256.svg" -resize 256x256 -background none "public\purge-icon-256.png"
magick "public\purge-favicon.svg" -resize 64x64 -background none "public\purge-icon-64.png"

# Convert PNG to ICO (multi-resolution)
Write-Host "Creating multi-resolution ICO..." -ForegroundColor Yellow
magick "public\purge-icon-512.png" `
    -resize 256x256 "temp-256.png"
magick "public\purge-icon-512.png" `
    -resize 128x128 "temp-128.png"
magick "public\purge-icon-512.png" `
    -resize 64x64 "temp-64.png"
magick "public\purge-icon-512.png" `
    -resize 32x32 "temp-32.png"
magick "public\purge-icon-512.png" `
    -resize 16x16 "temp-16.png"

# Combine into ICO
magick temp-256.png temp-128.png temp-64.png temp-32.png temp-16.png "public\purge-icon.ico"

# Cleanup
Remove-Item temp-*.png -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Conversion complete!" -ForegroundColor Green
Write-Host "  - purge-icon-512.png" -ForegroundColor Cyan
Write-Host "  - purge-icon-256.png" -ForegroundColor Cyan
Write-Host "  - purge-icon-64.png" -ForegroundColor Cyan
Write-Host "  - purge-icon.ico (multi-resolution)" -ForegroundColor Cyan
