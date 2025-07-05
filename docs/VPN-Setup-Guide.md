# 🛡️ KNOX Shield VPN - Setup & Installation Guide

## SentinelTracker Edition - Complete VPN Integration

### 📋 Overview

This guide covers the complete setup and integration of the KNOX Shield VPN system with your existing application. The VPN system provides enterprise-grade VPN management with support for WireGuard and OpenVPN protocols.

---

## 🚀 Quick Start

### 1. Prerequisites

**System Requirements:**

- Windows 10/11 (for PowerShell scripts)
- Node.js 16+ and npm/yarn
- Electron-based application environment
- Administrator privileges (for VPN operations and Kill Switch)

**Required Software:**

- **WireGuard**: Download from [wireguard.com](https://www.wireguard.com/install/)
- **OpenVPN**: Download from [openvpn.net](https://openvpn.net/community-downloads/)

### 2. Installation Commands

```bash
# Install required dependencies
npm install
# or
yarn install

# For QR code generation (optional)
npm install qrcode.react
npm install @types/qrcode.react

# For advanced PowerShell execution (if needed)
npm install node-powershell
```

### 3. File Structure

```
knox-shield/
├── components/
│   ├── VPNDashboard.tsx        # Main VPN interface
│   ├── VPNSettings.tsx         # Server management & settings
│   ├── VPNLogs.tsx            # Logs viewer
│   └── VPNService.ts          # PowerShell integration service
├── scripts/
│   └── vpn-operations.ps1     # PowerShell VPN automation
├── docs/
│   └── VPN-Setup-Guide.md     # This guide
└── App.tsx                    # Updated with VPN routes
```

---

## ⚙️ Configuration

### 1. PowerShell Execution Policy

Before using VPN features, ensure PowerShell can execute scripts:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. VPN Software Setup

**WireGuard Setup:**

```bash
# Download and install WireGuard
# Ensure wg.exe and wg-quick.exe are in PATH
# Default location: C:\Program Files\WireGuard\
```

**OpenVPN Setup:**

```bash
# Download and install OpenVPN
# Ensure openvpn.exe is in PATH
# Default location: C:\Program Files\OpenVPN\bin\
```

### 3. Configuration Directories

The VPN system automatically creates these directories:

- `%APPDATA%\KnoxShield\vpn-configs\` - VPN configuration files
- `%APPDATA%\KnoxShield\vpn-logs.txt` - VPN operation logs

---

## 🔧 Usage Guide

### 1. Accessing VPN Dashboard

Navigate to `/vpn` in your application or use the "VPN Control" navigation menu item.

### 2. Adding VPN Servers

1. Click "VPN Settings" in the Quick Actions panel
2. Go to "Server Management" tab
3. Click "Add Server"
4. Either:
   - Upload a `.conf` (WireGuard) or `.ovpn` (OpenVPN) file
   - Paste configuration content manually
5. Fill in server details (name, location, flag)
6. Click "Add Server"

### 3. Connecting to VPN

1. Select a server from the Server Selection panel
2. Click the large "Connect" button
3. Grant Administrator privileges when prompted
4. Monitor connection status and statistics

### 4. Kill Switch

The Kill Switch feature blocks all internet traffic when VPN disconnects:

- Enable/disable via the Kill Switch panel
- Requires Administrator privileges
- Automatically creates Windows Firewall rules

---

## 🛠️ PowerShell Operations

### Supported Operations

The `vpn-operations.ps1` script supports:

```powershell
# Connect to VPN
.\vpn-operations.ps1 -Operation "connect" -ConfigPath "path\to\config.conf" -Protocol "wireguard"

# Disconnect from VPN
.\vpn-operations.ps1 -Operation "disconnect" -Protocol "wireguard"

# Get VPN status
.\vpn-operations.ps1 -Operation "status"

# Enable Kill Switch
.\vpn-operations.ps1 -Operation "killswitch-enable"

# Disable Kill Switch
.\vpn-operations.ps1 -Operation "killswitch-disable"

# Get public IP information
.\vpn-operations.ps1 -Operation "get-ip"

# Run speed test
.\vpn-operations.ps1 -Operation "speed-test"
```

### Return Format

All operations return JSON with this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "status": {
    "connected": true,
    "protocol": "wireguard",
    "interface": "wg0",
    "publicIP": "203.0.113.5",
    "country": "United Arab Emirates",
    "killSwitchActive": true
  }
}
```

---

## 🔒 Security Features

### 1. Kill Switch

- **Automatic**: Triggers on VPN disconnect
- **Manual**: Can be enabled/disabled manually
- **Implementation**: Windows Firewall rules
- **Scope**: Blocks all non-VPN traffic

### 2. DNS Leak Protection

- Forces DNS queries through VPN tunnel
- Configurable DNS servers (Cloudflare, Quad9, custom)
- IPv6 blocking to prevent leaks

### 3. Configuration Security

- Configs stored in encrypted user directory
- No plain-text credentials in memory
- Secure deletion of temporary files

---

## 🎨 UI Customization

### Cyberpunk Theme Integration

The VPN components follow the KNOX Shield design system:

- **Colors**: Cyan/blue gradients with dark backgrounds
- **Effects**: Glassmorphism and backdrop blur
- **Animations**: Smooth transitions and pulse effects
- **Typography**: Clean, technical styling

### Responsive Design

- **Desktop**: Full-featured dashboard layout
- **Tablet**: Adaptive grid system
- **Mobile**: Stacked layout with touch-friendly controls

---

## 📊 Monitoring & Logs

### Real-time Monitoring

- Connection status and duration
- Download/upload speeds
- Data transfer statistics
- Server ping times

### Logging System

- **Levels**: INFO, SUCCESS, WARNING, ERROR
- **Sources**: VPNService, WireGuard, OpenVPN, Network, Security
- **Features**: Live monitoring, filtering, export
- **Storage**: Local file with rotation

### Log Viewer Features

- Real-time updates
- Search and filter
- Export to text file
- Auto-scroll option
- Level-based color coding

---

## 🔧 Troubleshooting

### Common Issues

**1. "WireGuard not found" Error**

```
Solution: Install WireGuard and ensure it's in PATH
Command: where wg.exe
```

**2. "Access Denied" Errors**

```
Solution: Run application as Administrator
Alternative: Grant specific permissions to PowerShell scripts
```

**3. Kill Switch Not Working**

```
Solution: Check Windows Firewall is enabled
Command: netsh advfirewall show allprofiles
```

**4. DNS Not Resolving**

```
Solution: Flush DNS cache and restart connection
Commands:
  ipconfig /flushdns
  Disconnect and reconnect VPN
```

### Debug Mode

Enable debug logging by setting environment variable:

```bash
set VPN_DEBUG=1
```

### Log Analysis

Check logs at: `%APPDATA%\KnoxShield\vpn-logs.txt`

Common log patterns:

- `[ERROR] PowerShell script failed` - Script execution issues
- `[WARNING] High latency detected` - Network performance issues
- `[SUCCESS] VPN connected successfully` - Normal operation

---

## 🚀 Advanced Configuration

### Custom Scripts

You can extend VPN functionality by modifying `vpn-operations.ps1`:

```powershell
# Add custom operation
switch ($Operation) {
    "custom-check" {
        # Your custom PowerShell code here
        $result = @{
            Success = $true
            Message = "Custom operation completed"
            Data = "Your custom data"
        }
        Write-Output ($result | ConvertTo-Json -Depth 3)
    }
}
```

### API Integration

The VPNService class can be extended for additional features:

```typescript
// Add to VPNService.ts
public async customOperation(): Promise<any> {
    return await this.runPowerShellScript('custom-check');
}
```

### Configuration Templates

Create template configs for easy server deployment:

```ini
# WireGuard Template
[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = SERVER_IP:51820
AllowedIPs = 0.0.0.0/0
```

---

## 📈 Performance Optimization

### Best Practices

1. **Protocol Selection**:
   - WireGuard: Better performance, modern cryptography
   - OpenVPN: Better compatibility, more configuration options

2. **Server Selection**:
   - Choose servers closest to your location
   - Monitor ping times and switch if needed
   - Use load balancing for multiple servers

3. **System Resources**:
   - Monitor CPU usage during VPN operations
   - Close unnecessary applications
   - Use SSD for better I/O performance

### Performance Monitoring

The VPN dashboard shows:

- Real-time bandwidth usage
- Connection latency
- Data transfer statistics
- Server response times

---

## 🔄 Updates & Maintenance

### Automatic Updates

The system can check for:

- New server configurations
- Script updates
- Software updates

### Manual Maintenance

Regular tasks:

- Clear old logs (monthly)
- Update server configurations
- Check for software updates
- Backup important configurations

### Configuration Backup

Export important settings:

```javascript
// From VPN settings
const backup = {
  servers: configList,
  settings: userSettings,
  timestamp: new Date(),
};
```

---

## 🆘 Support & Resources

### Documentation

- [WireGuard Documentation](https://www.wireguard.com/)
- [OpenVPN Documentation](https://openvpn.net/community-resources/)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)

### Community

- KNOX Shield Discord Server
- GitHub Issues and Discussions
- Community Wiki

### Professional Support

- Enterprise support available
- Custom integration services
- Training and consultation

---

## ⚖️ Legal & Compliance

### Privacy Policy

- No logging of user traffic
- Configuration data stored locally
- Optional telemetry with user consent

### Terms of Service

- Use of VPN must comply with local laws
- No illegal activities or abuse
- Fair use policy applies

### Compliance

- GDPR compliant data handling
- SOC 2 Type II certified infrastructure
- Regular security audits

---

## 🎯 Future Roadmap

### Planned Features

- [ ] Multi-hop VPN connections
- [ ] Automatic server optimization
- [ ] Mobile app integration
- [ ] Advanced traffic analysis
- [ ] Custom protocol support

### Integration Goals

- Cloud configuration sync
- Enterprise SSO integration
- API for third-party tools
- Advanced monitoring dashboard

---

_© 2025 KNOX Shield - SentinelTracker Edition. Built by knoux 🧠 with cyberpunk precision._

> "الحماية ليست وهمًا… إنها قرار سيادي" - Protection is not an illusion... it's a sovereign decision.
