# Purge Antivirus - Emergency Cleanup Script
# Author: DevDussey
# Description: Emergency system cleanup and malware removal

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$Force,
    [switch]$DeepClean,
    [switch]$NetworkIsolate
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\emergency-cleanup-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$StartTime = Get-Date

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

function Stop-SuspiciousProcesses {
    Write-Log "Stopping suspicious processes..." "INFO"
    
    $SuspiciousPatterns = @(
        "virus", "trojan", "malware", "keylog", "backdoor", "ransomware", 
        "cryptolock", "miner", "botnet", "spyware", "adware"
    )
    
    $StoppedProcesses = 0
    
    foreach ($Pattern in $SuspiciousPatterns) {
        $Processes = Get-Process | Where-Object { $_.ProcessName -match $Pattern }
        foreach ($Process in $Processes) {
            try {
                Write-Log "Terminating suspicious process: $($Process.ProcessName) (PID: $($Process.Id))" "WARNING"
                Stop-Process -Id $Process.Id -Force
                $StoppedProcesses++
            }
            catch {
                Write-Log "Failed to stop process $($Process.ProcessName): $($_.Exception.Message)" "ERROR"
            }
        }
    }
    
    # Check for processes with high CPU usage
    $HighCpuProcesses = Get-Process | Where-Object { $_.CPU -gt 80 -and $_.ProcessName -notmatch "(System|Idle|explorer|dwm)" }
    foreach ($Process in $HighCpuProcesses) {
        Write-Log "High CPU process detected: $($Process.ProcessName) - CPU: $($Process.CPU)" "WARNING"
        # Don't auto-kill high CPU processes, just log them
    }
    
    Write-Log "Stopped $StoppedProcesses suspicious processes" "INFO"
}

function Clean-TempFiles {
    Write-Log "Cleaning temporary files..." "INFO"
    
    $TempPaths = @(
        $env:TEMP,
        $env:TMP,
        "$env:LOCALAPPDATA\Temp",
        "$env:SYSTEMROOT\Temp",
        "$env:USERPROFILE\AppData\Local\Temp"
    )
    
    $CleanedFiles = 0
    $CleanedSize = 0
    
    foreach ($TempPath in $TempPaths) {
        if (Test-Path $TempPath) {
            try {
                $Files = Get-ChildItem -Path $TempPath -Recurse -File -ErrorAction SilentlyContinue
                foreach ($File in $Files) {
                    try {
                        $FileSize = $File.Length
                        Remove-Item -Path $File.FullName -Force -ErrorAction SilentlyContinue
                        $CleanedFiles++
                        $CleanedSize += $FileSize
                    }
                    catch {
                        # File might be in use, skip it
                    }
                }
                
                # Clean empty directories
                $Directories = Get-ChildItem -Path $TempPath -Recurse -Directory -ErrorAction SilentlyContinue | Sort-Object FullName -Descending
                foreach ($Directory in $Directories) {
                    try {
                        if ((Get-ChildItem -Path $Directory.FullName -ErrorAction SilentlyContinue).Count -eq 0) {
                            Remove-Item -Path $Directory.FullName -Force -ErrorAction SilentlyContinue
                        }
                    }
                    catch {
                        # Directory might be in use, skip it
                    }
                }
            }
            catch {
                Write-Log "Error cleaning temp path $TempPath : $($_.Exception.Message)" "WARNING"
            }
        }
    }
    
    Write-Log "Cleaned $CleanedFiles temporary files ($([math]::Round($CleanedSize/1MB, 2)) MB)" "INFO"
}

function Clean-RegistryThreats {
    Write-Log "Cleaning registry threats..." "INFO"
    
    $RegistryPaths = @(
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
        "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce",
        "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce"
    )
    
    $RemovedEntries = 0
    
    foreach ($RegPath in $RegistryPaths) {
        try {
            $RegEntries = Get-ItemProperty -Path $RegPath -ErrorAction SilentlyContinue
            if ($RegEntries) {
                foreach ($Property in $RegEntries.PSObject.Properties) {
                    if ($Property.Name -notmatch "^PS" -and $Property.Value) {
                        # Check for suspicious patterns
                        if ($Property.Value -match "(temp|appdata|roaming).*\.(exe|bat|cmd|scr)" -and 
                            $Property.Value -match "(virus|trojan|malware|keylog|backdoor)") {
                            
                            Write-Log "Removing suspicious registry entry: $($Property.Name) = $($Property.Value)" "WARNING"
                            try {
                                Remove-ItemProperty -Path $RegPath -Name $Property.Name -Force
                                $RemovedEntries++
                            }
                            catch {
                                Write-Log "Failed to remove registry entry: $($_.Exception.Message)" "ERROR"
                            }
                        }
                    }
                }
            }
        }
        catch {
            Write-Log "Error scanning registry path $RegPath : $($_.Exception.Message)" "WARNING"
        }
    }
    
    Write-Log "Removed $RemovedEntries suspicious registry entries" "INFO"
}

function Disable-NetworkConnections {
    if ($NetworkIsolate) {
        Write-Log "Isolating system from network..." "WARNING"
        
        try {
            # Disable network adapters
            $NetworkAdapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
            foreach ($Adapter in $NetworkAdapters) {
                Disable-NetAdapter -Name $Adapter.Name -Confirm:$false
                Write-Log "Disabled network adapter: $($Adapter.Name)" "WARNING"
            }
            
            Write-Log "System isolated from network. Re-enable adapters manually when safe." "WARNING"
        }
        catch {
            Write-Log "Failed to isolate network: $($_.Exception.Message)" "ERROR"
        }
    }
}

function Run-SystemFileCheck {
    Write-Log "Running system file integrity check..." "INFO"
    
    try {
        $SfcResult = sfc /scannow 2>&1
        Write-Log "System File Checker completed" "INFO"
        
        # Check if any corruption was found
        if ($SfcResult -match "found corrupt files") {
            Write-Log "CRITICAL: System file corruption detected!" "ERROR"
        }
        elseif ($SfcResult -match "did not find any integrity violations") {
            Write-Log "System files integrity verified" "INFO"
        }
    }
    catch {
        Write-Log "Failed to run system file check: $($_.Exception.Message)" "WARNING"
    }
}

function Reset-NetworkSettings {
    if ($DeepClean) {
        Write-Log "Resetting network settings..." "INFO"
        
        try {
            # Reset Winsock
            netsh winsock reset | Out-Null
            Write-Log "Winsock reset completed" "INFO"
            
            # Reset TCP/IP stack
            netsh int ip reset | Out-Null
            Write-Log "TCP/IP stack reset completed" "INFO"
            
            # Flush DNS
            ipconfig /flushdns | Out-Null
            Write-Log "DNS cache flushed" "INFO"
            
            Write-Log "Network settings reset. Restart required to take effect." "WARNING"
        }
        catch {
            Write-Log "Failed to reset network settings: $($_.Exception.Message)" "ERROR"
        }
    }
}

# Main execution
Write-Log "=== PURGE ANTIVIRUS EMERGENCY CLEANUP STARTED ===" "ERROR"
Write-Log "WARNING: This is an emergency cleanup procedure!" "WARNING"

if (!(Test-AdminRights)) {
    Write-Log "ERROR: Administrator privileges required for emergency cleanup" "ERROR"
    exit 1
}

if (!$Force) {
    Write-Log "Emergency cleanup requires -Force parameter to proceed" "WARNING"
    Write-Log "This operation will:" "WARNING"
    Write-Log "  - Stop suspicious processes" "WARNING"
    Write-Log "  - Clean temporary files" "WARNING"
    Write-Log "  - Remove suspicious registry entries" "WARNING"
    Write-Log "  - Run system integrity checks" "WARNING"
    if ($DeepClean) {
        Write-Log "  - Reset network settings (requires restart)" "WARNING"
    }
    if ($NetworkIsolate) {
        Write-Log "  - Isolate system from network" "WARNING"
    }
    Write-Log "Use -Force to proceed with emergency cleanup" "WARNING"
    exit 1
}

Write-Log "Starting emergency cleanup procedures..." "ERROR"

# Execute cleanup procedures
Stop-SuspiciousProcesses
Clean-TempFiles
Clean-RegistryThreats
Disable-NetworkConnections
Run-SystemFileCheck
Reset-NetworkSettings

# Run Windows Defender quick scan
Write-Log "Running Windows Defender emergency scan..." "INFO"
try {
    Start-MpScan -ScanType QuickScan
    Write-Log "Windows Defender scan initiated" "INFO"
}
catch {
    Write-Log "Failed to start Windows Defender scan: $($_.Exception.Message)" "WARNING"
}

# Final system check
Write-Log "Performing final system check..." "INFO"
$RunningProcesses = Get-Process | Where-Object { $_.ProcessName -match "(virus|trojan|malware|keylog|backdoor)" }
if ($RunningProcesses.Count -gt 0) {
    Write-Log "WARNING: $($RunningProcesses.Count) suspicious processes still running!" "WARNING"
    foreach ($Process in $RunningProcesses) {
        Write-Log "Suspicious process: $($Process.ProcessName) (PID: $($Process.Id))" "WARNING"
    }
}
else {
    Write-Log "No suspicious processes detected" "INFO"
}

$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Log "=== EMERGENCY CLEANUP COMPLETED ===" "INFO"
Write-Log "Cleanup duration: $($Duration.TotalMinutes) minutes" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

if ($DeepClean -or $NetworkIsolate) {
    Write-Log "SYSTEM RESTART REQUIRED to complete cleanup" "WARNING"
}

Write-Log "RECOMMENDATION: Run a full system scan after cleanup" "INFO"
Write-Log "Emergency cleanup procedure completed" "INFO"

exit 0