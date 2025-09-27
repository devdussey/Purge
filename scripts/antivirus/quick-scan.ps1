# Purge Antivirus - Quick Scan Script
# Author: DevDussey
# Description: Performs a quick system scan of critical areas

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$Verbose
)

# Ensure log directory exists
if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\quick-scan-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
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

Write-Log "=== Purge Antivirus Quick Scan Started ===" "INFO"
Write-Log "Scan initiated by: $env:USERNAME" "INFO"
Write-Log "Log file: $LogFile" "INFO"

if (!(Test-AdminRights)) {
    Write-Log "WARNING: Running without administrator privileges. Some scans may be limited." "WARNING"
}

# Critical directories to scan
$CriticalPaths = @(
    "$env:SYSTEMROOT\System32",
    "$env:SYSTEMROOT\SysWOW64",
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Documents",
    "$env:APPDATA",
    "$env:LOCALAPPDATA\Temp",
    "$env:TEMP"
)

$SuspiciousExtensions = @("*.exe", "*.scr", "*.bat", "*.cmd", "*.com", "*.pif", "*.vbs", "*.js", "*.jar")
$ThreatCount = 0
$ScannedFiles = 0

Write-Log "Starting quick scan of critical system areas..." "INFO"

foreach ($Path in $CriticalPaths) {
    if (Test-Path $Path) {
        Write-Log "Scanning: $Path" "INFO"
        
        try {
            foreach ($Extension in $SuspiciousExtensions) {
                $Files = Get-ChildItem -Path $Path -Filter $Extension -ErrorAction SilentlyContinue | Select-Object -First 100
                
                foreach ($File in $Files) {
                    $ScannedFiles++
                    
                    # Check file size (suspicious if very small or very large)
                    if ($File.Length -lt 1KB -or $File.Length -gt 100MB) {
                        Write-Log "Suspicious file size: $($File.FullName) ($($File.Length) bytes)" "WARNING"
                    }
                    
                    # Check for recently modified files
                    if ($File.LastWriteTime -gt (Get-Date).AddDays(-1)) {
                        Write-Log "Recently modified executable: $($File.FullName)" "WARNING"
                    }
                    
                    # Basic signature check (simplified)
                    if ($File.Name -match "(virus|trojan|malware|keylog|backdoor)" -and $File.Extension -eq ".exe") {
                        Write-Log "THREAT DETECTED: Suspicious filename pattern - $($File.FullName)" "ERROR"
                        $ThreatCount++
                    }
                }
            }
        }
        catch {
            Write-Log "Error scanning $Path : $($_.Exception.Message)" "ERROR"
        }
    }
    else {
        Write-Log "Path not found: $Path" "WARNING"
    }
}

# Check running processes for suspicious activity
Write-Log "Checking running processes..." "INFO"
$SuspiciousProcesses = Get-Process | Where-Object { 
    $_.ProcessName -match "(virus|trojan|malware|keylog|backdoor|miner)" -or
    $_.CPU -gt 80 -or
    ($_.WorkingSet -gt 500MB -and $_.ProcessName -notmatch "(chrome|firefox|explorer|system)")
}

foreach ($Process in $SuspiciousProcesses) {
    Write-Log "Suspicious process detected: $($Process.ProcessName) (PID: $($Process.Id), CPU: $($Process.CPU), Memory: $([math]::Round($Process.WorkingSet/1MB, 2))MB)" "WARNING"
    $ThreatCount++
}

# Check Windows Defender status
Write-Log "Checking Windows Defender status..." "INFO"
try {
    $DefenderStatus = Get-MpComputerStatus -ErrorAction SilentlyContinue
    if ($DefenderStatus) {
        Write-Log "Windows Defender Real-time Protection: $($DefenderStatus.RealTimeProtectionEnabled)" "INFO"
        Write-Log "Windows Defender Antivirus Enabled: $($DefenderStatus.AntivirusEnabled)" "INFO"
        Write-Log "Last Quick Scan: $($DefenderStatus.QuickScanStartTime)" "INFO"
    }
}
catch {
    Write-Log "Could not retrieve Windows Defender status" "WARNING"
}

$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Log "=== Quick Scan Completed ===" "INFO"
Write-Log "Files scanned: $ScannedFiles" "INFO"
Write-Log "Threats detected: $ThreatCount" "INFO"
Write-Log "Scan duration: $($Duration.TotalSeconds) seconds" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

if ($ThreatCount -gt 0) {
    Write-Log "RECOMMENDATION: Run a full system scan immediately" "WARNING"
    exit 1
}
else {
    Write-Log "System appears clean" "INFO"
    exit 0
}