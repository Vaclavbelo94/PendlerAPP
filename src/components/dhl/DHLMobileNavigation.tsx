
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Settings, User, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

const DHLMobileNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'DHL Dashboard',
      href: '/dhl-dashboard',
      isActive: location.pathname === '/dhl-dashboard'
    },
    {
      icon: Calendar,
      label: 'DHL Směny',
      href: '/dhl-shifts',
      isActive: location.pathname === '/dhl-shifts'
    },
    {
      icon: Car,
      label: 'DHL Vozidlo',
      href: '/dhl-vehicle',
      isActive: location.pathname === '/dhl-vehicle'
    },
    {
      icon: User,
      label: 'DHL Profil',
      href: '/dhl-profile',
      isActive: location.pathname === '/dhl-profile'
    },
    {
      icon: Settings,
      label: 'Nastavení',
      href: '/dhl-setup',
      isActive: location.pathname === '/dhl-setup'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-600 to-red-600 border-t border-yellow-500/20 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "flex flex-col items-center gap-1 h-14 px-2 min-w-0 flex-1 text-white hover:bg-white/10",
              item.isActive && "bg-white/20 text-white"
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

export default DHLMobileNavigation;
