
import React, { useContext } from 'react'; // Added useContext
import { GlassCard } from './Common';
import { CogIcon, ArrowPathIcon, LifebuoyIcon } from '@heroicons/react/24/outline'; 
import { AppContext } from '../App'; // Added AppContext

interface PagePlaceholderProps {
  titleKey: string; // Key for translation
  icon: React.ElementType;
  defaultTitle: string;
}

const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ titleKey, icon: Icon, defaultTitle }) => {
  const { getText } = useContext(AppContext)!;
  const title = getText(titleKey) || defaultTitle;
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn p-4">
      <GlassCard className="text-center p-10 md:p-16 dynamic-border-glow max-w-2xl w-full">
        <Icon className="h-20 w-20 md:h-24 md:w-24 text-cyber-primary mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl md:text-4xl font-orbitron text-text-main mb-4">{title}</h1>
        <p className="text-md md:text-lg text-text-muted">{getText('SECTION_UNDER_DEVELOPMENT_MSG_1') || 'This section is under active development by KNOX cybermancers.'}</p>
        <p className="text-md md:text-lg text-text-muted">{getText('SECTION_UNDER_DEVELOPMENT_MSG_2') || 'Advanced configurations and features coming soon!'}</p>
      </GlassCard>
    </div>
  );
};

export const SettingsPage: React.FC<{title?: string, icon?: React.ElementType, titleKey?: string}> = ({ title, icon = CogIcon, titleKey="Settings" }) => {
    const { getText } = useContext(AppContext)!;
    const pageTitle = title || getText(titleKey) || "Settings Panel";
    return <PagePlaceholder titleKey={titleKey} icon={icon} defaultTitle={pageTitle} />;
}
export const SupportPage: React.FC = () => <PagePlaceholder titleKey="Support" icon={LifebuoyIcon} defaultTitle="KNOX Support Hub" />;
export const UpdatePage: React.FC = () => <PagePlaceholder titleKey="Update" icon={ArrowPathIcon} defaultTitle="System Updates" />;
