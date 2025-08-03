import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DHLTeamChat from './team/DHLTeamChat';
import ShiftExchangeBoard from './team/ShiftExchangeBoard';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  ArrowLeftRight,
  Bell,
  Users
} from 'lucide-react';

interface DHLTeamCommunicationProps {
  className?: string;
}

export const DHLTeamCommunication: React.FC<DHLTeamCommunicationProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const [activeTab, setActiveTab] = useState<'chat' | 'shifts' | 'announcements'>('chat');

  const tabs = [
    {
      id: 'chat',
      label: t('team.chat'),
      icon: MessageCircle,
      count: 0
    },
    {
      id: 'shifts',
      label: t('team.shiftBoard'),
      icon: ArrowLeftRight,
      count: 2
    },
    {
      id: 'announcements',
      label: t('team.announcements'),
      icon: Bell,
      count: 1
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <DHLTeamChat />;
      case 'shifts':
        return <ShiftExchangeBoard />;
      case 'announcements':
        return (
          <div className="bg-card rounded-lg p-8 border text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Týmová oznámení</h3>
            <p className="text-muted-foreground">
              Bude implementováno v další fázi
            </p>
          </div>
        );
      default:
        return <DHLTeamChat />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          {t('team.title')}
        </h1>
        <p className="text-muted-foreground">
          Komunikujte se svým týmem, vyměňujte směny a sledujte oznámení
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 sm:flex-none relative"
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
              
              {isActive && (
                <motion.div
                  layoutId="teamActiveTab"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  style={{ zIndex: -1 }}
                />
              )}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default DHLTeamCommunication;