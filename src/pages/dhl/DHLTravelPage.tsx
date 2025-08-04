import React from 'react';
import { useTranslation } from 'react-i18next';
import ModernLayout from '@/components/modern/ModernLayout';
import DHLTravelManagement from '@/components/dhl/employee/DHLTravelManagement';

const DHLTravelPage = () => {
  const { t } = useTranslation('dhl');

  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('travel.title')}</h1>
          <p className="text-muted-foreground">{t('travel.description')}</p>
        </div>
        <DHLTravelManagement />
      </div>
    </ModernLayout>
  );
};

export default DHLTravelPage;