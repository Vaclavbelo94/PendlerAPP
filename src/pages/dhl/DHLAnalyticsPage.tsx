import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layouts/Layout';
import { DHLAnalyticsManagement } from '@/components/dhl/employee/DHLAnalyticsManagement';

const DHLAnalyticsPage = () => {
  const { t } = useTranslation('dhl');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{t('analytics.description')}</p>
        </div>
        <DHLAnalyticsManagement />
      </div>
    </Layout>
  );
};

export default DHLAnalyticsPage;