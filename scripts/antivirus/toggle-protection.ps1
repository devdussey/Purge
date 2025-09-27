# Purge Antivirus - Toggle Real-time Protection Script
# Author: DevDussey
# Description: Enables or disables real-time protection

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$Enable,
    [switch]$Disable,
    [switch]$Status
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\toggle-protection-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

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

Write-Log "=== Purge Antivirus Protection Toggle Started ===" "INFO"

if (!(Test-AdminRights)) {
    Write-Log "ERROR: Administrator privileges required to modify protection settings" "ERROR"
    exit 1
}

# Get current Windows Defender status
try {
    $DefenderStatus = Get-MpComputerStatus
    $CurrentRealTimeStatus = $DefenderStatus.RealTimeProtectionEnabled
    $CurrentAntivirusStatus = $DefenderStatus.AntivirusEnabled
    
    Write-Log "Current Real-time Protection: $CurrentRealTimeStatus" "INFO"
    Write-Log "Current Antivirus Status: $CurrentAntivirusStatus" "INFO"
    Write-Log "Last Quick Scan: $($DefenderStatus.QuickScanStartTime)" "INFO"
    Write-Log "Last Full Scan: $($DefenderStatus.FullScanStartTime)" "INFO"
    Write-Log "Antivirus Signature Version: $($DefenderStatus.AntivirusSignatureVersion)" "INFO"
}
catch {
    Write-Log "Could not retrieve Windows Defender status: $($_.Exception.Message)" "ERROR"
    exit 1
}

if ($Status) {
    Write-Log "=== Current Protection Status ===" "INFO"
    Write-Log "Real-time Protection: $($DefenderStatus.RealTimeProtectionEnabled)" "INFO"
    Write-Log "Antivirus Enabled: $($DefenderStatus.AntivirusEnabled)" "INFO"
    Write-Log "Antispyware Enabled: $($DefenderStatus.AntispywareEnabled)" "INFO"
    Write-Log "Behavior Monitor Enabled: $($DefenderStatus.BehaviorMonitorEnabled)" "INFO"
    Write-Log "On Access Protection Enabled: $($DefenderStatus.OnAccessProtectionEnabled)" "INFO"
    Write-Log "Real-time Scan Direction: $($DefenderStatus.RealTimeScanDirection)" "INFO"
    exit 0
}

if ($Enable) {
    Write-Log "Enabling real-time protection..." "INFO"
    
    try {
        # Enable real-time protection
        Set-MpPreference -DisableRealtimeMonitoring $false
        Write-Log "Real-time monitoring enabled" "INFO"
        
        # Enable behavior monitoring
        Set-MpPreference -DisableBehaviorMonitoring $false
        Write-Log "Behavior monitoring enabled" "INFO"
        
        # Enable on-access protection
        Set-MpPreference -DisableOnAccessProtection $false
        Write-Log "On-access protection enabled" "INFO"
        
        # Enable script scanning
        Set-MpPreference -DisableScriptScanning $false
        Write-Log "Script scanning enabled" "INFO"
        
        # Enable archive scanning
        Set-MpPreference -DisableArchiveScanning $false
        Write-Log "Archive scanning enabled" "INFO"
        
        # Start Windows Defender service if not running
        $DefenderService = Get-Service -Name "WinDefend" -ErrorAction SilentlyContinue
        if ($DefenderService -and $DefenderService.Status -ne "Running") {
            Start-Service -Name "WinDefend"
            Write-Log "Windows Defender service started" "INFO"
        }
        
        Write-Log "Real-time protection has been ENABLED" "INFO"
    }
    catch {
        Write-Log "Failed to enable real-time protection: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}
elseif ($Disable) {
    Write-Log "WARNING: Disabling real-time protection will leave your system vulnerable!" "WARNING"
    Write-Log "Disabling real-time protection..." "INFO"
    
    try {
        # Disable real-time protection
        Set-MpPreference -DisableRealtimeMonitoring $true
        Write-Log "Real-time monitoring disabled" "WARNING"
        
        # Note: Other protections are kept enabled for security
        Write-Log "Other protection features remain active for security" "INFO"
        
        Write-Log "Real-time protection has been DISABLED" "WARNING"
        Write-Log "RECOMMENDATION: Re-enable protection as soon as possible" "WARNING"
    }
    catch {
        Write-Log "Failed to disable real-time protection: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}
else {
    # Toggle current state
    if ($CurrentRealTimeStatus) {
        Write-Log "Real-time protection is currently ENABLED. Disabling..." "INFO"
        try {
            Set-MpPreference -DisableRealtimeMonitoring $true
            Write-Log "Real-time protection has been DISABLED" "WARNING"
        }
        catch {
            Write-Log "Failed to disable real-time protection: $($_.Exception.Message)" "ERROR"
            exit 1
        }
    }
    else {
        Write-Log "Real-time protection is currently DISABLED. Enabling..." "INFO"
        try {
            Set-MpPreference -DisableRealtimeMonitoring $false
            Set-MpPreference -DisableBehaviorMonitoring $false
            Set-MpPreference -DisableOnAccessProtection $false
            Write-Log "Real-time protection has been ENABLED" "INFO"
        }
        catch {
            Write-Log "Failed to enable real-time protection: $($_.Exception.Message)" "ERROR"
            exit 1
        }
    }
}

# Verify final status
try {
    Start-Sleep -Seconds 2  # Allow time for changes to take effect
    $FinalStatus = Get-MpComputerStatus
    Write-Log "Final Real-time Protection Status: $($FinalStatus.RealTimeProtectionEnabled)" "INFO"
}
catch {
    Write-Log "Could not verify final protection status" "WARNING"
}

Write-Log "Protection toggle operation completed" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"
exit 0