import React, { useState, useEffect, useRef } from "react";
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
} from "@heroicons/react/24/outline";

interface VPNServer {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  config: string;
  ping?: number;
  status: "online" | "offline" | "unknown";
}

interface VPNLog {
  id: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

interface VPNStats {
  currentIP: string;
  publicIP: string;
  country: string;
  city: string;
  flag: string;
  downloadSpeed: number;
  uploadSpeed: number;
  connectionDuration: number;
  bytesReceived: number;
  bytesSent: number;
}

export const VPNDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [killSwitchEnabled, setKillSwitchEnabled] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [vpnStats, setVpnStats] = useState<VPNStats>({
    currentIP: "192.168.1.100",
    publicIP: "203.0.113.1",
    country: "United Arab Emirates",
    city: "Dubai",
    flag: "🇦🇪",
    downloadSpeed: 0,
    uploadSpeed: 0,
    connectionDuration: 0,
    bytesReceived: 0,
    bytesSent: 0,
  });

  const [servers] = useState<VPNServer[]>([
    {
      id: "uae-dubai",
      name: "UAE - Dubai",
      location: "Dubai, UAE",
      country: "UAE",
      flag: "🇦🇪",
      config: "uae-dubai.conf",
      ping: 15,
      status: "online",
    },
    {
      id: "germany-frankfurt",
      name: "Germany - Frankfurt",
      location: "Frankfurt, Germany",
      country: "Germany",
      flag: "🇩🇪",
      config: "germany-frankfurt.conf",
      ping: 45,
      status: "online",
    },
    {
      id: "usa-newyork",
      name: "USA - New York",
      location: "New York, USA",
      country: "USA",
      flag: "🇺🇸",
      config: "usa-newyork.conf",
      ping: 120,
      status: "online",
    },
    {
      id: "singapore",
      name: "Singapore",
      location: "Singapore",
      country: "Singapore",
      flag: "🇸🇬",
      config: "singapore.conf",
      ping: 85,
      status: "online",
    },
  ]);

  const [logs, setLogs] = useState<VPNLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 300000),
      type: "success",
      message: "VPN connection established successfully",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 180000),
      type: "info",
      message: "Connected to UAE - Dubai server",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 120000),
      type: "info",
      message: "Kill Switch activated",
    },
  ]);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (selectedServer === "") {
      setSelectedServer(servers[0]?.id || "");
    }
  }, [servers]);

  useEffect(() => {
    if (isConnected && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setVpnStats((prev) => ({
          ...prev,
          connectionDuration: prev.connectionDuration + 1,
          downloadSpeed: Math.random() * 50 + 10,
          uploadSpeed: Math.random() * 20 + 5,
          bytesReceived: prev.bytesReceived + Math.random() * 1000000,
          bytesSent: prev.bytesSent + Math.random() * 500000,
        }));
      }, 1000);
    } else if (!isConnected && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const toggleVPN = async () => {
    if (isConnected) {
      setIsConnecting(true);
      addLog("info", "Disconnecting from VPN...");

      // Simulate PowerShell disconnect
      setTimeout(() => {
        setIsConnected(false);
        setIsConnecting(false);
        setVpnStats((prev) => ({ ...prev, connectionDuration: 0 }));
        addLog("warning", "VPN disconnected");
      }, 2000);
    } else {
      if (!selectedServer) {
        addLog("error", "Please select a server first");
        return;
      }

      setIsConnecting(true);
      addLog(
        "info",
        `Connecting to ${servers.find((s) => s.id === selectedServer)?.name}...`,
      );

      // Simulate PowerShell connect
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        const server = servers.find((s) => s.id === selectedServer);
        setVpnStats((prev) => ({
          ...prev,
          country: server?.country || prev.country,
          flag: server?.flag || prev.flag,
          city: server?.location.split(", ")[0] || prev.city,
        }));
        addLog("success", `Connected to ${server?.name} successfully`);
      }, 3000);
    }
  };

  const toggleKillSwitch = () => {
    setKillSwitchEnabled(!killSwitchEnabled);
    addLog(
      "info",
      `Kill Switch ${!killSwitchEnabled ? "enabled" : "disabled"}`,
    );
  };

  const addLog = (type: VPNLog["type"], message: string) => {
    const newLog: VPNLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = () => {
    if (isConnecting) return "rgb(255, 193, 7)";
    if (isConnected) return "rgb(40, 167, 69)";
    return "rgb(220, 53, 69)";
  };

  const getStatusIcon = () => {
    if (isConnecting) return <SignalIcon className="h-6 w-6 animate-pulse" />;
    if (isConnected) return <CheckCircleIcon className="h-6 w-6" />;
    return <XMarkIcon className="h-6 w-6" />;
  };

  const getLogIcon = (type: VPNLog["type"]) => {
    switch (type) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            🛡️ KNOX Shield VPN
          </h1>
          <p className="text-slate-300">
            SentinelTracker Edition - Ultimate VPN Control Center
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Connection Status Card */}
            <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                      <WifiIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Connection Status
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Real-time VPN monitoring
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
                      {isConnecting
                        ? "Connecting..."
                        : isConnected
                          ? "Connected"
                          : "Disconnected"}
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
                        isConnected
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
                    ) : isConnected ? (
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

                {/* Connection Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-300">Public IP</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStats.publicIP}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {vpnStats.flag} {vpnStats.city}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-slate-300">Duration</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {formatDuration(vpnStats.connectionDuration)}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowDownIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-slate-300">Download</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStats.downloadSpeed.toFixed(1)} Mbps
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatBytes(vpnStats.bytesReceived)}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <ArrowUpIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-slate-300">Upload</span>
                    </div>
                    <p className="text-white font-mono text-sm">
                      {vpnStats.uploadSpeed.toFixed(1)} Mbps
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatBytes(vpnStats.bytesSent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Selection & Kill Switch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Selection */}
              <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <GlobeAltIcon className="h-5 w-5 text-cyan-400" />
                  <span>Server Selection</span>
                </h3>
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
                      `}
                      onClick={() => setSelectedServer(server.id)}
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

              {/* Kill Switch & Settings */}
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
                        ${killSwitchEnabled ? "bg-red-500" : "bg-slate-600"}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${killSwitchEnabled ? "translate-x-6" : "translate-x-1"}
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
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-black/30"
                >
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{log.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
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
      `}</style>
    </div>
  );
};

export default VPNDashboard;
