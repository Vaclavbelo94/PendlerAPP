
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileSidebarFooterProps {
  compact?: boolean;
}

export const MobileSidebarFooter: React.FC<MobileSidebarFooterProps> = ({ 
  compact = false 
}) => {
  const { unifiedUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');

  if (compact) {
    return (
      <div className="border-t p-2 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/settings')}
          className="w-full flex flex-col gap-1"
        >
          <Settings className="h-4 w-4" />
          <span className="text-xs">{t('settings')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t p-4 space-y-3">
      {/* Premium Status */}
      {unifiedUser?.isPremium ? (
        <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
          <Crown className="h-4 w-4 text-amber-600" />
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            Premium aktivní
          </Badge>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/premium')}
          className="w-full flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <Crown className="h-4 w-4" />
          {t('upgradeToPremium')}
        </Button>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings')}
          className="flex-1 flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {t('settings')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/help')}
          className="flex-1 flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          {t('help')}
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-muted-foreground">
        PendlerApp v2.0.0
      </div>
    </div>
  );
};
