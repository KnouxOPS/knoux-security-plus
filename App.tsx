import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Layout, DynamicBackground } from "./components/Layout";
import { DashboardPage } from "./components/Dashboard";
import { CategoryDetailPage } from "./components/CategoryView";
import { ToolDetailPage } from "./components/ToolView";
import { SettingsPage, SupportPage, UpdatePage } from "./components/MiscPages";
import { LiveOperationsPage } from "./components/LiveOperations";
import VPNDashboard from "./components/VPNDashboard";
import {
  ToastMessage,
  LiveOperation,
  Tool,
  ToolCategory,
  ToolStatus,
  ToastType,
  ScanResults,
  ThreatDetails,
  ChatMessage as AppChatMessage,
  AIGeneratedContent,
  KNOX_LOGO_URL,
  Language,
  Theme,
  LocalizedTexts,
} from "./types";
import {
  TOOL_CATEGORIES as RAW_TOOL_CATEGORIES,
  AR_TEXTS,
  EN_TEXTS,
  THREAT_DB,
} from "./constants";
import { ToastContainer } from "./components/Common";
import { LockClosedIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface AppContextType {
  operations: LiveOperation[];
  addOperation: (
    tool: Tool,
    taskDescription: string,
    params?: Record<string, any>,
  ) => string;
  updateOperation: (
    operationId: string,
    updates: Partial<LiveOperation>,
  ) => void;
  addToast: (message: string, type?: ToastType, icon?: React.ReactNode) => void;
  getToolById: (categoryId: string, toolId: string) => Tool | undefined;
  updateToolStatus: (
    categoryId_or_toolCategoryName: string,
    toolId: string,
    status: ToolStatus,
    progress?: number,
  ) => void;
  allTools: Tool[];

  isGeminiAvailable: boolean;
  chatWithGemini: (
    toolId: string,
    userMessage: string,
    existingChat?: Chat,
  ) => Promise<{ chat: Chat; response: AppChatMessage } | null>;
  analyzeScanWithGemini: (
    scanResults: ScanResults,
  ) => Promise<AIGeneratedContent | null>;
  getGeminiChatInstance: (toolId: string) => Chat | undefined;
  storeGeminiChatInstance: (toolId: string, chat: Chat) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getText: (key: string, params?: any) => string;
  toolCategories: ToolCategory[];
}

export const AppContext = React.createContext<AppContextType | null>(null);

const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [operations, setOperations] = useState<LiveOperation[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const location = useLocation();

  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem("knoxLanguage") as Language) || "en",
  );
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("knoxTheme") as Theme) || "dark",
  );

  const texts = useMemo(
    () => (language === "ar" ? AR_TEXTS : EN_TEXTS),
    [language],
  );

  const getText = useCallback(
    (key: string, params?: any): string => {
      const textOrFn = texts[key];
      if (typeof textOrFn === "function") {
        return textOrFn(params);
      }
      return textOrFn || key;
    },
    [texts],
  );

  const toolCategories = useMemo(() => {
    return RAW_TOOL_CATEGORIES.map((category) => ({
      ...category,
      name: getText(category.name, {}) || category.name,
      description: getText(category.description, {}) || category.description,
      tools: category.tools.map((tool) => ({
        ...tool,
        name: getText(tool.name, {}) || tool.name,
        description: getText(tool.description, {}) || tool.description,
        longDescription:
          getText(tool.longDescription, {}) || tool.longDescription,
        status: tool.status || ToolStatus.NotLoaded,
        sampleExecutionParams: tool.sampleExecutionParams?.map((p) => ({
          ...p,
          label: getText(p.label) || p.label,
          placeholder: p.placeholder
            ? getText(p.placeholder) || p.placeholder
            : undefined,
          options: p.options?.map((opt) =>
            opt.startsWith("PRIVACY_WIPE_OPTIONS_")
              ? getText(opt) || opt.replace("PRIVACY_WIPE_OPTIONS_", "")
              : getText(opt) || opt,
          ),
        })),
      })),
    }));
  }, [getText]);

  const [localCategoriesData, setLocalCategoriesData] =
    useState<ToolCategory[]>(toolCategories);

  useEffect(() => {
    setLocalCategoriesData(toolCategories);
  }, [toolCategories]);

  const [geminiAI, setGeminiAI] = useState<GoogleGenAI | null>(null);
  const isGeminiAvailable = !!API_KEY && !!geminiAI;
  const activeGeminiChats = useRef<Map<string, Chat>>(new Map());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("knoxLanguage", lang);
    document.documentElement.lang = lang;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("knoxTheme", newTheme);
    document.documentElement.dataset.theme = newTheme;
    document.documentElement.classList.remove(
      newTheme === "dark" ? "light" : "dark",
    );
    document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    setTheme(theme);
    setLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToast = useCallback(
    (
      messageKeyOrText: string,
      type: ToastType = ToastType.Info,
      icon?: React.ReactNode,
    ) => {
      const message = getText(messageKeyOrText) || messageKeyOrText;
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prevToasts) => {
        const newToasts = [...prevToasts, { id, message, type, icon }];
        if (newToasts.length > 5) newToasts.shift();
        return newToasts;
      });
      setTimeout(
        () => {
          setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id),
          );
        },
        5000 + Math.random() * 2000,
      );
    },
    [getText],
  );

  useEffect(() => {
    if (API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        setGeminiAI(ai);
        console.log("Gemini AI SDK Initialized");
      } catch (error) {
        console.error("Failed to initialize Gemini AI SDK:", error);
        addToast(
          getText("AI_INIT_ERROR") ||
            "Error initializing Gemini AI. Features may be limited.",
          ToastType.Error,
        );
      }
    } else {
      console.warn(
        "API_KEY for Gemini is not set. AI features will be unavailable.",
      );
      addToast(getText("API_KEY_MISSING_ERROR"), ToastType.Error);
    }
  }, [addToast, getText]);

  const getGeminiChatInstance = useCallback(
    (toolId: string): Chat | undefined => {
      return activeGeminiChats.current.get(toolId);
    },
    [],
  );

  const storeGeminiChatInstance = useCallback((toolId: string, chat: Chat) => {
    activeGeminiChats.current.set(toolId, chat);
  }, []);

  const chatWithGemini = useCallback(
    async (
      toolId: string,
      userMessageText: string,
      existingChat?: Chat,
    ): Promise<{ chat: Chat; response: AppChatMessage } | null> => {
      if (!isGeminiAvailable) {
        addToast(getText("API_KEY_MISSING_ERROR"), ToastType.Error);
        return null;
      }

      let chat = existingChat || getGeminiChatInstance(toolId);
      if (!chat) {
        chat = geminiAI!.chats.create({
          model: "gemini-2.5-flash-preview-04-17",
          config: {
            systemInstruction:
              "You are KNOX AI, a helpful and knowledgeable cybersecurity assistant integrated into KNOX Security Plus. Respond in the user's language if apparent.",
          },
        });
        storeGeminiChatInstance(toolId, chat);
      }

      try {
        const result: GenerateContentResponse = await chat.sendMessage({
          message: userMessageText,
        });
        const aiResponseText = result.text;
        const aiMessage: AppChatMessage = {
          id: `ai-${Date.now()}`,
          text: aiResponseText,
          sender: "ai",
          timestamp: new Date(),
        };
        return { chat, response: aiMessage };
      } catch (error) {
        console.error("Error chatting with Gemini:", error);
        addToast(
          getText("AI_CHAT_ERROR") || "Error communicating with Gemini AI.",
          ToastType.Error,
        );
        const errorMessage: AppChatMessage = {
          id: `err-${Date.now()}`,
          text:
            getText("AI_CHAT_FAIL_MESSAGE") ||
            "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        return { chat, response: errorMessage };
      }
    },
    [
      isGeminiAvailable,
      addToast,
      geminiAI,
      getGeminiChatInstance,
      storeGeminiChatInstance,
      getText,
    ],
  );

  const analyzeScanWithGemini = useCallback(
    async (scanResults: ScanResults): Promise<AIGeneratedContent | null> => {
      if (!isGeminiAvailable) {
        addToast(getText("API_KEY_MISSING_ERROR"), ToastType.Error);
        return null;
      }
      addToast(
        getText("AI_ANALYZING_TOAST"),
        ToastType.Info,
        <SparklesIcon className="h-5 w-5" />,
      );

      let prompt = getText("THREAT_ANALYSIS_PROMPT_PREFIX");
      scanResults.threatsFound.forEach((threat) => {
        let threatTypeKey = "";
        switch (threat.type) {
          case "process":
            threatTypeKey = "THREAT_TYPE_PROCESS";
            break;
          case "startup":
            threatTypeKey = "THREAT_TYPE_STARTUP";
            break;
          case "signature":
            threatTypeKey = "THREAT_TYPE_SIGNATURE";
            break;
        }
        prompt += `- Finding: ${getText(threatTypeKey)} - "${threat.value}" (Severity: ${threat.severity || "Unknown"})\n`;
      });

      try {
        const response: GenerateContentResponse =
          await geminiAI!.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: { temperature: 0.3 },
          });
        const analysisText = response.text;
        addToast(
          getText("AI_ANALYSIS_COMPLETE_TOAST"),
          ToastType.Success,
          <SparklesIcon className="h-5 w-5" />,
        );
        return {
          id: `analysis-${Date.now()}`,
          toolId: "knoxdeepscan",
          prompt,
          responseText: analysisText,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error analyzing with Gemini:", error);
        addToast(getText("AI_ANALYSIS_ERROR_TOAST"), ToastType.Error);
        return {
          id: `analysis-err-${Date.now()}`,
          toolId: "knoxdeepscan",
          prompt,
          responseText: "Failed to generate AI analysis.",
          timestamp: new Date(),
          error: String(error),
        };
      }
    },
    [isGeminiAvailable, addToast, geminiAI, getText],
  );

  const updateToolStatus = useCallback(
    (
      categoryId_or_toolCategoryName: string,
      toolId: string,
      status: ToolStatus,
      progress?: number,
    ) => {
      setLocalCategoriesData((prevCategories) =>
        prevCategories.map((cat) => {
          const originalCategory = RAW_TOOL_CATEGORIES.find(
            (rc) =>
              rc.id === cat.id || rc.name === categoryId_or_toolCategoryName,
          );
          if (
            cat.id === categoryId_or_toolCategoryName ||
            (originalCategory &&
              getText(originalCategory.name) === categoryId_or_toolCategoryName)
          ) {
            return {
              ...cat,
              tools: cat.tools.map((t) => {
                const originalTool = originalCategory?.tools.find(
                  (rt) => rt.id === t.id,
                );
                if (
                  t.id === toolId ||
                  (originalTool && getText(originalTool.name) === toolId)
                ) {
                  return {
                    ...t,
                    status,
                    progress:
                      status === ToolStatus.Running ||
                      status === ToolStatus.Loading
                        ? progress !== undefined
                          ? progress
                          : t.progress
                        : status === ToolStatus.Completed
                          ? 100
                          : 0,
                  };
                }
                return t;
              }),
            };
          }
          return cat;
        }),
      );
    },
    [getText],
  );

  const addOperation = useCallback(
    (
      tool: Tool,
      taskDescription: string,
      params?: Record<string, any>,
    ): string => {
      const operationId = `op-${Date.now()}-${tool.id}`;
      const initialLog =
        params && Object.keys(params).length > 0
          ? `Operation started with params: ${JSON.stringify(params)}`
          : `Operation started: ${taskDescription}`;

      let newOperation: LiveOperation = {
        id: operationId,
        toolName: tool.name,
        toolIcon: tool.icon,
        taskDescription,
        status: ToolStatus.Running,
        progress: 0,
        startTime: new Date(),
        logs: [`[${new Date().toLocaleTimeString()}] ${initialLog}`],
      };

      let simulationLogic:
        | (() => { currentProgress: number; finalStatusUpdate?: any })
        | null = null;
      const totalDuration =
        3000 + Math.random() * (tool.id === "knoxdeepscan" ? 7000 : 4000);
      const updatesPerSecond = tool.id === "knoxdeepscan" ? 3 : 2;
      const progressIncrement =
        100 / ((totalDuration / 1000) * updatesPerSecond);

      if (tool.id === "knoxdeepscan") {
        newOperation.logs.push(
          `[${new Date().toLocaleTimeString()}] ${getText("KNOX_DEEP_SCAN_INIT") || "Initializing KNOX Deep Scan Engine..."}`,
        );
        let currentProgress = 0;
        let phase = 1;
        let itemsScanned = 0;
        const threatsFoundThisScan: ThreatDetails[] = [];

        simulationLogic = () => {
          currentProgress += progressIncrement;
          itemsScanned += Math.floor(Math.random() * 500 + 100);

          if (phase === 1 && currentProgress < 33) {
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DB_PROCESS_SCAN")} (${itemsScanned} items)`,
            );
            if (
              Math.random() < 0.05 &&
              THREAT_DB.maliciousProcessNames.length > 0
            ) {
              const threat =
                THREAT_DB.maliciousProcessNames[
                  Math.floor(
                    Math.random() * THREAT_DB.maliciousProcessNames.length,
                  )
                ];
              threatsFoundThisScan.push({
                type: "process",
                value: threat,
                severity: "High",
              });
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DETECTED_PREFIX")} ${getText("THREAT_TYPE_PROCESS")}: ${threat}`,
              );
            }
          } else if (currentProgress >= 33 && phase < 2) {
            phase = 2;
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DB_STARTUP_SCAN")} (${itemsScanned} items)`,
            );
          } else if (phase === 2 && currentProgress < 66) {
            if (
              Math.random() < 0.03 &&
              THREAT_DB.suspiciousStartupEntries.length > 0
            ) {
              const threat =
                THREAT_DB.suspiciousStartupEntries[
                  Math.floor(
                    Math.random() * THREAT_DB.suspiciousStartupEntries.length,
                  )
                ];
              threatsFoundThisScan.push({
                type: "startup",
                value: threat,
                severity: "Medium",
              });
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DETECTED_PREFIX")} ${getText("THREAT_TYPE_STARTUP")}: ${threat}`,
              );
            }
          } else if (currentProgress >= 66 && phase < 3) {
            phase = 3;
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DB_SIGNATURE_SCAN")} (${itemsScanned} items)`,
            );
          } else if (phase === 3 && currentProgress < 100) {
            if (
              Math.random() < 0.02 &&
              THREAT_DB.malwareSignatures.length > 0
            ) {
              const threatDef =
                THREAT_DB.malwareSignatures[
                  Math.floor(Math.random() * THREAT_DB.malwareSignatures.length)
                ];
              threatsFoundThisScan.push({
                type: "signature",
                value: threatDef.name,
                severity: "High",
              });
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("THREAT_DETECTED_PREFIX")} ${getText("THREAT_TYPE_SIGNATURE")}: ${threatDef.name}`,
              );
            }
          }

          if (currentProgress >= 100) {
            newOperation.scanResults = {
              itemsScanned,
              threatsFound: threatsFoundThisScan,
            };
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] Scan complete. ${itemsScanned} items processed. ${threatsFoundThisScan.length} potential threats found.`,
            );
            if (
              threatsFoundThisScan.length > 0 &&
              Notification.permission === "granted"
            ) {
              new Notification(getText("KNOX_ALERT_TITLE") || "KNOX Alert!", {
                body: `${threatsFoundThisScan.length} ${getText("KNOX_ALERT_BODY_THREATS_DETECTED") || "potential threats detected by KNOX Deep Scan. Review results."}`,
                icon: KNOX_LOGO_URL,
              });
            }
          }
          return {
            currentProgress,
            finalStatusUpdate:
              currentProgress >= 100
                ? { scanResults: newOperation.scanResults }
                : {},
          };
        };
      } else if (
        tool.id === "emailbreachlookup" &&
        params?.["Email Address to Check"]
      ) {
        const emailToCheck = params["Email Address to Check"];
        newOperation.logs.push(
          `[${new Date().toLocaleTimeString()}] ${getText("EMAIL_BREACH_ANALYZING", { email: emailToCheck })}`,
        );
        let currentProgress = 0;
        simulationLogic = () => {
          currentProgress += progressIncrement;
          if (currentProgress >= 100) {
            const foundBreaches =
              Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
            if (foundBreaches > 0) {
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("EMAIL_BREACH_FOUND", { count: foundBreaches, email: emailToCheck })}`,
              );
              for (let i = 0; i < foundBreaches; i++)
                newOperation.logs.push(
                  ` - Simulated breach entry ${i + 1} from source XYZ`,
                );
            } else {
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("EMAIL_BREACH_NO_BREACHES", { email: emailToCheck })}`,
              );
            }
          }
          return { currentProgress, finalStatusUpdate: {} };
        };
      } else if (
        tool.id === "privacytracewiper" &&
        params?.["Select items to wipe:"]
      ) {
        const itemToWipe = params["Select items to wipe:"];

        newOperation.logs.push(
          `[${new Date().toLocaleTimeString()}] ${getText("PRIVACY_WIPING_LOG_PREFIX")} ${itemToWipe}...`,
        );
        let currentProgress = 0;
        simulationLogic = () => {
          currentProgress += progressIncrement;
          if (currentProgress % 20 < progressIncrement && currentProgress < 100)
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] Deleting ${itemToWipe} sector ${Math.floor(currentProgress / 20) + 1}...`,
            );
          if (currentProgress >= 100) {
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] ${getText("PRIVACY_WIPE_COMPLETE")}`,
            );
          }
          return { currentProgress, finalStatusUpdate: {} };
        };
      } else if (tool.id === "malwareprocesskiller") {
        newOperation.logs.push(
          `[${new Date().toLocaleTimeString()}] ${getText("MALWARE_KILLER_SCAN_BUTTON")}...`,
        );
        let currentProgress = 0;
        let foundThreatsForKilling: string[] = [];
        simulationLogic = () => {
          currentProgress += progressIncrement;
          if (
            currentProgress < 50 &&
            Math.random() < 0.1 &&
            THREAT_DB.maliciousProcessNames.length > 0
          ) {
            const threat =
              THREAT_DB.maliciousProcessNames[
                Math.floor(
                  Math.random() * THREAT_DB.maliciousProcessNames.length,
                )
              ];
            if (!foundThreatsForKilling.includes(threat)) {
              foundThreatsForKilling.push(threat);
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("MALWARE_KILLER_PROCESS_FOUND", { name: threat })}`,
              );
            }
          }
          if (
            currentProgress >= 50 &&
            currentProgress < 100 &&
            foundThreatsForKilling.length > 0
          ) {
            const threatToKill = foundThreatsForKilling.shift();
            if (threatToKill) {
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("MALWARE_KILLER_TERMINATING", { name: threatToKill })}`,
              );
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("MALWARE_KILLER_TERMINATED", { name: threatToKill })}`,
              );
            }
          }
          if (currentProgress >= 100) {
            if (
              foundThreatsForKilling.length === 0 &&
              !newOperation.logs.some((l) =>
                l.includes(
                  getText("MALWARE_KILLER_PROCESS_FOUND", { name: "" }).split(
                    ":",
                  )[0],
                ),
              )
            ) {
              newOperation.logs.push(
                `[${new Date().toLocaleTimeString()}] ${getText("MALWARE_KILLER_NO_THREATS")}`,
              );
            }
            newOperation.logs.push(
              `[${new Date().toLocaleTimeString()}] Malware process scan & kill simulation complete.`,
            );
          }
          return { currentProgress, finalStatusUpdate: {} };
        };
      }

      if (!simulationLogic) {
        let currentProgress = 0;
        simulationLogic = () => {
          currentProgress += progressIncrement;
          return { currentProgress, finalStatusUpdate: {} };
        };
      }

      const interval = setInterval(() => {
        const result = simulationLogic!();
        const currentProgress = result.currentProgress;
        const finalStatusUpdate = result.finalStatusUpdate;

        if (currentProgress < 100) {
          setOperations((prevOps) =>
            prevOps.map((op) =>
              op.id === newOperation.id
                ? {
                    ...op,
                    progress: Math.min(currentProgress, 100),
                    logs: [...newOperation.logs].slice(-20),
                  }
                : op,
            ),
          );
          updateToolStatus(
            tool.category,
            tool.id,
            ToolStatus.Running,
            Math.min(currentProgress, 100),
          );
        } else {
          clearInterval(interval);
          const finalStatus =
            Math.random() > 0.1 ? ToolStatus.Completed : ToolStatus.Error;
          const finalLogMessage =
            finalStatus === ToolStatus.Completed
              ? "Operation completed successfully."
              : "Operation failed with an error.";
          newOperation.logs.push(
            `[${new Date().toLocaleTimeString()}] ${finalLogMessage}`,
          );

          setOperations((prevOps) =>
            prevOps.map((op) =>
              op.id === newOperation.id
                ? {
                    ...op,
                    status: finalStatus,
                    progress: 100,
                    endTime: new Date(),
                    logs: [...newOperation.logs].slice(-50),
                    ...finalStatusUpdate,
                  }
                : op,
            ),
          );
          updateToolStatus(tool.category, tool.id, finalStatus, 100);
          addToast(
            `${tool.name} - ${taskDescription} ${finalStatus}!`,
            finalStatus === ToolStatus.Completed
              ? ToastType.Success
              : ToastType.Error,
          );
        }
      }, 1000 / updatesPerSecond);

      setOperations((prevOps) => [newOperation, ...prevOps].slice(0, 50));
      return operationId;
    },
    [addToast, updateToolStatus, getText, toolCategories],
  );

  const updateOperation = useCallback(
    (operationId: string, updates: Partial<LiveOperation>) => {
      setOperations((prevOps) =>
        prevOps.map((op) => {
          if (op.id === operationId) {
            const newLogs = op.logs ? [...op.logs] : [];
            if (updates.status && updates.status !== op.status) {
              newLogs.push(
                `[${new Date().toLocaleTimeString()}] Status updated: ${updates.status}`,
              );
            }
            return { ...op, ...updates, logs: newLogs };
          }
          return op;
        }),
      );
    },
    [],
  );

  const getToolById = useCallback(
    (categoryId: string, toolId: string): Tool | undefined => {
      const category = localCategoriesData.find((cat) => cat.id === categoryId);
      return category?.tools.find((t) => t.id === toolId);
    },
    [localCategoriesData],
  );

  const allTools = localCategoriesData.flatMap((cat) => cat.tools);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          addToast(
            getText("NOTIFICATIONS_ENABLED_SUCCESS") ||
              "Desktop notifications enabled!",
            ToastType.Success,
          );
        } else {
          addToast(
            getText("NOTIFICATIONS_ENABLED_WARN") ||
              "Desktop notifications denied. Some alerts might be missed.",
            ToastType.Warning,
          );
        }
      });
    }
  }, [addToast, getText]);

  return (
    <AppContext.Provider
      value={{
        operations,
        addOperation,
        updateOperation,
        addToast,
        getToolById,
        updateToolStatus,
        allTools,
        isGeminiAvailable,
        chatWithGemini,
        analyzeScanWithGemini,
        getGeminiChatInstance,
        storeGeminiChatInstance,
        language,
        setLanguage,
        theme,
        setTheme,
        getText,
        toolCategories: localCategoriesData,
      }}
    >
      <div className="flex flex-col min-h-screen bg-cyber-bg text-text-main font-poppins relative">
        <DynamicBackground />
        <Layout key={`${location.pathname}-${language}-${theme}`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/category/:categoryId"
              element={<CategoryDetailPage />}
            />
            <Route
              path="/tool/:categoryId/:toolId"
              element={<ToolDetailPage />}
            />
            <Route path="/live-operations" element={<LiveOperationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/update" element={<UpdatePage />} />
            <Route
              path="/privacy"
              element={
                <SettingsPage
                  title={getText("Privacy") || "Privacy Configuration"}
                  icon={LockClosedIcon}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <ToastContainer
          toasts={toasts}
          onClose={(id) =>
            setToasts((current) => current.filter((t) => t.id !== id))
          }
        />
      </div>
    </AppContext.Provider>
  );
};

export default App;
