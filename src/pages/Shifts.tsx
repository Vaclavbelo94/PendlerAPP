
import React from 'react';
import { useTranslation } from 'react-i18next';
import UnifiedShiftsMainContainer from '@/components/shifts/UnifiedShiftsMainContainer';

const Shifts = () => {
  const { t } = useTranslation('shifts');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('shiftsPageDescription')}</p>
      </div>
      
      <UnifiedShiftsMainContainer />
    </div>
  );
};

export default Shifts;
