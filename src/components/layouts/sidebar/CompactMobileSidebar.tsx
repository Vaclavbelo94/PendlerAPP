
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Car, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('navigation');

  const navigationItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Calendar, label: t('shifts'), path: '/shifts' },
    { icon: Car, label: t('vehicle'), path: '/vehicle' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-60">
        <SheetHeader className="space-y-2">
          <SheetTitle>{t('menu')}</SheetTitle>
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
