import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs";

export interface VPNConnectionResult {
  success: boolean;
  message: string;
  status?: VPNStatus;
  error?: string;
}

export interface VPNStatus {
  connected: boolean;
  protocol: "wireguard" | "openvpn" | "none";
  interface: string;
  publicIP: string;
  country: string;
  killSwitchActive: boolean;
}

export interface VPNConfig {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  protocol: "wireguard" | "openvpn";
  configPath: string;
  configContent: string;
}

export interface IPInfo {
  ip: string;
  country: string;
  city: string;
  isp: string;
  success: boolean;
}

export interface SpeedTestResult {
  downloadSpeed: number;
  success: boolean;
}

export class VPNService {
  private static instance: VPNService;
  private configDir: string;
  private logFile: string;
  private scriptsDir: string;

  private constructor() {
    // Initialize paths based on app data directory
    const appDataPath = process.env.APPDATA || process.env.HOME || "./";
    this.configDir = path.join(appDataPath, "KnoxShield", "vpn-configs");
    this.logFile = path.join(appDataPath, "KnoxShield", "vpn-logs.txt");
    this.scriptsDir = path.join(__dirname, "..", "scripts");

    this.ensureDirectories();
  }

  public static getInstance(): VPNService {
    if (!VPNService.instance) {
      VPNService.instance = new VPNService();
    }
    return VPNService.instance;
  }

  private ensureDirectories(): void {
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }

      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create VPN directories:", error);
    }
  }

  private async runPowerShellScript(
    operation: string,
    options: {
      configPath?: string;
      protocol?: "wireguard" | "openvpn";
      serverName?: string;
      force?: boolean;
    } = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.scriptsDir, "vpn-operations.ps1");

      const args = [
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
        "-Operation",
        operation,
      ];

      if (options.configPath) {
        args.push("-ConfigPath", options.configPath);
      }
      if (options.protocol) {
        args.push("-Protocol", options.protocol);
      }
      if (options.serverName) {
        args.push("-ServerName", options.serverName);
      }
      if (options.force) {
        args.push("-Force");
      }

      const process = spawn("powershell.exe", args, {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let output = "";
      let error = "";

      process.stdout?.on("data", (data) => {
        output += data.toString();
      });

      process.stderr?.on("data", (data) => {
        error += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0 && output) {
          try {
            const result = JSON.parse(output.trim());
            resolve(result);
          } catch (parseError) {
            resolve({
              success: false,
              message: "Failed to parse script output",
              output,
              error,
            });
          }
        } else {
          reject(
            new Error(`PowerShell script failed with code ${code}: ${error}`),
          );
        }
      });

      process.on("error", (err) => {
        reject(err);
      });
    });
  }

  public async connect(config: VPNConfig): Promise<VPNConnectionResult> {
    try {
      const configPath = await this.saveConfig(config);

      const result = await this.runPowerShellScript("connect", {
        configPath: configPath,
        protocol: config.protocol,
        serverName: config.name,
      });

      return result;
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async disconnect(
    protocol?: "wireguard" | "openvpn",
  ): Promise<VPNConnectionResult> {
    try {
      const result = await this.runPowerShellScript("disconnect", {
        protocol: protocol,
      });

      return result;
    } catch (error) {
      return {
        success: false,
        message: `Disconnect failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async getStatus(): Promise<VPNStatus> {
    try {
      const result = await this.runPowerShellScript("status");
      return result;
    } catch (error) {
      console.error("Failed to get VPN status:", error);
      return {
        connected: false,
        protocol: "none",
        interface: "none",
        publicIP: "Unknown",
        country: "Unknown",
        killSwitchActive: false,
      };
    }
  }

  public async enableKillSwitch(): Promise<VPNConnectionResult> {
    try {
      const result = await this.runPowerShellScript("killswitch-enable");
      return result;
    } catch (error) {
      return {
        success: false,
        message: `Kill Switch enable failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async disableKillSwitch(): Promise<VPNConnectionResult> {
    try {
      const result = await this.runPowerShellScript("killswitch-disable");
      return result;
    } catch (error) {
      return {
        success: false,
        message: `Kill Switch disable failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async getPublicIP(): Promise<IPInfo> {
    try {
      const result = await this.runPowerShellScript("get-ip");
      return result;
    } catch (error) {
      console.error("Failed to get public IP:", error);
      return {
        ip: "Unknown",
        country: "Unknown",
        city: "Unknown",
        isp: "Unknown",
        success: false,
      };
    }
  }

  public async testSpeed(): Promise<SpeedTestResult> {
    try {
      const result = await this.runPowerShellScript("speed-test");
      return result;
    } catch (error) {
      console.error("Speed test failed:", error);
      return {
        downloadSpeed: 0,
        success: false,
      };
    }
  }

  public async saveConfig(config: VPNConfig): Promise<string> {
    const filename = `${config.id}.${config.protocol === "wireguard" ? "conf" : "ovpn"}`;
    const configPath = path.join(this.configDir, filename);

    try {
      fs.writeFileSync(configPath, config.configContent, "utf8");
      return configPath;
    } catch (error) {
      throw new Error(
        `Failed to save config: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public async loadConfig(
    configId: string,
    protocol: "wireguard" | "openvpn",
  ): Promise<string> {
    const filename = `${configId}.${protocol === "wireguard" ? "conf" : "ovpn"}`;
    const configPath = path.join(this.configDir, filename);

    try {
      if (!fs.existsSync(configPath)) {
        throw new Error(`Config file not found: ${configPath}`);
      }
      return fs.readFileSync(configPath, "utf8");
    } catch (error) {
      throw new Error(
        `Failed to load config: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public async deleteConfig(
    configId: string,
    protocol: "wireguard" | "openvpn",
  ): Promise<boolean> {
    const filename = `${configId}.${protocol === "wireguard" ? "conf" : "ovpn"}`;
    const configPath = path.join(this.configDir, filename);

    try {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
      return true;
    } catch (error) {
      console.error("Failed to delete config:", error);
      return false;
    }
  }

  public async getLogs(limit: number = 100): Promise<string[]> {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const content = fs.readFileSync(this.logFile, "utf8");
      const lines = content.split("\n").filter((line) => line.trim());

      // Return the last 'limit' lines
      return lines.slice(-limit).reverse();
    } catch (error) {
      console.error("Failed to read logs:", error);
      return [];
    }
  }

  public async clearLogs(): Promise<boolean> {
    try {
      if (fs.existsSync(this.logFile)) {
        fs.writeFileSync(this.logFile, "", "utf8");
      }
      return true;
    } catch (error) {
      console.error("Failed to clear logs:", error);
      return false;
    }
  }

  public async exportLogs(): Promise<string> {
    try {
      if (!fs.existsSync(this.logFile)) {
        return "";
      }
      return fs.readFileSync(this.logFile, "utf8");
    } catch (error) {
      console.error("Failed to export logs:", error);
      return "";
    }
  }

  // Utility method to check if VPN software is installed
  public async checkVPNSoftware(): Promise<{
    wireguard: boolean;
    openvpn: boolean;
  }> {
    try {
      const wgResult = await this.runPowerShellScript("status");
      // If status doesn't fail, WireGuard is likely available
      const wireguardAvailable = true;

      // For OpenVPN, we'd need a similar check
      const openvpnAvailable = true; // Simplified for now

      return {
        wireguard: wireguardAvailable,
        openvpn: openvpnAvailable,
      };
    } catch (error) {
      return {
        wireguard: false,
        openvpn: false,
      };
    }
  }

  // Utility method to ping a server
  public async pingServer(hostname: string): Promise<number> {
    return new Promise((resolve) => {
      const process = spawn("ping", ["-n", "1", hostname], {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let output = "";
      process.stdout?.on("data", (data) => {
        output += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          // Parse ping response for time
          const timeMatch = output.match(/time[<=](\d+)ms/i);
          if (timeMatch) {
            resolve(parseInt(timeMatch[1]));
          } else {
            resolve(999); // High ping if we can't parse
          }
        } else {
          resolve(-1); // Server unreachable
        }
      });

      process.on("error", () => {
        resolve(-1);
      });
    });
  }
}

export default VPNService;
