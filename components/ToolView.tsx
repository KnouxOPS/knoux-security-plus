
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Tool, ToolStatus, ExportFormat, ToastType, ToolCategory, ChatMessage as AppChatMessage, AIGeneratedContent, ScanResults } from '../types';
import { GlassCard, Button, ProgressBar, Modal, Tooltip, ExportResultsDropdown, Spinner } from './Common';
import { ArrowLeftIcon, PlayIcon, CogIcon, DocumentTextIcon, PauseIcon, StopIcon, CommandLineIcon, BeakerIcon, InformationCircleIcon, ListBulletIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../App';
import { ToolActionPreview } from './ToolActionPreview'; 
import { Chat } from '@google/genai';


const ToolStatusDisplay: React.FC<{ tool: Tool }> = ({ tool }) => {
  const { getText } = useContext(AppContext)!;
  const getStatusColor = () => {
    switch (tool.status) {
      case ToolStatus.Running: return 'border-cyber-action text-cyber-action animate-pulse';
      case ToolStatus.Completed: return 'border-green-500 text-green-400';
      case ToolStatus.ReadyToRun: return 'border-cyber-accent text-cyber-accent';
      case ToolStatus.Error: return 'border-red-600 text-red-500';
      case ToolStatus.Loading: return 'border-yellow-400 text-yellow-400 animate-pulse';
      default: return 'border-gray-600 text-text-muted';
    }
  };
  
  const statusKey = `STATUS_${tool.status.toUpperCase()}`;
  const statusText = getText(statusKey) || tool.status;

  return (
    <div className={`p-3 border-2 rounded-lg text-center ${getStatusColor()} glass-card mb-6 shadow-lg`}>
      <h3 className="text-lg font-orbitron">{getText('CURRENT_STATUS_TITLE') || 'Current Status'}</h3>
      <p className="text-2xl font-semibold">{statusText}</p>
      {(tool.status === ToolStatus.Running || tool.status === ToolStatus.Loading) && tool.progress !== undefined && (
        <ProgressBar progress={tool.progress} status={tool.status} className="mt-2" />
      )}
      {tool.status === ToolStatus.Error && <p className="text-sm mt-1">{getText('ERROR_CODE_LABEL') || 'Error Code'}: [Simulated-Err-404]</p>}
    </div>
  );
};

interface ExecutionParams {
  [key: string]: any;
}

const ExecutionOptions: React.FC<{ tool: Tool, categoryId: string, onRun: (params?: ExecutionParams) => void, onPause?: () => void, onStop?: () => void }> = ({ tool, categoryId, onRun, onPause, onStop }) => {
  const [showAdvancedSettingsForm, setShowAdvancedSettingsForm] = useState(false);
  const [customParams, setCustomParams] = useState<ExecutionParams>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const { updateToolStatus, addToast, getText } = useContext(AppContext)!;

  useEffect(() => {
    setCustomParams({});
    setSelectedTemplate('');
    if (tool.sampleExecutionParams) {
        const defaultP: ExecutionParams = {};
        tool.sampleExecutionParams.forEach(p => {
            const translatedLabel = p.label; // Already translated from AppContext
            if (p.defaultValue !== undefined) defaultP[translatedLabel] = p.defaultValue;
            else if (p.type === 'select' && p.options && p.options.length > 0) defaultP[translatedLabel] = p.options[0];
            else defaultP[translatedLabel] = '';
        });
        setCustomParams(defaultP);
    }
  }, [tool, showAdvancedSettingsForm, getText]);


  const handleRunClick = () => {
    if (tool.isGeminiPowered) { 
        if (tool.id !== 'chatgptdesktop') { 
             setShowAdvancedSettingsForm(true); 
        } else {
            addToast(getText('ENGAGE_CHAT_PROMPT', { toolName: tool.name }) || `Engage with ${tool.name} using the chat interface below.`, ToastType.Info);
        }
        return;
    }

    if (tool.status === ToolStatus.NotLoaded) {
        updateToolStatus(categoryId, tool.id, ToolStatus.Loading, 0);
        addToast(getText("INSTALLING_BUTTON_FOR_TOOL", { toolName: tool.name }), ToastType.Info);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            if (progress <= 100) {
                updateToolStatus(categoryId, tool.id, ToolStatus.Loading, progress);
            } else {
                clearInterval(interval);
                updateToolStatus(categoryId, tool.id, ToolStatus.ReadyToRun);
                addToast(getText("READY_TO_RUN_FOR_TOOL", { toolName: tool.name }), ToastType.Success);
            }
        }, 400);
    } else if (tool.status === ToolStatus.ReadyToRun || tool.status === ToolStatus.Completed || tool.status === ToolStatus.Error) {
        setShowAdvancedSettingsForm(true);
    } else if (tool.status === ToolStatus.Running) {
        addToast(getText('TOOL_ALREADY_RUNNING_MSG', { toolName: tool.name }) || `"${tool.name}" is already running. View progress in Live Operations.`, ToastType.Info);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const runParams = { ...customParams };
    if (selectedTemplate) runParams.template = selectedTemplate;
    onRun(runParams);
    setShowAdvancedSettingsForm(false);
  };

  const handleParamChange = (paramName: string, value: string | number | boolean) => {
    setCustomParams(prev => ({ ...prev, [paramName]: value }));
  };

  const renderParamInput = (param: NonNullable<Tool['sampleExecutionParams']>[0]) => {
    const inputClasses = "w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main focus:ring-cyber-accent focus:border-cyber-accent placeholder-text-muted";
    const translatedLabel = param.label; // Already translated
    const translatedPlaceholder = param.placeholder; // Already translated

    switch(param.type) {
        case 'select':
            return (
                <select 
                  id={translatedLabel}
                  value={customParams[translatedLabel] || (param.options && param.options.length > 0 ? param.options[0] : '')}
                  onChange={(e) => handleParamChange(translatedLabel, e.target.value)}
                  className={inputClasses}
                >
                  {param.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'number':
            return (
                <input 
                  type="number" 
                  id={translatedLabel}
                  value={customParams[translatedLabel] || ''}
                  onChange={(e) => handleParamChange(translatedLabel, parseFloat(e.target.value))}
                  min={param.min}
                  max={param.max}
                  placeholder={translatedPlaceholder || translatedLabel}
                  className={inputClasses}
                  required={param.required}
                />
            );
        case 'text':
        default:
            return (
                 <input 
                  type="text" 
                  id={translatedLabel}
                  value={customParams[translatedLabel] || ''}
                  onChange={(e) => handleParamChange(translatedLabel, e.target.value)}
                  placeholder={translatedPlaceholder || translatedLabel}
                  className={inputClasses}
                  required={param.required}
                />
            );
    }
  }
  
  if (tool.id === 'chatgptdesktop') {
    return null;
  }

  return (
    <GlassCard className="mb-6 dynamic-border-glow shadow-xl">
      <h4 className="text-xl font-orbitron text-cyber-accent mb-4 flex items-center">
        <PlayIcon className="h-6 w-6 mr-2"/> {getText("TOOL_EXEC_OPTIONS_TITLE")}
      </h4>
      {tool.status === ToolStatus.Running ? (
        <div className="space-y-3">
          <p className="text-center text-lg text-text-muted">{getText('OPERATION_IN_PROGRESS_MSG') || 'Operation in progress...'}</p>
          <div className="flex space-x-3">
            <Button variant="action" onClick={onPause} icon={<PauseIcon className="h-5 w-5"/>} className="flex-1">{getText("PAUSE_BUTTON")}</Button>
            <Button variant="action" onClick={onStop} icon={<StopIcon className="h-5 w-5"/>} className="flex-1">{getText("STOP_BUTTON")}</Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="primary" 
          onClick={handleRunClick} 
          icon={tool.status === ToolStatus.NotLoaded || tool.status === ToolStatus.Loading ? <Spinner className="h-5 w-5"/> : <PlayIcon className="h-5 w-5" />} 
          className="w-full text-lg py-3"
          isLoading={tool.status === ToolStatus.Loading}
          disabled={tool.status === ToolStatus.Loading}
        >
          {tool.status === ToolStatus.NotLoaded ? getText("DOWNLOAD_BUTTON") : 
           tool.status === ToolStatus.Loading ? getText("INSTALLING_BUTTON") : getText("START_SCAN_RUN_BUTTON")}
        </Button>
      )}

      <Modal isOpen={showAdvancedSettingsForm} onClose={() => setShowAdvancedSettingsForm(false)} title={`${getText("ADV_SETTINGS_FORM_TITLE_PREFIX")} ${tool.name}`} size="lg">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {tool.runTemplates && tool.runTemplates.length > 0 && (
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-text-muted mb-1">{getText('RUN_TEMPLATES_LABEL') || 'Run Templates'}</label>
              <select 
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main focus:ring-cyber-accent focus:border-cyber-accent"
              >
                <option value="">{getText("ADV_SETTINGS_TEMPLATE_SELECT")}</option>
                {tool.runTemplates.map(template => <option key={template} value={template}>{getText(template) || template}</option>)}
              </select>
            </div>
          )}
          {tool.sampleExecutionParams && tool.sampleExecutionParams.length > 0 ? tool.sampleExecutionParams?.map(param => (
            <div key={param.label}>
              <label htmlFor={param.label} className="block text-sm font-medium text-text-muted mb-1">
                {param.label} {param.required && <span className="text-cyber-action">*</span>}
              </label>
              {renderParamInput(param)}
            </div>
          )) : <p className="text-text-muted text-center py-4">{getText("ADV_SETTINGS_NO_PARAMS")}</p>}
          
          <Button type="submit" variant="primary" className="w-full mt-6" icon={<PlayIcon className="h-5 w-5"/>}>{getText("APPLY_PARAMS_BUTTON")}</Button>
        </form>
        <div className="mt-6 p-3 h-32 bg-black/60 border border-cyber-border rounded scrollable-content overflow-y-auto backdrop-blur-sm">
            <p className="text-xs text-text-muted font-firacode">[LOG] {getText('LOG_INIT_PARAMS_MSG', {toolName: tool.name}) || `Initializing parameters for ${tool.name}...`}</p>
            {selectedTemplate && <p className="text-xs text-text-muted font-firacode">[LOG] {getText('LOG_SELECTED_TEMPLATE_MSG', {templateName: selectedTemplate}) || `Selected Template: ${selectedTemplate}`}</p>}
            {Object.entries(customParams).map(([key, value]) => value && (
                 <p key={key} className="text-xs text-text-muted font-firacode">[LOG] {getText('LOG_PARAM_VALUE_MSG', {paramKey: key, paramValue: String(value)}) || `Param '${key}': ${String(value)}`}</p>
            ))}
        </div>
      </Modal>
    </GlassCard>
  );
};

const ResultsManagement: React.FC<{ tool: Tool, onExport: (format: ExportFormat) => void, onAnalyzeWithAI: (scanResults: ScanResults) => void, latestScanResults?: ScanResults }> = ({ tool, onExport, onAnalyzeWithAI, latestScanResults }) => {
  const [showFullResults, setShowFullResults] = useState(false);
  const { operations, isGeminiAvailable, getText } = useContext(AppContext)!;
  
  const relevantOperation = operations
    .filter(op => op.toolName === tool.name && (op.status === ToolStatus.Completed || op.status === ToolStatus.Error))
    .sort((a, b) => (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0))[0];
  
  const currentScanResults = latestScanResults || relevantOperation?.scanResults;
  const statusKey = `STATUS_${tool.status.toUpperCase()}`;
  const toolStatusText = getText(statusKey) || tool.status;

  return (
    <GlassCard className="mb-6 dynamic-border-glow shadow-xl">
      <h4 className="text-xl font-orbitron text-cyber-accent mb-4 flex items-center">
        <DocumentTextIcon className="h-6 w-6 mr-2"/> {getText("TOOL_RESULTS_MGMT_TITLE")}
      </h4>
      {tool.status !== ToolStatus.Completed && tool.status !== ToolStatus.Error && !relevantOperation && (
         <div className="text-center py-6">
            <InformationCircleIcon className="h-12 w-12 mx-auto text-text-muted opacity-50 mb-3"/>
            <p className="text-text-muted">{getText('NO_RESULTS_AVAILABLE_MSG') || 'No results available. Run the tool to generate results.'}</p>
         </div>
      )}
      {(tool.status === ToolStatus.Completed || tool.status === ToolStatus.Error || relevantOperation) && (
        <div className="space-y-4">
          <div className="p-4 border border-dashed border-cyber-border rounded-md text-center text-text-muted glass-card hover:border-cyber-accent/50">
            <BeakerIcon className="h-10 w-10 mx-auto mb-2 text-cyber-primary" />
            <p className="font-semibold">{getText('GRAPHICAL_RESULTS_SUMMARY_TITLE') || 'Graphical Results Summary'}</p>
            <p className="text-xs">
                {relevantOperation ? 
                    `${getText('LAST_RUN_LABEL') || 'Last run'}: ${new Date(relevantOperation.startTime).toLocaleDateString()}, ${getText('STATUS_LABEL')|| 'Status'}: ${getText(`STATUS_${relevantOperation.status.toUpperCase()}`) || relevantOperation.status}` : 
                    `${getText('TOOL_STATUS_LABEL') || 'Tool Status'}: ${toolStatusText}`
                }
            </p>
            <div className="h-16 w-full bg-cyber-surface/30 my-2 rounded flex items-center justify-center text-xs text-text-muted opacity-70">{getText('SPARKLINE_CHART_AREA_PLACEHOLDER') || 'Sparkline/Summary Chart Area'}</div>
            {currentScanResults && currentScanResults.threatsFound.length > 0 && (
                <p className="text-sm text-cyber-action mt-1">{getText('THREATS_IDENTIFIED_MSG', {count: currentScanResults.threatsFound.length}) || `${currentScanResults.threatsFound.length} potential threats identified in last scan.`}</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
                variant="secondary" 
                onClick={() => setShowFullResults(true)} 
                icon={<ListBulletIcon className="h-5 w-5"/>} 
                className="flex-1"
                disabled={!relevantOperation}
            >
              {getText("BROWSE_FULL_RESULTS_BUTTON")}
            </Button>
            <ExportResultsDropdown onExport={onExport} buttonText={getText("EXPORT_RESULTS_BUTTON")}/>
          </div>
          {tool.id === 'knoxdeepscan' && currentScanResults && currentScanResults.threatsFound.length > 0 && isGeminiAvailable && (
            <Button
              variant="action"
              onClick={() => onAnalyzeWithAI(currentScanResults)}
              icon={<SparklesIcon className="h-5 w-5"/>}
              className="w-full mt-2"
            >
              {getText("ANALYZE_WITH_AI_BUTTON")}
            </Button>
          )}
        </div>
      )}
      <Modal isOpen={showFullResults && !!relevantOperation} onClose={() => setShowFullResults(false)} title={`${tool.name} - ${getText('FULL_RESULTS_MODAL_TITLE_SUFFIX') || 'Full Results'}`} size="xl">
        <div className="font-firacode text-sm text-text-main bg-black/80 p-4 rounded-md h-[60vh] overflow-auto scrollable-content border border-cyber-border backdrop-blur-sm">
          <h5 className="font-orbitron text-cyber-accent mb-2">{getText('DETAILED_LOG_TITLE_PREFIX') || 'Detailed Log / Output from Operation ID'}: {relevantOperation?.id}</h5>
          {relevantOperation?.scanResults && relevantOperation.scanResults.threatsFound.length > 0 && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                <h6 className="font-orbitron text-red-400 mb-1">{getText('THREATS_DETECTED_SUBHEADER') || 'Threats Detected'}:</h6>
                {relevantOperation.scanResults.threatsFound.map((threat, idx) => (
                    <p key={idx} className="text-xs text-red-300">
                        - {getText('THREAT_TYPE_LABEL') || 'Type'}: <span className="font-semibold">{getText(`THREAT_TYPE_${threat.type.toUpperCase()}`) || threat.type}</span>, {getText('THREAT_VALUE_LABEL') || 'Value'}: <span className="italic">"{threat.value}"</span>, {getText('THREAT_SEVERITY_LABEL') || 'Severity'}: {threat.severity || getText('SEVERITY_NA') || 'N/A'}
                    </p>
                ))}
            </div>
          )}
          {(relevantOperation?.logs || []).map((log, index) => <p key={index} className="whitespace-pre-wrap leading-relaxed border-b border-cyber-border/20 py-1">{log}</p>)}
          {(!relevantOperation || relevantOperation.logs.length === 0) && <p>{getText('NO_DETAILED_LOGS_MSG') || 'No detailed logs available for this completed operation.'}</p>}
        </div>
      </Modal>
    </GlassCard>
  );
};

const AdvancedSettingsPanel: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { addToast, getText } = useContext(AppContext)!;

  const handleSaveTemplate = () => {
    addToast(getText('TEMPLATE_SAVED_MSG', { toolName: tool.name }) || `Custom template for ${tool.name} saved! (Simulated)`, ToastType.Success);
    setIsPanelOpen(false);
  };
  const handleImportExport = (action: 'import' | 'export') => {
    addToast(getText('CONFIG_IMPORTED_EXPORTED_MSG', { toolName: tool.name, actionType: action }) || `Configuration for ${tool.name} ${action}ed (Simulated).`, ToastType.Info);
  };
  
  if (tool.id === 'chatgptdesktop') { 
    return null;
  }

  return (
    <GlassCard className="dynamic-border-glow shadow-xl">
      <h4 className="text-xl font-orbitron text-cyber-accent mb-4 flex items-center">
        <CogIcon className="h-6 w-6 mr-2"/> {getText("TOOL_ADV_SETTINGS_TITLE")}
      </h4>
      <Button 
        variant="ghost" 
        onClick={() => setIsPanelOpen(true)} 
        icon={<CogIcon className="h-5 w-5" />} 
        className="w-full"
      >
        {getText("CUSTOMIZE_BUTTON")}
      </Button>
      <Modal isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={`${getText('ADV_SETTINGS_MODAL_TITLE_PREFIX') || 'Advanced Settings'}: ${tool.name}`} size="lg">
        <div className="space-y-6 p-2">
          <p className="text-text-muted">{getText('ADV_SETTINGS_MODAL_DESC', { toolName: tool.name }) || `Configure detailed options for ${tool.name}. These settings will be applied to future runs unless overridden by execution parameters.`}</p>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">{getText('DEFAULT_OUTPUT_DIR_LABEL') || 'Default Output Directory'}</label>
            <input type="text" defaultValue={`/knox_data/results/${tool.id}/`} className="w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">{getText('LOG_VERBOSITY_LABEL') || 'Log Verbosity Level'}</label>
            <select className="w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main">
              <option>{getText('LOG_VERBOSITY_MINIMAL') || 'Minimal (Errors Only)'}</option>
              <option selected>{getText('LOG_VERBOSITY_STANDARD') || 'Standard (Info & Warnings)'}</option>
              <option>{getText('LOG_VERBOSITY_VERBOSE') || 'Verbose (Debug)'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">{getText('DEFAULT_TIMEOUT_LABEL') || 'Default Timeout (seconds)'}</label>
            <input type="number" defaultValue={600} className="w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">{getText('AUTO_UPDATES_LABEL') || 'Enable Automatic Updates for this Tool'}</label>
            <select className="w-full p-2.5 bg-cyber-surface border border-cyber-border rounded-md text-text-main">
              <option>{getText('YES_OPTION') || 'Yes'}</option>
              <option selected>{getText('NO_MANUAL_OPTION') || 'No (Manual Update)'}</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-8">
            <Button onClick={handleSaveTemplate} variant="secondary" className="flex-1" icon={<DocumentTextIcon className="h-5 w-5"/>}>{getText("SAVE_TEMPLATE_BUTTON")}</Button>
            <Button onClick={() => handleImportExport('export')} variant="ghost" className="flex-1">{getText("IMPORT_EXPORT_CONFIG_BUTTON")}</Button>
          </div>
        </div>
      </Modal>
    </GlassCard>
  );
};

const ChatInterface: React.FC<{ tool: Tool }> = ({ tool }) => {
  const { isGeminiAvailable, chatWithGemini, addToast, getGeminiChatInstance, storeGeminiChatInstance, getText } = useContext(AppContext)!;
  const [messages, setMessages] = useState<AppChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [currentChatSession, setCurrentChatSession] = useState<Chat | undefined>(() => getGeminiChatInstance(tool.id));


  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!isGeminiAvailable) {
        addToast(getText("API_KEY_MISSING_ERROR"), ToastType.Error);
        return;
    }

    const userMessage: AppChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiPlaceholderMessage: AppChatMessage = {
        id: `ai-loading-${Date.now()}`,
        text: getText('AI_THINKING_MSG') || "KNOX AI is thinking...",
        sender: 'ai',
        timestamp: new Date(),
        isLoading: true,
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    const result = await chatWithGemini(tool.id, userMessage.text, currentChatSession);
    
    setMessages(prev => prev.filter(msg => msg.id !== aiPlaceholderMessage.id)); 

    if (result && result.response) {
      setMessages(prev => [...prev, result.response]);
      if (result.chat) {
        setCurrentChatSession(result.chat); 
        storeGeminiChatInstance(tool.id, result.chat); 
      }
    } else {
       const errorMsg: AppChatMessage = {
           id: `ai-error-${Date.now()}`,
           text: getText('AI_FAILED_RESPONSE_MSG') || "Failed to get response from AI.",
           sender: 'ai',
           timestamp: new Date()
       };
       setMessages(prev => [...prev, errorMsg]);
    }
    setIsLoading(false);
  };

  return (
    <GlassCard className="dynamic-border-glow shadow-xl h-[70vh] flex flex-col">
      <h4 className="text-xl font-orbitron text-cyber-accent mb-4 p-4 border-b border-cyber-border flex items-center">
        <SparklesIcon className="h-6 w-6 mr-2"/> {getText("CHAT_INTERFACE_TITLE")}
      </h4>
      <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto scrollable-content">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-xl shadow ${
              msg.sender === 'user' 
                ? 'bg-cyber-primary text-white rounded-br-none' 
                : 'bg-cyber-surface text-text-main rounded-bl-none border border-cyber-border'
            } ${msg.isLoading ? 'animate-pulse' : ''}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-purple-200' : 'text-text-muted opacity-70'} text-right`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
         {messages.length === 0 && !isLoading && (
            <div className="text-center text-text-muted opacity-70 py-10">
                <SparklesIcon className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                <p>{getText('START_AI_CONVERSATION_PROMPT') || 'Start a conversation with KNOX AI!'}</p>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-cyber-border">
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={isLoading ? getText('AI_REPLYING_PLACEHOLDER') || "AI is replying..." : getText("CHAT_INPUT_PLACEHOLDER")}
            className="flex-grow p-3 bg-cyber-surface border border-cyber-border rounded-lg text-text-main focus:ring-cyber-accent focus:border-cyber-accent placeholder-text-muted"
            disabled={isLoading || !isGeminiAvailable}
          />
          <Button 
            variant="primary" 
            onClick={handleSendMessage} 
            isLoading={isLoading}
            disabled={isLoading || !isGeminiAvailable || !inputValue.trim()}
            icon={<PaperAirplaneIcon className="h-5 w-5"/>}
            className="px-5"
          >
            {getText("SEND_MESSAGE_BUTTON")}
          </Button>
        </div>
        {!isGeminiAvailable && <p className="text-xs text-cyber-action text-center mt-2">{getText("API_KEY_MISSING_ERROR")}</p>}
      </div>
    </GlassCard>
  );
};


export const ToolDetailPage: React.FC = () => {
  const { categoryId, toolId } = useParams<{ categoryId: string; toolId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);
  
  if (!appContext) return <div className="text-center text-lg p-10">Loading KNOX Core...</div>;
  const { getToolById, addOperation, updateOperation, updateToolStatus, addToast, operations, analyzeScanWithGemini, isGeminiAvailable, getText, toolCategories } = appContext;
  
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIGeneratedContent | null>(null);
  const [showAiAnalysisModal, setShowAiAnalysisModal] = useState(false);

  const tool = useMemo(() => {
    if (!categoryId || !toolId) return undefined;
    return getToolById(categoryId, toolId);
  }, [categoryId, toolId, getToolById]);

  const category = useMemo(() => toolCategories.find(c => c.id === categoryId), [categoryId, toolCategories]);

  useEffect(() => {
    if (!tool) {
      addToast(getText('TOOL_NOT_FOUND_MSG', { toolIdValue: toolId, categoryIdValue: categoryId }) || `Tool ${toolId} in category ${categoryId} not found. Redirecting...`, ToastType.Error);
      navigate('/');
      return;
    }
    
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('action') === 'run' && (tool.status === ToolStatus.ReadyToRun || tool.status === ToolStatus.Completed) && !tool.isGeminiPowered) {
      addToast(getText('PREPARING_TO_RUN_TOOL_MSG', { toolName: tool.name }) || `Preparing to run ${tool.name}... Configure parameters.`, ToastType.Info);
      navigate(`/tool/${categoryId}/${toolId}`, { replace: true }); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, categoryId, toolId, navigate, location.search, addToast, getText]);


  if (!tool || !categoryId || !category) {
    return <div className="text-center text-cyber-action font-bold p-10 flex items-center justify-center h-full"><Spinner className="h-10 w-10 mr-4"/>{getText('LOADING_TOOL_DATA_MSG') || 'Loading tool data or redirecting...'}</div>;
  }
  
  const handleRunTool = (params?: ExecutionParams) => {
    const taskDescription = params && Object.keys(params).length > 0 ? 
      getText('CUSTOM_RUN_DESC', { params: JSON.stringify(params) }) || `Custom run: ${Object.entries(params).map(([k,v]) => `${k}=${v}`).join(', ')}` : 
      getText('DEFAULT_RUN_DESC', { toolName: tool.name }) || `Default run for ${tool.name}`;
      
    addOperation(tool, taskDescription, params); 
    updateToolStatus(categoryId, tool.id, ToolStatus.Running, 0); 
    addToast(getText('TOOL_OPERATION_STARTED_MSG', { toolName: tool.name, description: taskDescription }) || `"${tool.name}" operation started: ${taskDescription}`, ToastType.Success);
  };

  const findActiveOperationId = () => {
    const activeOp = operations.find(op => op.toolName === tool.name && op.status === ToolStatus.Running);
    return activeOp?.id;
  }

  const handlePauseTool = () => {
    const opId = findActiveOperationId();
    if(opId) {
      updateOperation(opId, { status: ToolStatus.ReadyToRun }); 
      updateToolStatus(categoryId, tool.id, ToolStatus.ReadyToRun);
      addToast(getText('TOOL_PAUSED_MSG', { toolName: tool.name }) || `${tool.name} paused.`, ToastType.Info);
    } else {
      addToast(getText('NO_ACTIVE_OP_TO_PAUSE_MSG', { toolName: tool.name }) || `No active operation found for ${tool.name} to pause.`, ToastType.Warning);
    }
  };

  const handleStopTool = () => {
    const opId = findActiveOperationId();
    if(opId) {
      updateOperation(opId, { status: ToolStatus.Error, endTime: new Date(), progress: tool.progress }); 
      updateToolStatus(categoryId, tool.id, ToolStatus.Error); 
      addToast(getText('TOOL_STOPPED_MSG', { toolName: tool.name }) || `${tool.name} stopped.`, ToastType.Warning);
    } else {
       addToast(getText('NO_ACTIVE_OP_TO_STOP_MSG', { toolName: tool.name }) || `No active operation found for ${tool.name} to stop.`, ToastType.Warning);
    }
  };
  
  const handleExport = (format: ExportFormat) => {
    addToast(getText('EXPORTING_RESULTS_MSG', { toolName: tool.name, exportFormat: format }) || `Exporting ${tool.name} results as ${format}... (Simulated)\n${getText("SUCCESS_TOAST")}`, ToastType.Success);
  };

  const handleAnalyzeWithAI = async (scanResults: ScanResults) => {
    if (!isGeminiAvailable) {
        addToast(getText("API_KEY_MISSING_ERROR"), ToastType.Error);
        return;
    }
    const result = await analyzeScanWithGemini(scanResults);
    setAiAnalysisResult(result);
    if(result && !result.error) setShowAiAnalysisModal(true);
  };

  const latestScanResults = operations
    .filter(op => op.toolName === tool.name && op.status === ToolStatus.Completed && op.scanResults)
    .sort((a,b) => (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0))[0]?.scanResults;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <Button variant="ghost" onClick={() => navigate(`/category/${categoryId}`)} className="mb-4 group">
        <ArrowLeftIcon className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" /> {getText('BACK_TO_CATEGORY_BUTTON', { categoryName: category.name }) || `Back to ${category.name}`}
      </Button>
      
      <header className="text-center py-6 glass-card dynamic-border-glow shadow-xl">
        <div className="flex items-center justify-center mb-4">
         {tool.icon && <tool.icon className={`h-16 w-16 md:h-20 md:w-20 ${tool.isGeminiPowered ? 'text-cyber-secondary' : 'text-cyber-primary'} animate-subtleGlow`} />}
        </div>
        <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-text-main mb-2 tracking-wide">
          {tool.name} {tool.isGeminiPowered && <SparklesIcon className="inline h-8 w-8 text-yellow-400" title={getText('GEMINI_POWERED_TOOLTIP') || "Powered by Gemini AI"}/>}
        </h1>
        <p className="text-md text-text-muted max-w-3xl mx-auto px-4">{tool.longDescription || getText("TOOL_DESCRIPTION_PLACEHOLDER")}</p>
      </header>
      
      {tool.id !== 'chatgptdesktop' && <ToolActionPreview tool={tool} category={category}/>}
      {tool.id !== 'chatgptdesktop' && <ToolStatusDisplay tool={tool} />}
      
      {tool.id === 'chatgptdesktop' ? (
        <ChatInterface tool={tool} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6 md:space-y-8">
            <ExecutionOptions tool={tool} categoryId={categoryId} onRun={handleRunTool} onPause={handlePauseTool} onStop={handleStopTool} />
            <AdvancedSettingsPanel tool={tool} />
          </div>
          <ResultsManagement tool={tool} onExport={handleExport} onAnalyzeWithAI={handleAnalyzeWithAI} latestScanResults={latestScanResults} />
        </div>
      )}

      {aiAnalysisResult && (
        <Modal 
            isOpen={showAiAnalysisModal} 
            onClose={() => setShowAiAnalysisModal(false)} 
            title={getText("AI_ANALYSIS_MODAL_TITLE")} 
            size="xl"
        >
            <div className="font-poppins text-sm text-text-main bg-cyber-surface/80 p-4 rounded-md h-[70vh] overflow-auto scrollable-content border border-cyber-border backdrop-blur-sm">
                <h4 className="font-orbitron text-cyber-accent text-lg mb-2">{getText('AI_ANALYSIS_REPORT_FOR_TOOL_MSG', { toolName: tool.name }) || `Gemini AI Analysis Report for ${tool.name}`}</h4>
                <p className="text-xs text-text-muted opacity-80 mb-4">{getText('GENERATED_ON_DATE_MSG', { date: new Date(aiAnalysisResult.timestamp).toLocaleString() }) || `Generated on: ${new Date(aiAnalysisResult.timestamp).toLocaleString()}`}</p>
                {aiAnalysisResult.error ? (
                    <p className="text-red-400">{getText('ERROR_LABEL') || 'Error'}: {aiAnalysisResult.error}</p>
                ) : (
                    <pre className="whitespace-pre-wrap leading-relaxed text-text-main">{aiAnalysisResult.responseText}</pre>
                )}
            </div>
        </Modal>
      )}
    </div>
  );
};
