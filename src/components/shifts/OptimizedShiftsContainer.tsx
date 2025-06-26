
import React from 'react';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import UnifiedShiftsMainContainer from './UnifiedShiftsMainContainer';
import { useTranslation } from 'react-i18next';

const OptimizedShiftsContainer = () => {
  const { t } = useTranslation();

  return <UnifiedShiftsMainContainer />;
};

export default OptimizedShiftsContainer;
