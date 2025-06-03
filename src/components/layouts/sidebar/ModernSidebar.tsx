
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  Crown,
  Lock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { modernNavigationItems, getCategoryItems, getCategoryTitle } from './modernNavigationData';

interface ModernSidebarProps {
  closeSidebar?: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAdminUser = user?.email === 'admin@pendlerapp.com' || isAdmin;

  const handleLogout = async () => {
    await signOut();
    if (closeSidebar) closeSidebar();
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const getFilteredItems = (category: string) => {
    return getCategoryItems(category).filter(item => {
      if (item.isAdmin && !isAdminUser) return false;
      if (item.requiresAuth && !user) return false;
      if (item.isPremium && !isPremium && !isAdminUser) return true; // Show with lock
      return item.isPublic || (item.requiresAuth && user) || (item.isPremium && (isPremium || isAdminUser));
    });
  };

  const NavigationItem = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.href;
    const needsPremium = item.isPremium && !isPremium && !isAdminUser;
    const Icon = item.icon;

    const itemContent = (
      <motion.div
        whileHover={{ x: isCollapsed ? 0 : 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Button
          asChild
          variant="ghost"
          className={cn(
            "w-full relative overflow-hidden group border border-transparent",
            "transition-all duration-300 ease-out",
            isCollapsed ? "justify-center p-3 h-12" : "justify-start h-12 px-4",
            isActive 
              ? "bg-gradient-to-r from-white/20 to-white/10 border-white/30 shadow-lg" 
              : "hover:bg-white/10 hover:border-white/20 hover:shadow-md"
          )}
        >
          <Link 
            to={item.href} 
            className="flex items-center w-full"
            onClick={handleLinkClick}
          >
            {/* Icon with gradient background */}
            <div className={cn(
              "relative flex items-center justify-center rounded-lg transition-all duration-300",
              isCollapsed ? "w-6 h-6" : "w-8 h-8 mr-3",
              `bg-gradient-to-r ${item.gradient}`,
              isActive ? "shadow-lg" : "group-hover:shadow-md"
            )}>
              <Icon className="h-4 w-4 text-white" />
              {needsPremium && (
                <Lock className="absolute -top-1 -right-1 h-3 w-3 text-white bg-amber-500 rounded-full p-0.5" />
              )}
            </div>

            {/* Label and description */}
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-white/90 group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  {item.isPremium && isPremium && (
                    <Crown className="h-4 w-4 text-amber-400" />
                  )}
                  {item.isAdmin && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  "text-xs transition-colors duration-200",
                  isActive ? "text-white/80" : "text-white/60 group-hover:text-white/70"
                )}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        </Button>
      </motion.div>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {itemContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <div>
              <p>{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              {needsPremium && <p className="text-xs text-amber-600">Vyžaduje Premium</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return itemContent;
  };

  const CategorySection = ({ category }: { category: string }) => {
    const items = getFilteredItems(category);
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        {!isCollapsed && (
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-white/70 mb-3 px-4 flex items-center"
          >
            {getCategoryTitle(category)}
            {category === 'admin' && <Sparkles className="ml-2 h-4 w-4 text-amber-400" />}
          </motion.h3>
        )}
        <nav className="space-y-1">
          {items.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>
      </div>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-full"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90 backdrop-blur-xl border-r border-white/20" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-white/20 to-white/10 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">PA</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">PendlerApp</h2>
                  <p className="text-xs text-white/70">Moderní design</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 bg-gradient-to-r from-white/20 to-white/10 rounded-xl flex items-center justify-center mx-auto"
              >
                <span className="text-white font-bold text-lg">PA</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* User section */}
        {user ? (
          <div className="p-4 border-b border-white/20">
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "space-x-3"
            )}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {isPremium && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                        Premium
                      </Badge>
                    )}
                    {isAdminUser && (
                      <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-white/20">
            {isCollapsed ? (
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="sm" className="w-full text-white hover:bg-white/10">
                      <Link to="/login" onClick={handleLinkClick}>
                        <LogIn className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Přihlásit se</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white">
                      <Link to="/register" onClick={handleLinkClick}>
                        <UserPlus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Registrovat se</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                  <Link to="/login" onClick={handleLinkClick}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Přihlásit se
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-white/20 hover:bg-white/30 text-white">
                  <Link to="/register" onClick={handleLinkClick}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrovat se
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <CategorySection category="main" />
          <CategorySection category="tools" />
          <CategorySection category="support" />
          {isAdminUser && <CategorySection category="admin" />}
        </div>

        {/* Logout button */}
        {user && (
          <div className="p-4 border-t border-white/20">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full text-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Odhlásit se</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Odhlásit se
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
