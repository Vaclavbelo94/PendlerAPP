import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Settings, 
  BarChart3,
  Shield,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAdminV2 } from '@/hooks/useAdminV2';

export const MobileAdminNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useAdminV2();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/admin/mobile',
      permission: 'viewer'
    },
    {
      id: 'users',
      label: 'Uživatelé',
      icon: Users,
      href: '/admin/mobile/users',
      permission: 'moderator',
      badge: '12'
    },
    {
      id: 'companies',
      label: 'Firmy',
      icon: Building2,
      href: '/admin/mobile/companies',
      permission: 'admin'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/admin/mobile/analytics',
      permission: 'viewer'
    },
    {
      id: 'rideshare',
      label: 'Spolujízdy',
      icon: Car,
      href: '/admin/mobile/rideshare',
      permission: 'viewer' // Changed to viewer to test
    },
    {
      id: 'security',
      label: 'Zabezpečení',
      icon: Shield,
      href: '/admin/mobile/security',
      permission: 'admin'
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    hasPermission(item.permission as any)
  );

  const isActive = (href: string) => {
    if (href === '/admin/mobile') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around py-2">
        {filteredItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.href)}
            className={cn(
              "flex flex-col gap-1 h-auto py-2 px-1 min-w-0 flex-1 relative",
              isActive(item.href) && "text-primary bg-primary/10"
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-xs p-0"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs truncate max-w-full">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </nav>
  );
};