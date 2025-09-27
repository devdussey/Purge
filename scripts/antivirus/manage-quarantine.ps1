# Purge Antivirus - Quarantine Management Script
# Author: DevDussey
# Description: Manages quarantined files and threats

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$List,
    [switch]$Restore,
    [string]$RestoreFile,
    [switch]$Delete,
    [string]$DeleteFile,
    [switch]$Clear,
    [switch]$Export
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$QuarantinePath = "$LogPath\quarantine"
$LogFile = "$LogPath\manage-quarantine-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Output $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

Write-Log "=== Purge Antivirus Quarantine Management Started ===" "INFO"

if (!(Test-Path $QuarantinePath)) {
    Write-Log "Quarantine directory does not exist: $QuarantinePath" "INFO"
    Write-Log "Creating quarantine directory..." "INFO"
    New-Item -ItemType Directory -Path $QuarantinePath -Force | Out-Null
}

# Get quarantined files
$QuarantinedFiles = Get-ChildItem -Path $QuarantinePath -File -ErrorAction SilentlyContinue

if ($List -or (!$Restore -and !$Delete -and !$Clear -and !$Export)) {
    Write-Log "=== QUARANTINED FILES ===" "INFO"
    
    if ($QuarantinedFiles.Count -eq 0) {
        Write-Log "No files currently in quarantine" "INFO"
    }
    else {
        Write-Log "Found $($QuarantinedFiles.Count) files in quarantine:" "INFO"
        
        foreach ($File in $QuarantinedFiles) {
            $OriginalName = $File.Name -replace '\.quarantine$', ''
            $QuarantineDate = $File.CreationTime
            $FileSize = [math]::Round($File.Length / 1KB, 2)
            
            Write-Log "File: $OriginalName" "INFO"
            Write-Log "  Quarantined: $($QuarantineDate.ToString('yyyy-MM-dd HH:mm:ss'))" "INFO"
            Write-Log "  Size: $FileSize KB" "INFO"
            Write-Log "  Quarantine File: $($File.Name)" "INFO"
            Write-Log "  ---" "INFO"
        }
        
        # Check Windows Defender quarantine as well
        Write-Log "Checking Windows Defender quarantine..." "INFO"
        try {
            $DefenderThreats = Get-MpThreat -ErrorAction SilentlyContinue
            if ($DefenderThreats) {
                Write-Log "Windows Defender quarantined threats:" "INFO"
                foreach ($Threat in $DefenderThreats) {
                    Write-Log "Threat: $($Threat.ThreatName)" "WARNING"
                    Write-Log "  Status: $($Threat.ActionSuccess)" "INFO"
                    Write-Log "  Detection Time: $($Threat.InitialDetectionTime)" "INFO"
                    Write-Log "  ---" "INFO"
                }
            }
            else {
                Write-Log "No threats in Windows Defender quarantine" "INFO"
            }
        }
        catch {
            Write-Log "Could not access Windows Defender quarantine information" "WARNING"
        }
    }
    exit 0
}

if ($Restore) {
    if (!(Test-AdminRights)) {
        Write-Log "ERROR: Administrator privileges required to restore files" "ERROR"
        exit 1
    }
    
    if ($RestoreFile) {
        # Restore specific file
        $QuarantineFile = "$QuarantinePath\$RestoreFile"
        if (!(Test-Path $QuarantineFile)) {
            $QuarantineFile = "$QuarantinePath\$RestoreFile.quarantine"
        }
        
        if (Test-Path $QuarantineFile) {
            Write-Log "Restoring file: $RestoreFile" "WARNING"
            
            # Determine original location (simplified - in real implementation, you'd store metadata)
            $OriginalName = $RestoreFile -replace '\.quarantine$', ''
            $RestorePath = "$env:USERPROFILE\Desktop\Restored_$OriginalName"
            
            try {
                Copy-Item -Path $QuarantineFile -Destination $RestorePath -Force
                Write-Log "File restored to: $RestorePath" "INFO"
                Write-Log "WARNING: Restored file may still be malicious. Scan before use!" "WARNING"
                
                # Optionally remove from quarantine
                Remove-Item -Path $QuarantineFile -Force
                Write-Log "File removed from quarantine" "INFO"
            }
            catch {
                Write-Log "Failed to restore file: $($_.Exception.Message)" "ERROR"
                exit 1
            }
        }
        else {
            Write-Log "File not found in quarantine: $RestoreFile" "ERROR"
            exit 1
        }
    }
    else {
        Write-Log "ERROR: Please specify a file to restore using -RestoreFile parameter" "ERROR"
        exit 1
    }
}

if ($Delete) {
    if (!(Test-AdminRights)) {
        Write-Log "ERROR: Administrator privileges required to delete quarantined files" "ERROR"
        exit 1
    }
    
    if ($DeleteFile) {
        # Delete specific file
        $QuarantineFile = "$QuarantinePath\$DeleteFile"
        if (!(Test-Path $QuarantineFile)) {
            $QuarantineFile = "$QuarantinePath\$DeleteFile.quarantine"
        }
        
        if (Test-Path $QuarantineFile) {
            Write-Log "Permanently deleting quarantined file: $DeleteFile" "WARNING"
            
            try {
                Remove-Item -Path $QuarantineFile -Force
                Write-Log "File permanently deleted from quarantine" "INFO"
            }
            catch {
                Write-Log "Failed to delete file: $($_.Exception.Message)" "ERROR"
                exit 1
            }
        }
        else {
            Write-Log "File not found in quarantine: $DeleteFile" "ERROR"
            exit 1
        }
    }
    else {
        Write-Log "ERROR: Please specify a file to delete using -DeleteFile parameter" "ERROR"
        exit 1
    }
}

if ($Clear) {
    if (!(Test-AdminRights)) {
        Write-Log "ERROR: Administrator privileges required to clear quarantine" "ERROR"
        exit 1
    }
    
    Write-Log "WARNING: This will permanently delete ALL quarantined files!" "WARNING"
    Write-Log "Clearing quarantine directory..." "WARNING"
    
    try {
        if ($QuarantinedFiles.Count -gt 0) {
            foreach ($File in $QuarantinedFiles) {
                Remove-Item -Path $File.FullName -Force
                Write-Log "Deleted: $($File.Name)" "INFO"
            }
            Write-Log "Quarantine cleared. Deleted $($QuarantinedFiles.Count) files" "INFO"
        }
        else {
            Write-Log "Quarantine is already empty" "INFO"
        }
    }
    catch {
        Write-Log "Error clearing quarantine: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

if ($Export) {
    Write-Log "Exporting quarantine information..." "INFO"
    
    $ExportPath = "$env:USERPROFILE\Desktop\quarantine-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $ExportContent = @()
    
    $ExportContent += "Purge Antivirus - Quarantine Report"
    $ExportContent += "Generated: $(Get-Date)"
    $ExportContent += "Quarantine Path: $QuarantinePath"
    $ExportContent += "Total Files: $($QuarantinedFiles.Count)"
    $ExportContent += ""
    $ExportContent += "=== QUARANTINED FILES ==="
    
    if ($QuarantinedFiles.Count -eq 0) {
        $ExportContent += "No files currently in quarantine"
    }
    else {
        foreach ($File in $QuarantinedFiles) {
            $OriginalName = $File.Name -replace '\.quarantine$', ''
            $ExportContent += "File: $OriginalName"
            $ExportContent += "  Quarantined: $($File.CreationTime)"
            $ExportContent += "  Size: $([math]::Round($File.Length / 1KB, 2)) KB"
            $ExportContent += "  Path: $($File.FullName)"
            $ExportContent += ""
        }
    }
    
    try {
        Set-Content -Path $ExportPath -Value $ExportContent
        Write-Log "Quarantine report exported to: $ExportPath" "INFO"
    }
    catch {
        Write-Log "Failed to export quarantine report: $($_.Exception.Message)" "ERROR"
    }
}

Write-Log "Quarantine management operation completed" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

exit 0