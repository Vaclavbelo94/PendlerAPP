
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Home,
  BarChart3,
  Languages,
  Calendar,
  Car,
  FileText,
  Map,
  Settings,
  Crown,
  Contact,
  HelpCircle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Shield,
  Scale,
  Lock,
  FileCheck
} from 'lucide-react';

const MobileNavigation = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const { t } = useLanguage();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const navigationItems = [
    { label: t('home'), href: '/', icon: Home, isPublic: true },
    { label: t('dashboard'), href: '/dashboard', icon: BarChart3, isPremium: true },
    { label: t('translator'), href: '/translator', icon: Languages, isPublic: true },
    { label: t('taxAdvisor'), href: '/tax-advisor', icon: FileText, isPremium: true },
    { label: t('shifts'), href: '/shifts', icon: Calendar, isPremium: true },
    { label: t('vehicle'), href: '/vehicle', icon: Car, isPremium: true },
    { label: t('travel'), href: '/travel', icon: Map, isPremium: true },
    { label: t('laws'), href: '/laws', icon: Scale, isPublic: true },
    { label: t('settings'), href: '/settings', icon: Settings, requiresAuth: true },
    { label: t('premium'), href: '/premium', icon: Crown, isPublic: true },
    { label: t('contact'), href: '/contact', icon: Contact, isPublic: true },
    { label: t('faq'), href: '/faq', icon: HelpCircle, isPublic: true },
    { label: t('privacy'), href: '/privacy', icon: Lock, isPublic: true },
    { label: t('terms'), href: '/terms', icon: FileCheck, isPublic: true }
  ];

  if (isAdmin) {
    navigationItems.push({
      label: t('admin'),
      href: '/admin',
      icon: Shield,
      requiresAuth: true
    });
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">PendlerApp</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            // Check if item should be shown
            if (item.requiresAuth && !user) return null;
            if (item.isPremium && !isPremium && user) {
              return (
                <div key={item.href} className="relative">
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                    <Lock className="h-3 w-3 ml-auto" />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.isPremium && isPremium && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {t('premium')}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Section */}
      <div className="border-t p-4">
        {user ? (
          <div className="space-y-2">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{t('profile')}</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('login')}</span>
            </Link>
            <Link
              to="/register"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>{t('register')}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
