
import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationItems } from '@/data/navigationData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface UnifiedMobileSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  variant: 'overlay' | 'sheet' | 'compact';
  className?: string;
}

export const UnifiedMobileSidebar: React.FC<UnifiedMobileSidebarProps> = ({
  isOpen,
  closeSidebar,
  variant = 'overlay',
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const renderMenuItem = (item: any, level = 0) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    return (
      <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className={cn("w-full", level > 0 && "ml-4")}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start h-12 px-4 text-left",
            "hover:bg-accent/10 transition-all duration-200",
            isActive && "bg-primary/10 text-primary border-r-2 border-primary"
          )}
          onClick={() => handleNavigate(item.path)}
        >
          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
          <span className="font-medium truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </Button>
      </motion.div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Navigace</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSidebar}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navigationItems
            .filter(item => !item.adminOnly || (item.adminOnly && isAdmin))
            .map(item => renderMenuItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          {user ? `Přihlášen jako ${user.email}` : 'Nepřihlášen'}
        </div>
      </div>
    </div>
  );

  if (variant === 'overlay') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={closeSidebar}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={cn(
                "fixed top-0 left-0 h-full w-80 z-[101]",
                className
              )}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'compact') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className={cn(
              "fixed top-0 left-0 h-full w-72 z-[101]",
              className
            )}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Sheet variant
  return isOpen ? (
    <div className={cn("w-full h-full", className)}>
      {sidebarContent}
    </div>
  ) : null;
};
