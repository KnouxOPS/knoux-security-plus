
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { LiveOperation, ToolStatus, ToastType } from '../types';
import { GlassCard, Button, ProgressBar, Modal, AdvancedSearchBar, Tooltip } from './Common';
import { PlayIcon, PauseIcon, StopIcon, DocumentMagnifyingGlassIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const OperationsTable: React.FC<{ operations: LiveOperation[], onAction: (opId: string, action: 'pause' | 'stop' | 'view_log' | 'force_stop') => void }> = ({ operations, onAction }) => {
  const { getText } = useContext(AppContext)!;
  if (operations.length === 0) {
    return (
      <GlassCard className="text-center py-10">
        <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-cyber-primary mb-4"/>
        <p className="text-xl text-text-muted">{getText("NO_ACTIVE_TOOLS_ALERT")}</p>
      </GlassCard>
    );
  }
  
  const getStatusRowClass = (status: ToolStatus) => {
    if (status === ToolStatus.Running) return 'bg-cyber-action/10 animate-pulse';
    if (status === ToolStatus.Error) return 'bg-red-700/20';
    if (status === ToolStatus.Completed) return 'bg-green-700/10';
    return 'bg-cyber-surface/50';
  };

  return (
    <div className="overflow-x-auto scrollable-content glass-card p-0 dynamic-border-glow">
      <table className="min-w-full divide-y divide-cyber-border">
        <thead className="bg-cyber-surface/80">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_TOOL")}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_TASK")}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_STATUS")}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_PROGRESS")}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_TIME")}</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-orbitron text-cyber-accent uppercase tracking-wider">{getText("OP_COL_ACTIONS")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyber-border/50">
          {operations.map((op) => (
            <tr key={op.id} className={`hover:bg-cyber-primary/20 transition-colors ${getStatusRowClass(op.status)}`}>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  {op.toolIcon && <op.toolIcon className="h-6 w-6 mr-2 text-cyber-accent flex-shrink-0" />}
                  <span className="text-sm font-medium text-text-main">{op.toolName}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted max-w-xs truncate" title={op.taskDescription}>{op.taskDescription}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${op.status === ToolStatus.Completed ? 'bg-green-500/30 text-green-300' : 
                    op.status === ToolStatus.Running ? 'bg-cyber-action/30 text-orange-300 animate-pulse' : 
                    op.status === ToolStatus.Error ? 'bg-red-500/30 text-red-300' : 
                    'bg-gray-500/30 text-text-muted'}`}>
                  {getText(`STATUS_${op.status.toUpperCase()}`) || op.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <ProgressBar progress={op.progress} status={op.status} small />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-text-muted">
                <div>{getText('START_TIME_LABEL') || 'Start'}: {new Date(op.startTime).toLocaleString()}</div>
                {op.endTime && <div>{getText('END_TIME_LABEL') || 'End'}: {new Date(op.endTime).toLocaleString()}</div>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                <Tooltip text={getText("VIEW_LOG_BUTTON")}>
                    <Button variant="ghost" onClick={() => onAction(op.id, 'view_log')} className="p-1.5"><DocumentMagnifyingGlassIcon className="h-4 w-4"/></Button>
                </Tooltip>
                {op.status === ToolStatus.Running && (
                  <>
                    <Tooltip text={getText("PAUSE_BUTTON")}>
                        <Button variant="ghost" onClick={() => onAction(op.id, 'pause')} className="p-1.5"><PauseIcon className="h-4 w-4"/></Button>
                    </Tooltip>
                    <Tooltip text={getText("STOP_BUTTON")}>
                        <Button variant="ghost" onClick={() => onAction(op.id, 'stop')} className="p-1.5"><StopIcon className="h-4 w-4"/></Button>
                    </Tooltip>
                  </>
                )}
                 {(op.status === ToolStatus.Completed || op.status === ToolStatus.Error) && (
                    <Tooltip text={getText('CLEAR_OPERATION_TOOLTIP') || "Clear Operation"}>
                        <Button variant="ghost" onClick={() => onAction(op.id, 'force_stop')} className="p-1.5 text-red-400 hover:text-red-300"><TrashIcon className="h-4 w-4"/></Button>
                    </Tooltip>
                 )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LogViewerModal: React.FC<{ isOpen: boolean, onClose: () => void, logs: string[], toolName: string }> = ({ isOpen, onClose, logs, toolName }) => {
  const { getText } = useContext(AppContext)!;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${getText('LIVE_LOGS_MODAL_TITLE_PREFIX') || 'Live Logs'}: ${toolName}`} size="lg">
      <div className="bg-black/80 p-4 rounded-md h-[60vh] overflow-y-auto scrollable-content font-firacode text-xs text-text-main border border-cyber-border">
        {logs.map((log, index) => (
          <p key={index} className="whitespace-pre-wrap leading-relaxed">{log}</p>
        ))}
        {logs.length === 0 && <p>{getText('NO_LOGS_YET_MSG') || 'No logs yet for this operation.'}</p>}
      </div>
    </Modal>
  );
};

export const LiveOperationsPage: React.FC = () => {
  const { operations, updateOperation, addToast, getText } = useContext(AppContext)!;
  const [selectedOpLogs, setSelectedOpLogs] = useState<string[] | null>(null);
  const [logViewToolName, setLogViewToolName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleOperationAction = (opId: string, action: 'pause' | 'stop' | 'view_log' | 'force_stop') => {
    const op = operations.find(o => o.id === opId);
    if (!op) return;

    switch (action) {
      case 'pause':
        updateOperation(opId, { status: ToolStatus.ReadyToRun }); 
        addToast(getText('TOOL_OPERATION_PAUSED_MSG', {toolName: op.toolName}) || `${op.toolName} operation paused.`, ToastType.Info);
        break;
      case 'stop':
        updateOperation(opId, { status: ToolStatus.Error, endTime: new Date() }); 
        addToast(getText('TOOL_OPERATION_STOPPED_MSG', {toolName: op.toolName}) || `${op.toolName} operation stopped by user.`, ToastType.Warning);
        break;
      case 'force_stop': 
        updateOperation(opId, { status: ToolStatus.Completed, logs: [...op.logs, `[${new Date().toLocaleTimeString()}] ${getText('OPERATION_CLEARED_BY_USER_LOG') || 'Operation cleared by user.'}`] }); 
        addToast(getText('TOOL_OPERATION_CLEARED_MSG', {toolName: op.toolName}) || `${op.toolName} operation entry cleared.`, ToastType.Info);
        break;
      case 'view_log':
        setSelectedOpLogs(op.logs);
        setLogViewToolName(op.toolName);
        break;
    }
  };
  
  const filteredOperations = useMemo(() => {
    if (!searchTerm) return operations;
    return operations.filter(op => 
      op.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [operations, searchTerm]);

  const completedTasks = operations.filter(op => op.status === ToolStatus.Completed).length;
  const runningTasks = operations.filter(op => op.status === ToolStatus.Running).length;
  const errorTasks = operations.filter(op => op.status === ToolStatus.Error).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-text-main mb-2">
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent">
            {getText("LIVE_OPERATIONS_TITLE")}
          </span>
        </h1>
        <p className="text-md text-text-muted max-w-2xl mx-auto">{getText("LIVE_OPERATIONS_SUBTITLE")}</p>
      </header>

      <AdvancedSearchBar onSearch={setSearchTerm} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="text-center">
            <h4 className="font-orbitron text-cyber-accent">{getText('COMPLETED_TASKS_CHART_LABEL') || 'Completed'}</h4>
            <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
        </GlassCard>
        <GlassCard className="text-center">
            <h4 className="font-orbitron text-cyber-accent">{getText('RUNNING_TASKS_CHART_LABEL') || 'Running'}</h4>
            <p className="text-3xl font-bold text-orange-400 animate-pulse">{runningTasks}</p>
        </GlassCard>
        <GlassCard className="text-center">
            <h4 className="font-orbitron text-cyber-accent">{getText('ERROR_TASKS_CHART_LABEL') || 'Errors'}</h4>
            <p className="text-3xl font-bold text-red-500">{errorTasks}</p>
        </GlassCard>
      </div>

      <OperationsTable operations={filteredOperations} onAction={handleOperationAction} />
      
      {selectedOpLogs && (
        <LogViewerModal 
          isOpen={!!selectedOpLogs} 
          onClose={() => setSelectedOpLogs(null)} 
          logs={selectedOpLogs}
          toolName={logViewToolName}
        />
      )}
    </div>
  );
};
