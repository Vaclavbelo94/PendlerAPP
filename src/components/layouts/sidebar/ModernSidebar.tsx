
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calendar, 
  Car, 
  Settings, 
  BarChart3,
  Crown,
  User,
  Languages,
  FileText,
  Map,
  Scale,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const ModernSidebar = () => {
  const { user, unifiedUser } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { t: tOvertime } = useTranslation('overtime');

  const navigationItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Languages, label: t('translator'), path: '/translator' },
    { icon: Calendar, label: t('shifts'), path: '/shifts', premium: true },
    { icon: Clock, label: tOvertime('title'), path: '/overtime', premium: true },
    { icon: Car, label: t('vehicle'), path: '/vehicle', premium: true },
    { icon: Map, label: t('travel'), path: '/travel', premium: true },
    { icon: FileText, label: t('taxAdvisor'), path: '/tax-advisor', premium: true },
    { icon: Scale, label: t('laws'), path: '/laws' },
    { icon: User, label: t('profile'), path: '/profile' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="font-bold">PendlerApp</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.premium && !unifiedUser?.isPremium;
            
            return (
              <Link 
                key={item.path}
                to={isLocked ? '/premium' : item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.path) 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  isLocked && 'opacity-60'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.premium && !unifiedUser?.isPremium && (
                  <Crown className="h-3 w-3 text-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {unifiedUser?.isPremium && (
        <div className="p-4 border-t">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ModernSidebar;
