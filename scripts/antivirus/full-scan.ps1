# Purge Antivirus - Full System Scan Script
# Author: DevDussey
# Description: Performs a comprehensive system scan

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [switch]$Verbose,
    [switch]$QuarantineThreats
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\full-scan-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$QuarantinePath = "$LogPath\quarantine"
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

function Move-ToQuarantine {
    param([string]$FilePath)
    
    if (!(Test-Path $QuarantinePath)) {
        New-Item -ItemType Directory -Path $QuarantinePath -Force | Out-Null
    }
    
    $FileName = Split-Path $FilePath -Leaf
    $QuarantineFile = "$QuarantinePath\$FileName.quarantine"
    
    try {
        Move-Item -Path $FilePath -Destination $QuarantineFile -Force
        Write-Log "File quarantined: $FilePath -> $QuarantineFile" "INFO"
        return $true
    }
    catch {
        Write-Log "Failed to quarantine file: $FilePath - $($_.Exception.Message)" "ERROR"
        return $false
    }
}

Write-Log "=== Purge Antivirus Full System Scan Started ===" "INFO"

if (!(Test-AdminRights)) {
    Write-Log "ERROR: Full scan requires administrator privileges" "ERROR"
    exit 1
}

# Get all drives
$Drives = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DriveType -eq 3 }
$TotalFiles = 0
$ScannedFiles = 0
$ThreatCount = 0
$QuarantinedCount = 0

Write-Log "Scanning drives: $($Drives.DeviceID -join ', ')" "INFO"

foreach ($Drive in $Drives) {
    $DrivePath = $Drive.DeviceID + "\"
    Write-Log "Scanning drive: $DrivePath" "INFO"
    
    try {
        # Get all files recursively
        $Files = Get-ChildItem -Path $DrivePath -Recurse -File -ErrorAction SilentlyContinue | 
                 Where-Object { $_.Extension -match '\.(exe|scr|bat|cmd|com|pif|vbs|js|jar|dll|sys)$' }
        
        $TotalFiles += $Files.Count
        Write-Log "Found $($Files.Count) executable files on $DrivePath" "INFO"
        
        foreach ($File in $Files) {
            $ScannedFiles++
            
            # Progress indicator
            if ($ScannedFiles % 100 -eq 0) {
                Write-Progress -Activity "Full System Scan" -Status "Scanned $ScannedFiles of $TotalFiles files" -PercentComplete (($ScannedFiles / $TotalFiles) * 100)
            }
            
            $IsThreat = $false
            
            # File size checks
            if ($File.Length -lt 500 -and $File.Extension -eq ".exe") {
                Write-Log "THREAT: Suspiciously small executable - $($File.FullName)" "ERROR"
                $IsThreat = $true
            }
            
            # Filename pattern matching
            if ($File.Name -match "(virus|trojan|malware|keylog|backdoor|ransomware|spyware|adware|rootkit)") {
                Write-Log "THREAT: Suspicious filename pattern - $($File.FullName)" "ERROR"
                $IsThreat = $true
            }
            
            # Check file hash against known malware (simplified)
            try {
                $Hash = Get-FileHash -Path $File.FullName -Algorithm SHA256 -ErrorAction SilentlyContinue
                # In a real implementation, you'd check against a malware hash database
                if ($Hash.Hash -eq "KNOWN_MALWARE_HASH_PLACEHOLDER") {
                    Write-Log "THREAT: Known malware hash detected - $($File.FullName)" "ERROR"
                    $IsThreat = $true
                }
            }
            catch {
                # File might be locked or inaccessible
            }
            
            # Check digital signature
            try {
                $Signature = Get-AuthenticodeSignature -FilePath $File.FullName -ErrorAction SilentlyContinue
                if ($Signature.Status -eq "NotSigned" -and $File.Extension -eq ".exe" -and $File.Length -gt 1MB) {
                    Write-Log "WARNING: Large unsigned executable - $($File.FullName)" "WARNING"
                }
            }
            catch {
                # Signature check failed
            }
            
            if ($IsThreat) {
                $ThreatCount++
                
                if ($QuarantineThreats) {
                    if (Move-ToQuarantine -FilePath $File.FullName) {
                        $QuarantinedCount++
                    }
                }
            }
        }
    }
    catch {
        Write-Log "Error scanning drive $DrivePath : $($_.Exception.Message)" "ERROR"
    }
}

# Registry scan for malicious entries
Write-Log "Scanning registry for malicious entries..." "INFO"
$RegistryPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce"
)

foreach ($RegPath in $RegistryPaths) {
    try {
        $RegEntries = Get-ItemProperty -Path $RegPath -ErrorAction SilentlyContinue
        if ($RegEntries) {
            foreach ($Property in $RegEntries.PSObject.Properties) {
                if ($Property.Name -notmatch "^PS" -and $Property.Value -match "(temp|appdata|roaming)" -and $Property.Value -match "\.exe") {
                    Write-Log "SUSPICIOUS: Registry autostart entry - $($Property.Name): $($Property.Value)" "WARNING"
                }
            }
        }
    }
    catch {
        Write-Log "Could not scan registry path: $RegPath" "WARNING"
    }
}

# Network connections check
Write-Log "Checking suspicious network connections..." "INFO"
try {
    $Connections = Get-NetTCPConnection | Where-Object { $_.State -eq "Established" }
    foreach ($Connection in $Connections) {
        $Process = Get-Process -Id $Connection.OwningProcess -ErrorAction SilentlyContinue
        if ($Process -and $Process.ProcessName -match "(virus|trojan|malware|miner)") {
            Write-Log "THREAT: Suspicious network connection from $($Process.ProcessName) to $($Connection.RemoteAddress):$($Connection.RemotePort)" "ERROR"
            $ThreatCount++
        }
    }
}
catch {
    Write-Log "Could not check network connections" "WARNING"
}

Write-Progress -Activity "Full System Scan" -Completed

$EndTime = Get-Date
$Duration = $EndTime - $StartTime

Write-Log "=== Full System Scan Completed ===" "INFO"
Write-Log "Total files scanned: $ScannedFiles" "INFO"
Write-Log "Threats detected: $ThreatCount" "INFO"
Write-Log "Files quarantined: $QuarantinedCount" "INFO"
Write-Log "Scan duration: $($Duration.TotalMinutes) minutes" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

if ($ThreatCount -gt 0) {
    Write-Log "SYSTEM INFECTED: $ThreatCount threats detected" "ERROR"
    exit 1
}
else {
    Write-Log "SYSTEM CLEAN: No threats detected" "INFO"
    exit 0
}