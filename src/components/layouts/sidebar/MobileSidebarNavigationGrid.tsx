
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Car, Settings, BarChart3, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

interface MobileSidebarNavigationGridProps {
  compact?: boolean;
}

export const MobileSidebarNavigationGrid: React.FC<MobileSidebarNavigationGridProps> = ({ compact = false }) => {
  const { unifiedUser } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Směny', path: '/shifts' },
    { icon: Car, label: 'Vozidla', path: '/vehicles' },
    { icon: BarChart3, label: 'Analytika', path: '/analytics', premium: true },
    { icon: Settings, label: 'Nastavení', path: '/settings' },
  ];

  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {navigationItems.map((item) => {
        const isLocked = item.premium && !unifiedUser?.isPremium;
        const Icon = item.icon;
        
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`${compact ? 'justify-center' : 'justify-start'} h-auto py-3`}
            onClick={() => navigate(isLocked ? '/premium' : item.path)}
          >
            <Icon className={`h-4 w-4 ${compact ? '' : 'mr-2'}`} />
            {!compact && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isLocked && <Crown className="h-3 w-3 text-amber-500" />}
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};
