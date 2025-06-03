
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  Crown,
  Lock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { modernNavigationItems, getCategoryItems, getCategoryTitle } from './modernNavigationData';

interface ModernMobileSidebarProps {
  closeSidebar: () => void;
}

export const ModernMobileSidebar: React.FC<ModernMobileSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  
  const isAdminUser = user?.email === 'admin@pendlerapp.com' || isAdmin;

  const handleLogout = async () => {
    await signOut();
    closeSidebar();
  };

  const handleLinkClick = () => {
    closeSidebar();
  };

  const getFilteredItems = (category: string) => {
    return getCategoryItems(category).filter(item => {
      if (item.isAdmin && !isAdminUser) return false;
      if (item.requiresAuth && !user) return false;
      if (item.isPremium && !isPremium && !isAdminUser) return true; // Show with lock
      return item.isPublic || (item.requiresAuth && user) || (item.isPremium && (isPremium || isAdminUser));
    });
  };

  const NavigationCard = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.href;
    const needsPremium = item.isPremium && !isPremium && !isAdminUser;
    const Icon = item.icon;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className={cn(
          "relative overflow-hidden border-0 shadow-lg transition-all duration-300",
          isActive 
            ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl" 
            : "bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl"
        )}>
          <CardContent className="p-4">
            <Link 
              to={item.href} 
              className="block"
              onClick={handleLinkClick}
            >
              <div className="flex items-center space-x-3">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? "bg-white/20" 
                    : `bg-gradient-to-r ${item.gradient}`
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-white" : "text-white"
                  )} />
                  {needsPremium && (
                    <Lock className="absolute top-1 right-1 h-3 w-3 text-amber-500 bg-white rounded-full p-0.5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn(
                      "font-semibold",
                      isActive ? "text-white" : "text-gray-900"
                    )}>
                      {item.label}
                    </h3>
                    {item.isPremium && isPremium && (
                      <Crown className="h-4 w-4 text-amber-500" />
                    )}
                    {item.isAdmin && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    isActive ? "text-white/80" : "text-gray-600"
                  )}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const CategorySection = ({ category }: { category: string }) => {
    const items = getFilteredItems(category);
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold text-gray-900 mb-4 flex items-center"
        >
          {getCategoryTitle(category)}
          {category === 'admin' && <Crown className="ml-2 h-5 w-5 text-amber-500" />}
        </motion.h3>
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavigationCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-purple-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">PA</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">PendlerApp</h2>
            <p className="text-sm text-gray-600">Mobilní verze</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={closeSidebar}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* User section */}
        {user ? (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    {isPremium && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                        Premium
                      </Badge>
                    )}
                    {isAdminUser && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/register" onClick={handleLinkClick}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registrovat se
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" onClick={handleLinkClick}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Přihlásit se
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <CategorySection category="main" />
        <CategorySection category="tools" />
        <CategorySection category="support" />
        {isAdminUser && <CategorySection category="admin" />}

        {/* Logout button */}
        {user && (
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Odhlásit se
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};
