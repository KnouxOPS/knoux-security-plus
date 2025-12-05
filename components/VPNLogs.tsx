import React, { useState, useEffect, useRef } from "react";
import {
  DocumentTextIcon,
  XMarkIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

interface VPNLogEntry {
  id: string;
  timestamp: Date;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
  source?: string;
}

interface VPNLogsProps {
  onClose: () => void;
}

export const VPNLogs: React.FC<VPNLogsProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<VPNLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<VPNLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Sample log data (in real app, this would come from VPNService)
  useEffect(() => {
    const sampleLogs: VPNLogEntry[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 300000),
        level: "INFO",
        message: "VPN service initialized successfully",
        source: "VPNService",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 280000),
        level: "INFO",
        message: "Loading WireGuard configuration: uae-dubai.conf",
        source: "WireGuard",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 260000),
        level: "SUCCESS",
        message: "WireGuard interface wg0 created successfully",
        source: "WireGuard",
      },
      {
        id: "4",
        timestamp: new Date(Date.now() - 240000),
        level: "INFO",
        message: "Connecting to UAE - Dubai server (203.0.113.1:51820)",
        source: "Connection",
      },
      {
        id: "5",
        timestamp: new Date(Date.now() - 220000),
        level: "SUCCESS",
        message: "VPN tunnel established successfully",
        source: "Connection",
      },
      {
        id: "6",
        timestamp: new Date(Date.now() - 200000),
        level: "INFO",
        message: "Public IP changed from 192.168.1.100 to 203.0.113.5",
        source: "Network",
      },
      {
        id: "7",
        timestamp: new Date(Date.now() - 180000),
        level: "SUCCESS",
        message: "DNS configuration updated: 1.1.1.1, 1.0.0.1",
        source: "Network",
      },
      {
        id: "8",
        timestamp: new Date(Date.now() - 160000),
        level: "INFO",
        message: "Kill Switch activated - blocking non-VPN traffic",
        source: "KillSwitch",
      },
      {
        id: "9",
        timestamp: new Date(Date.now() - 140000),
        level: "WARNING",
        message: "High latency detected: 150ms to server",
        source: "Network",
      },
      {
        id: "10",
        timestamp: new Date(Date.now() - 120000),
        level: "INFO",
        message: "Speed test completed: 45.2 Mbps down, 12.8 Mbps up",
        source: "SpeedTest",
      },
      {
        id: "11",
        timestamp: new Date(Date.now() - 100000),
        level: "ERROR",
        message: "Temporary connection interruption detected",
        source: "Connection",
      },
      {
        id: "12",
        timestamp: new Date(Date.now() - 80000),
        level: "INFO",
        message: "Auto-reconnect triggered",
        source: "Connection",
      },
      {
        id: "13",
        timestamp: new Date(Date.now() - 60000),
        level: "SUCCESS",
        message: "Connection restored successfully",
        source: "Connection",
      },
      {
        id: "14",
        timestamp: new Date(Date.now() - 40000),
        level: "INFO",
        message: "IPv6 traffic blocked for leak protection",
        source: "Security",
      },
      {
        id: "15",
        timestamp: new Date(Date.now() - 20000),
        level: "SUCCESS",
        message: "VPN session stable - uptime 4 minutes 40 seconds",
        source: "Status",
      },
    ];

    setLogs(sampleLogs);
  }, []);

  // Filter logs based on search and level
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.source?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter]);

  // Auto scroll to bottom
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // Live log simulation
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        const liveMessages = [
          "Heartbeat: Connection healthy",
          "Bandwidth usage: 2.5 MB/s down, 0.8 MB/s up",
          "DNS query: example.com resolved via secure tunnel",
          "Security scan: No threats detected",
          "Performance check: Latency 45ms",
          "Traffic analysis: 1,024 packets transmitted",
        ];

        const newLog: VPNLogEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          level: Math.random() > 0.8 ? "WARNING" : "INFO",
          message:
            liveMessages[Math.floor(Math.random() * liveMessages.length)],
          source: "LiveMonitor",
        };

        setLogs((prev) => [...prev, newLog]);
      }, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case "WARNING":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />;
      case "ERROR":
        return <XMarkIcon className="h-4 w-4 text-red-400" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-blue-400" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "WARNING":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "ERROR":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logText = filteredLogs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] [${log.level}] ${log.source ? `[${log.source}] ` : ""}${log.message}`,
      )
      .join("\n");

    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knox-vpn-logs-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: Date) => {
    return (
      timestamp.toLocaleTimeString() +
      "." +
      timestamp.getMilliseconds().toString().padStart(3, "0")
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-cyan-500/30 w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <DocumentTextIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                VPN Connection Logs
              </h2>
              <p className="text-sm text-slate-400">
                Real-time monitoring and event history
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                isLive
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-slate-400"}`}
              ></div>
              <span>{isLive ? "LIVE" : "STATIC"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-slate-600/30">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full bg-black/30 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <FunnelIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="bg-black/30 border border-slate-600 rounded-lg pl-10 pr-8 py-2 text-white focus:border-cyan-500 focus:outline-none appearance-none"
                >
                  <option value="all">All Levels</option>
                  <option value="INFO">Info</option>
                  <option value="SUCCESS">Success</option>
                  <option value="WARNING">Warning</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Auto Scroll Toggle */}
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  autoScroll
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
                }`}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Auto Scroll</span>
              </button>

              {/* Export */}
              <button
                onClick={exportLogs}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors text-sm"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export</span>
              </button>

              {/* Clear */}
              <button
                onClick={clearLogs}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logs Container */}
        <div className="flex-1 p-4">
          <div
            ref={logsContainerRef}
            className="h-full bg-black/20 rounded-xl border border-slate-600/30 p-4 overflow-y-auto font-mono text-sm custom-scrollbar"
          >
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <CommandLineIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs to display</p>
                  <p className="text-xs mt-2">
                    Logs will appear here when VPN operations occur
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors group"
                  >
                    <div className="flex items-center space-x-2 flex-shrink-0 w-20">
                      {getLogIcon(log.level)}
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${getLogLevelColor(log.level)}`}
                      >
                        {log.level}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 w-24">
                      <ClockIcon className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-400 text-xs">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    {log.source && (
                      <div className="flex-shrink-0 w-20">
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {log.source}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 break-words">
                        {log.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600/30">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Total: {logs.length} entries</span>
              <span>Filtered: {filteredLogs.length} showing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Live monitoring {isLive ? "active" : "inactive"}</span>
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
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgb(99, 102, 241);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgb(79, 70, 229);
        }
      `}</style>
    </div>
  );
};

export default VPNLogs;
