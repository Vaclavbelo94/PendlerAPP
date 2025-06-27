
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SidebarUserSectionProps {
  collapsed: boolean;
}

const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ collapsed }) => {
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation('common');

  const displayName = user?.email?.split('@')[0] || t('user');
  const isPremium = unifiedUser?.isPremium || false;

  return (
    <div className="p-4 border-t border-border">
      <AnimatePresence mode="wait">
        {!collapsed ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* User Info Card */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
              <div className="relative">
                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                {isPremium && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-50 p-1 rounded-full">
                    <Crown className="h-2 w-2" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPremium ? t('premiumAccount') : t('freeAccount')}
                </p>
              </div>
            </div>

            {/* Upgrade Button (if not premium) */}
            {!isPremium && (
              <Button
                size="sm"
                className={cn(
                  "w-full bg-gradient-to-r from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "shadow-md hover:shadow-lg transition-all duration-200"
                )}
              >
                <Crown className="h-3 w-3 mr-2" />
                {t('upgradeToPremium')}
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="bg-primary text-primary-foreground p-2 rounded-full">
                <User className="h-4 w-4" />
              </div>
              {isPremium && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-50 p-1 rounded-full">
                  <Crown className="h-2 w-2" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarUserSection;
