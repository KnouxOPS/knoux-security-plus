
import React, { useContext } from 'react'; // Added useContext
import { Tool, ToolCategory } from '../types';
import { GlassCard } from './Common'; 
import { AppContext } from '../App'; // Added AppContext
import { SignalIcon, CodeBracketIcon, ArrowPathIcon, ChatBubbleLeftRightIcon, CommandLineIcon, ServerIcon, ShieldCheckIcon, BeakerIcon, PhotoIcon, CpuChipIcon, CubeTransparentIcon, FunnelIcon, KeyIcon, BugAntIcon, EyeIcon } from '@heroicons/react/24/outline'; 

interface ToolActionPreviewProps {
  tool: Tool; // Already translated
  category: ToolCategory; // Already translated
}

const getRandomAnimation = () => {
  const animations = ['animate-pulse', 'animate-bounce', 'animate-pingOnce', 'animate-subtleGlow'];
  return animations[Math.floor(Math.random() * animations.length)];
};

const RenderPreviewContent: React.FC<{ tool: Tool, category: ToolCategory }> = ({ tool, category }) => {
  const { getText } = useContext(AppContext)!;
  const ToolIcon = tool.icon || category.icon || CommandLineIcon; 

  const iconClasses = `h-16 w-16 md:h-24 md:w-24 text-cyber-accent group-hover:text-cyber-primary transition-all duration-300 ${getRandomAnimation()}`;

  switch (tool.id) {
    case 'nmap':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <SignalIcon className={iconClasses} /> 
          <p className="mt-4 text-sm text-text-muted">{getText('NMAP_PREVIEW_TEXT') || 'Simulating network node discovery...'}</p>
          <div className="w-full h-8 mt-2 bg-cyber-bg rounded-md overflow-hidden border border-cyber-border">
            <div className="h-full bg-cyber-accent animate-pulse" style={{width: `${Math.random()*60+20}%`, animationDuration: '3s'}}></div>
          </div>
        </div>
      );
    case 'vscode':
    case 'pycharm':
    case 'intellijidea':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <CodeBracketIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('IDE_PREVIEW_TEXT') || 'Visualizing code structure analysis...'}</p>
          <pre className="mt-2 text-xs text-cyber-secondary/70 bg-cyber-bg/50 p-2 rounded-md font-firacode overflow-hidden max-h-24">
            {`class ${tool.name}Example {\n  constructor() {\n    this.status = "active";\n  }\n  run() {\n    // Knoux Power!\n  }\n}`}
          </pre>
        </div>
      );
    case 'recuva':
    case 'easeusdatarecoverywizard': // Assuming 'easeusdatarecovery' from user is this ID
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <ArrowPathIcon className={`${iconClasses} animate-spin`} style={{animationDuration: '5s'}}/>
          <p className="mt-4 text-sm text-text-muted">{getText('RECOVERY_TOOL_PREVIEW_TEXT') || 'Scanning for recoverable file signatures...'}</p>
          <div className="flex space-x-2 mt-2">
            {[1,2,3].map(i => <div key={i} className={`w-8 h-8 bg-cyber-primary/30 rounded animate-pulse`} style={{animationDelay: `${i*0.2}s`}}></div>)}
          </div>
        </div>
      );
    case 'chatgptdesktop':
    case 'openassistant':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <ChatBubbleLeftRightIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('CHATBOT_PREVIEW_TEXT') || 'Generating intelligent responses...'}</p>
          <div className="mt-2 p-2 w-full max-w-xs bg-cyber-bg/50 rounded-md text-left">
            <p className="text-xs text-cyber-accent animate-pulse">{getText('KNOX_AI_THINKING_PREVIEW') || 'Knox AI: Thinking...'}</p>
            <p className="text-xs text-text-muted animate-pulse" style={{animationDelay: '0.5s'}}>{getText('KNOX_AI_GREETING_PREVIEW') || 'Knox AI: How can I assist you today?'}</p>
          </div>
        </div>
      );
    case 'metasploit':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <CommandLineIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('METASPLOIT_PREVIEW_TEXT') || 'Executing advanced exploit module...'}</p>
          <p className="font-firacode text-xs text-red-400 animate-pulse">msf6 exploit(handler) &gt; run</p>
        </div>
      );
     case 'burpsuite':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <BugAntIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('BURPSUITE_PREVIEW_TEXT') || 'Intercepting & analyzing web traffic...'}</p>
          <p className="font-firacode text-xs text-orange-400">HTTP/1.1 200 OK | Target: example.com</p>
        </div>
      );
    case 'stablediffusionui':
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
          <PhotoIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('STABLE_DIFFUSION_PREVIEW_TEXT') || 'Generating visionary artwork...'}</p>
          <div className="w-24 h-24 mt-2 border-2 border-cyber-accent rounded-md bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse"></div>
        </div>
      );
    default:
      let GenericIcon = CommandLineIcon; 
      if (category.id === 'offensive-security') GenericIcon = ShieldCheckIcon;
      else if (category.id === 'developer-tools') GenericIcon = CodeBracketIcon;
      else if (category.id === 'post-format-utilities') GenericIcon = CubeTransparentIcon;
      else if (category.id === 'bots-ai-models') GenericIcon = CpuChipIcon;
      
      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <GenericIcon className={iconClasses} />
          <p className="mt-4 text-sm text-text-muted">{getText('GENERIC_TOOL_PREVIEW_TEXT', { toolName: tool.name }) || `Visualizing core function of ${tool.name}...`}</p>
          <p className="text-xs text-text-muted opacity-70">{getText('CONCEPTUAL_PREVIEW_NOTE') || 'This is a conceptual preview.'}</p>
        </div>
      );
  }
};

export const ToolActionPreview: React.FC<ToolActionPreviewProps> = ({ tool, category }) => {
  const { getText } = useContext(AppContext)!;
  return (
    <GlassCard className="text-center h-80 md:h-96 group dynamic-border-glow shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-bg/30 opacity-50 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-orbitron text-cyber-primary mb-1 absolute top-4 left-4 right-4 text-center">{getText("TOOL_PREVIEW_TITLE")}</h3>
        <RenderPreviewContent tool={tool} category={category} />
        <p className="text-xs text-text-muted opacity-70 absolute bottom-4 left-4 right-4 text-center">{getText("TOOL_PREVIEW_SUB_TEXT")}</p>
      </div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-cyber-primary/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-cyber-action/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/4 translate-y-1/4"></div>
    </GlassCard>
  );
};
