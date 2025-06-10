
import { ToolCategory, Tool, ToolStatus, SmartToggleType, LocalizedTexts } from './types';
import { 
  ShieldCheckIcon, CodeBracketIcon, CubeTransparentIcon, CpuChipIcon, CogIcon, 
  ArrowPathIcon, PlayIcon, CommandLineIcon, ServerIcon, AcademicCapIcon, AdjustmentsHorizontalIcon, 
  BeakerIcon, CloudIcon, WrenchScrewdriverIcon, HomeIcon, LockClosedIcon, SquaresPlusIcon, BoltIcon,
  RocketLaunchIcon, GlobeAltIcon, FireIcon, MagnifyingGlassIcon, CircleStackIcon, DevicePhoneMobileIcon,
  PhotoIcon, PuzzlePieceIcon, UsersIcon, LifebuoyIcon, ArchiveBoxIcon, BugAntIcon,
  PaintBrushIcon, LanguageIcon, EyeIcon, SignalIcon, DocumentChartBarIcon, ChatBubbleLeftRightIcon,
  MicrophoneIcon, VideoCameraIcon, LightBulbIcon, BuildingLibraryIcon, FunnelIcon, TableCellsIcon, KeyIcon,
  ShareIcon, TrashIcon, SparklesIcon, SunIcon, MoonIcon, EnvelopeIcon, ShieldExclamationIcon
} from '@heroicons/react/24/outline';
// Removed: import { BroomIcon as SolidBroomIcon } from '@heroicons/react/24/solid'; 

// --- English UI Texts ---
export const EN_TEXTS: LocalizedTexts = {
  DOWNLOAD_BUTTON: "Download 🦾",
  CUSTOMIZE_BUTTON: "Customize ✨",
  RUN_TOOL_BUTTON: "Run Tool 🚀",
  INSTALLING_BUTTON: "Installing...",
  READY_TO_RUN_BUTTON: "Ready to Run! 🔥",
  START_SCAN_RUN_BUTTON: "Start Scan/Run",
  PAUSE_BUTTON: "Pause",
  STOP_BUTTON: "Stop",
  FORCE_STOP_BUTTON: "Force Stop",
  VIEW_LOG_BUTTON: "View Log",
  BROWSE_FULL_RESULTS_BUTTON: "Browse Full Results",
  EXPORT_RESULTS_BUTTON: "Export Results",
  SAVE_TEMPLATE_BUTTON: "Save Template",
  IMPORT_EXPORT_CONFIG_BUTTON: "Import/Export Config",
  APPLY_PARAMS_BUTTON: "Apply & Run",
  SEND_MESSAGE_BUTTON: "Send 💬",
  ANALYZE_WITH_AI_BUTTON: "Analyze with AI 🧠",

  WELCOME_MESSAGE: "Welcome, Knoux Master! Ready to revolutionize your workflow?",
  TOOLTIP_TEXT: "Try me, ya knoux!",
  SUCCESS_TOAST: "Mission Accomplished, Script Lord! ✅",
  NO_ACTIVE_TOOLS_ALERT: "System idle, Commander. Bolster your arsenal in Settings. ⚙️",
  DASHBOARD_TITLE: "PLATFORMS - KNOX Elite Toolkit",
  DASHBOARD_SUBTITLE: "Browse a curated collection of powerful tools and utilities. Each rigorously vetted and optimized by Knoux experts for peak performance.",
  CATEGORY_DETAIL_TITLE_PREFIX: "Top 20 Tools in",
  CATEGORY_DETAIL_TITLE_SUFFIX: "at your command 🔥 — Click to customize, run, and monitor in real-time.",
  LIVE_OPERATIONS_TITLE: "KNOX Live Operations - Real-time Command Center 📡",
  LIVE_OPERATIONS_SUBTITLE: "Ultimate control. Monitor all running tasks and their live output. Track progress, take immediate action, and command your operations.",
  FOOTER_TEXT_LEFT: "MAX KNOX PLUS - Power for Professionals 🦾 — All Rights Reserved.",
  APP_VERSION: (params: { version: string }) => `Version ${params.version} - Gemini Fusion`,

  STATUS_NOT_LOADED: "Not Loaded",
  STATUS_READY_TO_RUN: "Ready to Run",
  STATUS_RUNNING: "Running",
  STATUS_COMPLETED: "Completed",
  STATUS_ERROR: "Error",
  STATUS_LOADING: "Loading",

  TOOL_DESCRIPTION_PLACEHOLDER: "Professional-grade description of the tool's features and effective usage.",
  TOOL_ADV_SETTINGS_TITLE: "Advanced Settings & Pro Configuration",
  TOOL_EXEC_OPTIONS_TITLE: "Dynamic Execution Options",
  TOOL_RESULTS_MGMT_TITLE: "Comprehensive Results Management",
  TOOL_PREVIEW_TITLE: "Tool Action Preview",
  TOOL_PREVIEW_SUB_TEXT: "Simplified visualization of the tool's mechanism or typical output.",
  ADV_SETTINGS_FORM_TITLE_PREFIX: "Advanced Execution Settings for:",
  ADV_SETTINGS_TEMPLATE_SELECT: "-- Select Run Template --",
  ADV_SETTINGS_NO_PARAMS: "No customizable parameters for this template/tool.",
  CHAT_INTERFACE_TITLE: "KNOX AI Chat (Powered by Gemini)",
  CHAT_INPUT_PLACEHOLDER: "Ask the AI genius...",
  AI_ANALYSIS_MODAL_TITLE: "AI Threat Analysis Report",
  AI_ANALYZING_TOAST: "Analyzing threats with Gemini AI...",
  AI_ANALYSIS_COMPLETE_TOAST: "AI Analysis Complete! View Report.",
  AI_ANALYSIS_ERROR_TOAST: "AI Analysis Failed. Please try again.",
  API_KEY_MISSING_ERROR: "Gemini API Key is missing. AI features will be unavailable. Please ensure 'API_KEY' environment variable is configured.",
  AI_INIT_ERROR: "Error initializing Gemini AI. Features may be limited.",
  AI_CHAT_ERROR: "Error communicating with Gemini AI.",
  AI_CHAT_FAIL_MESSAGE: "Sorry, I encountered an error. Please try again.",
  SWITCH_TO_LIGHT_MODE: "Switch to Light Mode",
  SWITCH_TO_DARK_MODE: "Switch to Dark Mode",
  SWITCH_TO_ARABIC: "Switch to Arabic",
  SWITCH_TO_ENGLISH: "Switch to English",


  OP_COL_TOOL: "Tool",
  OP_COL_TASK: "Operation/Task",
  OP_COL_STATUS: "Status",
  OP_COL_PROGRESS: "Progress Bar",
  OP_COL_LOGS: "Live Logs",
  OP_COL_TIME: "Start/End Time",
  OP_COL_ACTIONS: "Actions",

  KNOX_DEEP_SCAN_NAME: "KNOX Deep Scan",
  KNOX_DEEP_SCAN_DESC: "Full system heuristic and signature-based threat detection.",
  KNOX_DEEP_SCAN_LONG_DESC: "KNOX Deep Scan employs advanced algorithms and a comprehensive threat database to meticulously examine your system for malware, suspicious activities, and potential vulnerabilities. It simulates a deep inspection of critical system areas, running processes, startup items, and file integrity. Results can be further analyzed by Gemini AI for enhanced insights.",
  KNOX_DEEP_SCAN_INIT: "Initializing KNOX Deep Scan Engine...",
  KNOX_ALERT_TITLE: "KNOX Alert!",
  KNOX_ALERT_BODY_THREATS_DETECTED: "potential threats detected by KNOX Deep Scan. Review results.",
  THREAT_DB_PROCESS_SCAN: "Scanning running processes...",
  THREAT_DB_STARTUP_SCAN: "Analyzing startup entries...",
  THREAT_DB_SIGNATURE_SCAN: "Performing file signature matching...",
  THREAT_DETECTED_PREFIX: "THREAT DETECTED:",
  THREAT_ANALYSIS_PROMPT_PREFIX: "Analyze the following potential security findings from a system scan. Provide a brief risk assessment, potential impact, and general mitigation advice for each. Format as a readable report:\n\n",
  THREAT_TYPE_PROCESS: "Potentially Malicious Process",
  THREAT_TYPE_STARTUP: "Suspicious Startup Item",
  THREAT_TYPE_SIGNATURE: "Malware Signature Match",

  EMAIL_BREACH_LOOKUP_NAME: "Email Breach Lookup",
  EMAIL_BREACH_LOOKUP_DESC: "Check if an email has been compromised in known data breaches.",
  EMAIL_BREACH_LOOKUP_LONG_DESC: "Enter an email address to check against a database of known data breaches (simulated). This tool helps identify potential exposure of credentials or personal information. For real checks, use reputable services like Have I Been Pwned.",
  EMAIL_BREACH_INPUT_LABEL: "Email Address to Check",
  EMAIL_BREACH_CHECK_BUTTON: "Check Email",
  EMAIL_BREACH_ANALYZING: (params: { email: string }) => `Checking ${params.email} for breaches...`,
  EMAIL_BREACH_NO_BREACHES: (params: { email: string }) => `No breaches found for ${params.email} in our simulated database.`,
  EMAIL_BREACH_FOUND: (params: { count: number; email: string }) => `Found ${params.count} potential breach(es) involving ${params.email}. (Simulated details below)`,

  PRIVACY_TRACE_WIPER_NAME: "Privacy Trace Wiper",
  PRIVACY_TRACE_WIPER_DESC: "Simulates cleaning of browser history, cookies, and temporary files.",
  PRIVACY_TRACE_WIPER_LONG_DESC: "This tool simulates the process of wiping digital footprints such as browser cache, cookies, history, temporary system files, and application logs to enhance your privacy. The actual deletion is simulated for safety in this web environment.",
  PRIVACY_WIPE_TARGET_LABEL: "Select items to wipe:",
  PRIVACY_WIPE_OPTIONS_Browser_Cache: "Browser Cache",
  PRIVACY_WIPE_OPTIONS_Cookies: "Cookies",
  PRIVACY_WIPE_OPTIONS_History: "History",
  PRIVACY_WIPE_OPTIONS_Temp_Files: "Temp Files",
  PRIVACY_WIPE_OPTIONS_App_Logs: "App Logs",
  PRIVACY_WIPE_START_BUTTON: "Start Wiping Traces",
  PRIVACY_WIPING_LOG_PREFIX: "Wiping",
  PRIVACY_WIPE_COMPLETE: "Privacy trace wiping simulation complete.",

  MALWARE_PROCESS_KILLER_NAME: "Malware Process Killer",
  MALWARE_PROCESS_KILLER_DESC: "Simulates identification and termination of suspicious background processes.",
  MALWARE_PROCESS_KILLER_LONG_DESC: "This utility simulates scanning for and terminating processes that match signatures in the KNOX Threat DB or exhibit suspicious behavior. In a real environment, this would require administrative privileges. Here, actions are simulated.",
  MALWARE_KILLER_SCAN_BUTTON: "Scan for Malicious Processes",
  MALWARE_KILLER_TERMINATE_BUTTON: (params: { count: number }) => `Terminate ${params.count} Threat(s)`,
  MALWARE_KILLER_NO_THREATS: "No suspicious processes found (Simulated).",
  MALWARE_KILLER_PROCESS_FOUND: (params: { name: string }) => `Suspicious process found: ${params.name}`,
  MALWARE_KILLER_TERMINATING: (params: { name: string }) => `Simulating termination of ${params.name}...`,
  MALWARE_KILLER_TERMINATED: (params: { name: string }) => `Process ${params.name} terminated (Simulated).`,
  NOTIFICATIONS_ENABLED_SUCCESS: "Desktop notifications enabled!",
  NOTIFICATIONS_ENABLED_WARN: "Desktop notifications denied. Some alerts might be missed.",
};


// --- Arabic UI Texts ---
export const AR_TEXTS: LocalizedTexts = {
  DOWNLOAD_BUTTON: "حمّلها ياباشا 🦾",
  CUSTOMIZE_BUTTON: "فصّل الشغل ✨",
  RUN_TOOL_BUTTON: "شغل الأداة 🚀",
  INSTALLING_BUTTON: "جاري التحميل...",
  READY_TO_RUN_BUTTON: "جاهزة للتشغيل! 🔥",
  START_SCAN_RUN_BUTTON: "بدء فحص/تشغيل",
  PAUSE_BUTTON: "إيقاف مؤقت",
  STOP_BUTTON: "إيقاف",
  FORCE_STOP_BUTTON: "إيقاف إجباري",
  VIEW_LOG_BUTTON: "عرض السجل",
  BROWSE_FULL_RESULTS_BUTTON: "استعراض النتائج الكاملة",
  EXPORT_RESULTS_BUTTON: "تصدير النتائج",
  SAVE_TEMPLATE_BUTTON: "حفظ القالب",
  IMPORT_EXPORT_CONFIG_BUTTON: "استيراد/تصدير الإعدادات",
  APPLY_PARAMS_BUTTON: "طبّق وشغّل",
  SEND_MESSAGE_BUTTON: "أرسل 💬",
  ANALYZE_WITH_AI_BUTTON: "تحليل بواسطة AI 🧠",

  WELCOME_MESSAGE: "أهلاً بك يا سيد نوكس! هل أنت مستعد لإحداث ثورة في سير عملك؟",
  TOOLTIP_TEXT: "جرّبني يا نوكس!",
  SUCCESS_TOAST: "بيضتها يا سيد السكربتات! ✅",
  NO_ACTIVE_TOOLS_ALERT: "عزوبية يا خوي؟ نظامك هادئ للغاية. أضف المزيد من القوة لأرسنالك في الإعدادات. ⚙️",
  DASHBOARD_TITLE: "المنصات - ساحة أدوات KNOX الراقية.",
  DASHBOARD_SUBTITLE: "تصفح مجموعة منتقاة بعناية فائقة لأقوى الأدوات والمرافق عبر فئات مختلفة. كل أداة تم فحصها، تحسينها، وتهيئتها من قبل خبراء Knoux لتمنحك الأداء الأمثل والكفاءة القصوى.",
  CATEGORY_DETAIL_TITLE_PREFIX: "أقوى 20 برنامج في عالم",
  CATEGORY_DETAIL_TITLE_SUFFIX: "جمعتهالك عالبارد 🔥 — اضغط على كل أداة لتخصيصها وتشغيلها ومراقبتها في الوقت الفعلي.",
  LIVE_OPERATIONS_TITLE: "عمليات KNOX الجارية - تقرير فوري، تفاعل مطلق 📡",
  LIVE_OPERATIONS_SUBTITLE: "شاشة التحكم المطلقة. شاهد جميع مهامك قيد التشغيل ونتائجها المباشرة. تتبع التقدم، قم بالإجراءات الفورية، وتحكم بالكامل في عملياتك من مكان واحد.",
  FOOTER_TEXT_LEFT: "MAX KNOX PLUS - قوة للمحترفين 🦾 — كل الحقوق محفوظة.",
  APP_VERSION: (params: { version: string }) => `الإصدار ${params.version} - دمج Gemini`,


  STATUS_NOT_LOADED: "غير محملة",
  STATUS_READY_TO_RUN: "جاهزة للتشغيل",
  STATUS_RUNNING: "قيد التشغيل",
  STATUS_COMPLETED: "تم الانتهاء",
  STATUS_ERROR: "خطأ",
  STATUS_LOADING: "جاري التحميل",

  TOOL_DESCRIPTION_PLACEHOLDER: "وصف تفصيلي احترافي لميزات الأداة وكيفية استخدامها بفعالية.",
  TOOL_ADV_SETTINGS_TITLE: "إعدادات متقدمة وتكوين احترافي",
  TOOL_EXEC_OPTIONS_TITLE: "خيارات التشغيل الفعالة",
  TOOL_RESULTS_MGMT_TITLE: "إدارة النتائج الشاملة",
  TOOL_PREVIEW_TITLE: "معاينة عمل الأداة",
  TOOL_PREVIEW_SUB_TEXT: "تصور مبسط لآلية عمل الأداة أو مخرجاتها النموذجية.",
  ADV_SETTINGS_FORM_TITLE_PREFIX: "إعدادات التشغيل المتقدمة لـ:",
  ADV_SETTINGS_TEMPLATE_SELECT: "-- اختر قالب تشغيل --",
  ADV_SETTINGS_NO_PARAMS: "لا توجد معلمات قابلة للتخصيص لهذا القالب/الأداة.",
  CHAT_INTERFACE_TITLE: "دردشة KNOX AI (مدعومة بـ Gemini)",
  CHAT_INPUT_PLACEHOLDER: "اسأل عبقري الذكاء الاصطناعي...",
  AI_ANALYSIS_MODAL_TITLE: "تقرير تحليل التهديدات بالذكاء الاصطناعي",
  AI_ANALYZING_TOAST: "جاري تحليل التهديدات بواسطة Gemini AI...",
  AI_ANALYSIS_COMPLETE_TOAST: "اكتمل تحليل AI! عرض التقرير.",
  AI_ANALYSIS_ERROR_TOAST: "فشل تحليل AI. حاول مرة أخرى.",
  API_KEY_MISSING_ERROR: "مفتاح Gemini API غير موجود. ميزات الذكاء الاصطناعي ستكون معطلة. يرجى التأكد من تكوين متغير البيئة 'API_KEY' بشكل صحيح.",
  AI_INIT_ERROR: "خطأ في تهيئة Gemini AI. قد تكون الميزات محدودة.",
  AI_CHAT_ERROR: "خطأ في الاتصال بـ Gemini AI.",
  AI_CHAT_FAIL_MESSAGE: "عذرًا، واجهت خطأ. حاول مرة اخرى.",
  SWITCH_TO_LIGHT_MODE: "التبديل إلى الوضع الفاتح",
  SWITCH_TO_DARK_MODE: "التبديل إلى الوضع الداكن",
  SWITCH_TO_ARABIC: "التبديل إلى اللغة العربية",
  SWITCH_TO_ENGLISH: "التبديل إلى اللغة الإنجليزية",


  OP_COL_TOOL: "الأداة",
  OP_COL_TASK: "العملية/المهمة",
  OP_COL_STATUS: "الحالة",
  OP_COL_PROGRESS: "شريط التقدم",
  OP_COL_LOGS: "السجلات الحية",
  OP_COL_TIME: "وقت البدء/الانتهاء",
  OP_COL_ACTIONS: "الإجراءات",

  KNOX_DEEP_SCAN_NAME: "KNOX Deep Scan",
  KNOX_DEEP_SCAN_DESC: "فحص شامل للنظام قائم على الاستدلال والتوقيعات لكشف التهديدات.",
  KNOX_DEEP_SCAN_LONG_DESC: "يستخدم KNOX Deep Scan خوارزميات متقدمة وقاعدة بيانات شاملة للتهديدات لفحص نظامك بدقة بحثًا عن البرامج الضارة والأنشطة المشبوهة ونقاط الضعف المحتملة. يحاكي فحصًا عميقًا لمناطق النظام الحيوية والعمليات قيد التشغيل وعناصر بدء التشغيل وسلامة الملفات. يمكن تحليل النتائج بواسطة Gemini AI للحصول على رؤى معززة.",
  KNOX_DEEP_SCAN_INIT: "جاري تهيئة محرك KNOX Deep Scan...",
  KNOX_ALERT_TITLE: "تنبيه KNOX!",
  KNOX_ALERT_BODY_THREATS_DETECTED: "تهديدات محتملة تم اكتشافها بواسطة KNOX Deep Scan. راجع النتائج.",
  THREAT_DB_PROCESS_SCAN: "فحص العمليات قيد التشغيل...",
  THREAT_DB_STARTUP_SCAN: "تحليل إدخالات بدء التشغيل...",
  THREAT_DB_SIGNATURE_SCAN: "مطابقة توقيعات الملفات...",
  THREAT_DETECTED_PREFIX: "تم اكتشاف تهديد:",
  THREAT_ANALYSIS_PROMPT_PREFIX: "حلل نتائج الفحص الأمني المحتملة التالية. قدم تقييمًا موجزًا للمخاطر، والتأثير المحتمل، ونصائح عامة للتخفيف لكل منها. نسقها كتقرير قابل للقراءة:\n\n",
  THREAT_TYPE_PROCESS: "عملية قد تكون ضارة",
  THREAT_TYPE_STARTUP: "عنصر بدء تشغيل مشبوه",
  THREAT_TYPE_SIGNATURE: "مطابقة توقيع برنامج ضار",
  
  EMAIL_BREACH_LOOKUP_NAME: "فحص اختراق البريد الإلكتروني",
  EMAIL_BREACH_LOOKUP_DESC: "تحقق مما إذا كان بريد إلكتروني قد تم اختراقه في تسريبات بيانات معروفة.",
  EMAIL_BREACH_LOOKUP_LONG_DESC: "أدخل عنوان بريد إلكتروني للتحقق منه مقابل قاعدة بيانات لتسريبات البيانات المعروفة (محاكاة). تساعد هذه الأداة في تحديد التعرض المحتمل لبيانات الاعتماد أو المعلومات الشخصية. لإجراء عمليات تحقق حقيقية، استخدم خدمات موثوقة مثل Have I Been Pwned.",
  EMAIL_BREACH_INPUT_LABEL: "البريد الإلكتروني المراد فحصه",
  EMAIL_BREACH_CHECK_BUTTON: "فحص البريد",
  EMAIL_BREACH_ANALYZING: (params: { email: string }) => `جاري فحص ${params.email} بحثًا عن اختراقات...`,
  EMAIL_BREACH_NO_BREACHES: (params: { email: string }) => `لم يتم العثور على اختراقات لـ ${params.email} في قاعدة بياناتنا المحاكاة.`,
  EMAIL_BREACH_FOUND: (params: { count: number; email: string }) => `تم العثور على ${params.count} اختراق(اختراقات) محتمل(ة) متعلق(ة) بـ ${params.email}. (تفاصيل محاكاة أدناه)`,

  PRIVACY_TRACE_WIPER_NAME: "ماسح آثار الخصوصية",
  PRIVACY_TRACE_WIPER_DESC: "يحاكي تنظيف سجل المتصفح، ملفات تعريف الارتباط، والملفات المؤقتة.",
  PRIVACY_TRACE_WIPER_LONG_DESC: "تحاكي هذه الأداة عملية مسح البصمات الرقمية مثل ذاكرة التخزين المؤقت للمتصفح، ملفات تعريف الارتباط، السجل، ملفات النظام المؤقتة، وسجلات التطبيقات لتعزيز خصوصيتك. الحذف الفعلي محاكى للسلامة في بيئة الويب هذه.",
  PRIVACY_WIPE_TARGET_LABEL: "اختر العناصر المراد مسحها:",
  PRIVACY_WIPE_OPTIONS_Browser_Cache: "ذاكرة المتصفح المؤقتة",
  PRIVACY_WIPE_OPTIONS_Cookies: "ملفات تعريف الارتباط",
  PRIVACY_WIPE_OPTIONS_History: "السجل",
  PRIVACY_WIPE_OPTIONS_Temp_Files: "الملفات المؤقتة",
  PRIVACY_WIPE_OPTIONS_App_Logs: "سجلات التطبيقات",
  PRIVACY_WIPE_START_BUTTON: "بدء مسح الآثار",
  PRIVACY_WIPING_LOG_PREFIX: "جاري مسح",
  PRIVACY_WIPE_COMPLETE: "اكتملت محاكاة مسح آثار الخصوصية.",

  MALWARE_PROCESS_KILLER_NAME: "قاتل العمليات الخبيثة",
  MALWARE_PROCESS_KILLER_DESC: "يحاكي تحديد وإنهاء العمليات المشبوهة في الخلفية.",
  MALWARE_PROCESS_KILLER_LONG_DESC: "تحاكي هذه الأداة فحص وإنهاء العمليات التي تطابق التوقيعات في قاعدة بيانات تهديدات KNOX أو تظهر سلوكًا مشبوهًا. في بيئة حقيقية، يتطلب هذا صلاحيات إدارية. هنا، يتم محاكاة الإجراءات.",
  MALWARE_KILLER_SCAN_BUTTON: "فحص العمليات الخبيثة",
  MALWARE_KILLER_TERMINATE_BUTTON: (params: { count: number }) => `إنهاء ${params.count} تهديد(ات)`,
  MALWARE_KILLER_NO_THREATS: "لم يتم العثور على عمليات مشبوهة (محاكاة).",
  MALWARE_KILLER_PROCESS_FOUND: (params: { name: string }) => `تم العثور على عملية مشبوهة: ${params.name}`,
  MALWARE_KILLER_TERMINATING: (params: { name: string }) => `محاكاة إنهاء ${params.name}...`,
  MALWARE_KILLER_TERMINATED: (params: { name: string }) => `تم إنهاء العملية ${params.name} (محاكاة).`,
  NOTIFICATIONS_ENABLED_SUCCESS: "تم تفعيل إشعارات سطح المكتب!",
  NOTIFICATIONS_ENABLED_WARN: "تم رفض إشعارات سطح المكتب. قد تفوتك بعض التنبيهات.",
};


export const THREAT_DB: {
  maliciousProcessNames: string[];
  suspiciousStartupEntries: string[];
  malwareSignatures: { name: string, pattern: RegExp }[]; 
  commonSafeProcessNames: string[];
  commonSafeFilePaths: string[];
} = {
  maliciousProcessNames: ["xrat.exe", "evil_agent.dll", "keylogger_v3.exe", "minerdaemon.exe", "cryptolocker.exe", "darkside.bin"],
  suspiciousStartupEntries: [
    "C:\\Users\\Admin\\AppData\\Roaming\\msupdate.vbs", 
    "/usr/local/bin/hidden_init.sh --run", 
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater",
    "~/Library/LaunchAgents/com.malicious.agent.plist"
  ],
  malwareSignatures: [ 
    { name: "EICAR Test String", pattern: /EICAR-STANDARD-ANTIVIRUS-TEST-FILE/i },
    { name: "Generic Ransomware Note", pattern: /YOUR FILES ARE ENCRYPTED!.*PAY BTC/i },
    { name: "PowerShell Encoded Command", pattern: /powershell -enc JAB[A-Za-z0-9+/=]+/i }, 
  ],
  commonSafeProcessNames: ["explorer.exe", "chrome.exe", "firefox.exe", "svchost.exe", "lsass.exe", "wininit.exe", "Discord.exe", "Spotify.exe", "Code.exe"],
  commonSafeFilePaths: [
    "C:\\Windows\\System32\\notepad.exe",
    "/usr/bin/python3",
    "C:\\Program Files\\ExampleApp\\app.exe",
    "~/Documents/report.docx",
    "/var/log/syslog"
  ]
};

// --- Tool Definitions ---
const offensiveSecurityToolsArray: Tool[] = [
  { 
    id: 'nmap', name: 'Nmap', 
    description: 'Network scanner and security auditor.', icon: SignalIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools',
    longDescription: 'Nmap ("Network Mapper") is an indispensable free and open-source utility for network discovery, security auditing, and administration. It uses raw IP packets in novel ways to determine what hosts are available on the network, what services (application name and version) those hosts are offering, what operating systems (and OS versions) they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics. It is used by professionals for tasks like network inventory, managing service upgrade schedules, and monitoring host or service uptime.', 
    sampleExecutionParams: [
      {label: 'Target IP/Range (e.g., 192.168.1.1 or 10.0.0.0/24)', type: 'text', required: true},
      {label: 'Scan Type', type: 'select', options: ['Quick Scan (-T4 -F)', 'Intense Scan (-T4 -A -v)', 'Full Port Scan (-p-)', 'OS Detection (-O)', 'Version Detection (-sV)'], required: true},
      {label: 'Output Verbosity (-v level)', type: 'number', min:0, max:3, defaultValue:1}
    ], 
    runTemplates: ['Quick Scan against target', 'Intense Scan + OS & Version Detection', 'Scan Top 1000 Ports', 'Ping Scan Only'] 
  },
  { 
    id: 'metasploit', name: 'Metasploit Framework', 
    description: 'Penetration testing platform.', icon: CommandLineIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', 
    longDescription: 'The Metasploit Framework is a highly acclaimed penetration testing tool. It provides information about security vulnerabilities and aids in penetration testing and IDS signature development. It contains a vast database of exploits and auxiliary modules, allowing security professionals to systematically probe networks for weaknesses, execute exploits, and manage post-exploitation activities. Its modular architecture supports custom script development and integration with other security tools.',
    sampleExecutionParams: [
      {label: 'Target RHOSTS', type: 'text', required: true},
      {label: 'Exploit Module (e.g., windows/smb/ms17_010_eternalblue)', type: 'text', required: true},
      {label: 'Payload (e.g., windows/x64/meterpreter/reverse_tcp)', type: 'text'},
      {label: 'LHOST (Listening Host for reverse shells)', type: 'text'}
    ],
    runTemplates: ['Launch msfconsole', 'Scan for MS17-010', 'Basic Web Delivery Server']
  },
  { 
    id: 'burpsuite', name: 'Burp Suite', 
    description: 'Web vulnerability scanner.', icon: BugAntIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', 
    longDescription: 'Burp Suite is an integrated platform for performing security testing of web applications. Its various tools work seamlessly together to support the entire testing process, from initial mapping and analysis of an application\'s attack surface, through to finding and exploiting security vulnerabilities. It includes a proxy server, web spider, scanner, intruder, repeater, sequencer, decoder, and comparer, making it a comprehensive toolkit for web pentesters.',
    sampleExecutionParams: [
      {label: 'Target URL (e.g., https://example.com)', type: 'text', required: true},
      {label: 'Scan Configuration', type: 'select', options: ['Audit for common vulnerabilities', 'Crawl and Audit', 'Passive Scan Only']},
      {label: 'Proxy Port', type: 'number', defaultValue: 8080}
    ],
    runTemplates: ['Start Burp Proxy', 'Scan Target for XSS & SQLi', 'Analyze Target Sitemap']
  },
  { 
    id: 'wireshark', name: 'Wireshark', 
    description: 'Network protocol analyzer.', icon: FunnelIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', 
    longDescription: 'Wireshark is the world’s foremost and widely-used network protocol analyzer. It lets you see what’s happening on your network at a microscopic level. It is the de facto standard across many commercial and non-profit enterprises, government agencies, and educational institutions. Wireshark development thrives thanks to the volunteer contributions of networking experts around the globe and is the continuation of a project started by Gerald Combs in 1998.',
    sampleExecutionParams: [
      {label: 'Network Interface (e.g., eth0, wlan0)', type: 'text', required: true},
      {label: 'Capture Filter (BPF syntax, e.g., "port 80")', type: 'text'},
      {label: 'Capture Duration (seconds, 0 for indefinite)', type: 'number', defaultValue: 0}
    ],
    runTemplates: ['Capture all traffic on eth0', 'Capture HTTP traffic', 'Capture DNS queries']
  },
  { 
    id: 'johntheripper', name: 'John the Ripper', 
    description: 'Password cracking tool.', icon: KeyIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', 
    longDescription: 'John the Ripper is a fast password cracker, currently available for many flavors of Unix, Windows, DOS, BeOS, and OpenVMS. Its primary purpose is to detect weak Unix passwords. Besides several crypt(3) password hash types most commonly found on various Unix flavors, supported out of the box are Kerberos/AFS and Windows LM hashes, plus a number of other hashes and ciphers in "-jumbo" versions.',
    sampleExecutionParams: [
      {label: 'Password File Path', type: 'text', required: true},
      {label: 'Wordlist File Path (optional)', type: 'text'},
      {label: 'Cracking Mode', type: 'select', options: ['Single Crack', 'Wordlist Mode', 'Incremental Mode']}
    ],
    runTemplates: ['Crack /etc/shadow with default wordlist', 'Wordlist attack on custom hash file']
  },
   { id: 'hashcat', name: 'Hashcat', description: 'Advanced password recovery.', icon: AdjustmentsHorizontalIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Hashcat is the world\'s fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly-optimized hashing algorithms. Hashcat supports CPUs, GPUs, and other hardware accelerators on Linux, Windows, and macOS, and has facilities to help enable distributed password cracking.' },
   { id: 'sqlmap', name: 'sqlmap', description: 'SQL injection and database takeover tool.', icon: CircleStackIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'sqlmap is an open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over of database servers. It comes with a powerful detection engine, many niche features for the ultimate penetration tester and a broad range of switches lasting from database fingerprinting, over data fetching from the database, to accessing the underlying file system and executing commands on the operating system via out-of-band connections.' },
   { id: 'nikto', name: 'Nikto', description: 'Web server scanner.', icon: ServerIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Nikto is an Open Source (GPL) web server scanner which performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/CGIs, checks for outdated versions of over 1250 servers, and version specific problems on over 270 servers.' },
   { id: 'aircrackng', name: 'Aircrack-ng', description: 'WiFi security auditing.', icon: GlobeAltIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Aircrack-ng is a complete suite of tools to assess WiFi network security. It focuses on different areas of WiFi security: Monitoring, Attacking, Testing, and Cracking.' },
   { id: 'hydra', name: 'Hydra', description: 'Login cracker.', icon: UsersIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add. This tool gives researchers and security consultants the possibility to show how easy it would be to gain unauthorized access to a system remotely.' },
   { id: 'maltego', name: 'Maltego', description: 'Open source intelligence and graphical link analysis.', icon: ShareIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Maltego is a unique platform developed to deliver a clear threat picture to the environment that an organization owns and operates. Maltego’s unique advantage is to demonstrate the complexity and severity of single points of failure as well as trust relationships that exist currently within the scope of your infrastructure.' },
   { id: 'reconng', name: 'Recon-ng', description: 'Web reconnaissance framework.', icon: MagnifyingGlassIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Recon-ng is a full-featured Web Reconnaissance framework written in Python. Complete with independent modules, database interaction, built in convenience functions, interactive help, and command completion, Recon-ng provides a powerful environment in which open source web-based reconnaissance can be conducted quickly and thoroughly.' },
   { id: 'ettercap', name: 'Ettercap', description: 'Comprehensive suite for man-in-the-middle attacks.', icon: PuzzlePieceIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Ettercap is a comprehensive suite for man in the middle attacks. It features sniffing of live connections, content filtering on the fly and many other interesting tricks. It supports active and passive dissection of many protocols and includes many features for network and host analysis.' },
   { id: 'set', name: 'SET (Social-Engineer Toolkit)', description: 'Social engineering penetration testing.', icon: UsersIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'The Social-Engineer Toolkit (SET) is an open-source penetration testing framework designed for social engineering. SET has a number of custom attack vectors that allow you to make a believable attack quickly.' },
   { id: 'netcat', name: 'Netcat', description: 'Versatile networking utility.', icon: CommandLineIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Netcat is a featured networking utility which reads and writes data across network connections, using the TCP/IP protocol. It is designed to be a reliable "back-end" tool that can be used directly or easily driven by other programs and scripts.' },
   { id: 'beef', name: 'BeEF (Browser Exploitation Framework)', description: 'Browser exploitation framework.', icon: BugAntIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'BeEF is short for The Browser Exploitation Framework. It is a penetration testing tool that focuses on the web browser. Unlike other security frameworks, BeEF looks past the hardened network perimeter and client system, and examines exploitability within the context of the one open door: the web browser.' },
   { id: 'dirbuster', name: 'DirBuster', description: 'Directory and file name brute-forcer.', icon: MagnifyingGlassIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'DirBuster is a multi threaded java application designed to brute force directories and files names on web/application servers. Often is the case now that developers will leave old pages and files still accessible but unlinked. DirBuster attempts to find these.' },
   { 
    id: 'mimikatz', name: 'Mimikatz', 
    description: 'Credentials extraction tool.', icon: KeyIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', 
    longDescription: 'Mimikatz is a tool I\'ve made to learn C and make some experiments with Windows security. It\'s now well known to extract plaintexts passwords, hash, PIN code and kerberos tickets from memory. Mimikatz can also perform pass-the-hash, pass-the-ticket or build Golden tickets.' 
   },
   { id: 'empire', name: 'Empire', description: 'Post-exploitation framework.', icon: RocketLaunchIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'Empire is a post-exploitation framework that includes a pure-PowerShell2.0 Windows agent, and a pure Python 2.6/2.7 Linux/OS X agent. It is the merging of the previous PowerShell Empire and Python EmPyre projects. The framework offers cryptologically-secure communications and a flexible architecture.' },
   { id: 'fuzzdb', name: 'FuzzDB', description: 'Dictionary of attack patterns and primitives for black-box application fault injection.', icon: DocumentChartBarIcon, status: ToolStatus.NotLoaded, category: 'Offensive Security Tools', longDescription: 'FuzzDB was created to increase the likelihood of finding application security vulnerabilities through dynamic application security testing. It provides a comprehensive dictionary of attack patterns and primitives for black-box application fault injection and resource discovery.' },
   {
    id: 'knoxdeepscan', name: 'KNOX_DEEP_SCAN_NAME', 
    description: 'KNOX_DEEP_SCAN_DESC', 
    icon: SparklesIcon, 
    status: ToolStatus.ReadyToRun, 
    category: 'Offensive Security Tools',
    longDescription: 'KNOX_DEEP_SCAN_LONG_DESC', 
    isGeminiPowered: true, 
  },
  {
    id: 'malwareprocesskiller', name: 'MALWARE_PROCESS_KILLER_NAME',
    description: 'MALWARE_PROCESS_KILLER_DESC',
    icon: ShieldExclamationIcon, status: ToolStatus.ReadyToRun, category: 'Offensive Security Tools',
    longDescription: 'MALWARE_PROCESS_KILLER_LONG_DESC',
  },
];

const developerToolsArray: Tool[] = [
  { 
    id: 'vscode', name: 'Visual Studio Code', 
    description: 'Code editor redefined.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', 
    longDescription: 'Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, TypeScript and Node.js and has a rich ecosystem of extensions for other languages (such as C++, C#, Java, Python, PHP, Go) and runtimes (such as .NET and Unity).',
    sampleExecutionParams: [
      {label: 'Project Folder Path', type: 'text'},
      {label: 'File to Open', type: 'text'},
      {label: 'Install Extension (ID)', type: 'text'}
    ],
    runTemplates: ['Open Project Folder', 'Open Specific File', 'Install Python Extension']
  },
  { 
    id: 'pycharm', name: 'JetBrains PyCharm', 
    description: 'Python IDE for professional developers.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', 
    longDescription: 'PyCharm is an Integrated Development Environment (IDE) used in computer programming, specifically for the Python language. It is developed by the Czech company JetBrains. It provides code analysis, a graphical debugger, an integrated unit tester, integration with version control systems (VCSes), and supports web development with Django as well as Data Science with Anaconda.',
    sampleExecutionParams: [
      {label: 'Python Project Path', type: 'text', required: true},
      {label: 'Virtual Environment Path (optional)', type: 'text'}
    ],
    runTemplates: ['Open Python Project', 'Create New Django Project']
  },
  { 
    id: 'intellijidea', name: 'IntelliJ IDEA', 
    description: 'Capable and Ergonomic Java IDE', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', 
    longDescription: 'IntelliJ IDEA is a Java integrated development environment (IDE) for developing computer software. It is developed by JetBrains (formerly known as IntelliJ), and is available as an Apache 2 Licensed community edition, and in a proprietary commercial edition. It offers deep intelligence for Java, Kotlin, Groovy, Scala, and other JVM languages, along with extensive framework support.',
    sampleExecutionParams: [
      {label: 'Java Project Path', type: 'text', required: true},
      {label: 'Maven/Gradle Project', type: 'select', options: ['None', 'Maven', 'Gradle']}
    ],
    runTemplates: ['Open Java Project', 'Create New Spring Boot Application']
  },
  { id: 'githubdesktop', name: 'GitHub Desktop', description: 'Extend your GitHub workflow beyond your browser.', icon: CloudIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'GitHub Desktop is an open source Electron-based GitHub app. It is written in TypeScript and uses React. It allows users to manage repositories, commit changes, create branches, and collaborate with others on GitHub directly from their desktop.' },
  { id: 'postman', name: 'Postman', description: 'API Platform for building and using APIs.', icon: ServerIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Postman is an API platform for developers to design, build, test and iterate their APIs. It simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs—faster.' },
  { id: 'dockerdesktop', name: 'Docker Desktop', description: 'Develop and run containerized applications.', icon: CubeTransparentIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Docker Desktop is an easy-to-install application for your Mac or Windows environment that enables you to build and share containerized applications and microservices. Docker Desktop includes Docker Engine, Docker CLI client, Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper.' },
  { id: 'dbeaver', name: 'DBeaver', description: 'Free multi-platform database tool.', icon: CircleStackIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'DBeaver is a free multi-platform database tool for developers, SQL programmers, database administrators and analysts. Supports any database which has JDBC driver. It can handle all the most popular databases like MySQL, PostgreSQL, SQLite, Oracle, DB2, SQL Server, Sybase, MS Access, Teradata, Firebird, Derby, etc.' },
  { id: 'insomnia', name: 'Insomnia', description: 'API Design and Testing.', icon: ServerIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Insomnia is a collaborative open source API design tool for GraphQL, REST, and gRPC. It offers a beautiful interface, powerful features like code generation, environment variables, and plugin support to streamline your API development workflow.' },
  { id: 'fiddler', name: 'Fiddler Everywhere', description: 'Web debugging proxy.', icon: ShieldCheckIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Fiddler Everywhere is a web debugging proxy for macOS, Windows, and Linux. Capture, inspect, monitor all HTTP(S) traffic between your computer and the Internet, mock requests, and diagnose network issues. Fiddler Everywhere is a powerful tool for web developers and testers.' },
  { id: 'jupyterlab', name: 'JupyterLab', description: 'Web-based interactive development environment.', icon: BeakerIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'JupyterLab is a web-based interactive development environment for Jupyter notebooks, code, and data. JupyterLab has a flexible user interface that allows users to configure and arrange workflows in data science, scientific computing, computational journalism, and machine learning.' },
  { id: 'eclipse', name: 'Eclipse IDE', description: 'IDE for Java and other languages.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Eclipse is an integrated development environment (IDE) used in computer programming. It contains a base workspace and an extensible plug-in system for customizing the environment. Eclipse is written mostly in Java and its primary use is for developing Java applications, but it may also be used to develop applications in other programming languages via plug-ins.' },
  { id: 'notepadplusplus', name: 'Notepad++', description: 'Free source code editor and Notepad replacement.', icon: DocumentChartBarIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Notepad++ is a free (as in "free speech" and also as in "free beer") source code editor and Notepad replacement that supports several languages. Running in the MS Windows environment, its use is governed by GPL License.' },
  { id: 'gitkraken', name: 'GitKraken', description: 'Legendary Git GUI client.', icon: CloudIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'GitKraken Client is a Git GUI for Windows, Mac, & Linux that makes Git more visual and intuitive. Work with repositories on GitHub, GitLab, Bitbucket, and Azure DevOps. It offers a clean UI, powerful features like merge conflict resolution, and integrations with popular issue trackers.' },
  { id: 'vscodeliveshare', name: 'VSCode Live Share', description: 'Real-time collaborative development.', icon: UsersIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Visual Studio Live Share enables you to collaboratively edit and debug with others in real time, regardless what programming languages you\'re using or app types you\'re building. It allows you to share your current project, start a debugging session, share terminals, and more.' },
  { id: 'sourcetree', name: 'Sourcetree', description: 'Free Git GUI for Mac and Windows.', icon: CloudIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Sourcetree simplifies how you interact with your Git repositories so you can focus on coding. Visualize and manage your repositories through Sourcetree\'s simple Git GUI. It supports both Git and Mercurial.' },
  { id: 'webstorm', name: 'WebStorm', description: 'The smartest JavaScript IDE.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'WebStorm is a powerful IDE for modern JavaScript development. Enjoy top-notch support for JavaScript, TypeScript, HTML, CSS, Node.js, React, Angular, Vue, and more. It offers intelligent code completion, on-the-fly error detection, powerful navigation, and refactoring tools.' },
  { id: 'xdebug', name: 'Xdebug', description: 'Debugging and profiling tool for PHP.', icon: BugAntIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Xdebug is an extension for PHP to assist with debugging and development. It provides a rich set of features, including step debugging, stack traces, code coverage analysis, and profiling. It integrates with many popular PHP IDEs.' },
  { id: 'mysqlworkbench', name: 'MySQL Workbench', description: 'Visual tool for database architects, developers, and DBAs.', icon: CircleStackIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'MySQL Workbench is a unified visual tool for database architects, developers, and DBAs. MySQL Workbench provides data modeling, SQL development, and comprehensive administration tools for server configuration, user administration, backup, and much more.' },
  { id: 'tableplus', name: 'TablePlus', description: 'Modern, native tool for relational databases.', icon: TableCellsIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'TablePlus is a modern, native, and friendly GUI tool for relational databases: MySQL, PostgreSQL, SQLite, Microsoft SQL Server, Amazon Redshift, MariaDB, CockroachDB, Vertica, Oracle, Cassandra, and more. It offers a clean interface and powerful features.' },
  { id: 'beyondcompare', name: 'Beyond Compare', description: 'Compare files and folders.', icon: DocumentChartBarIcon, status: ToolStatus.NotLoaded, category: 'Developer Tools', longDescription: 'Beyond Compare allows you to quickly and easily compare your files and folders. By using simple, powerful commands you can focus on the differences you\'re interested in and ignore those you\'re not. It can then merge the changes, synchronize your files, and generate reports for your records.' },
];

const postFormatUtilitiesArray: Tool[] = [
  { 
    id: 'ccleaner', name: 'CCleaner', 
    description: 'PC optimization and cleaning tool.', icon: PaintBrushIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', 
    longDescription: 'CCleaner is a utility program designed to clean potentially unwanted files and invalid Windows Registry entries from a computer. It can also manage startup programs, uninstall software, and securely erase data. Regular use can help improve system performance and stability.',
    sampleExecutionParams: [
      {label: 'Cleaning Mode', type: 'select', options: ['Standard Clean', 'Deep Clean (includes Registry)', 'Analyze Only'], required: true},
      {label: 'Applications to Clean (comma separated, e.g., chrome,firefox,edge)', type: 'text'},
    ],
    runTemplates: ['Run Standard System Clean', 'Analyze Disk Space Usage', 'Clean Browser Caches']
  },
  { 
    id: 'recuva', name: 'Recuva', 
    description: 'File recovery software.', icon: ArrowPathIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', 
    longDescription: 'Recuva is a freeware Windows utility to restore files that have been accidentally deleted from your computer. This includes files emptied from the Recycle bin as well as images and other files that have been deleted by user error from digital camera memory cards or MP3 players. It can also recover files from damaged or newly formatted drives.',
    sampleExecutionParams: [
      {label: 'Drive to Scan (e.g., C:, D:)', type: 'text', required: true},
      {label: 'File Type to Recover', type: 'select', options: ['All Files', 'Pictures', 'Music', 'Documents', 'Videos', 'Compressed', 'Emails']},
      {label: 'Enable Deep Scan (slower)', type: 'select', options:['No', 'Yes']}
    ],
    runTemplates: ['Quick Scan for Pictures on C:', 'Deep Scan for Documents on USB Drive']
  },
  { id: 'driverbooster', name: 'Driver Booster', description: 'Update outdated drivers.', icon: CpuChipIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Driver Booster is a program that attempts to update device drivers for users on Windows. It scans your PC for outdated, missing, or faulty drivers and updates them with ones it deems appropriate from its large online database. Keeping drivers updated can improve system stability and performance.' },
  { id: 'macriumreflect', name: 'Macrium Reflect', description: 'Backup and disk imaging software.', icon: ArchiveBoxIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Macrium Reflect is a backup utility for Microsoft Windows. It can create disk images and file backup archives, with options to restore them later. It supports creating full, incremental, and differential backups, and includes features like disk cloning and scheduling.' },
  { id: 'autoruns', name: 'Autoruns', description: 'Comprehensive startup monitor.', icon: PlayIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Autoruns shows you what programs are configured to run during system bootup or login, and shows you the entries in the order Windows processes them. These programs include ones in your startup folder, Run, RunOnce, and other Registry keys. You can configure Autoruns to show other locations, including Explorer shell extensions, toolbars, browser helper objects, Winlogon notifications, auto-start services, and much more.' },
  { id: 'bleachbit', name: 'BleachBit', description: 'Free up disk space and guard privacy.', icon: ShieldCheckIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'BleachBit quickly frees disk space and tirelessly guards your privacy. Free cache, delete cookies, clear Internet history, shred temporary files, delete logs, and discard junk you didn\'t know was there. Designed for Linux and Windows systems, it wipes clean thousands of applications including Firefox, Internet Explorer, Adobe Flash, Google Chrome, Opera, Safari, and more.' },
  { id: 'crystaldiskinfo', name: 'CrystalDiskInfo', description: 'HDD/SSD utility software.', icon: CircleStackIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'CrystalDiskInfo is an HDD/SSD utility software which supports S.M.A.R.T. and a part of USB-HDD. It shows you the health status of your hard drives and SSDs, including temperature, firmware version, serial number, interface, transfer mode, total host reads/writes, and power on hours.' },
  { id: 'glaryutilities', name: 'Glary Utilities', description: 'All-in-one PC maintenance tool.', icon: CogIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Glary Utilities offers numerous powerful and easy-to-use system tools and utilities to fix, speed up, maintain and protect your PC. It provides features like registry cleaner, disk cleaner, startup manager, memory optimizer, tracks eraser, file shredder, and more.' },
  { id: 'aomeibackupper', name: 'AOMEI Backupper', description: 'Backup, restore, and clone software.', icon: ArchiveBoxIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'AOMEI Backupper Standard is a free backup software for Windows PCs and Laptops, which contains all features of data backup, sync, restore and clone. It supports system backup, disk backup, partition backup, and file backup.' },
  { id: 'easeusdatarecoverywizard', name: 'EaseUS Data Recovery Wizard', description: 'Recover lost data.', icon: ArrowPathIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'EaseUS Data Recovery Wizard is a data recovery program that enables users to recover data lost from PCs, laptops, hard drives, SSDs, USB drives, memory cards, digital cameras, etc., due to deleting, formatting, partition loss, OS crash, virus attack and other data loss scenarios.' },
  { id: 'hwmonitor', name: 'HWMonitor', description: 'Hardware monitoring program.', icon: CpuChipIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'HWMonitor is a hardware monitoring program that reads PC systems main health sensors: voltages, temperatures, fans speed. It handles the most common sensor chips, like ITE® IT87 series, most Winbond® ICs, and others. In addition, it can read modern CPUs on-die core thermal sensors, as well as HDD temperature via S.M.A.R.T, and video card GPU temperature.' },
  { id: 'wisediskcleaner', name: 'Wise Disk Cleaner', description: 'Clean junks of Browsers, remove junks and useless files of Windows.', icon: PaintBrushIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Wise Disk Cleaner is a freeware utility designed to help you keep your disk clean by deleting any unnecessary files. Usually, these unnecessary or junk files appear as a result of program incomplete uninstalls, or Temporary Internet Files. It is best if these files are wiped out from time to time, as they may, at some point, use a considerable amount of space on your drives.' },
  { id: 'defraggler', name: 'Defraggler', description: 'Defragment your entire hard drive, or individual files.', icon: CogIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Defraggler is a freemium defragmentation utility developed by Piriform, which can defragment individual files or groups of files on computer system. Defraggler runs on Microsoft Windows; it has support for all versions since Windows XP. It includes support for both IA-32 and x64 versions of these operating systems.' },
  { id: 'speccy', name: 'Speccy', description: 'Advanced System Information tool.', icon: EyeIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Speccy will give you detailed statistics on every piece of hardware in your computer. Including CPU, Motherboard, RAM, Graphics Cards, Hard Disks, Optical Drives, Audio support. Additionally Speccy adds the temperatures of your different components, so you can easily see if there’s a problem!' },
  { id: 'minitoolpartitionwizard', name: 'MiniTool Partition Wizard', description: 'Partition management software.', icon: CubeTransparentIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'MiniTool Partition Wizard is a rich-featured partition magic, which is designed to optimize disk usage and to protect your data. It comes with so many powerful features with which you can completely control your hard disk and partition.' },
  { id: 'clonezilla', name: 'Clonezilla', description: 'Disk imaging/cloning program.', icon: ServerIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Clonezilla is a partition and disk imaging/cloning program similar to True Image® or Norton Ghost®. It helps you to do system deployment, bare metal backup and recovery. Three types of Clonezilla are available, Clonezilla live, Clonezilla lite server, and Clonezilla SE (server edition).' },
  { id: 'iobituninstaller', name: 'IObit Uninstaller', description: 'Uninstall unwanted programs and browser plug-ins.', icon: TrashIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'IObit Uninstaller helps you uninstall and remove unwanted programs and folders from your computer fast and easily. Where the built-in and sluggish Windows Add or Remove Programs option fails, IObit Uninstaller works as always and picks up the slack.' },
  { id: 'windowsrepairtool', name: 'Windows Repair (Tweaking.com)', description: 'All-in-one repair tool to help fix a large majority of known Windows problems.', icon: WrenchScrewdriverIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Windows Repair is an all-in-one repair tool to help fix a large majority of known Windows problems including registry errors and file permissions as well as issues with Internet Explorer, Windows Update, Windows Firewall and more.' },
  { id: 'registryworkshop', name: 'Registry Workshop', description: 'Advanced registry editor.', icon: CogIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'Registry Workshop is an advanced registry editor. It is a perfect replacement for RegEdit and RegEdt32 which shipped with Windows. In addition to all the standard features, Registry Workshop adds a variety of powerful features that allow you to work faster and more efficiently with registry related tasks.' },
  { id: 'rstudio_data_recovery', name: 'R-Studio (Data Recovery)', description: 'Data recovery software.', icon: ArrowPathIcon, status: ToolStatus.NotLoaded, category: 'Post-Format Utilities', longDescription: 'R-Studio is a family of powerful and cost-effective undelete and data recovery software. Empowered by the new unique data recovery technologies, it is the most comprehensive data recovery solution for recovery files from NTFS, NTFS5, ReFS, FAT12/16/32, exFAT, HFS/HFS+ (Macintosh), Little and Big Endian variants of UFS1/UFS2 (FreeBSD/OpenBSD/NetBSD/Solaris) and Ext2/Ext3/Ext4 FS (Linux) partitions.' },
  {
    id: 'privacytracewiper', name: 'PRIVACY_TRACE_WIPER_NAME',
    description: 'PRIVACY_TRACE_WIPER_DESC',
    icon: PaintBrushIcon, status: ToolStatus.ReadyToRun, category: 'Post-Format Utilities', // Corrected Icon
    longDescription: 'PRIVACY_TRACE_WIPER_LONG_DESC',
    sampleExecutionParams: [
      {
        label: 'PRIVACY_WIPE_TARGET_LABEL', type: 'select', 
        options: [
            'PRIVACY_WIPE_OPTIONS_Browser_Cache', 
            'PRIVACY_WIPE_OPTIONS_Cookies', 
            'PRIVACY_WIPE_OPTIONS_History', 
            'PRIVACY_WIPE_OPTIONS_Temp_Files', 
            'PRIVACY_WIPE_OPTIONS_App_Logs'
        ], 
        required: true, 
        defaultValue: 'PRIVACY_WIPE_OPTIONS_Browser_Cache'
      }
    ],
  },
];

const botsAndAIModelsArray: Tool[] = [
  { 
    id: 'chatgptdesktop', name: 'ChatGPT Desktop (Unofficial)', 
    description: 'Access ChatGPT seamlessly via Gemini.', icon: SparklesIcon, status: ToolStatus.ReadyToRun, category: 'Bots & AI Models', 
    longDescription: 'This tool provides a direct chat interface powered by Google Gemini API. Engage in intelligent conversations, ask complex questions, and get creative insights from a powerful language model, all within KNOX Security Plus. Ensure your Gemini API key is configured.',
    isGeminiPowered: true,
  },
  { 
    id: 'botpress', name: 'Botpress', 
    description: 'Open-source conversational AI platform.', icon: CommandLineIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', 
    longDescription: 'Botpress is an open-source conversational AI platform that provides all the tools you need to build, deploy, and manage chatbots and voice assistants. It features a visual flow editor, NLU capabilities, and can be extended with custom code and integrations. Ideal for developers looking to create sophisticated conversational experiences.',
    sampleExecutionParams: [
      {label: 'Bot Project Path/ID', type: 'text', required: true},
      {label: 'Deployment Environment', type: 'select', options: ['Local Development', 'Staging', 'Production']}
    ],
    runTemplates: ['Run Bot Locally', 'Deploy Bot to Cloud']
  },
  { id: 'rasa', name: 'Rasa', description: 'Open source machine learning framework for automated text and voice-based conversations.', icon: AcademicCapIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Rasa provides the infrastructure & tools necessary for high-performing, resilient, proprietary contextual assistants. With Rasa, you can build chatbots and voice assistants that truly understand your users and can hold meaningful conversations.' },
  { id: 'seleniumide', name: 'Selenium IDE', description: 'Record and playback test automation for the web.', icon: PlayIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Selenium IDE is a Chrome and Firefox extension that makes it easy to record and playback tests. It’s an ideal tool for anyone new to test automation, offering a simple way to create automated tests for web applications without needing extensive programming knowledge.' },
  { id: 'tensorflowgui', name: 'TensorFlow GUI (Various)', description: 'Graphical interfaces for TensorFlow model building/training.', icon: LightBulbIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'While TensorFlow itself is a library, various community projects offer GUIs to simplify model creation, training, and visualization, making deep learning more accessible. TensorBoard is a key visualization toolkit. Other tools might wrap common TensorFlow tasks in a more user-friendly interface.' },
  { id: 'uipathcommunity', name: 'UiPath Community Edition', description: 'Robotic Process Automation (RPA) platform.', icon: RocketLaunchIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'UiPath Community Edition is a free RPA tool for individual developers, small professional teams, education and training purposes. It allows you to automate repetitive tasks by building software robots that mimic human actions.' },
  { id: 'orange3', name: 'Orange3', description: 'Open source machine learning and data visualization.', icon: BeakerIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Orange is an open-source data visualization, machine learning and data mining toolkit. It features a visual programming front-end for explorative data analysis and interactive data visualization, and can also be used as a Python library.' },
  { id: 'huggingfacehub', name: 'Hugging Face Hub', description: 'Platform for sharing and using ML models and datasets.', icon: CloudIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'The Hugging Face Hub is a platform with over 120k models, 20k datasets, and 50k demo apps (Spaces), all open source and publicly available, in an online platform where people can easily collaborate and build ML solutions together. It\'s central to the Transformers library.' },
  { id: 'puppeteer', name: 'Puppeteer', description: 'Node library for controlling headless Chrome or Chromium.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default, but can be configured to run full (non-headless) Chrome or Chromium. It\'s widely used for web scraping, automated testing, and generating screenshots/PDFs of pages.' },
  { id: 'stablediffusionui', name: 'Stable Diffusion UI (Various)', description: 'User interfaces for running Stable Diffusion models locally.', icon: PhotoIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Numerous open-source projects like AUTOMATIC1111 provide user-friendly web interfaces to run Stable Diffusion image generation models on your own hardware. These UIs offer features like txt2img, img2img, inpainting, upscaling, and prompt management.' },
  { id: 'autogpt', name: 'Auto-GPT', description: 'Experimental open-source attempt to make GPT-4 fully autonomous.', icon: CpuChipIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Auto-GPT is an experimental open-source application showcasing the capabilities of the GPT-4 language model. It chains together LLM "thoughts", to autonomously achieve whatever goal you set. It can perform tasks like web searches, file operations, and code execution.' },
  { id: 'chatterbot', name: 'ChatterBot', description: 'Python library for creating chatbots.', icon: ChatBubbleLeftRightIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'ChatterBot is a Python library that makes it easy to generate automated responses to a user’s input. It uses a selection of machine learning algorithms to produce different types of responses. It is language-independent, allowing it to be trained to speak any language.' },
  { id: 'scrapy', name: 'Scrapy', description: 'Fast high-level web crawling and scraping framework.', icon: MagnifyingGlassIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Scrapy is an open source and collaborative framework for extracting the data you need from websites. In a fast, simple, yet extensible way. It allows you to define spiders that crawl websites and extract structured data.' },
  { id: 'deepstack', name: 'DeepStack', description: 'Open-source AI server for object detection, face recognition, etc.', icon: EyeIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'DeepStack is an Open-Source AI Server that empowers every developer to easily build and deploy AI systems both on-premise and in the cloud. It provides APIs for tasks like object detection, face recognition, scene recognition, and custom model deployment.' },
  { id: 'openassistant', name: 'Open Assistant', description: 'Conversational AI for everyone.', icon: UsersIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Open Assistant is a chat-based assistant that understands tasks, can interact with third-party systems, and retrieve information dynamically to do so. It is an open-source project aiming to create a powerful and accessible AI assistant.' },
  { id: 'botmanstudio', name: 'BotMan Studio', description: 'PHP framework for chatbot development.', icon: CodeBracketIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'BotMan Studio is a Laravel project that makes it easy to develop chatbots using BotMan. It provides a simple and expressive way to build chatbots for multiple messaging platforms like Slack, Telegram, Facebook Messenger, and more.' },
  { id: 'mlflow', name: 'MLFlow', description: 'Open source platform for the machine learning lifecycle.', icon: BuildingLibraryIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'MLflow is an open source platform to manage the ML lifecycle, including experimentation, reproducibility, deployment, and a central model registry. It has four primary components: Tracking, Projects, Models, and Registry.' },
  { id: 'fastapi', name: 'FastAPI', description: 'Modern, fast (high-performance), web framework for building APIs.', icon: ServerIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints. It is often used to serve machine learning models due to its speed and ease of use.' },
  { id: 'datarobot', name: 'DataRobot', description: 'Enterprise AI platform.', icon: CpuChipIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'DataRobot is an enterprise AI platform that accelerates data science by automating the end-to-end journey from data to value. It provides tools for automated machine learning (AutoML), MLOps, and AI governance.' },
  { id: 'haystack', name: 'Haystack (by deepset)', description: 'Open-source NLP framework for building custom applications with LLMs.', icon: BeakerIcon, status: ToolStatus.NotLoaded, category: 'Bots & AI Models', longDescription: 'Haystack is an open-source NLP framework by deepset that allows you to build powerful and production-ready pipelines for different search systems. It can be used for tasks like question answering, document search, and summarization, often leveraging Large Language Models (LLMs).' },
   {
    id: 'emailbreachlookup', name: 'EMAIL_BREACH_LOOKUP_NAME',
    description: 'EMAIL_BREACH_LOOKUP_DESC',
    icon: EnvelopeIcon, status: ToolStatus.ReadyToRun, category: 'Bots & AI Models',
    longDescription: 'EMAIL_BREACH_LOOKUP_LONG_DESC',
    sampleExecutionParams: [
      {label: 'EMAIL_BREACH_INPUT_LABEL', type: 'text', required: true, placeholder: 'example@email.com'}
    ],
  },
];


export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'offensive-security',
    name: 'Offensive Security Tools', 
    description: 'A suite of tools for penetration testing, vulnerability assessment, and red teaming operations.', 
    icon: ShieldCheckIcon,
    tools: offensiveSecurityToolsArray,
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools', 
    description: 'Essential utilities for software development, debugging, API testing, and version control.', 
    icon: CodeBracketIcon,
    tools: developerToolsArray,
  },
  {
    id: 'post-format-utilities',
    name: 'Post-Format Utilities', 
    description: 'Tools for system cleanup, data recovery, driver updates, and disk management after OS setup.', 
    icon: WrenchScrewdriverIcon,
    tools: postFormatUtilitiesArray,
  },
  {
    id: 'bots-ai-models',
    name: 'Bots & AI Models', 
    description: 'Platforms, frameworks, and tools for building, training, and deploying AI models and bots. Now with Gemini power!', 
    icon: SparklesIcon, 
    tools: botsAndAIModelsArray,
  },
];

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: HomeIcon, i18nKey: 'DASHBOARD_TITLE' }, 
  { name: 'Protection', path: '/category/offensive-security', icon: ShieldCheckIcon, i18nKey: 'Offensive Security Tools' },
  { name: 'Privacy', path: '/privacy', icon: LockClosedIcon, i18nKey: 'Privacy' }, 
  { name: 'Developer Tools', path: '/category/developer-tools', icon: CodeBracketIcon, i18nKey: 'Developer Tools' }, 
  { name: 'AI & Bots', path: '/category/bots-ai-models', icon: SparklesIcon, i18nKey: 'Bots & AI Models' }, 
  { name: 'Utility', path: '/category/post-format-utilities', icon: WrenchScrewdriverIcon, i18nKey: 'Post-Format Utilities' }, 
  { name: 'Live Operations', path: '/live-operations', icon: BoltIcon, i18nKey: 'LIVE_OPERATIONS_TITLE' },
  { name: 'Update', path: '/update', icon: ArrowPathIcon, i18nKey: 'Update' }, 
  { name: 'Support', path: '/support', icon: LifebuoyIcon, i18nKey: 'Support' }, 
  { name: 'Settings', path: '/settings', icon: CogIcon, i18nKey: 'Settings' }, 
];


export const SMART_TOGGLES_DATA: SmartToggleType[] = [
  { id: 'autopilot', label: 'Autopilot', icon: RocketLaunchIcon, active: false, statusText: '🤖 Off' }, 
  { id: 'vpn', label: 'VPN', icon: GlobeAltIcon, active: false, statusText: '🌐 Off' },
  { id: 'maxmode', label: 'Max Mode', icon: FireIcon, active: false, statusText: '⚡ Off' },
];

export const getToolDisplayIcon = (tool: Tool, category?: ToolCategory) => {
  if (tool.isGeminiPowered) return tool.icon || SparklesIcon; 
  return tool.icon || category?.icon || PuzzlePieceIcon;
};

AR_TEXTS['Offensive Security Tools'] = 'أدوات الأمن الهجومي';
AR_TEXTS['Developer Tools'] = 'أدوات المطورين';
AR_TEXTS['Post-Format Utilities'] = 'أدوات ما بعد التهيئة';
AR_TEXTS['Bots & AI Models'] = 'الروبوتات ونماذج الذكاء الاصطناعي';
AR_TEXTS['Privacy'] = 'الخصوصية';
AR_TEXTS['Update'] = 'التحديثات';
AR_TEXTS['Support'] = 'الدعم';
AR_TEXTS['Settings'] = 'الإعدادات';

EN_TEXTS['Offensive Security Tools'] = 'Offensive Security Tools';
EN_TEXTS['Developer Tools'] = 'Developer Tools';
EN_TEXTS['Post-Format Utilities'] = 'Post-Format Utilities';
EN_TEXTS['Bots & AI Models'] = 'Bots & AI Models';
EN_TEXTS['Privacy'] = 'Privacy';
EN_TEXTS['Updates'] = 'Updates';
EN_TEXTS['Support'] = 'Support';
EN_TEXTS['Settings'] = 'Settings';
    