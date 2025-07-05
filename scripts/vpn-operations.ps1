# KNOX Shield VPN Operations PowerShell Script
# SentinelTracker Edition - VPN Management System

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("connect", "disconnect", "status", "killswitch-enable", "killswitch-disable", "get-ip", "speed-test")]
    [string]$Operation,
    
    [Parameter(Mandatory=$false)]
    [string]$ConfigPath,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("wireguard", "openvpn")]
    [string]$Protocol = "wireguard",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Global Variables
$Script:LogFile = "$env:APPDATA\KnoxShield\vpn-logs.txt"
$Script:ConfigDir = "$env:APPDATA\KnoxShield\vpn-configs"
$Script:KillSwitchActive = $false

# Ensure directories exist
if (!(Test-Path (Split-Path $Script:LogFile -Parent))) {
    New-Item -ItemType Directory -Path (Split-Path $Script:LogFile -Parent) -Force | Out-Null
}
if (!(Test-Path $Script:ConfigDir)) {
    New-Item -ItemType Directory -Path $Script:ConfigDir -Force | Out-Null
}

# Logging function
function Write-VPNLog {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $Script:LogFile -Value $logEntry
    Write-Host $logEntry
}

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Get current public IP and location
function Get-PublicIPInfo {
    try {
        Write-VPNLog "Fetching public IP information..."
        $ipInfo = Invoke-RestMethod -Uri "http://ipapi.co/json/" -TimeoutSec 10
        return @{
            IP = $ipInfo.ip
            Country = $ipInfo.country_name
            City = $ipInfo.city
            ISP = $ipInfo.org
            Success = $true
        }
    } catch {
        Write-VPNLog "Failed to get public IP: $($_.Exception.Message)" "ERROR"
        return @{
            IP = "Unknown"
            Country = "Unknown"
            City = "Unknown"
            ISP = "Unknown"
            Success = $false
        }
    }
}

# WireGuard Operations
function Connect-WireGuard {
    param([string]$ConfigFile)
    
    if (!(Test-Path $ConfigFile)) {
        Write-VPNLog "WireGuard config file not found: $ConfigFile" "ERROR"
        return $false
    }
    
    try {
        Write-VPNLog "Connecting to WireGuard using config: $ConfigFile"
        
        # Check if WireGuard is installed
        $wgPath = Get-Command "wg.exe" -ErrorAction SilentlyContinue
        if (!$wgPath) {
            Write-VPNLog "WireGuard not found. Please install WireGuard first." "ERROR"
            return $false
        }
        
        # Start WireGuard connection
        $process = Start-Process -FilePath "wg-quick.exe" -ArgumentList "up", $ConfigFile -PassThru -WindowStyle Hidden
        Start-Sleep -Seconds 3
        
        # Verify connection
        $wgStatus = & wg.exe show
        if ($LASTEXITCODE -eq 0 -and $wgStatus) {
            Write-VPNLog "WireGuard connected successfully" "SUCCESS"
            return $true
        } else {
            Write-VPNLog "WireGuard connection failed" "ERROR"
            return $false
        }
    } catch {
        Write-VPNLog "WireGuard connection error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Disconnect-WireGuard {
    param([string]$ConfigFile)
    
    try {
        Write-VPNLog "Disconnecting WireGuard..."
        
        if ($ConfigFile -and (Test-Path $ConfigFile)) {
            & wg-quick.exe down $ConfigFile
        } else {
            # Try to disconnect all interfaces
            $interfaces = & wg.exe show interfaces 2>$null
            foreach ($interface in $interfaces) {
                & wg-quick.exe down $interface
            }
        }
        
        Write-VPNLog "WireGuard disconnected" "SUCCESS"
        return $true
    } catch {
        Write-VPNLog "WireGuard disconnect error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# OpenVPN Operations
function Connect-OpenVPN {
    param([string]$ConfigFile)
    
    if (!(Test-Path $ConfigFile)) {
        Write-VPNLog "OpenVPN config file not found: $ConfigFile" "ERROR"
        return $false
    }
    
    try {
        Write-VPNLog "Connecting to OpenVPN using config: $ConfigFile"
        
        # Check if OpenVPN is installed
        $ovpnPath = Get-Command "openvpn.exe" -ErrorAction SilentlyContinue
        if (!$ovpnPath) {
            Write-VPNLog "OpenVPN not found. Please install OpenVPN first." "ERROR"
            return $false
        }
        
        # Start OpenVPN connection
        $process = Start-Process -FilePath "openvpn.exe" -ArgumentList "--config", $ConfigFile, "--daemon" -PassThru -WindowStyle Hidden
        Start-Sleep -Seconds 5
        
        # Check if process is running
        if (Get-Process -Name "openvpn" -ErrorAction SilentlyContinue) {
            Write-VPNLog "OpenVPN connected successfully" "SUCCESS"
            return $true
        } else {
            Write-VPNLog "OpenVPN connection failed" "ERROR"
            return $false
        }
    } catch {
        Write-VPNLog "OpenVPN connection error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Disconnect-OpenVPN {
    try {
        Write-VPNLog "Disconnecting OpenVPN..."
        
        # Kill all OpenVPN processes
        Get-Process -Name "openvpn" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        Write-VPNLog "OpenVPN disconnected" "SUCCESS"
        return $true
    } catch {
        Write-VPNLog "OpenVPN disconnect error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Kill Switch Functions
function Enable-KillSwitch {
    if (!(Test-Administrator)) {
        Write-VPNLog "Kill Switch requires Administrator privileges" "ERROR"
        return $false
    }
    
    try {
        Write-VPNLog "Enabling Kill Switch..."
        
        # Block all traffic except VPN
        netsh advfirewall firewall add rule name="KNOX_KILL_SWITCH_BLOCK_ALL" dir=out action=block
        netsh advfirewall firewall add rule name="KNOX_KILL_SWITCH_ALLOW_LOCAL" dir=out action=allow remoteip=192.168.0.0/16,10.0.0.0/8,172.16.0.0/12
        
        $Script:KillSwitchActive = $true
        Write-VPNLog "Kill Switch enabled successfully" "SUCCESS"
        return $true
    } catch {
        Write-VPNLog "Kill Switch enable error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Disable-KillSwitch {
    if (!(Test-Administrator)) {
        Write-VPNLog "Kill Switch requires Administrator privileges" "ERROR"
        return $false
    }
    
    try {
        Write-VPNLog "Disabling Kill Switch..."
        
        # Remove firewall rules
        netsh advfirewall firewall delete rule name="KNOX_KILL_SWITCH_BLOCK_ALL" 2>$null
        netsh advfirewall firewall delete rule name="KNOX_KILL_SWITCH_ALLOW_LOCAL" 2>$null
        
        $Script:KillSwitchActive = $false
        Write-VPNLog "Kill Switch disabled successfully" "SUCCESS"
        return $true
    } catch {
        Write-VPNLog "Kill Switch disable error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Network Speed Test
function Test-NetworkSpeed {
    try {
        Write-VPNLog "Testing network speed..."
        
        # Simple download speed test
        $testUrl = "http://speedtest.ftp.otenet.gr/files/test1Mb.db"
        $startTime = Get-Date
        
        try {
            Invoke-WebRequest -Uri $testUrl -OutFile "$env:TEMP\speedtest.tmp" -TimeoutSec 30
            $endTime = Get-Date
            $duration = ($endTime - $startTime).TotalSeconds
            $fileSize = (Get-Item "$env:TEMP\speedtest.tmp").Length
            $speedMbps = [math]::Round(($fileSize * 8 / 1MB) / $duration, 2)
            
            Remove-Item "$env:TEMP\speedtest.tmp" -Force -ErrorAction SilentlyContinue
            
            Write-VPNLog "Speed test completed: $speedMbps Mbps" "SUCCESS"
            return @{
                DownloadSpeed = $speedMbps
                Success = $true
            }
        } catch {
            Write-VPNLog "Speed test failed: $($_.Exception.Message)" "ERROR"
            return @{
                DownloadSpeed = 0
                Success = $false
            }
        }
    } catch {
        Write-VPNLog "Speed test error: $($_.Exception.Message)" "ERROR"
        return @{
            DownloadSpeed = 0
            Success = $false
        }
    }
}

# Get VPN Status
function Get-VPNStatus {
    try {
        $status = @{
            Connected = $false
            Protocol = "none"
            Interface = "none"
            PublicIP = "Unknown"
            Country = "Unknown"
            KillSwitchActive = $Script:KillSwitchActive
        }
        
        # Check WireGuard
        try {
            $wgInterfaces = & wg.exe show interfaces 2>$null
            if ($wgInterfaces -and $wgInterfaces.Length -gt 0) {
                $status.Connected = $true
                $status.Protocol = "wireguard"
                $status.Interface = $wgInterfaces[0]
            }
        } catch { }
        
        # Check OpenVPN if WireGuard not connected
        if (!$status.Connected) {
            $ovpnProcess = Get-Process -Name "openvpn" -ErrorAction SilentlyContinue
            if ($ovpnProcess) {
                $status.Connected = $true
                $status.Protocol = "openvpn"
                $status.Interface = "TAP-Windows"
            }
        }
        
        # Get IP info if connected
        if ($status.Connected) {
            $ipInfo = Get-PublicIPInfo
            if ($ipInfo.Success) {
                $status.PublicIP = $ipInfo.IP
                $status.Country = $ipInfo.Country
            }
        }
        
        return $status
    } catch {
        Write-VPNLog "Status check error: $($_.Exception.Message)" "ERROR"
        return @{
            Connected = $false
            Protocol = "none"
            Interface = "none"
            PublicIP = "Unknown"
            Country = "Unknown"
            KillSwitchActive = $false
        }
    }
}

# Main Operation Handler
try {
    Write-VPNLog "Starting VPN operation: $Operation"
    
    switch ($Operation) {
        "connect" {
            if (!$ConfigPath) {
                Write-VPNLog "Config path is required for connect operation" "ERROR"
                exit 1
            }
            
            $success = switch ($Protocol) {
                "wireguard" { Connect-WireGuard -ConfigFile $ConfigPath }
                "openvpn" { Connect-OpenVPN -ConfigFile $ConfigPath }
                default { 
                    Write-VPNLog "Unknown protocol: $Protocol" "ERROR"
                    $false
                }
            }
            
            if ($success) {
                # Get updated status
                Start-Sleep -Seconds 2
                $status = Get-VPNStatus
                $result = @{
                    Success = $true
                    Message = "VPN connected successfully"
                    Status = $status
                }
            } else {
                $result = @{
                    Success = $false
                    Message = "VPN connection failed"
                    Status = Get-VPNStatus
                }
            }
            
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
        "disconnect" {
            $success = switch ($Protocol) {
                "wireguard" { Disconnect-WireGuard -ConfigFile $ConfigPath }
                "openvpn" { Disconnect-OpenVPN }
                default {
                    # Try both protocols
                    $wgSuccess = Disconnect-WireGuard
                    $ovpnSuccess = Disconnect-OpenVPN
                    $wgSuccess -or $ovpnSuccess
                }
            }
            
            $result = @{
                Success = $success
                Message = if ($success) { "VPN disconnected successfully" } else { "VPN disconnect failed" }
                Status = Get-VPNStatus
            }
            
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
        "status" {
            $status = Get-VPNStatus
            Write-Output ($status | ConvertTo-Json -Depth 3)
        }
        
        "killswitch-enable" {
            $success = Enable-KillSwitch
            $result = @{
                Success = $success
                Message = if ($success) { "Kill Switch enabled" } else { "Kill Switch enable failed" }
                KillSwitchActive = $success
            }
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
        "killswitch-disable" {
            $success = Disable-KillSwitch
            $result = @{
                Success = $success
                Message = if ($success) { "Kill Switch disabled" } else { "Kill Switch disable failed" }
                KillSwitchActive = !$success
            }
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
        "get-ip" {
            $ipInfo = Get-PublicIPInfo
            Write-Output ($ipInfo | ConvertTo-Json -Depth 3)
        }
        
        "speed-test" {
            $speedResult = Test-NetworkSpeed
            Write-Output ($speedResult | ConvertTo-Json -Depth 3)
        }
        
        default {
            Write-VPNLog "Unknown operation: $Operation" "ERROR"
            $result = @{
                Success = $false
                Message = "Unknown operation: $Operation"
            }
            Write-Output ($result | ConvertTo-Json -Depth 3)
            exit 1
        }
    }
    
    Write-VPNLog "VPN operation completed: $Operation" "SUCCESS"
    
} catch {
    Write-VPNLog "Critical error: $($_.Exception.Message)" "ERROR"
    $errorResult = @{
        Success = $false
        Message = "Critical error: $($_.Exception.Message)"
        Error = $_.Exception.GetType().Name
    }
    Write-Output ($errorResult | ConvertTo-Json -Depth 3)
    exit 1
}
