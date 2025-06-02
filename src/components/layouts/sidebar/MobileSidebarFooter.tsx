
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileSidebarFooterProps {
  handleLogout: () => void;
}

export const MobileSidebarFooter: React.FC<MobileSidebarFooterProps> = ({
  handleLogout
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Odhlásit se
      </Button>
    </div>
  );
};
