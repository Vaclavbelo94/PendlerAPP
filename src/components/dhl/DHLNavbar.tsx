
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Menu, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificationIndicator } from '@/components/notifications/NotificationIndicator';
import { dhlNavigationItems } from '@/data/dhlNavigationData';

export const DHLNavbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <nav className="bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DHL Portal</h1>
              <p className="text-xs text-yellow-100">Zaměstnanecký systém</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {dhlNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`text-white hover:bg-white/10 ${
                        isActive ? 'bg-white/20' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <NotificationIndicator />
            {isMobile && (
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
