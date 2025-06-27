
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Home, Calendar, Car, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

interface CompactMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompactMobileSidebar: React.FC<CompactMobileSidebarProps> = ({
  isOpen,
  onClose
}) => {
  const { user, unifiedUser } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Směny', path: '/shifts' },
    { icon: Car, label: 'Vozidla', path: '/vehicles' },
    { icon: Settings, label: 'Nastavení', path: '/settings' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-60">
        <SheetHeader className="space-y-2">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="justify-start"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
