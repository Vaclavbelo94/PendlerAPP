
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Car, Settings, BarChart3, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

interface ModernMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernMobileSidebar: React.FC<ModernMobileSidebarProps> = ({
  isOpen,
  onClose
}) => {
  const { user, unifiedUser } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Směny', path: '/shifts' },
    { icon: Car, label: 'Vozidla', path: '/vehicles' },
    { icon: BarChart3, label: 'Analytika', path: '/analytics', premium: true },
    { icon: Settings, label: 'Nastavení', path: '/settings' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="space-y-2">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 mt-4">
          {navigationItems.map((item) => {
            const isLocked = item.premium && !unifiedUser?.isPremium;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  navigate(isLocked ? '/premium' : item.path);
                  onClose();
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                {item.premium && !unifiedUser?.isPremium && (
                  <Crown className="ml-auto h-3 w-3 text-amber-500" />
                )}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
