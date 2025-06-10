
import React, { useState, useMemo, useContext, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Tool, ToolStatus, ToastType } from '../types'; 
import { GlassCard, Button, Tooltip, AdvancedSearchBar, ProgressBar } from './Common';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../App';

interface ToolCardProps {
  tool: Tool; // Already translated tool data from AppContext
  categoryId: string; // The ID of the category
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, categoryId }) => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  if (!appContext) return null;
  const { addToast, updateToolStatus, getText } = appContext;

  const handleCustomize = () => {
    navigate(`/tool/${categoryId}/${tool.id}`);
  };

  const handleLoadRun = () => {
     if (tool.status === ToolStatus.NotLoaded) {
      updateToolStatus(categoryId, tool.id, ToolStatus.Loading); 
      addToast(getText("INSTALLING_BUTTON_FOR_TOOL", {toolName: tool.name}) || `"${tool.name}" ${getText("INSTALLING_BUTTON")}`, ToastType.Info);
      setTimeout(() => {
        updateToolStatus(categoryId, tool.id, ToolStatus.ReadyToRun);
        addToast(getText("READY_TO_RUN_FOR_TOOL", {toolName: tool.name}) || `"${tool.name}" ${getText("READY_TO_RUN_BUTTON")}`, ToastType.Success);
      }, 2000 + Math.random() * 2000); 
    } else if (tool.status === ToolStatus.ReadyToRun || tool.status === ToolStatus.Completed || tool.status === ToolStatus.Error) {
       navigate(`/tool/${categoryId}/${tool.id}?action=run`); 
    } else if (tool.status === ToolStatus.Running) {
       navigate(`/tool/${categoryId}/${tool.id}`); 
    }
  };
  
  const getStatusColor = (status: ToolStatus) => {
    switch (status) {
      case ToolStatus.Running: return 'text-cyber-action animate-pulse';
      case ToolStatus.Completed: return 'text-green-400';
      case ToolStatus.ReadyToRun: return 'text-cyber-accent';
      case ToolStatus.Error: return 'text-red-500';
      case ToolStatus.Loading: return 'text-yellow-400 animate-pulse';
      default: return 'text-text-muted';
    }
  };

  const getButtonText = () => {
    switch (tool.status) {
      case ToolStatus.NotLoaded: return getText("DOWNLOAD_BUTTON");
      case ToolStatus.Loading: return getText("INSTALLING_BUTTON");
      case ToolStatus.ReadyToRun: return getText("RUN_TOOL_BUTTON");
      case ToolStatus.Running: return getText("VIEW_PROGRESS_BUTTON") || "View Progress";
      case ToolStatus.Completed: return getText("RUN_AGAIN_BUTTON") || "Run Again";
      case ToolStatus.Error: return getText("RETRY_BUTTON") || "Retry / View Error";
      default: return getText("DOWNLOAD_BUTTON");
    }
  };
  
  const statusKey = `STATUS_${tool.status.toUpperCase()}`;
  const statusText = getText(statusKey) || tool.status;


  return (
    <Tooltip text={`${getText("TOOLTIP_TEXT")} - ${statusText}`}>
      <GlassCard className="group relative flex flex-col justify-between h-full dynamic-border-glow overflow-hidden">
        <div>
          <div className="flex items-center mb-3">
            {tool.icon && <tool.icon className={`h-10 w-10 mr-3 ${tool.status === ToolStatus.Running ? 'text-cyber-action animate-spin' : 'text-cyber-accent'} group-hover:scale-110 transition-transform`} />}
            <h3 className="text-xl font-orbitron text-text-main group-hover:text-cyber-primary transition-colors truncate" title={tool.name}>{tool.name}</h3>
          </div>
          <p className="text-sm text-text-muted mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors">{tool.description}</p>
          <div className={`text-xs font-semibold mb-3 ${getStatusColor(tool.status)}`}>
            {getText('STATUS_LABEL') || 'Status'}: {statusText}
          </div>
          {(tool.status === ToolStatus.Running || tool.status === ToolStatus.Loading) && tool.progress !== undefined && (
            <ProgressBar progress={tool.progress} status={tool.status} className="mb-3" />
          )}
        </div>
        <div className="mt-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant={tool.status === ToolStatus.NotLoaded || tool.status === ToolStatus.Loading ? "primary" : "secondary"} 
            onClick={handleLoadRun} 
            className="w-full text-xs"
            isLoading={tool.status === ToolStatus.Loading}
            disabled={tool.status === ToolStatus.Loading}
          >
            {getButtonText()}
          </Button>
          <Button variant="ghost" onClick={handleCustomize} className="w-full text-xs">{getText("CUSTOMIZE_BUTTON")}</Button>
        </div>
        <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-cyber-accent/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-500 ease-out"></div>
      </GlassCard>
    </Tooltip>
  );
};

export const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  if (!appContext) return <div className="text-center text-cyber-action font-bold p-10">Loading context...</div>;
  const { getText, toolCategories, addToast } = appContext;

  const category = useMemo(() => toolCategories.find(cat => cat.id === categoryId), [categoryId, toolCategories]);
  
  const localTools = category?.tools || [];


  useEffect(() => {
    if (category) {
      addToast(getText("EXPLORING_CATEGORY_MSG", { categoryName: category.name }) || `Exploring ${category.name}`, ToastType.Info);
    } else {
      addToast(getText("CATEGORY_NOT_FOUND_MSG", { categoryIdValue: categoryId }) || `Category ${categoryId} not found.`, ToastType.Error);
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoryId, navigate, addToast, getText]); // Add getText to dependencies

  if (!category) {
    return <div className="text-center text-cyber-action font-bold p-10">{getText('CATEGORY_NOT_FOUND_REDIRECTING_MSG') || 'Category not found. Redirecting...'}</div>;
  }
  
  const filteredTools = useMemo(() => {
    if (!searchTerm) return localTools;
    return localTools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localTools, searchTerm]);


  return (
    <div className="space-y-6 animate-fadeIn">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> {getText('BACK_TO_DASHBOARD_BUTTON') || 'Back to Dashboard'}
      </Button>
      <header className="text-center">
        <h1 className="text-4xl font-orbitron font-bold text-text-main mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent">
            {category.name}
          </span>
        </h1>
        <p className="text-md text-text-muted max-w-2xl mx-auto">
          {getText("CATEGORY_DETAIL_TITLE_PREFIX")} <span className="font-semibold text-cyber-accent">{category.name}</span> {getText("CATEGORY_DETAIL_TITLE_SUFFIX")}
        </p>
      </header>

      <AdvancedSearchBar onSearch={setSearchTerm} />
      
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} categoryId={category.id} />
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-10">
            <p className="text-xl text-text-muted">{getText('NO_TOOLS_FOUND_MSG', { searchTermValue: searchTerm }) || `No tools found matching "${searchTerm}". Try a different search.`}</p>
        </GlassCard>
      )}
    </div>
  );
};
