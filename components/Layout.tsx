
import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS as RAW_NAV_ITEMS, SMART_TOGGLES_DATA, TOOL_CATEGORIES as RAW_TOOL_CATEGORIES } from '../constants'; 
import { KNOX_LOGO_URL, SmartToggleType, ToolStatus, ToastType, Language, Theme } from '../types';
import { UserCircleIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon, LanguageIcon as LangSwitchIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../App';

interface LayoutProps {
  children: React.ReactNode;
}

const KNOX_USER_AVATAR = "https://picsum.photos/seed/knoxuser/100/100"; 

export const DynamicBackground: React.FC = () => {
  const [particles, setParticles] = useState<{ x: number, y: number, size: number, opacity: number, color: string }[]>([]);
  const { theme } = useContext(AppContext)!;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: theme === 'dark' 
          ? ['#8A2BE2', '#FF00FF', '#00FFFF'][Math.floor(Math.random() * 3)] // Purple, Pink, Cyan for dark
          : ['#6A1B9A', '#D81B60', '#00ACC1'][Math.floor(Math.random() * 3)] // Deeper versions for light
      }));
      setParticles(newParticles);
    };
    generateParticles(); 
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            animationDuration: `${Math.random() * 10 + 10}s`, 
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
       <div className="absolute inset-0 bg-gradient-to-br from-cyber-bg via-transparent to-cyber-bg opacity-50"></div>
    </div>
  );
};


const TopBar: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null; 
  const { addToast, getText } = appContext;

  const [smartToggles, setSmartToggles] = useState<SmartToggleType[]>(SMART_TOGGLES_DATA.map(t => ({
      ...t,
      label: getText(t.label) || t.label,
      statusText: getText(t.statusText || `${t.label} ${t.active ? 'On':'Off'}`) || `${t.label} ${t.active ? 'On':'Off'}`
  })));

  useEffect(() => { // Update toggles if language changes
    setSmartToggles(SMART_TOGGLES_DATA.map(t => ({
      ...t,
      label: getText(t.label) || t.label,
      statusText: getText(t.statusText || `${t.label} ${t.active ? 'On':'Off'}`) || `${t.label} ${t.active ? 'On':'Off'}`
    })));
  }, [getText]);


  const toggleSmartFeature = (id: SmartToggleType['id']) => {
    setSmartToggles(prev => prev.map(toggle => {
      if (toggle.id === id) {
        const newActiveState = !toggle.active;
        let newStatusTextKey = '';
        if (id === 'vpn') newStatusTextKey = `vpn_status_${newActiveState ? 'on' : 'off'}`; // Example key
        else if (id === 'maxmode') newStatusTextKey = `maxmode_status_${newActiveState ? 'on' : 'off'}`;
        else if (id === 'autopilot') newStatusTextKey = `autopilot_status_${newActiveState ? 'on' : 'off'}`;
        
        const statusText = getText(newStatusTextKey) || `${getText(toggle.label)} ${newActiveState ? getText('ON_STATUS') || 'On' : getText('OFF_STATUS') || 'Off'}`;
        
        addToast(`${getText(toggle.label)} ${newActiveState ? getText('ACTIVATED_STATUS') || 'Activated' : getText('DEACTIVATED_STATUS') || 'Deactivated'}`, 
                 newActiveState ? ToastType.Success : ToastType.Info);
        return { ...toggle, active: newActiveState, statusText: statusText };
      }
      return toggle;
    }));
  };
  
  return (
    <header className="sticky top-0 z-40 h-20 bg-cyber-surface/80 backdrop-blur-md border-b border-cyber-border flex items-center justify-between px-6 shadow-xl">
      <Link to="/" className="flex items-center space-x-3">
        <img src={KNOX_LOGO_URL} alt="KNOX Logo" className="h-10 w-auto animate-subtleGlow" />
        <span className="font-orbitron text-2xl font-bold text-text-main tracking-wider">KNOX <span className="text-cyber-accent">Shield</span></span>
      </Link>
      <div className="flex items-center space-x-4">
        {smartToggles.map(toggle => (
           <button 
             key={toggle.id}
             onClick={() => toggleSmartFeature(toggle.id)}
             className={`p-2 rounded-lg glass-card dynamic-border-glow flex items-center space-x-2 transition-all duration-300 hover:shadow-neon-glow-md ${toggle.active ? 'bg-cyber-accent/30 text-cyber-accent' : 'text-text-muted hover:text-text-main'}`}
             title={getText(toggle.label)}
           >
             <toggle.icon className={`h-5 w-5 ${toggle.active ? 'text-cyber-accent animate-pulse' : ''}`} />
             <span className="text-xs font-poppins hidden md:inline">{toggle.statusText}</span>
           </button>
        ))}
        <div className="relative group">
           <img src={KNOX_USER_AVATAR} alt="User Avatar" className="h-10 w-10 rounded-full border-2 border-cyber-accent cursor-pointer group-hover:shadow-neon-glow-md transition-all duration-300 animate-pulse"/>
           <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 border-cyber-accent animate-ping opacity-50 group-hover:opacity-75"></div>
           <div className="absolute right-0 mt-12 w-48 bg-cyber-surface/90 backdrop-blur-md border border-cyber-border rounded-md shadow-lg py-1 hidden group-hover:block">
             <a href="#profile" className="block px-4 py-2 text-sm text-text-muted hover:bg-cyber-primary/30 hover:text-text-main">Profile</a>
             <a href="#logout" className="block px-4 py-2 text-sm text-text-muted hover:bg-cyber-primary/30 hover:text-text-main">Logout</a>
           </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC<{isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}> = ({isOpen, setIsOpen}) => {
  const location = useLocation();
  const appContext = useContext(AppContext);
  if (!appContext) return null;
  const { allTools, getText, toolCategories } = appContext;
  
  const activeToolsCount = allTools.filter(t => t.status === ToolStatus.Running).length;

  const NAV_ITEMS = RAW_NAV_ITEMS.map(item => ({
      ...item,
      name: getText(item.i18nKey) || item.name // Translate Nav Item Name
  }));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('/category/')) {
        return location.pathname.startsWith(path);
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-cyber-surface/90 backdrop-blur-lg border-r border-cyber-border shadow-2xl transform transition-transform duration-300 ease-in-out scrollable-content
                        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]`}>
        <div className="p-4">
          <p className="text-sm text-text-muted mb-2 font-orbitron">{getText('NAVIGATION_TITLE') || 'NAVIGATION'}</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} 
                className={({ isActive: navIsActive }) => 
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out
                   hover:bg-cyber-accent/20 hover:text-cyber-accent hover:shadow-neon-glow-sm
                   ${isActive(item.path) 
                     ? 'bg-cyber-accent/20 text-cyber-accent shadow-neon-glow-sm font-semibold' 
                     : 'text-text-muted'}`
                }
              >
                <item.icon className={`h-5 w-5 mr-3 ${ isActive(item.path) ? 'animate-pulse' : ''}`} />
                {item.name}
                {item.i18nKey === 'LIVE_OPERATIONS_TITLE' && activeToolsCount > 0 && (
                  <span className="ml-auto inline-block py-0.5 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-cyber-action text-white rounded-full text-xs animate-pulse">
                    {activeToolsCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-4 left-4 right-4 p-4 glass-card">
          <h4 className="font-orbitron text-cyber-accent">{getText('KNOX_STATS_TITLE') || 'KNOX Stats'}</h4>
          <p className="text-xs text-text-muted">{getText('TOTAL_TOOLS_STAT') || 'Total Tools'}: {allTools.length}</p>
          <p className="text-xs text-text-muted">{getText('CATEGORIES_STAT') || 'Categories'}: {toolCategories.length}</p> 
          <p className="text-xs text-text-muted">{getText('ACTIVE_OPERATIONS_STAT') || 'Active Operations'}: {activeToolsCount}</p>
        </div>
      </aside>
    </>
  );
};

const Footer: React.FC = () => {
    const appContext = useContext(AppContext);
    if (!appContext) return null;
    const { getText, language, setLanguage, theme, setTheme } = appContext;

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    
    const appVersionText = getText("APP_VERSION", { version: "1.3.0" });


    return (
        <footer className="h-16 md:h-12 bg-cyber-surface/80 backdrop-blur-md border-t border-cyber-border flex flex-col md:flex-row items-center justify-between px-6 text-xs text-text-muted">
            <p className="mb-2 md:mb-0">{getText("FOOTER_TEXT_LEFT")}</p>
            <div className="flex items-center space-x-3 md:space-x-4">
                <button onClick={toggleTheme} title={getText(theme === 'dark' ? "SWITCH_TO_LIGHT_MODE" : "SWITCH_TO_DARK_MODE")} className="hover:text-cyber-accent transition-colors p-1">
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button onClick={toggleLanguage} title={getText(language === 'en' ? "SWITCH_TO_ARABIC" : "SWITCH_TO_ENGLISH")} className="hover:text-cyber-accent transition-colors p-1">
                    <LangSwitchIcon className="h-5 w-5"/>
                </button>
                <p>{appVersionText}</p>
                <Link to="/support" className="hover:text-cyber-accent transition-colors">{getText("Quick Support") || "Quick Support"}</Link>
            </div>
        </footer>
    );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const appContext = useContext(AppContext);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!appContext) return <div className="text-center text-lg p-10">Initializing KNOX Core...</div>;
  const { getText } = appContext;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto scrollable-content relative">
           <button 
            className="lg:hidden fixed top-24 left-4 z-[60] p-2 rounded-md bg-cyber-accent/50 text-white hover:bg-cyber-accent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={getText(sidebarOpen ? 'CLOSE_SIDEBAR_ARIA' : 'OPEN_SIDEBAR_ARIA') || (sidebarOpen ? "Close sidebar" : "Open sidebar")}
          >
            {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
