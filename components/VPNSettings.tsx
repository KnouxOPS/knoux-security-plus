import React, { useState, useRef } from "react";
import {
  CogIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowUpIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  CloudArrowUpIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface VPNConfig {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  protocol: "wireguard" | "openvpn";
  configContent: string;
  createdAt: Date;
  isActive: boolean;
}

interface VPNSettingsProps {
  onClose: () => void;
}

export const VPNSettings: React.FC<VPNSettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "servers" | "advanced" | "notifications"
  >("servers");
  const [showAddServer, setShowAddServer] = useState(false);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [showConfigContent, setShowConfigContent] = useState<string | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [configs, setConfigs] = useState<VPNConfig[]>([
    {
      id: "1",
      name: "UAE - Dubai Premium",
      location: "Dubai, UAE",
      country: "UAE",
      flag: "🇦🇪",
      protocol: "wireguard",
      configContent:
        "[Interface]\nPrivateKey = ...\nAddress = 10.0.0.2/24\nDNS = 1.1.1.1\n\n[Peer]\nPublicKey = ...\nEndpoint = uae.example.com:51820\nAllowedIPs = 0.0.0.0/0",
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: "2",
      name: "Germany - Frankfurt",
      location: "Frankfurt, Germany",
      country: "Germany",
      flag: "🇩🇪",
      protocol: "openvpn",
      configContent:
        "client\ndev tun\nproto udp\nremote germany.example.com 1194\nresolv-retry infinite\nnobind\nuser nobody\ngroup nogroup\npersist-key\npersist-tun",
      createdAt: new Date(Date.now() - 86400000),
      isActive: false,
    },
  ]);

  const [newServer, setNewServer] = useState({
    name: "",
    location: "",
    country: "",
    flag: "",
    protocol: "wireguard" as "wireguard" | "openvpn",
    configContent: "",
  });

  const [settings, setSettings] = useState({
    autoReconnect: true,
    startOnBoot: false,
    minimizeToTray: true,
    notifications: true,
    killSwitchOnDisconnect: true,
    dnsLeakProtection: true,
    ipv6Blocking: true,
    preferredProtocol: "wireguard" as "wireguard" | "openvpn" | "automatic",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setNewServer((prev) => ({
          ...prev,
          configContent: content,
          name: file.name.replace(/\.(conf|ovpn)$/, ""),
          protocol: file.name.endsWith(".conf") ? "wireguard" : "openvpn",
        }));
      };
      reader.readAsText(file);
    }
  };

  const addServer = () => {
    if (newServer.name && newServer.configContent) {
      const config: VPNConfig = {
        id: Date.now().toString(),
        ...newServer,
        createdAt: new Date(),
        isActive: false,
      };
      setConfigs((prev) => [...prev, config]);
      setNewServer({
        name: "",
        location: "",
        country: "",
        flag: "",
        protocol: "wireguard",
        configContent: "",
      });
      setShowAddServer(false);
    }
  };

  const deleteServer = (id: string) => {
    setConfigs((prev) => prev.filter((config) => config.id !== id));
  };

  const toggleServerActive = (id: string) => {
    setConfigs((prev) =>
      prev.map((config) => ({
        ...config,
        isActive: config.id === id ? !config.isActive : false,
      })),
    );
  };

  const generateQRCode = (configContent: string) => {
    // In a real implementation, you would use a QR code library
    // For now, we'll show a placeholder
    setShowQRCode(configContent);
  };

  const exportConfig = (config: VPNConfig) => {
    const blob = new Blob([config.configContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name}.${config.protocol === "wireguard" ? "conf" : "ovpn"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "servers" as const, label: "Server Management", icon: ServerIcon },
    { id: "advanced" as const, label: "Advanced Settings", icon: CogIcon },
    { id: "notifications" as const, label: "Notifications", icon: BellIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border border-cyan-500/30 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
              <CogIcon className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">VPN Settings</h2>
              <p className="text-sm text-slate-400">
                Manage servers and configure VPN preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-8rem)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-cyan-500/30 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "servers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Server Configurations
                  </h3>
                  <button
                    onClick={() => setShowAddServer(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Server</span>
                  </button>
                </div>

                {/* Server List */}
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div
                      key={config.id}
                      className="bg-black/20 border border-slate-600 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{config.flag}</div>
                          <div>
                            <h4 className="text-white font-medium">
                              {config.name}
                            </h4>
                            <p className="text-sm text-slate-400">
                              {config.location}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  config.protocol === "wireguard"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {config.protocol.toUpperCase()}
                              </span>
                              {config.isActive && (
                                <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleServerActive(config.id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              config.isActive
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                          >
                            {config.isActive ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() =>
                              setShowConfigContent(config.configContent)
                            }
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="View Config"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => generateQRCode(config.configContent)}
                            className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                            title="Generate QR Code"
                          >
                            <QrCodeIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => exportConfig(config)}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            title="Export Config"
                          >
                            <CloudArrowUpIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteServer(config.id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Delete Server"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Server Modal */}
                {showAddServer && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl border border-cyan-500/30 p-6 w-full max-w-2xl">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Add New Server
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-slate-300 mb-2">
                              Server Name
                            </label>
                            <input
                              type="text"
                              value={newServer.name}
                              onChange={(e) =>
                                setNewServer((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                              placeholder="e.g., UAE Premium"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-slate-300 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              value={newServer.location}
                              onChange={(e) =>
                                setNewServer((prev) => ({
                                  ...prev,
                                  location: e.target.value,
                                }))
                              }
                              className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                              placeholder="e.g., Dubai, UAE"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-slate-300 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={newServer.country}
                              onChange={(e) =>
                                setNewServer((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                }))
                              }
                              className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                              placeholder="e.g., UAE"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-slate-300 mb-2">
                              Flag Emoji
                            </label>
                            <input
                              type="text"
                              value={newServer.flag}
                              onChange={(e) =>
                                setNewServer((prev) => ({
                                  ...prev,
                                  flag: e.target.value,
                                }))
                              }
                              className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                              placeholder="🇦🇪"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-slate-300 mb-2">
                            Protocol
                          </label>
                          <select
                            value={newServer.protocol}
                            onChange={(e) =>
                              setNewServer((prev) => ({
                                ...prev,
                                protocol: e.target.value as
                                  | "wireguard"
                                  | "openvpn",
                              }))
                            }
                            className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                          >
                            <option value="wireguard">WireGuard</option>
                            <option value="openvpn">OpenVPN</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-slate-300 mb-2">
                            Configuration
                          </label>
                          <div className="space-y-2">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                              <DocumentArrowUpIcon className="h-4 w-4" />
                              <span>Upload Config File</span>
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".conf,.ovpn"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <textarea
                              value={newServer.configContent}
                              onChange={(e) =>
                                setNewServer((prev) => ({
                                  ...prev,
                                  configContent: e.target.value,
                                }))
                              }
                              className="w-full h-32 bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none resize-none"
                              placeholder="Paste configuration content or upload a file..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mt-6">
                        <button
                          onClick={addServer}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200"
                        >
                          Add Server
                        </button>
                        <button
                          onClick={() => setShowAddServer(false)}
                          className="px-4 py-2 bg-slate-600 rounded-lg text-white hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Advanced Settings
                </h3>

                <div className="space-y-4">
                  {/* Connection Settings */}
                  <div className="bg-black/20 border border-slate-600 rounded-xl p-4">
                    <h4 className="font-medium text-white mb-3">
                      Connection Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">
                            Auto-reconnect on disconnect
                          </p>
                          <p className="text-xs text-slate-400">
                            Automatically reconnect if connection drops
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              autoReconnect: !prev.autoReconnect,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.autoReconnect
                              ? "bg-green-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.autoReconnect
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">Start on system boot</p>
                          <p className="text-xs text-slate-400">
                            Launch VPN when system starts
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              startOnBoot: !prev.startOnBoot,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.startOnBoot
                              ? "bg-green-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.startOnBoot
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-300 mb-2">
                          Preferred Protocol
                        </label>
                        <select
                          value={settings.preferredProtocol}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              preferredProtocol: e.target.value as any,
                            }))
                          }
                          className="w-full bg-black/30 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="automatic">Automatic</option>
                          <option value="wireguard">WireGuard</option>
                          <option value="openvpn">OpenVPN</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-black/20 border border-slate-600 rounded-xl p-4">
                    <h4 className="font-medium text-white mb-3">
                      Security Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">
                            Kill Switch on disconnect
                          </p>
                          <p className="text-xs text-slate-400">
                            Block all traffic when VPN disconnects
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              killSwitchOnDisconnect:
                                !prev.killSwitchOnDisconnect,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.killSwitchOnDisconnect
                              ? "bg-red-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.killSwitchOnDisconnect
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">DNS Leak Protection</p>
                          <p className="text-xs text-slate-400">
                            Prevent DNS queries from leaking
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              dnsLeakProtection: !prev.dnsLeakProtection,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.dnsLeakProtection
                              ? "bg-blue-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.dnsLeakProtection
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-300">IPv6 Blocking</p>
                          <p className="text-xs text-slate-400">
                            Block IPv6 traffic to prevent leaks
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              ipv6Blocking: !prev.ipv6Blocking,
                            }))
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.ipv6Blocking
                              ? "bg-purple-500"
                              : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.ipv6Blocking
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">
                  Notification Settings
                </h3>

                <div className="bg-black/20 border border-slate-600 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">Enable notifications</p>
                        <p className="text-xs text-slate-400">
                          Show system notifications for VPN events
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: !prev.notifications,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications
                            ? "bg-blue-500"
                            : "bg-slate-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">
                          Minimize to system tray
                        </p>
                        <p className="text-xs text-slate-400">
                          Keep VPN running in background
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            minimizeToTray: !prev.minimizeToTray,
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.minimizeToTray
                            ? "bg-green-500"
                            : "bg-slate-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.minimizeToTray
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Config Content Modal */}
      {showConfigContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-cyan-500/30 p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Configuration Content
              </h3>
              <button
                onClick={() => setShowConfigContent(null)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black/30 border border-slate-600 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {showConfigContent}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-cyan-500/30 p-6 w-full max-w-md text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">QR Code</h3>
              <button
                onClick={() => setShowQRCode(null)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg mb-4">
              <div className="w-48 h-48 mx-auto bg-black/10 rounded flex items-center justify-center">
                <QrCodeIcon className="h-24 w-24 text-black/30" />
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Scan with your mobile device to import configuration
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPNSettings;
