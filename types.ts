
export enum ToolStatus {
  NotLoaded = "NotLoaded",
  ReadyToRun = "ReadyToRun",
  Running = "Running",
  Completed = "Completed",
  Error = "Error",
  Loading = "Loading", // For download/install phase
}

export interface Tool {
  id: string;
  name: string; // This will become a key for i18n
  description: string; // This will become a key for i18n
  icon?: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => React.ReactNode; 
  status: ToolStatus;
  progress?: number; // 0-100
  longDescription: string; // Key for i18n
  category: string; 
  sampleExecutionParams?: { 
    label: string; // Key for i18n
    type: 'text' | 'number' | 'select'; 
    options?: string[]; // Values, or keys if options need translation
    required?: boolean;
    placeholder?: string; // Key for i18n
    min?: number; 
    max?: number; 
    defaultValue?: string | number | boolean;
  }[];
  runTemplates?: string[]; // Values, or keys if templates need translation
  isGeminiPowered?: boolean; 
}

export interface ToolCategory {
  id: string;
  name: string; // Key for i18n
  description: string; // Key for i18n
  icon?: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => React.ReactNode;
  tools: Tool[];
}

export interface ThreatDetails {
  type: 'process' | 'startup' | 'signature';
  value: string;
  severity?: 'High' | 'Medium' | 'Low'; 
}

export interface ScanResults {
  itemsScanned: number;
  threatsFound: ThreatDetails[];
}

export interface LiveOperation {
  id: string;
  toolName: string; // Direct name, or key if tool names in operations need i18n
  toolIcon?: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => React.ReactNode;
  taskDescription: string; // Could be a template string with placeholders
  status: ToolStatus;
  progress: number;
  startTime: Date;
  endTime?: Date;
  logs: string[];
  scanResults?: ScanResults; 
}

export enum ToastType {
  Success = "Success",
  Error = "Error",
  Info = "Info",
  Warning = "Warning"
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string; // Direct message or key for i18n
  icon?: React.ReactNode;
}

export interface SmartToggleType {
  id: 'autopilot' | 'vpn' | 'maxmode';
  label: string; // Key for i18n
  icon: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => React.ReactNode;
  active: boolean;
  statusText?: string; // Key for i18n or template
}

export const KNOX_LOGO_URL = "https://i.postimg.cc/ZRyJgdM0/Chat-GPT-Image-May-27-2025-02-30-45-AM-removebg-preview.png";

export type ExportFormat = "JSON" | "XML" | "CSV" | "XLSX" | "PDF" | "Markdown" | "HTML" | "TXT" | "DOCX";

export const EXPORT_FORMATS: ExportFormat[] = ["JSON", "XML", "CSV", "XLSX", "PDF", "Markdown", "HTML", "TXT", "DOCX"];

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean; 
}

export interface AIGeneratedContent {
  id: string; 
  toolId: string; 
  prompt: string;
  responseText: string;
  timestamp: Date;
  error?: string; 
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

// Type for localized text objects
export type LocalizedTexts = {
  [key: string]: string | ((params?: any) => string); // Allow simple strings or functions for dynamic text
};
