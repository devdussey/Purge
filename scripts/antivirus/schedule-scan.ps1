# Purge Antivirus - Schedule Scan Script
# Author: DevDussey
# Description: Creates scheduled scans using Windows Task Scheduler

param(
    [string]$LogPath = "$env:TEMP\purge-antivirus-logs",
    [string]$ScanType = "Quick",  # Quick, Full, Custom
    [string]$Schedule = "Daily",   # Daily, Weekly, Monthly
    [string]$Time = "02:00",      # Time in HH:MM format
    [switch]$Remove,
    [switch]$List
)

if (!(Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

$LogFile = "$LogPath\schedule-scan-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

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

Write-Log "=== Purge Antivirus Schedule Scan Started ===" "INFO"

if (!(Test-AdminRights)) {
    Write-Log "ERROR: Administrator privileges required to manage scheduled tasks" "ERROR"
    exit 1
}

$TaskName = "Purge-Antivirus-$ScanType-Scan"
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($List) {
    Write-Log "Listing existing Purge Antivirus scheduled tasks..." "INFO"
    try {
        $Tasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "Purge-Antivirus*" }
        if ($Tasks) {
            foreach ($Task in $Tasks) {
                $TaskInfo = Get-ScheduledTaskInfo -TaskName $Task.TaskName
                Write-Log "Task: $($Task.TaskName)" "INFO"
                Write-Log "  State: $($Task.State)" "INFO"
                Write-Log "  Last Run: $($TaskInfo.LastRunTime)" "INFO"
                Write-Log "  Next Run: $($TaskInfo.NextRunTime)" "INFO"
                Write-Log "  Last Result: $($TaskInfo.LastTaskResult)" "INFO"
            }
        }
        else {
            Write-Log "No Purge Antivirus scheduled tasks found" "INFO"
        }
    }
    catch {
        Write-Log "Error listing scheduled tasks: $($_.Exception.Message)" "ERROR"
    }
    exit 0
}

if ($Remove) {
    Write-Log "Removing scheduled task: $TaskName" "INFO"
    try {
        $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        if ($ExistingTask) {
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Log "Scheduled task '$TaskName' removed successfully" "INFO"
        }
        else {
            Write-Log "Scheduled task '$TaskName' not found" "WARNING"
        }
    }
    catch {
        Write-Log "Error removing scheduled task: $($_.Exception.Message)" "ERROR"
        exit 1
    }
    exit 0
}

# Create scheduled task
Write-Log "Creating scheduled task: $TaskName" "INFO"
Write-Log "Scan Type: $ScanType" "INFO"
Write-Log "Schedule: $Schedule" "INFO"
Write-Log "Time: $Time" "INFO"

try {
    # Remove existing task if it exists
    $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($ExistingTask) {
        Write-Log "Removing existing task: $TaskName" "INFO"
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    }
    
    # Determine script to run
    $ScriptToRun = switch ($ScanType.ToLower()) {
        "quick" { "$ScriptPath\quick-scan.ps1" }
        "full" { "$ScriptPath\full-scan.ps1" }
        default { "$ScriptPath\quick-scan.ps1" }
    }
    
    # Create action
    $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptToRun`""
    
    # Create trigger based on schedule
    $Trigger = switch ($Schedule.ToLower()) {
        "daily" {
            New-ScheduledTaskTrigger -Daily -At $Time
        }
        "weekly" {
            New-ScheduledTaskTrigger -Weekly -WeeksInterval 1 -DaysOfWeek Sunday -At $Time
        }
        "monthly" {
            New-ScheduledTaskTrigger -Weekly -WeeksInterval 4 -DaysOfWeek Sunday -At $Time
        }
        default {
            New-ScheduledTaskTrigger -Daily -At $Time
        }
    }
    
    # Create principal (run as SYSTEM with highest privileges)
    $Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    
    # Create settings
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false
    
    # Register the task
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Description "Purge Antivirus $ScanType Scan - Scheduled $Schedule at $Time"
    
    Write-Log "Scheduled task created successfully" "INFO"
    
    # Verify task creation
    $CreatedTask = Get-ScheduledTask -TaskName $TaskName
    if ($CreatedTask) {
        Write-Log "Task verification successful" "INFO"
        Write-Log "Task State: $($CreatedTask.State)" "INFO"
        
        $TaskInfo = Get-ScheduledTaskInfo -TaskName $TaskName
        Write-Log "Next Run Time: $($TaskInfo.NextRunTime)" "INFO"
    }
}
catch {
    Write-Log "Error creating scheduled task: $($_.Exception.Message)" "ERROR"
    exit 1
}

# Create additional maintenance tasks
Write-Log "Creating maintenance scheduled tasks..." "INFO"

try {
    # Daily definition update task
    $UpdateTaskName = "Purge-Antivirus-Update-Definitions"
    $UpdateAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath\update-definitions.ps1`""
    $UpdateTrigger = New-ScheduledTaskTrigger -Daily -At "01:00"
    
    $ExistingUpdateTask = Get-ScheduledTask -TaskName $UpdateTaskName -ErrorAction SilentlyContinue
    if ($ExistingUpdateTask) {
        Unregister-ScheduledTask -TaskName $UpdateTaskName -Confirm:$false
    }
    
    Register-ScheduledTask -TaskName $UpdateTaskName -Action $UpdateAction -Trigger $UpdateTrigger -Principal $Principal -Settings $Settings -Description "Purge Antivirus - Daily Definition Updates"
    Write-Log "Definition update task created" "INFO"
    
    # Weekly cleanup task
    $CleanupTaskName = "Purge-Antivirus-Weekly-Cleanup"
    $CleanupAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath\emergency-cleanup.ps1`""
    $CleanupTrigger = New-ScheduledTaskTrigger -Weekly -WeeksInterval 1 -DaysOfWeek Saturday -At "03:00"
    
    $ExistingCleanupTask = Get-ScheduledTask -TaskName $CleanupTaskName -ErrorAction SilentlyContinue
    if ($ExistingCleanupTask) {
        Unregister-ScheduledTask -TaskName $CleanupTaskName -Confirm:$false
    }
    
    Register-ScheduledTask -TaskName $CleanupTaskName -Action $CleanupAction -Trigger $CleanupTrigger -Principal $Principal -Settings $Settings -Description "Purge Antivirus - Weekly System Cleanup"
    Write-Log "Weekly cleanup task created" "INFO"
}
catch {
    Write-Log "Warning: Could not create all maintenance tasks: $($_.Exception.Message)" "WARNING"
}

Write-Log "=== Schedule Scan Configuration Completed ===" "INFO"
Write-Log "Main scan task: $TaskName" "INFO"
Write-Log "Schedule: $Schedule at $Time" "INFO"
Write-Log "Script: $ScriptToRun" "INFO"
Write-Log "Log saved to: $LogFile" "INFO"

exit 0