import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layouts/Layout';
import { DHLDocumentManagement } from '@/components/dhl/employee/DHLDocumentManagement';

const DHLDocumentsPage = () => {
  const { t } = useTranslation('dhl');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('documents.title')}</h1>
          <p className="text-muted-foreground">{t('documents.description')}</p>
        </div>
        <DHLDocumentManagement />
      </div>
    </Layout>
  );
};

export default DHLDocumentsPage;