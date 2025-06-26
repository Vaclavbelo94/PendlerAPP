
import React from 'react';
import OptimizedLayout from '@/components/layouts/OptimizedLayout';
import UnifiedShiftsMainContainer from '@/components/shifts/UnifiedShiftsMainContainer';
import { useTranslation } from 'react-i18next';

const Shifts = () => {
  const { t } = useTranslation();

  return (
    <OptimizedLayout>
      <div className="py-2">
        <UnifiedShiftsMainContainer />
      </div>
    </OptimizedLayout>
  );
};

export default Shifts;
