
import React from 'react';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  FileText,
  Activity,
  Key,
  Crown,
  RefreshCw,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface AdminNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  variant?: 'primary' | 'secondary';
}

const getPrimarySections = (t: any) => [
  {
    id: 'dashboard',
    icon: BarChart3,
    label: t('dashboard.label'),
    description: t('dashboard.description')
  },
  {
    id: 'users-list',
    icon: Users,
    label: t('users.label'),
    description: t('users.description')
  },
  {
    id: 'premium-features',
    icon: Crown,
    label: t('premium.label'),
    description: t('premium.description')
  },
  {
    id: 'system-monitoring',
    icon: Activity,
    label: t('monitoring.label'),
    description: t('monitoring.description')
  }
];

const getSecondarySections = (t: any) => [
  {
    id: 'users-activity',
    icon: Activity,
    label: t('usersActivity.label'),
    description: t('usersActivity.description')
  },
  {
    id: 'promo-codes',
    icon: Key,
    label: t('promoCodes.label'),
    description: t('promoCodes.description')
  },
  {
    id: 'ad-management',
    icon: Eye,
    label: t('adManagement.label'),
    description: t('adManagement.description')
  },
  {
    id: 'password-reset',
    icon: RefreshCw,
    label: t('passwordReset.label'),
    description: t('passwordReset.description')
  },
  {
    id: 'database',
    icon: Database,
    label: t('database.label'),
    description: t('database.description')
  },
  {
    id: 'system-logs',
    icon: FileText,
    label: t('systemLogs.label'),
    description: t('systemLogs.description')
  }
];

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeSection,
  onSectionChange,
  variant = 'primary'
}) => {
  const { t } = useTranslation('admin-nav');
  const sections = variant === 'primary' 
    ? getPrimarySections(t) 
    : getSecondarySections(t);
  
  return (
    <div className="flex justify-center">
      <div className={cn(
        "grid gap-4 w-full",
        variant === 'primary' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-6 max-w-7xl"
      )}>
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "relative p-4 md:p-6 rounded-2xl border text-center transition-all duration-300 group",
                "hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-lg" 
                  : "bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20"
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
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"
                  layoutId={`activeAdminTab-${variant}`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-3",
                    isActive 
                      ? "bg-gradient-to-br from-primary/20 to-accent/20 text-primary" 
                      : "bg-gradient-to-br from-muted/50 to-muted/30 text-muted-foreground group-hover:from-primary/10 group-hover:to-accent/10 group-hover:text-primary"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
                
                <h3 className={cn(
                  "font-semibold text-lg transition-colors duration-300 mb-2",
                  isActive 
                    ? "text-primary" 
                    : "text-foreground group-hover:text-primary"
                )}>
                  {section.label}
                </h3>
                
                <p className={cn(
                  "text-sm transition-colors duration-300",
                  isActive 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {section.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;
