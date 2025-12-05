const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

let mainWindow;
let vpnProcess = null;
let killSwitchActive = false;
let connectionStartTime = null;
const logs = [];
const SCRIPTS_DIR = path.join(__dirname, "scripts");
const CONFIGS_DIR = path.join(__dirname, "configs");
const ENCRYPTION_KEY = crypto.randomBytes(32); // يجب تخزينه بأمان في التطبيق الحقيقي

// التأكد من وجود المجلدات المطلوبة
function ensureDirectories() {
  [SCRIPTS_DIR, CONFIGS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// دالة تشفير ملفات الإعدادات
function encryptConfig(content) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher("aes-256-cbc", ENCRYPTION_KEY);
  let encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// دالة فك تشفير ملفات الإعدادات
function decryptConfig(encryptedContent) {
  try {
    const [ivHex, encrypted] = encryptedContent.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipher("aes-256-cbc", ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    addLog(`Failed to decrypt config: ${error.message}`, "error");
    return null;
  }
}

// دالة تسجيل الأحداث
function addLog(message, level = "info", source = "VPNService") {
  const timestamp = new Date().toISOString();
  const logEntry = {
    id: Date.now().toString(),
    timestamp,
    level,
    message,
    source,
  };
  logs.push(logEntry);

  // الحفاظ على آخر 200 سجل فقط
  if (logs.length > 200) logs.shift();

  // إرسال السجل للواجهة إذا كانت متاحة
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("vpn:log-updated", logEntry);
  }

  console.log(`[${level.toUpperCase()}] [${source}] ${message}`);
}

// دالة تشغيل سكربتات PowerShell
function runPowershellScript(scriptName, args = [], elevated = false) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);

    if (!fs.existsSync(scriptPath)) {
      const errorMsg = `PowerShell script not found: ${scriptPath}`;
      addLog(errorMsg, "error", "PowerShell");
      return reject(new Error(errorMsg));
    }

    addLog(
      `Executing script: ${scriptName} with args: [${args.join(", ")}]`,
      "info",
      "PowerShell",
    );

    const psArgs = [
      "-ExecutionPolicy",
      "Bypass",
      "-NoProfile",
      "-WindowStyle",
      "Hidden",
      "-File",
      scriptPath,
      ...args,
    ];

    const shell = spawn("powershell.exe", psArgs, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    shell.stdout.on("data", (data) => {
      const output = data.toString().trim();
      stdout += output;
      if (output) {
        addLog(`Script output: ${output}`, "debug", "PowerShell");
      }
    });

    shell.stderr.on("data", (data) => {
      const error = data.toString().trim();
      stderr += error;
      if (error) {
        addLog(`Script error: ${error}`, "warning", "PowerShell");
      }
    });

    shell.on("error", (error) => {
      addLog(
        `Failed to start PowerShell: ${error.message}`,
        "error",
        "PowerShell",
      );
      reject(new Error(`Failed to start PowerShell: ${error.message}`));
    });

    shell.on("close", (code) => {
      addLog(
        `Script ${scriptName} finished with exit code: ${code}`,
        "info",
        "PowerShell",
      );

      if (code !== 0) {
        const errorMsg = `Script failed with exit code ${code}: ${stderr}`;
        reject(new Error(errorMsg));
      } else {
        try {
          // محاولة تحليل JSON إذا كان المخرج يحتوي على JSON
          const result = stdout.trim();
          if (result.startsWith("{") || result.startsWith("[")) {
            resolve(JSON.parse(result));
          } else {
            resolve(result);
          }
        } catch (parseError) {
          resolve(stdout.trim());
        }
      }
    });

    // حفظ مرجع العملية للإيقاف لاحقاً
    if (scriptName === "connect_vpn.ps1") {
      vpnProcess = shell;
    }
  });
}

// مراقبة اتصال VPN
let monitoringInterval = null;

function startVPNMonitoring() {
  stopVPNMonitoring();
  connectionStartTime = new Date();

  addLog("Starting VPN connection monitoring...", "info", "Monitor");

  monitoringInterval = setInterval(async () => {
    try {
      // فحص حالة الاتصال
      const statusResult = await runPowershellScript("get_vpn_status.ps1");

      // فحص الـ IP الخارجي
      const ipResult = await runPowershellScript("get_external_ip.ps1");

      // فحص إحصائيات الشبكة
      const statsResult = await runPowershellScript("get_network_stats.ps1");

      // حساب مدة الاتصال
      const duration = connectionStartTime
        ? Math.floor((Date.now() - connectionStartTime.getTime()) / 1000)
        : 0;

      const realtimeData = {
        currentIP: ipResult.ip || "Fetching...",
        country: ipResult.country || "Unknown",
        city: ipResult.city || "Unknown",
        connectionDuration: duration,
        downloadSpeed: statsResult.downloadSpeed || 0,
        uploadSpeed: statsResult.uploadSpeed || 0,
        bytesReceived: statsResult.bytesReceived || 0,
        bytesSent: statsResult.bytesSent || 0,
      };

      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("vpn:realtime-data", realtimeData);
      }
    } catch (error) {
      addLog(`Monitoring error: ${error.message}`, "error", "Monitor");
    }
  }, 5000);
}

function stopVPNMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    addLog("VPN monitoring stopped", "info", "Monitor");
  }

  if (vpnProcess && !vpnProcess.killed) {
    vpnProcess.kill();
    vpnProcess = null;
    addLog("VPN process terminated", "info", "VPNProcess");
  }

  connectionStartTime = null;
}

// IPC Handlers
ipcMain.on("vpn:connect", async (event, configPath) => {
  addLog(`Connect request received for: ${configPath}`, "info", "IPC");

  try {
    // إيقاف أي اتصال سابق
    if (vpnProcess && !vpnProcess.killed) {
      await runPowershellScript("disconnect_vpn.ps1");
    }

    // بدء الاتصال الجديد
    const result = await runPowershellScript(
      "connect_vpn.ps1",
      [configPath],
      true,
    );

    addLog("VPN connection established successfully", "success", "WireGuard");

    mainWindow.webContents.send("vpn:status-updated", {
      status: "Connected",
      message: "VPN connected successfully",
      serverName: path.basename(configPath, path.extname(configPath)),
    });

    startVPNMonitoring();
  } catch (error) {
    addLog(`VPN connection failed: ${error.message}`, "error", "VPN");
    mainWindow.webContents.send("vpn:status-updated", {
      status: "Disconnected",
      message: `Connection failed: ${error.message}`,
    });
  }
});

ipcMain.on("vpn:disconnect", async (event) => {
  addLog("Disconnect request received", "info", "IPC");

  try {
    await runPowershellScript("disconnect_vpn.ps1", [], true);

    stopVPNMonitoring();

    addLog("VPN disconnected successfully", "success", "VPN");
    mainWindow.webContents.send("vpn:status-updated", {
      status: "Disconnected",
      message: "VPN disconnected successfully",
    });
  } catch (error) {
    addLog(`VPN disconnection failed: ${error.message}`, "error", "VPN");
    mainWindow.webContents.send("vpn:status-updated", {
      status: "Connected",
      message: `Disconnection failed: ${error.message}`,
    });
  }
});

ipcMain.on("vpn:toggle-killswitch", async (event, enable) => {
  addLog(
    `Kill Switch toggle request: ${enable ? "Enable" : "Disable"}`,
    "info",
    "IPC",
  );

  try {
    const action = enable ? "DisableInternet" : "EnableInternet";
    await runPowershellScript("toggle_killswitch.ps1", [action], true);

    killSwitchActive = enable;
    addLog(
      `Kill Switch ${enable ? "enabled" : "disabled"}`,
      "success",
      "KillSwitch",
    );

    mainWindow.webContents.send("vpn:killswitch-status", killSwitchActive);
  } catch (error) {
    addLog(
      `Kill Switch operation failed: ${error.message}`,
      "error",
      "KillSwitch",
    );
    mainWindow.webContents.send("vpn:killswitch-status", killSwitchActive);
  }
});

// جلب البيانات الأولية
ipcMain.handle("vpn:get-initial-data", async () => {
  addLog("Initial data requested", "info", "IPC");

  const servers = loadVPNConfigs();

  return {
    servers,
    status: {
      connected: false,
      status: "Disconnected",
      currentIP: "N/A",
      killSwitchActive,
    },
    logs: logs.slice(-50), // آخر 50 سجل
    settings: {
      autoReconnect: true,
      notifications: true,
      killSwitchOnDisconnect: killSwitchActive,
    },
  };
});

// استيراد ملف إعدادات VPN
ipcMain.on("vpn:import-config", async (event) => {
  addLog("Config import requested", "info", "IPC");

  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [
        { name: "VPN Config Files", extensions: ["conf", "ovpn"] },
        { name: "WireGuard Config", extensions: ["conf"] },
        { name: "OpenVPN Config", extensions: ["ovpn"] },
      ],
      title: "Import VPN Configuration",
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const configContent = fs.readFileSync(filePath, "utf8");
      const fileName = path.basename(filePath);
      const protocol = fileName.endsWith(".conf") ? "wireguard" : "openvpn";

      // تشفير وحفظ الإعدادات
      const encryptedContent = encryptConfig(configContent);
      const serverName = `${Date.now()}_${fileName}`;
      const serverConfigPath = path.join(
        CONFIGS_DIR,
        `${serverName}.encrypted`,
      );

      fs.writeFileSync(serverConfigPath, encryptedContent);

      // حفظ بيانات السيرفر
      const serverInfo = {
        id: serverName,
        name: fileName.replace(/\.(conf|ovpn)$/, ""),
        location: "Unknown",
        protocol,
        configPath: serverConfigPath,
        imported: true,
        importDate: new Date().toISOString(),
      };

      const serversInfoPath = path.join(CONFIGS_DIR, "servers.json");
      let serversInfo = [];

      if (fs.existsSync(serversInfoPath)) {
        serversInfo = JSON.parse(fs.readFileSync(serversInfoPath, "utf8"));
      }

      serversInfo.push(serverInfo);
      fs.writeFileSync(serversInfoPath, JSON.stringify(serversInfo, null, 2));

      addLog(`Config imported successfully: ${fileName}`, "success", "Import");

      // تحديث قائمة السيرفرات في الواجهة
      mainWindow.webContents.send("vpn:server-list-updated", loadVPNConfigs());
    } else {
      addLog("Config import canceled by user", "info", "Import");
    }
  } catch (error) {
    addLog(`Config import failed: ${error.message}`, "error", "Import");
    dialog.showErrorBox(
      "Import Error",
      `Failed to import VPN config: ${error.message}`,
    );
  }
});

// حذف إعدادات السيرفر
ipcMain.on("vpn:delete-server", async (event, serverId) => {
  addLog(`Delete server request: ${serverId}`, "info", "IPC");

  try {
    const serversInfoPath = path.join(CONFIGS_DIR, "servers.json");

    if (fs.existsSync(serversInfoPath)) {
      let serversInfo = JSON.parse(fs.readFileSync(serversInfoPath, "utf8"));
      const serverIndex = serversInfo.findIndex((s) => s.id === serverId);

      if (serverIndex !== -1) {
        const server = serversInfo[serverIndex];

        // حذف ملف الإعدادات
        if (fs.existsSync(server.configPath)) {
          fs.unlinkSync(server.configPath);
        }

        // إزالة من قائمة السيرفرات
        serversInfo.splice(serverIndex, 1);
        fs.writeFileSync(serversInfoPath, JSON.stringify(serversInfo, null, 2));

        addLog(
          `Server deleted successfully: ${server.name}`,
          "success",
          "Delete",
        );

        // تحديث قائمة السيرفرات
        mainWindow.webContents.send(
          "vpn:server-list-updated",
          loadVPNConfigs(),
        );
      }
    }
  } catch (error) {
    addLog(`Server deletion failed: ${error.message}`, "error", "Delete");
  }
});

// تصدير السجلات
ipcMain.handle("vpn:export-logs", async () => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `knox-vpn-logs-${new Date().toISOString().split("T")[0]}.txt`,
      filters: [
        { name: "Text Files", extensions: ["txt"] },
        { name: "JSON Files", extensions: ["json"] },
      ],
    });

    if (!result.canceled) {
      const extension = path.extname(result.filePath);
      let content = "";

      if (extension === ".json") {
        content = JSON.stringify(logs, null, 2);
      } else {
        content = logs
          .map(
            (log) =>
              `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`,
          )
          .join("\n");
      }

      fs.writeFileSync(result.filePath, content);
      addLog(`Logs exported to: ${result.filePath}`, "success", "Export");
      return { success: true, path: result.filePath };
    }

    return { success: false, canceled: true };
  } catch (error) {
    addLog(`Log export failed: ${error.message}`, "error", "Export");
    return { success: false, error: error.message };
  }
});

// تحميل قائمة السيرفرات
function loadVPNConfigs() {
  const serversInfoPath = path.join(CONFIGS_DIR, "servers.json");

  if (!fs.existsSync(serversInfoPath)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(serversInfoPath, "utf8"));
  } catch (error) {
    addLog(`Failed to load servers info: ${error.message}`, "error", "Config");
    return [];
  }
}

// إنشاء النافذة الرئيسية
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    // تخصيصات KNOX Shield
    frame: false,
    titleBarStyle: "hidden",
    transparent: true,
    hasShadow: true,
    backgroundColor: "#0a0a1f",
    icon: path.join(__dirname, "assets", "knox-icon.ico"),
  });

  // تحميل التطبيق
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  // معالجة أحداث النافذة
  mainWindow.on("closed", () => {
    stopVPNMonitoring();
    mainWindow = null;
  });

  mainWindow.on("minimize", () => {
    // إخفاء النافذة في system tray إذا كان مفعلاً
    if (killSwitchActive) {
      addLog("Window minimized with Kill Switch active", "info", "UI");
    }
  });
}

// دورة حياة التطبيق
app.whenReady().then(() => {
  ensureDirectories();
  createWindow();
  addLog("KNOX Shield VPN application started", "success", "App");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopVPNMonitoring();
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("before-quit", () => {
  stopVPNMonitoring();

  // إيقاف Kill Switch إذا كان مفعلاً
  if (killSwitchActive) {
    addLog("Disabling Kill Switch before app quit", "info", "App");
    runPowershellScript(
      "toggle_killswitch.ps1",
      ["EnableInternet"],
      true,
    ).catch((error) =>
      addLog(
        `Failed to disable Kill Switch on quit: ${error.message}`,
        "error",
        "App",
      ),
    );
  }
});

// معالجة الأخطاء العامة
process.on("uncaughtException", (error) => {
  addLog(`Uncaught Exception: ${error.message}`, "error", "System");
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  addLog(`Unhandled Rejection: ${reason}`, "error", "System");
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = { addLog };
