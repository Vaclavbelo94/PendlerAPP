
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useHasPermission } from '@/hooks/useAuthPermissions';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getVisibleItems } from './modernNavigationData';

interface ModernMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernMobileSidebar: React.FC<ModernMobileSidebarProps> = ({
  isOpen,
  onClose
}) => {
  const { user, unifiedUser, signOut } = useAuth();
  const { hasPremiumAccess, hasOvertimeAccess, permissions } = useHasPermission();
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const navigationItems = getVisibleItems(
    permissions.companyType,
    !!user,
    permissions.canAccessPremiumFeatures,
    permissions.canAccessAdminPanel
  );

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar - vysouvání zprava */}
      <div className="fixed top-0 right-0 h-full w-80 bg-black text-white z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="font-bold text-white">PendlerApp</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isLocked = item.isPremium && !hasPremiumAccess();
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={isLocked ? '/premium' : item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base transition-colors ${
                    active 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  } ${isLocked ? 'opacity-60' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.isPremium && !hasPremiumAccess() && (
                    <Crown className="h-4 w-4 text-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Section */}
        {user && (
          <div className="border-t border-gray-700 p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-700 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {user.email?.split('@')[0] || 'Uživatel'}
                </p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                {hasPremiumAccess() && (
                  <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800">
                    <Crown className="h-3 w-3 mr-1" />
                    {permissions.isDHLEmployee ? 'DHL Employee' : 'Premium'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Profile Link */}
            <Link
              to="/profile"
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors ${
                isActive('/profile') ? 'bg-gray-800 text-white' : ''
              }`}
            >
              <User className="h-5 w-5" />
              <span>{t('profile')}</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Odhlásit se</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
