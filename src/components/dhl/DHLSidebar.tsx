
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLAdmin } from '@/utils/dhlAuthUtils';
import { dhlNavigationItems, dhlAdminNavigationItems } from '@/data/dhlNavigationData';

export const DHLSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = canAccessDHLAdmin(user);

  const navigationItems = isAdmin ? dhlAdminNavigationItems : dhlNavigationItems;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-yellow-600 to-red-600 text-white shadow-xl z-50">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/10">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">DHL Portal</h1>
            <p className="text-sm text-yellow-100">
              {isAdmin ? 'Admin Panel' : 'Zaměstnanec'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path} className="block">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="default"
                  className={`w-full justify-start text-white hover:bg-white/10 ${
                    isActive ? 'bg-white/20' : ''
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.title}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-6 bg-white/10" />

        {/* Quick Stats */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-yellow-100 uppercase tracking-wide">
            Rychlé statistiky
          </h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-yellow-100">Směny tento měsíc</div>
            </div>
            <div className="p-3 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs text-yellow-100">Aktuální Woche</div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
