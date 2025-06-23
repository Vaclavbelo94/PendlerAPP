
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Settings, User, Car, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('common');

  const navItems = [
    {
      icon: Home,
      label: t('dashboard'),
      href: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      icon: Calendar,
      label: t('shifts'),
      href: '/shifts',
      isActive: location.pathname === '/shifts'
    },
    {
      icon: Calculator,
      label: t('taxAdvisor'),
      href: '/tax-advisor',
      isActive: location.pathname === '/tax-advisor'
    },
    {
      icon: Car,
      label: t('vehicle'),
      href: '/vehicle',
      isActive: location.pathname === '/vehicle'
    },
    {
      icon: User,
      label: t('profile'),
      href: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "flex flex-col items-center gap-1 h-14 px-2 min-w-0 flex-1",
              item.isActive && "text-primary bg-primary/10"
            )}
          >
            <Link to={item.href}>
              <item.icon className="h-5 w-5" />
              <span className="text-xs truncate">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
