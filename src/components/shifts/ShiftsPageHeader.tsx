
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShiftsPageHeaderProps {
  onAddShift: () => void;
}

const ShiftsPageHeader: React.FC<ShiftsPageHeaderProps> = ({ onAddShift }) => {
  const { t } = useTranslation('shifts');

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('shiftsDescription')}</p>
      </div>
      <Button onClick={onAddShift} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('add')}
      </Button>
    </div>
  );
};

export default ShiftsPageHeader;
