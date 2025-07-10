
import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database,
  Shield,
  Smartphone,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface ModernSettingsNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ModernSettingsNavigation: React.FC<ModernSettingsNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('settings');

  const settingsTabs = [
    {
      id: 'general',
      icon: SettingsIcon,
      label: t('general'),
      description: t('basicSettings')
    },
    {
      id: 'account',
      icon: User,
      label: t('account'),
      description: t('accountInfo')
    },
    {
      id: 'appearance',
      icon: Palette,
      label: t('appearance'),
      description: t('display')
    },
    {
      id: 'notifications',
      icon: Bell,
      label: t('notifications'),
      description: t('shiftNotifications')
    },
    {
      id: 'language',
      icon: Globe,
      label: t('language'),
      description: t('languageSettings')
    },
    {
      id: 'security',
      icon: Shield,
      label: t('security'),
      description: t('privacy')
    },
    {
      id: 'device',
      icon: Smartphone,
      label: t('device'),
      description: t('system')
    },
    {
      id: 'data',
      icon: Database,
      label: t('data'),
      description: t('dataManagement')
    },
    {
      id: 'shifts',
      icon: Clock,
      label: 'Směny',
      description: 'Generování a správa směn'
    }
  ];

  return (
    <div className="flex justify-center">
      <div className={cn(
        "grid gap-4 w-full max-w-6xl",
        isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
      )}>
        {settingsTabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative p-4 md:p-6 rounded-2xl text-center transition-all duration-300 group",
                "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg" 
                  : "bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background gradient for active state */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"
                  layoutId="activeSettingsTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3",
                    isActive 
                      ? "bg-white/30 text-white" 
                      : "bg-white/10 text-white/80 group-hover:bg-white/20 group-hover:text-white"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
                
                <h3 className={cn(
                  "font-semibold transition-colors duration-300 mb-2",
                  isMobile ? "text-sm" : "text-lg",
                  isActive 
                    ? "text-white" 
                    : "text-white/90 group-hover:text-white"
                )}>
                  {tab.label}
                </h3>
                
                <p className={cn(
                  "transition-colors duration-300",
                  isMobile ? "text-xs" : "text-sm",
                  isActive 
                    ? "text-white/80" 
                    : "text-white/70 group-hover:text-white/80"
                )}>
                  {tab.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ModernSettingsNavigation;
