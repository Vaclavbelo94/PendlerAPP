
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from 'react-i18next';

interface CompactModeToggleProps {
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
}

const CompactModeToggle = ({ compactMode, setCompactMode }: CompactModeToggleProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('settings');

  return (
    <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
      <div className={`${isMobile ? 'text-center' : ''}`}>
        <Label htmlFor="compactMode" className={`${isMobile ? 'text-sm' : 'text-base'}`}>{t('compactMode')}</Label>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'text-center mt-1' : ''}`}>
          {t('showMoreContentOnScreen')}
        </p>
      </div>
      <Switch 
        id="compactMode" 
        checked={compactMode}
        onCheckedChange={setCompactMode}
      />
    </div>
  );
};

export default CompactModeToggle;
