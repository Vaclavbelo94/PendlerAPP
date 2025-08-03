import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Calendar, 
  Users, 
  FileText, 
  Navigation,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface DHLEmployeeNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DHLEmployeeNavigation: React.FC<DHLEmployeeNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation('dhl-employee');

  const sections = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'timeTracking',
      label: t('navigation.timeTracking'),
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'shifts',
      label: t('navigation.shifts'),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'team',
      label: t('navigation.team'),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'documents',
      label: t('navigation.documents'),
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'travel',
      label: t('navigation.travel'),
      icon: Navigation,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="bg-card rounded-lg p-2 shadow-sm border mb-6">
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden flex overflow-x-auto space-x-2 pb-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeTab === section.id;
          
          return (
            <motion.div
              key={section.id}
              className="flex-shrink-0"
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(section.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 h-16 w-20 rounded-lg transition-all duration-200",
                  isActive 
                    ? `${section.bgColor} ${section.color} shadow-sm` 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{section.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeTab === section.id;
          
          return (
            <motion.div
              key={section.id}
              className="relative"
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                onClick={() => onTabChange(section.id)}
                className={cn(
                  "relative w-full flex flex-col items-center justify-center gap-2 h-20 transition-all duration-200",
                  isActive 
                    ? `${section.bgColor} ${section.color} shadow-sm` 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{section.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/5 rounded-md border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DHLEmployeeNavigation;