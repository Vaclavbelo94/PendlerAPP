
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  Crown,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { modernNavigationItems, getCategoryItems } from './modernNavigationData';

interface CompactMobileSidebarProps {
  closeSidebar: () => void;
}

export const CompactMobileSidebar: React.FC<CompactMobileSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isAdminUser = user?.email === 'admin@pendlerapp.com' || isAdmin;

  const handleLogout = async () => {
    await signOut();
    closeSidebar();
  };

  const handleLinkClick = () => {
    closeSidebar();
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const getFilteredItems = (category: string) => {
    return getCategoryItems(category).filter(item => {
      if (item.isAdmin && !isAdminUser) return false;
      if (item.requiresAuth && !user) return false;
      return item.isPublic || (item.requiresAuth && user) || (item.isPremium && (isPremium || isAdminUser));
    });
  };

  const allItems = [
    ...getFilteredItems('main'),
    ...getFilteredItems('tools'),
    ...getFilteredItems('support'),
    ...(isAdminUser ? getFilteredItems('admin') : [])
  ];

  const CompactIcon = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Link 
          to={item.href} 
          onClick={handleLinkClick}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-h-[60px] relative",
            isActive 
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg" 
              : "bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 hover:text-gray-900"
          )}
        >
          <Icon className="h-6 w-6" />
          <span className="text-xs font-medium mt-1 text-center leading-tight">
            {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
          </span>
          {item.isPremium && isPremium && (
            <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 bg-white rounded-full p-0.5" />
          )}
        </Link>
      </motion.div>
    );
  };

  const ExpandedView = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
        <h3 className="text-lg font-semibold text-gray-900">Navigace</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpandToggle}
          className="text-gray-600"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
        {allItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                  : "bg-white/60 hover:bg-white/80 text-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {item.isPremium && isPremium && (
                <Crown className="h-4 w-4 text-amber-500 ml-auto" />
              )}
              {item.isAdmin && (
                <Badge variant="destructive" className="text-xs ml-auto">
                  Admin
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-50 w-48 bg-gradient-to-b from-blue-50 to-purple-50 shadow-xl relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">Menu</span>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandToggle}
            className="text-gray-600 p-1"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            className="text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User section */}
      <div className="p-3 bg-white/60 border-b">
        {user ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user.user_metadata?.username || 'User'}
              </p>
              <div className="flex gap-1">
                {isPremium && (
                  <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1">
                    Pro
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button asChild size="sm" className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600">
              <Link to="/register" onClick={handleLinkClick}>
                <UserPlus className="h-3 w-3 mr-1" />
                Registrovat
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Grid */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {allItems.slice(0, 8).map((item) => (
            <CompactIcon key={item.id} item={item} />
          ))}
        </div>
        
        {allItems.length > 8 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExpandToggle}
            className="w-full mt-3 text-xs"
          >
            Zobrazit vše ({allItems.length - 8} více)
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-white/60">
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-xs text-red-600 hover:text-red-700"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Odhlásit
          </Button>
        )}
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {isExpanded && <ExpandedView />}
      </AnimatePresence>
    </motion.div>
  );
};
