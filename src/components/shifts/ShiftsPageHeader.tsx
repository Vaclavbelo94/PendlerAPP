
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ShiftsPageHeaderProps {
  onAddShift: () => void;
}

const ShiftsPageHeader: React.FC<ShiftsPageHeaderProps> = ({ onAddShift }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  return (
    <div className={cn("flex justify-between items-center mb-6", isMobile ? "flex-col gap-4 items-stretch mb-4" : "")}>
      <div className={cn(isMobile ? "text-center" : "")}>
        <h1 className={cn("font-bold tracking-tight", isMobile ? "text-2xl" : "text-3xl")}>
          {t('shifts') || 'Směny'}
        </h1>
        <p className={cn("text-muted-foreground", isMobile ? "text-sm" : "text-base")}>
          {t('shiftsManagementDescription') || 'Správa vašich pracovních směn a rozvrhu'}
        </p>
      </div>
      
      <Button 
        onClick={onAddShift} 
        className={cn("flex items-center gap-2", isMobile ? "w-full justify-center" : "")}
      >
        <Plus className="h-4 w-4" />
        {t('addShift') || 'Přidat směnu'}
      </Button>
    </div>
  );
};

export default ShiftsPageHeader;
