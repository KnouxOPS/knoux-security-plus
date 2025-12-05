const { contextBridge, ipcRenderer } = require("electron");

// قائمة القنوات المسموحة للأمان
const validSendChannels = [
  "vpn:connect",
  "vpn:disconnect",
  "vpn:toggle-killswitch",
  "vpn:import-config",
  "vpn:delete-server",
  "vpn:ping-server",
  "vpn:speed-test",
  "vpn:clear-logs",
];

const validReceiveChannels = [
  "vpn:status-updated",
  "vpn:realtime-data",
  "vpn:killswitch-status",
  "vpn:log-updated",
  "vpn:server-list-updated",
  "vpn:connection-error",
  "vpn:notification",
];

const validInvokeChannels = [
  "vpn:get-initial-data",
  "vpn:export-logs",
  "vpn:get-server-details",
  "vpn:generate-qr-code",
  "vpn:check-admin-privileges",
  "vpn:get-network-interfaces",
];

// عرض APIs آمنة للواجهة الأمامية
contextBridge.exposeInMainWorld("electron", {
  // إرسال أوامر من الواجهة إلى main process
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      console.log(`[IPC Send] ${channel}:`, data);
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`[IPC Security] Invalid send channel: ${channel}`);
      throw new Error(`Invalid IPC send channel: ${channel}`);
    }
  },

  // الاستماع للأحداث القادمة من main process
  on: (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);

      // إرجاع دالة للتنظيف
      return () => {
        ipcRenderer.removeListener(channel, subscription);
        console.log(`[IPC Cleanup] Removed listener for ${channel}`);
      };
    } else {
      console.warn(`[IPC Security] Invalid receive channel: ${channel}`);
      return () => {}; // دالة ��ارغة للتنظيف
    }
  },

  // مرة واحدة فقط للاستماع
  once: (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.once(channel, subscription);
      console.log(`[IPC Once] Listening once to ${channel}`);
    } else {
      console.warn(`[IPC Security] Invalid once channel: ${channel}`);
    }
  },

  // التعامل مع الردود المباشرة (مثال على استخدام invoke/handle)
  invoke: async (channel, ...args) => {
    if (validInvokeChannels.includes(channel)) {
      console.log(`[IPC Invoke] ${channel}:`, args);
      try {
        const result = await ipcRenderer.invoke(channel, ...args);
        console.log(`[IPC Invoke Response] ${channel}:`, result);
        return result;
      } catch (error) {
        console.error(`[IPC Invoke Error] ${channel}:`, error);
        throw error;
      }
    } else {
      console.warn(`[IPC Security] Invalid invoke channel: ${channel}`);
      return Promise.reject(
        new Error(`Invalid IPC invoke channel: ${channel}`),
      );
    }
  },

  // إزالة مستمع م��دد
  removeListener: (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, func);
      console.log(`[IPC Remove] Removed specific listener for ${channel}`);
    } else {
      console.warn(`[IPC Security] Invalid removeListener channel: ${channel}`);
    }
  },

  // إزالة جميع المستمعين لقناة معينة
  removeAllListeners: (channel) => {
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
      console.log(`[IPC Remove All] Removed all listeners for ${channel}`);
    } else {
      console.warn(
        `[IPC Security] Invalid removeAllListeners channel: ${channel}`,
      );
    }
  },
});

// APIs إضافية للنظام
contextBridge.exposeInMainWorld("knoxSystem", {
  // معلومات النظام
  platform: process.platform,
  arch: process.arch,
  versions: {
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome,
  },

  // معلومات التطبيق
  appInfo: {
    name: "KNOX Shield VPN",
    version: "1.0.0",
    description: "SentinelTracker Edition - Ultimate VPN Control Center",
  },
});

// APIs للأمان والتشفير (محدودة)
contextBridge.exposeInMainWorld("knoxSecurity", {
  // توليد معرف فريد
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // تشفير بسيط للبيانات الحساسة في الواجهة
  simpleEncrypt: (text) => {
    return btoa(text); // Base64 encoding للبيانات البسيطة
  },

  // فك تشفير بسيط
  simpleDecrypt: (encoded) => {
    try {
      return atob(encoded);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  },
});

// APIs للتخزين المحلي الآمن
contextBridge.exposeInMainWorld("knoxStorage", {
  // حفظ إعدادات المستخدم
  setItem: (key, value) => {
    try {
      localStorage.setItem(`knox_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  },

  // جلب إعدادات المستخدم
  getItem: (key) => {
    try {
      const item = localStorage.getItem(`knox_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  // حذف إعدادات المستخدم
  removeItem: (key) => {
    try {
      localStorage.removeItem(`knox_${key}`);
      return true;
    } catch (error) {
      console.error("Storage remove error:", error);
      return false;
    }
  },

  // مسح جميع البيانات
  clear: () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("knox_")) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  },
});

// APIs للإشعارات
contextBridge.exposeInMainWorld("knoxNotifications", {
  // إظهار إشعار نظام
  show: (title, body, options = {}) => {
    if ("Notification" in window && Notification.permission === "granted") {
      return new Notification(title, {
        body,
        icon: options.icon || "./assets/knox-icon.png",
        tag: options.tag || "knox-vpn",
        ...options,
      });
    } else if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          return new Notification(title, { body, ...options });
        }
      });
    }
    return null;
  },

  // طلب صلاحية الإشعارات
  requestPermission: async () => {
    if ("Notification" in window) {
      return await Notification.requestPermission();
    }
    return "denied";
  },

  // فحص حالة صلاحية الإشعارات
  getPermission: () => {
    if ("Notification" in window) {
      return Notification.permission;
    }
    return "denied";
  },
});

// إضافة مستمعين للأحداث العامة
window.addEventListener("DOMContentLoaded", () => {
  console.log("[KNOX Preload] DOM loaded, APIs exposed successfully");

  // فحص دعم الإشعارات
  if ("Notification" in window) {
    console.log("[KNOX Preload] Notifications supported");
  } else {
    console.warn("[KNOX Preload] Notifications not supported");
  }

  // فحص دعم localStorage
  try {
    localStorage.setItem("knox_test", "test");
    localStorage.removeItem("knox_test");
    console.log("[KNOX Preload] LocalStorage supported");
  } catch (error) {
    console.warn("[KNOX Preload] LocalStorage not supported:", error);
  }
});

// معالجة الأخطاء العامة
window.addEventListener("error", (event) => {
  console.error("[KNOX Preload] Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("[KNOX Preload] Unhandled promise rejection:", event.reason);
});

console.log(
  "[KNOX Preload] Security-hardened preload script loaded successfully",
);
