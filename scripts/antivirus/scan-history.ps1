# Purge Antivirus - Scan History Viewer Script
# Author: DevDussey
# Description: Views and manages scan history and logs

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [int]$Days = 30,
    [switch]$Export,
    [string]$ExportPath = "$env:USERPROFILE\Desktop\purge-scan-history.html",
    [switch]$Clean,
    [switch]$Summary
)

if (!(Test-Path $LogPath)) {
    Write-Output "No log directory found at: $LogPath"
    Write-Output "No scan history available."
    exit 0
}

$LogFile = "$LogPath\scan-history-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Output $LogEntry
    if (Test-Path (Split-Path $LogFile)) {
        Add-Content -Path $LogFile -Value $LogEntry
    }
}

Write-Log "=== Purge Antivirus Scan History Viewer ===" "INFO"

# Get all log files
$CutoffDate = (Get-Date).AddDays(-$Days)
$LogFiles = Get-ChildItem -Path $LogPath -Filter "*.log" | Where-Object { $_.LastWriteTime -gt $CutoffDate } | Sort-Object LastWriteTime -Descending

if ($LogFiles.Count -eq 0) {
    Write-Log "No log files found in the last $Days days" "INFO"
    exit 0
}

Write-Log "Found $($LogFiles.Count) log files from the last $Days days" "INFO"

if ($Clean) {
    Write-Log "Cleaning old log files (older than $Days days)..." "INFO"
    $OldLogFiles = Get-ChildItem -Path $LogPath -Filter "*.log" | Where-Object { $_.LastWriteTime -le $CutoffDate }
    
    foreach ($OldFile in $OldLogFiles) {
        try {
            Remove-Item -Path $OldFile.FullName -Force
            Write-Log "Deleted old log file: $($OldFile.Name)" "INFO"
        }
        catch {
            Write-Log "Failed to delete log file: $($OldFile.Name) - $($_.Exception.Message)" "ERROR"
        }
    }
    
    Write-Log "Log cleanup completed. Deleted $($OldLogFiles.Count) old files" "INFO"
    exit 0
}

# Analyze scan history
$ScanSummary = @{
    QuickScans = 0
    FullScans = 0
    UpdateRuns = 0
    TotalThreats = 0
    CleanScans = 0
    FailedScans = 0
    TotalScannedFiles = 0
}

$ScanResults = @()

foreach ($LogFile in $LogFiles) {
    try {
        $Content = Get-Content -Path $LogFile.FullName
        $ScanType = "Unknown"
        $ThreatsFound = 0
        $FilesScanned = 0
        $ScanStatus = "Unknown"
        $ScanDuration = "Unknown"
        
        # Parse log content
        foreach ($Line in $Content) {
            if ($Line -match "Quick Scan") {
                $ScanType = "Quick Scan"
                $ScanSummary.QuickScans++
            }
            elseif ($Line -match "Full System Scan") {
                $ScanType = "Full Scan"
                $ScanSummary.FullScans++
            }
            elseif ($Line -match "Definition Update") {
                $ScanType = "Definition Update"
                $ScanSummary.UpdateRuns++
            }
            elseif ($Line -match "Threats detected: (\d+)") {
                $ThreatsFound = [int]$Matches[1]
                $ScanSummary.TotalThreats += $ThreatsFound
            }
            elseif ($Line -match "Files scanned: (\d+)") {
                $FilesScanned = [int]$Matches[1]
                $ScanSummary.TotalScannedFiles += $FilesScanned
            }
            elseif ($Line -match "Total files scanned: (\d+)") {
                $FilesScanned = [int]$Matches[1]
                $ScanSummary.TotalScannedFiles += $FilesScanned
            }
            elseif ($Line -match "SYSTEM CLEAN") {
                $ScanStatus = "Clean"
                $ScanSummary.CleanScans++
            }
            elseif ($Line -match "SYSTEM INFECTED") {
                $ScanStatus = "Threats Found"
            }
            elseif ($Line -match "Scan duration: ([\d.]+) (seconds|minutes)") {
                $Duration = [double]$Matches[1]
                $Unit = $Matches[2]
                if ($Unit -eq "minutes") {
                    $ScanDuration = "$Duration minutes"
                } else {
                    $ScanDuration = "$Duration seconds"
                }
            }
            elseif ($Line -match "ERROR" -and $ScanStatus -eq "Unknown") {
                $ScanStatus = "Failed"
                $ScanSummary.FailedScans++
            }
        }
        
        if ($ScanStatus -eq "Unknown" -and $ThreatsFound -eq 0) {
            $ScanStatus = "Clean"
            $ScanSummary.CleanScans++
        }
        
        $ScanResults += [PSCustomObject]@{
            Date = $LogFile.LastWriteTime
            Type = $ScanType
            Status = $ScanStatus
            ThreatsFound = $ThreatsFound
            FilesScanned = $FilesScanned
            Duration = $ScanDuration
            LogFile = $LogFile.Name
        }
    }
    catch {
        Write-Log "Error parsing log file $($LogFile.Name): $($_.Exception.Message)" "ERROR"
    }
}

if ($Summary) {
    Write-Log "=== SCAN HISTORY SUMMARY (Last $Days days) ===" "INFO"
    Write-Log "Total Quick Scans: $($ScanSummary.QuickScans)" "INFO"
    Write-Log "Total Full Scans: $($ScanSummary.FullScans)" "INFO"
    Write-Log "Total Definition Updates: $($ScanSummary.UpdateRuns)" "INFO"
    Write-Log "Total Threats Detected: $($ScanSummary.TotalThreats)" "INFO"
    Write-Log "Clean Scans: $($ScanSummary.CleanScans)" "INFO"
    Write-Log "Failed Scans: $($ScanSummary.FailedScans)" "INFO"
    Write-Log "Total Files Scanned: $($ScanSummary.TotalScannedFiles)" "INFO"
    
    if ($ScanSummary.TotalThreats -gt 0) {
        Write-Log "SECURITY ALERT: $($ScanSummary.TotalThreats) threats detected in recent scans!" "WARNING"
    }
    
    exit 0
}

# Display detailed scan history
Write-Log "=== DETAILED SCAN HISTORY ===" "INFO"
$ScanResults | Sort-Object Date -Descending | ForEach-Object {
    Write-Log "Date: $($_.Date.ToString('yyyy-MM-dd HH:mm:ss'))" "INFO"
    Write-Log "Type: $($_.Type)" "INFO"
    Write-Log "Status: $($_.Status)" "INFO"
    Write-Log "Threats: $($_.ThreatsFound)" "INFO"
    Write-Log "Files Scanned: $($_.FilesScanned)" "INFO"
    Write-Log "Duration: $($_.Duration)" "INFO"
    Write-Log "Log File: $($_.LogFile)" "INFO"
    Write-Log "---" "INFO"
}

if ($Export) {
    Write-Log "Exporting scan history to HTML report..." "INFO"
    
    $HtmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Purge Antivirus - Scan History Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .scan-entry { background-color: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .clean { border-left: 5px solid #10b981; }
        .threats { border-left: 5px solid #ef4444; }
        .failed { border-left: 5px solid #f59e0b; }
        .date { font-weight: bold; color: #374151; }
        .status { font-weight: bold; }
        .status.clean { color: #10b981; }
        .status.threats { color: #ef4444; }
        .status.failed { color: #f59e0b; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f9fafb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Purge Antivirus - Scan History Report</h1>
        <p>Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</p>
        <p>Report Period: Last $Days days</p>
    </div>
    
    <div class="summary">
        <h2>Summary Statistics</h2>
        <table>
            <tr><th>Metric</th><th>Count</th></tr>
            <tr><td>Quick Scans</td><td>$($ScanSummary.QuickScans)</td></tr>
            <tr><td>Full Scans</td><td>$($ScanSummary.FullScans)</td></tr>
            <tr><td>Definition Updates</td><td>$($ScanSummary.UpdateRuns)</td></tr>
            <tr><td>Total Threats Detected</td><td>$($ScanSummary.TotalThreats)</td></tr>
            <tr><td>Clean Scans</td><td>$($ScanSummary.CleanScans)</td></tr>
            <tr><td>Failed Scans</td><td>$($ScanSummary.FailedScans)</td></tr>
            <tr><td>Total Files Scanned</td><td>$($ScanSummary.TotalScannedFiles)</td></tr>
        </table>
    </div>
    
    <h2>Detailed Scan History</h2>
"@

    foreach ($Scan in ($ScanResults | Sort-Object Date -Descending)) {
        $CssClass = switch ($Scan.Status) {
            "Clean" { "clean" }
            "Threats Found" { "threats" }
            "Failed" { "failed" }
            default { "clean" }
        }
        
        $StatusClass = $CssClass
        
        $HtmlContent += @"
    <div class="scan-entry $CssClass">
        <div class="date">$($Scan.Date.ToString('yyyy-MM-dd HH:mm:ss'))</div>
        <p><strong>Type:</strong> $($Scan.Type)</p>
        <p><strong>Status:</strong> <span class="status $StatusClass">$($Scan.Status)</span></p>
        <p><strong>Threats Found:</strong> $($Scan.ThreatsFound)</p>
        <p><strong>Files Scanned:</strong> $($Scan.FilesScanned)</p>
        <p><strong>Duration:</strong> $($Scan.Duration)</p>
        <p><strong>Log File:</strong> $($Scan.LogFile)</p>
    </div>
"@
    }
    
    $HtmlContent += @"
</body>
</html>
"@
    
    try {
        Set-Content -Path $ExportPath -Value $HtmlContent -Encoding UTF8
        Write-Log "HTML report exported to: $ExportPath" "INFO"
        
        # Try to open the report
        try {
            Start-Process $ExportPath
            Write-Log "Report opened in default browser" "INFO"
        }
        catch {
            Write-Log "Report saved but could not open automatically" "WARNING"
        }
    }
    catch {
        Write-Log "Failed to export HTML report: $($_.Exception.Message)" "ERROR"
    }
}

Write-Log "Scan history analysis completed" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

exit 0