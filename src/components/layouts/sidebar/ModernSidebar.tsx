
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useAuthPermissions } from '@/hooks/useAuthPermissions';
import { cn } from '@/lib/utils';
import { getVisibleItems } from './modernNavigationData';

const ModernSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const permissions = useAuthPermissions();

  // Získáme viditelné položky podle oprávnění uživatele
  const visibleItems = getVisibleItems(
    permissions.companyType,
    !!user,
    permissions.isPremium,
    permissions.isAdmin
  );

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
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.isPremium && !permissions.isPremium;
            
            return (
              <Link 
                key={item.href}
                to={isLocked ? '/premium' : item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.href) 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  isLocked && 'opacity-60'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.isPremium && !permissions.isPremium && (
                  <Crown className="h-3 w-3 text-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {permissions.isPremium && (
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
