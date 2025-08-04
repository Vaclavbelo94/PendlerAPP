import React from 'react';
import { useTranslation } from 'react-i18next';
import ModernLayout from '@/components/modern/ModernLayout';
import { TimeTrackingWidget } from '@/components/dhl/employee/timeTracking/TimeTrackingWidget';

const DHLTimeTrackingPage = () => {
  const { t } = useTranslation('dhl');

  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('timeTracking.title')}</h1>
          <p className="text-muted-foreground">{t('timeTracking.description')}</p>
        </div>
        <div className="grid gap-6">
          <TimeTrackingWidget />
        </div>
      </div>
    </ModernLayout>
  );
};

export default DHLTimeTrackingPage;