
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

interface MobileSidebarFooterProps {
  compact?: boolean;
}

export const MobileSidebarFooter: React.FC<MobileSidebarFooterProps> = ({ compact = false }) => {
  const { signOut, unifiedUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 border-t space-y-2">
      {!unifiedUser?.isPremium && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/premium')}
        >
          <Crown className="h-4 w-4 mr-2" />
          {compact ? '' : 'Upgrade'}
        </Button>
      )}
      
      <Button
        variant="ghost"
        className="w-full"
        onClick={signOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        {compact ? '' : 'Odhlásit'}
      </Button>
    </div>
  );
};
