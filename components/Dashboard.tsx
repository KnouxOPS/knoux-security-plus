
import React, { useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ToolCategory, ToastType } from '../types'; 
import { GlassCard, Tooltip } from './Common';
import { AppContext } from '../App';

interface CategoryCardProps {
  category: ToolCategory; // Already translated from AppContext
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  if (!appContext) return null;
  const { addToast, getText } = appContext;


  const handleClick = () => {
    navigate(`/category/${category.id}`); // Use ID for navigation
    addToast(`${getText('NAVIGATING_TO_MSG') || 'Navigating to'} ${category.name}`, ToastType.Info);
  };

  return (
    <Tooltip text={getText("TOOLTIP_TEXT")}>
      <GlassCard 
        className="group relative overflow-hidden transform transition-all duration-500 hover:!-translate-y-2 dynamic-border-glow h-full flex flex-col justify-between"
        onClick={handleClick}
        interactive={true}
      >
        <div>
          <div className="flex items-center justify-center mb-4 text-cyber-accent">
            {category.icon && <category.icon className="h-16 w-16 group-hover:animate-pulse" />}
          </div>
          <h3 className="text-2xl font-orbitron text-center text-text-main mb-2 group-hover:text-cyber-accent transition-colors duration-300">{category.name}</h3>
          <p className="text-sm text-text-muted text-center line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">{category.description}</p>
        </div>
        <div className="mt-6 text-center">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-cyber-bg bg-cyber-accent rounded-full group-hover:bg-cyber-primary group-hover:text-white transition-all duration-300">
                {category.tools.length} {getText('TOOLS_COUNT_SUFFIX') || 'Tools'}
            </span>
        </div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-cyber-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out"></div>
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyber-secondary/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 ease-out"></div>
      </GlassCard>
    </Tooltip>
  );
};

export const DashboardPage: React.FC = () => {
  const appContext = useContext(AppContext);
  
  useEffect(() => {
    if (appContext) {
        appContext.addToast(appContext.getText("WELCOME_MESSAGE"), ToastType.Info);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext?.getText]); // Depend on getText to re-show if language changes

  if (!appContext) return null; 
  const { getText, toolCategories } = appContext;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="text-center py-8">
        <h1 className="text-5xl font-orbitron font-bold text-text-main mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent animate-pulse">
            {getText("DASHBOARD_TITLE")}
          </span>
        </h1>
        <p className="text-lg text-text-muted max-w-3xl mx-auto font-poppins">{getText("DASHBOARD_SUBTITLE")}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {toolCategories.map(category => ( 
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};
