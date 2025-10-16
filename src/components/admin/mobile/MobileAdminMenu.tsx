import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users, 
  Building2, 
  Settings,
  BarChart3,
  Shield,
  Database,
  Monitor,
  CreditCard,
  HelpCircle,
  LogOut,
  Crown,
  Eye,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/auth';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const MobileAdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unifiedUser } = useAuth();
  const { hasPermission, adminPermissions } = useAdminV2();
  const { t } = useTranslation('admin-mobile');

  const menuSections = [
    {
      title: t('menu.main'),
      items: [
        {
          id: 'dashboard',
          label: t('menu.dashboard'),
          icon: Home,
          href: '/admin/mobile',
          permission: 'viewer'
        },
        {
          id: 'users',
          label: t('menu.users'),
          icon: Users,
          href: '/admin/mobile/users',
          permission: 'moderator'
        },
        {
          id: 'companies',
          label: t('menu.companies'),
          icon: Building2,
          href: '/admin/mobile/companies',
          permission: 'admin'
        },
        {
          id: 'rideshare',
          label: t('menu.rideshare'),
          icon: Car,
          href: '/admin/mobile/rideshare',
          permission: 'moderator'
        }
      ]
    },
    {
      title: t('menu.analyticsMonitoring'),
      items: [
        {
          id: 'analytics',
          label: t('menu.analytics'),
          icon: BarChart3,
          href: '/admin/mobile/analytics',
          permission: 'viewer'
        },
        {
          id: 'monitoring',
          label: t('menu.monitoring'),
          icon: Monitor,
          href: '/admin/mobile/monitoring',
          permission: 'admin'
        }
      ]
    },
    {
      title: t('menu.system'),
      items: [
        {
          id: 'premium-codes',
          label: t('menu.premiumCodes'),
          icon: CreditCard,
          href: '/admin/mobile/premium-codes',
          permission: 'admin'
        },
        {
          id: 'security',
          label: t('menu.security'),
          icon: Shield,
          href: '/admin/mobile/security',
          permission: 'admin'
        },
        {
          id: 'database',
          label: t('menu.database'),
          icon: Database,
          href: '/admin/mobile/database',
          permission: 'super_admin'
        },
        {
          id: 'settings',
          label: t('menu.settings'),
          icon: Settings,
          href: '/admin/mobile/settings',
          permission: 'admin'
        }
      ]
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!unifiedUser?.email) return 'U';
    return unifiedUser.email.charAt(0).toUpperCase();
  };

  const getPermissionBadge = () => {
    if (!adminPermissions?.permission_level) return null;
    
    const config = {
      super_admin: { icon: Crown, labelKey: 'permissions.superAdmin', color: 'text-red-500' },
      admin: { icon: Shield, labelKey: 'permissions.admin', color: 'text-orange-500' },
      dhl_admin: { icon: Building2, labelKey: 'permissions.dhlAdmin', color: 'text-yellow-500' },
      moderator: { icon: Users, labelKey: 'permissions.moderator', color: 'text-blue-500' },
      viewer: { icon: Eye, labelKey: 'permissions.viewer', color: 'text-green-500' }
    };

    const { icon: Icon, labelKey, color } = config[adminPermissions.permission_level];

    return (
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-sm font-medium">{t(labelKey)}</span>
      </div>
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin/mobile') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={unifiedUser?.email} />
            <AvatarFallback className="font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{unifiedUser?.email}</p>
            {getPermissionBadge()}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter(item => 
            hasPermission(item.permission as any)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "w-full justify-start gap-3 h-auto py-2.5",
                      isActive(item.href) && "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">{t('menu.logout')}</span>
        </Button>
      </div>
    </div>
  );
};