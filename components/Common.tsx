
import React, { useState, useEffect, useRef, useContext } from 'react'; // Added useContext
import { ToastMessage, ToastType, ExportFormat, EXPORT_FORMATS, ToolStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon, DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../App'; // Added AppContext

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'action' | 'ghost';
  glow?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', glow = true, icon, className, isLoading, ...props }) => {
  const { theme } = useContext(AppContext)!;
  const baseStyle = "px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = "";
  // Default text color for dark theme
  let textColor = 'text-white';
  if (theme === 'light') {
    // Specific text colors for light theme buttons
    if (variant === 'primary' || variant === 'secondary' || variant === 'action') {
      textColor = 'text-white'; // Keep white for solid backgrounds
    } else { // ghost
      textColor = 'text-cyber-accent'; // Accent color for ghost
    }
  }


  switch (variant) {
    case 'primary':
      variantStyle = `bg-cyber-primary ${textColor} hover:bg-purple-500 focus:ring-cyber-primary`;
      if (glow) variantStyle += " shadow-lg hover:shadow-neon-glow-md";
      break;
    case 'secondary':
      variantStyle = `bg-cyber-accent ${theme === 'dark' ? 'text-cyber-bg' : 'text-white'} hover:bg-cyan-300 focus:ring-cyber-accent`;
      if (glow) variantStyle += " shadow-lg hover:shadow-neon-glow-md";
      break;
    case 'action':
      variantStyle = `bg-cyber-action ${textColor} hover:bg-orange-400 focus:ring-cyber-action`;
      if (glow) variantStyle += " shadow-lg hover:shadow-neon-glow-action";
      break;
    case 'ghost':
      variantStyle = `bg-transparent border border-cyber-accent text-cyber-accent hover:bg-cyber-accent/20 focus:ring-cyber-accent`;
      break;
  }
  // For light theme, ensure ghost button text is cyber-accent
  if (theme === 'light' && variant === 'ghost') {
    variantStyle = `bg-transparent border border-cyber-accent text-cyber-accent hover:bg-cyber-accent/20 focus:ring-cyber-accent`;
  }


  return (
    <button className={`${baseStyle} ${variantStyle} ${className || ''}`} {...props} disabled={props.disabled || isLoading}>
      {isLoading && <Spinner className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-white' : 'text-cyber-primary'}`}/>}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// GlassCard Component
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean; 
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick, interactive }) => {
  return (
    <div 
      className={`glass-card p-4 md:p-6 shadow-xl transition-all duration-300 ${interactive ? 'hover:scale-105 hover:shadow-neon-glow-lg cursor-pointer' : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  let sizeClasses = "max-w-md"; 
  if (size === 'sm') sizeClasses = "max-w-sm";
  if (size === 'lg') sizeClasses = "max-w-lg";
  if (size === 'xl') sizeClasses = "max-w-xl md:max-w-2xl lg:max-w-4xl";
  if (size === 'full') sizeClasses = "max-w-full h-full";


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <GlassCard className={`w-full ${sizeClasses} relative max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-cyber-border">
          <h3 className="text-xl font-orbitron text-cyber-accent">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <XCircleIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="p-4 md:p-6 flex-grow overflow-y-auto scrollable-content">
          {children}
        </div>
      </GlassCard>
    </div>
  );
};

// Icon Component 
interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: (props: React.SVGProps<SVGSVGElement> & { title?: string | undefined; titleId?: string | undefined; }) => React.ReactNode; 
  className?: string;
}
export const Icon: React.FC<IconProps> = ({ icon: HeroiconComponent, className, ...props }) => {
  return <HeroiconComponent className={`h-6 w-6 ${className || ''}`} {...props} />;
};


// Tooltip Component
interface TooltipProps {
  text: string;
  children: React.ReactElement; 
}
export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX, y: rect.top - 10 });
    }
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (visible && tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let newX = e.clientX + 15;
        let newY = e.clientY - 5; 

        if (newX + tooltipRect.width > window.innerWidth) {
            newX = e.clientX - tooltipRect.width - 15;
        }
        if ((newY - tooltipRect.height) < 0) {
            newY = e.clientY + 15 + tooltipRect.height; 
        }
        
        setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <>
      <span
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'contents' }} 
      >
        {children}
      </span>
      {visible && (
        <div
          ref={tooltipRef}
          className="fixed tooltip-knoux z-[9999] transition-opacity duration-150"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transform: 'translateY(-100%)' 
          }}
        >
          {text}
        </div>
      )}
    </>
  );
};

// ProgressBar Component
interface ProgressBarProps {
  progress: number; 
  status?: ToolStatus;
  className?: string;
  small?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, className, small }) => {
  const bgColor = status === ToolStatus.Error ? 'bg-cyber-action' : 
                  status === ToolStatus.Completed ? 'bg-green-500' : 
                  'bg-cyber-accent';
  const height = small ? 'h-1.5' : 'h-2.5';
  
  return (
    <div className={`w-full bg-text-muted/30 rounded-full ${height} ${className || ''}`}>
      <div 
        className={`${bgColor} ${height} rounded-full transition-all duration-500 ease-out ${status === ToolStatus.Running ? 'animate-pulse' : ''}`} 
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      ></div>
    </div>
  );
};


// Spinner Component
export const Spinner: React.FC<{className?: string}> = ({className}) => (
  <svg className={`animate-spin ${className || 'h-5 w-5 text-text-main'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


// Toast Notification Components
interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, icon, onClose }) => {
  const { theme } = useContext(AppContext)!;
  let bgColorClass = 'bg-cyber-primary'; 
  let textColorClass = theme === 'dark' ? 'text-white' : 'text-white'; // Default for solid backgrounds
  let IconComponent = icon || <InformationCircleIcon className={`h-6 w-6 ${textColorClass}`} />;

  switch (type) {
    case ToastType.Success:
      bgColorClass = 'bg-green-600';
      IconComponent = icon || <CheckCircleIcon className={`h-6 w-6 ${textColorClass}`} />;
      break;
    case ToastType.Error:
      bgColorClass = 'bg-cyber-action';
      IconComponent = icon || <XCircleIcon className={`h-6 w-6 ${textColorClass}`} />;
      break;
    case ToastType.Warning:
      bgColorClass = 'bg-yellow-500';
      textColorClass = 'text-black'; // Warning often has black text for contrast
      IconComponent = icon || <ExclamationTriangleIcon className={`h-6 w-6 ${textColorClass}`} />;
      break;
  }

  return (
    <div className={`glass-card ${bgColorClass} ${textColorClass} p-4 rounded-lg shadow-2xl flex items-center space-x-3 dynamic-border-glow`}>
      <div className="flex-shrink-0">{IconComponent}</div>
      <div className={`flex-grow text-sm font-medium ${textColorClass}`}>{message}</div>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 bg-transparent ${textColorClass}/70 hover:${textColorClass} rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center`}>
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-full max-w-sm space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
};


interface ExportResultsProps {
  onExport: (format: ExportFormat) => void;
  buttonText?: string;
}
export const ExportResultsDropdown: React.FC<ExportResultsProps> = ({ onExport, buttonText = "Export Results" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getText } = useContext(AppContext)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          icon={<DocumentArrowDownIcon className="h-5 w-5" />}
        >
          {getText(buttonText) || buttonText}
        </Button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-2xl glass-card ring-1 ring-cyber-accent ring-opacity-20 focus:outline-none py-1">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format}
              onClick={() => {
                onExport(format);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-text-main hover:bg-cyber-primary/30 hover:text-cyber-accent transition-colors"
            >
              {getText('EXPORT_AS_FORMAT_MSG', {exportFormat: format}) || `Export as ${format}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdvancedSearchBar: React.FC<{onSearch: (term: string) => void, onFilterChange?: (filters: any) => void}> = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { getText } = useContext(AppContext)!;
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    }
    
    return (
        <form onSubmit={handleSearch} className="w-full mb-6">
            <div className="relative">
                <input 
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={getText('SEARCH_BAR_PLACEHOLDER') || "Search tools, operations, or logs..."}
                    className="w-full p-3 pl-10 text-sm text-text-main bg-cyber-surface/70 border border-cyber-border rounded-lg focus:ring-cyber-accent focus:border-cyber-accent focus:outline-none backdrop-blur-sm placeholder-text-muted"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>
        </form>
    );
};
