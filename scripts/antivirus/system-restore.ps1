# Purge Antivirus - System Restore Script
# Author: DevDussey
# Description: Creates restore points and manages system recovery

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$CreateRestorePoint,
    [switch]$ListRestorePoints,
    [string]$RestoreToPoint,
    [switch]$EnableSystemRestore,
    [string]$Description = "Purge Antivirus - Pre-Scan Restore Point"
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\system-restore-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

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

Write-Log "=== Purge Antivirus System Restore Management ===" "INFO"

if (!(Test-AdminRights)) {
    Write-Log "ERROR: Administrator privileges required for system restore operations" "ERROR"
    exit 1
}

# Check if System Restore is enabled
Write-Log "Checking System Restore status..." "INFO"
try {
    $SystemRestoreStatus = Get-ComputerRestorePoint -ErrorAction SilentlyContinue
    $RestoreEnabled = (Get-WmiObject -Class Win32_SystemRestore -ErrorAction SilentlyContinue) -ne $null
    
    if (!$RestoreEnabled) {
        Write-Log "WARNING: System Restore appears to be disabled" "WARNING"
        
        if ($EnableSystemRestore) {
            Write-Log "Attempting to enable System Restore..." "INFO"
            try {
                Enable-ComputerRestore -Drive "C:\"
                Write-Log "System Restore enabled for C: drive" "INFO"
            }
            catch {
                Write-Log "Failed to enable System Restore: $($_.Exception.Message)" "ERROR"
                exit 1
            }
        }
        else {
            Write-Log "Use -EnableSystemRestore to enable System Restore" "INFO"
        }
    }
    else {
        Write-Log "System Restore is enabled" "INFO"
    }
}
catch {
    Write-Log "Error checking System Restore status: $($_.Exception.Message)" "ERROR"
}

if ($ListRestorePoints) {
    Write-Log "=== AVAILABLE RESTORE POINTS ===" "INFO"
    
    try {
        $RestorePoints = Get-ComputerRestorePoint | Sort-Object CreationTime -Descending
        
        if ($RestorePoints.Count -eq 0) {
            Write-Log "No restore points found" "INFO"
        }
        else {
            Write-Log "Found $($RestorePoints.Count) restore points:" "INFO"
            
            foreach ($Point in $RestorePoints) {
                Write-Log "Restore Point #$($Point.SequenceNumber)" "INFO"
                Write-Log "  Description: $($Point.Description)" "INFO"
                Write-Log "  Created: $($Point.CreationTime)" "INFO"
                Write-Log "  Type: $($Point.RestorePointType)" "INFO"
                Write-Log "  ---" "INFO"
            }
        }
    }
    catch {
        Write-Log "Error listing restore points: $($_.Exception.Message)" "ERROR"
    }
    
    exit 0
}

if ($CreateRestorePoint) {
    Write-Log "Creating system restore point..." "INFO"
    Write-Log "Description: $Description" "INFO"
    
    try {
        # Create restore point
        $RestorePoint = Checkpoint-Computer -Description $Description -RestorePointType "MODIFY_SETTINGS"
        Write-Log "System restore point created successfully" "INFO"
        
        # Verify creation
        Start-Sleep -Seconds 5
        $LatestPoint = Get-ComputerRestorePoint | Sort-Object CreationTime -Descending | Select-Object -First 1
        if ($LatestPoint -and $LatestPoint.Description -eq $Description) {
            Write-Log "Restore point verified: #$($LatestPoint.SequenceNumber)" "INFO"
            Write-Log "Created: $($LatestPoint.CreationTime)" "INFO"
        }
        else {
            Write-Log "WARNING: Could not verify restore point creation" "WARNING"
        }
    }
    catch {
        Write-Log "Failed to create restore point: $($_.Exception.Message)" "ERROR"
        
        # Try alternative method
        Write-Log "Attempting alternative restore point creation..." "INFO"
        try {
            $WMIClass = [wmiclass]"\\.\root\default:Systemrestore"
            $Result = $WMIClass.CreateRestorePoint($Description, 0, 100)
            
            if ($Result.ReturnValue -eq 0) {
                Write-Log "Restore point created using WMI method" "INFO"
            }
            else {
                Write-Log "WMI restore point creation failed with code: $($Result.ReturnValue)" "ERROR"
            }
        }
        catch {
            Write-Log "Alternative method also failed: $($_.Exception.Message)" "ERROR"
            exit 1
        }
    }
}

if ($RestoreToPoint) {
    Write-Log "WARNING: System restore will restart the computer!" "WARNING"
    Write-Log "Restoring system to restore point: $RestoreToPoint" "WARNING"
    
    try {
        # Validate restore point exists
        $RestorePoints = Get-ComputerRestorePoint
        $TargetPoint = $RestorePoints | Where-Object { $_.SequenceNumber -eq $RestoreToPoint }
        
        if (!$TargetPoint) {
            Write-Log "ERROR: Restore point #$RestoreToPoint not found" "ERROR"
            Write-Log "Available restore points:" "INFO"
            foreach ($Point in $RestorePoints) {
                Write-Log "  #$($Point.SequenceNumber): $($Point.Description) ($($Point.CreationTime))" "INFO"
            }
            exit 1
        }
        
        Write-Log "Target restore point found:" "INFO"
        Write-Log "  Description: $($TargetPoint.Description)" "INFO"
        Write-Log "  Created: $($TargetPoint.CreationTime)" "INFO"
        Write-Log "  Type: $($TargetPoint.RestorePointType)" "INFO"
        
        Write-Log "Initiating system restore..." "WARNING"
        Write-Log "The system will restart automatically" "WARNING"
        
        # Perform system restore
        Restore-Computer -RestorePoint $RestoreToPoint -Confirm:$false
        
        Write-Log "System restore initiated" "INFO"
    }
    catch {
        Write-Log "Failed to restore system: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

# Automatic restore point creation before scans
if (!$CreateRestorePoint -and !$ListRestorePoints -and !$RestoreToPoint) {
    Write-Log "Creating automatic pre-scan restore point..." "INFO"
    
    try {
        # Check if a recent restore point exists (within last 24 hours)
        $RecentPoints = Get-ComputerRestorePoint | Where-Object { 
            $_.CreationTime -gt (Get-Date).AddHours(-24) -and 
            $_.Description -match "Purge Antivirus"
        }
        
        if ($RecentPoints.Count -eq 0) {
            $AutoDescription = "Purge Antivirus - Auto Restore Point $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            Checkpoint-Computer -Description $AutoDescription -RestorePointType "MODIFY_SETTINGS"
            Write-Log "Automatic restore point created: $AutoDescription" "INFO"
        }
        else {
            Write-Log "Recent Purge Antivirus restore point exists, skipping creation" "INFO"
        }
    }
    catch {
        Write-Log "Could not create automatic restore point: $($_.Exception.Message)" "WARNING"
    }
}

# System health check
Write-Log "Performing system health check..." "INFO"
try {
    # Check disk space
    $SystemDrive = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }
    $FreeSpaceGB = [math]::Round($SystemDrive.FreeSpace / 1GB, 2)
    $TotalSpaceGB = [math]::Round($SystemDrive.Size / 1GB, 2)
    $FreeSpacePercent = [math]::Round(($SystemDrive.FreeSpace / $SystemDrive.Size) * 100, 1)
    
    Write-Log "System Drive (C:) Status:" "INFO"
    Write-Log "  Free Space: $FreeSpaceGB GB ($FreeSpacePercent%)" "INFO"
    Write-Log "  Total Space: $TotalSpaceGB GB" "INFO"
    
    if ($FreeSpacePercent -lt 15) {
        Write-Log "WARNING: Low disk space may affect system restore functionality" "WARNING"
    }
    
    # Check system restore disk usage
    $RestoreConfig = Get-WmiObject -Class SystemRestoreConfig -Namespace "root\default" -ErrorAction SilentlyContinue
    if ($RestoreConfig) {
        Write-Log "System Restore Configuration:" "INFO"
        Write-Log "  Disk Space Usage: $($RestoreConfig.DiskPercent)%" "INFO"
    }
}
catch {
    Write-Log "Error during system health check: $($_.Exception.Message)" "WARNING"
}

Write-Log "System restore management completed" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

exit 0