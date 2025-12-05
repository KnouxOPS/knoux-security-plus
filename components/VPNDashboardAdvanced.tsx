import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  WifiIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CogIcon,
  DocumentTextIcon,
  PlayIcon,
  StopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  SignalIcon,
  CommandLineIcon,
  ServerIcon,
  BoltIcon,
  EyeIcon,
  NoSymbolIcon,
  CloudArrowUpIcon,
  QrCodeIcon,
  LockClosedIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// VPN Data Types based on the specifications
interface VPNServer {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  protocol: "wireguard" | "openvpn";
  configPath: string;
  ping?: number;
  status: "online" | "offline" | "connecting";
  isActive: boolean;
}

interface VPNLog {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "warning" | "error" | "debug";
  message: string;
  source?: string;
}

interface VPNStatus {
  connected: boolean;
  status: "Connected" | "Disconnected" | "Connecting";
  currentIP: string;
  publicIP: string;
  country: string;
  city: string;
  flag: string;
  connectionDuration: number;
  downloadSpeed: number;
  uploadSpeed: number;
  bytesReceived: number;
  bytesSent: number;
  killSwitchActive: boolean;
  protocol?: "wireguard" | "openvpn";
  serverName?: string;
}

interface VPNSettings {
  autoReconnect: boolean;
  startOnBoot: boolean;
  minimizeToTray: boolean;
  notifications: boolean;
  killSwitchOnDisconnect: boolean;
  dnsLeakProtection: boolean;
  ipv6Blocking: boolean;
  preferredProtocol: "wireguard" | "openvpn" | "automatic";
}

export const VPNDashboardAdvanced: React.FC = () => {
  // State Management
  const [vpnStatus, setVpnStatus] = useState<VPNStatus>({
    connected: false,
    status: "Disconnected",
    currentIP: "192.168.1.100",
    publicIP: "0.0.0.0",
    country: "United Arab Emirates",
    city: "Dubai",
    flag: "🇦🇪",
    connectionDuration: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    bytesReceived: 0,
    bytesSent: 0,
    killSwitchActive: false,
  });

  const [servers, setServers] = useState<VPNServer[]>([
    {
      id: "uae-dubai-premium",
      name: "UAE - Dubai Premium",
      location: "Dubai, UAE",
      country: "UAE",
      flag: "🇦🇪",
      protocol: "wireguard",
      configPath: "configs/uae-dubai.conf",
      ping: 15,
      status: "online",
      isActive: true,
    },
    {
      id: "germany-frankfurt",
      name: "Germany - Frankfurt",
      location: "Frankfurt, Germany",
      country: "Germany",
      flag: "🇩🇪",
      protocol: "openvpn",
      configPath: "configs/germany-frankfurt.ovpn",
      ping: 45,
      status: "online",
      isActive: false,
    },
    {
      id: "usa-newyork",
      name: "USA - New York",
      location: "New York, USA",
      country: "USA",
      flag: "🇺🇸",
      protocol: "wireguard",
      configPath: "configs/usa-newyork.conf",
      ping: 120,
      status: "online",
      isActive: false,
    },
    {
      id: "singapore-premium",
      name: "Singapore Premium",
      location: "Singapore",
      country: "Singapore",
      flag: "🇸🇬",
      protocol: "wireguard",
      configPath: "configs/singapore.conf",
      ping: 85,
      status: "online",
      isActive: false,
    },
  ]);

  const [logs, setLogs] = useState<VPNLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 300000),
      level: "info",
      message: "VPN service initialized successfully",
      source: "VPNService",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 280000),
      level: "success",
      message: "Connected to UAE - Dubai Premium server",
      source: "WireGuard",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 260000),
      level: "info",
      message: "Kill Switch activated - network protection enabled",
      source: "KillSwitch",
    },
  ]);

  const [settings, setSettings] = useState<VPNSettings>({
    autoReconnect: true,
    startOnBoot: false,
    minimizeToTray: true,
    notifications: true,
    killSwitchOnDisconnect: true,
    dnsLeakProtection: true,
    ipv6Blocking: true,
    preferredProtocol: "wireguard",
  });

  const [selectedServer, setSelectedServer] =
    useState<string>("uae-dubai-premium");
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showServerManager, setShowServerManager] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Refs for cleanup
  const monitoringInterval = useRef<NodeJS.Timeout>();
  const connectionStartTime = useRef<Date>();

  // Simulated Electron IPC (replace with actual window.electron in real implementation)
  const electron = {
    send: (channel: string, data?: any) => {
      console.log(`[IPC Send] ${channel}:`, data);
      // Simulate PowerShell responses
      handleElectronResponse(channel, data);
    },
    invoke: async (channel: string, data?: any) => {
      console.log(`[IPC Invoke] ${channel}:`, data);
      return handleElectronInvoke(channel, data);
    },
    on: (channel: string, callback: Function) => {
      console.log(`[IPC Listen] ${channel}`);
      return () => console.log(`[IPC Cleanup] ${channel}`);
    },
  };

  // Simulated PowerShell responses
  const handleElectronResponse = useCallback((channel: string, data?: any) => {
    setTimeout(() => {
      switch (channel) {
        case "vpn:connect":
          if (data) {
            setIsConnecting(true);
            addLog("info", `Connecting to ${data}...`, "PowerShell");

            setTimeout(() => {
              setVpnStatus((prev) => ({
                ...prev,
                connected: true,
                status: "Connected",
                publicIP: "203.0.113.5",
                protocol: "wireguard",
              }));
              setIsConnecting(false);
              connectionStartTime.current = new Date();
              startMonitoring();
              addLog(
                "success",
                "VPN connection established successfully",
                "WireGuard",
              );
            }, 3000);
          }
          break;

        case "vpn:disconnect":
          setVpnStatus((prev) => ({
            ...prev,
            connected: false,
            status: "Disconnected",
            connectionDuration: 0,
          }));
          stopMonitoring();
          addLog("warning", "VPN disconnected", "VPNService");
          break;

        case "vpn:toggle-killswitch":
          setVpnStatus((prev) => ({
            ...prev,
            killSwitchActive: data,
          }));
          addLog(
            "info",
            `Kill Switch ${data ? "enabled" : "disabled"}`,
            "KillSwitch",
          );
          break;
      }
    }, 100);
  }, []);

  const handleElectronInvoke = useCallback(
    async (channel: string, data?: any) => {
      switch (channel) {
        case "vpn:get-initial-data":
          return {
            servers,
            status: vpnStatus,
            settings,
            logs: logs.slice(-20),
          };
        default:
          return null;
      }
    },
    [servers, vpnStatus, settings, logs],
  );

  // Utility Functions
  const addLog = useCallback(
    (level: VPNLog["level"], message: string, source?: string) => {
      const newLog: VPNLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        message,
        source,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    },
    [],
  );

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // VPN Operations
  const toggleVPN = useCallback(() => {
    if (vpnStatus.connected) {
      electron.send("vpn:disconnect");
    } else {
      const server = servers.find((s) => s.id === selectedServer);
      if (server) {
        electron.send("vpn:connect", server.configPath);
      } else {
        addLog("error", "No server selected");
      }
    }
  }, [vpnStatus.connected, selectedServer, servers, electron]);

  const toggleKillSwitch = useCallback(() => {
    const newState = !vpnStatus.killSwitchActive;
    electron.send("vpn:toggle-killswitch", newState);
  }, [vpnStatus.killSwitchActive, electron]);

  // Monitoring Functions
  const startMonitoring = useCallback(() => {
    stopMonitoring();

    monitoringInterval.current = setInterval(() => {
      if (connectionStartTime.current) {
        const duration = Math.floor(
          (Date.now() - connectionStartTime.current.getTime()) / 1000,
        );
        setVpnStatus((prev) => ({
          ...prev,
          connectionDuration: duration,
          downloadSpeed: Math.random() * 50 + 10,
          uploadSpeed: Math.random() * 20 + 5,
          bytesReceived: prev.bytesReceived + Math.random() * 1000000,
          bytesSent: prev.bytesSent + Math.random() * 500000,
        }));
      }
    }, 1000);
  }, []);

  const stopMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = undefined;
    }
  }, []);

  // Effects
  useEffect(() => {
    // Initialize VPN data
    electron
      .invoke("vpn:get-initial-data")
      .then((data) => {
        if (data) {
          setServers(data.servers || servers);
          setVpnStatus(data.status || vpnStatus);
          setSettings(data.settings || settings);
          setLogs(data.logs || logs);
        }
      })
      .catch(console.error);

    return () => {
      stopMonitoring();
    };
  }, []);

  // UI Helper Functions
  const getStatusColor = () => {
    if (isConnecting) return "rgb(255, 193, 7)";
    if (vpnStatus.connected) return "rgb(40, 167, 69)";
    return "rgb(220, 53, 69)";
  };

  const getStatusIcon = () => {
    if (isConnecting) return <SignalIcon className="h-6 w-6 animate-pulse" />;
    if (vpnStatus.connected) return <CheckCircleIcon className="h-6 w-6" />;
    return <XMarkIcon className="h-6 w-6" />;
  };

  const getLogIcon = (level: VPNLog["level"]) => {
    switch (level) {
      case "success":
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <XMarkIcon className="h-4 w-4 text-red-400" />;
      default:
        return <DocumentTextIcon className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                🛡️ KNOX Shield VPN
              </h1>
              <p className="text-slate-300">
                SentinelTracker Edition - Ultimate VPN Control Center
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-black/20 border border-cyan-500/30 rounded-lg">
                <span className="text-sm text-slate-400">Status: </span>
                <span
                  className="font-medium"
                  style={{ color: getStatusColor() }}
                >
                  {isConnecting ? "Connecting..." : vpnStatus.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Connection Control Card */}
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                {/* Status Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                      <WifiIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Connection Control
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Real-time VPN management
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center space-x-2 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor()}20`,
                      border: `1px solid ${getStatusColor()}50`,
                    }}
                  >
                    <span style={{ color: getStatusColor() }}>
                      {getStatusIcon()}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: getStatusColor() }}
                    >
                      {isConnecting ? "Connecting..." : vpnStatus.status}
                    </span>
                  </div>
                </div>

                {/* Main Connect Button */}
                <div className="text-center mb-6">
                  <button
                    onClick={toggleVPN}
                    disabled={isConnecting}
                    className={`
                      relative inline-flex items-center justify-center space-x-3 px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        vpnStatus.connected
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25"
                      }
                    `}
                  >
                    {isConnecting ? (
                      <>
                        <SignalIcon className="h-6 w-6 animate-pulse" />
                        <span>Connecting...</span>
                      </>
                    ) : vpnStatus.connected ? (
                      <>
                        <StopIcon className="h-6 w-6" />
                        <span>Disconnect</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-6 w-6" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Connection Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-300">Public IP</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStatus.publicIP}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {vpnStatus.flag} {vpnStatus.city}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-slate-300">Duration</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {formatDuration(vpnStatus.connectionDuration)}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowDownIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-slate-300">Download</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStatus.downloadSpeed.toFixed(1)} Mbps
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatBytes(vpnStatus.bytesReceived)}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowUpIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-slate-300">Upload</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStatus.uploadSpeed.toFixed(1)} Mbps
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatBytes(vpnStatus.bytesSent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Selection & Kill Switch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Selection */}
              <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <ServerIcon className="h-5 w-5 text-cyan-400" />
                    <span>Server Selection</span>
                  </h3>
                  <button
                    onClick={() => setShowServerManager(true)}
                    className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    <CogIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {servers.map((server) => (
                    <div
                      key={server.id}
                      className={`
                        p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-cyan-500/10
                        ${
                          selectedServer === server.id
                            ? "border-cyan-500 bg-cyan-500/20"
                            : "border-slate-600 bg-black/20"
                        }
                        ${vpnStatus.connected ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                      onClick={() =>
                        !vpnStatus.connected && setSelectedServer(server.id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{server.flag}</span>
                          <div>
                            <p className="text-white font-medium">
                              {server.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {server.location}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  server.protocol === "wireguard"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {server.protocol.toUpperCase()}
                              </span>
                              {server.isActive && (
                                <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`w-2 h-2 rounded-full mb-1 ${
                              server.status === "online"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <p className="text-xs text-slate-400">
                            {server.ping}ms
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kill Switch & Quick Actions */}
              <div className="space-y-6">
                {/* Kill Switch */}
                <div className="bg-black/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-red-400" />
                    <span>Kill Switch</span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm mb-1">
                        Internet protection when VPN drops
                      </p>
                      <p className="text-xs text-slate-400">
                        Blocks all traffic if VPN disconnects
                      </p>
                    </div>
                    <button
                      onClick={toggleKillSwitch}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900
                        ${vpnStatus.killSwitchActive ? "bg-red-500" : "bg-slate-600"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${vpnStatus.killSwitchActive ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl bg-black/30 border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200"
                    >
                      <CogIcon className="h-5 w-5 text-cyan-400" />
                      <span className="text-white">VPN Settings</span>
                    </button>
                    <button
                      onClick={() => setShowLogs(!showLogs)}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl bg-black/30 border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200"
                    >
                      <DocumentTextIcon className="h-5 w-5 text-green-400" />
                      <span className="text-white">View Logs</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-black/30 border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200">
                      <CommandLineIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-white">Run Diagnostics</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5 text-green-400" />
              <span>Connection Logs</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {logs.slice(0, 20).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-black/30 hover:bg-slate-800/50 transition-colors"
                >
                  {getLogIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm text-white">{log.message}</p>
                      {log.source && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {log.source}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <CommandLineIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs to display</p>
                  <p className="text-xs mt-2">
                    Logs will appear here when VPN operations occur
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(99, 102, 241) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgb(99, 102, 241);
          border-radius: 3px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default VPNDashboardAdvanced;
