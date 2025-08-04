import React from 'react';
import ModernLayout from '@/components/modern/ModernLayout';
import { DHLDocumentManagement } from '@/components/dhl/employee/DHLDocumentManagement';

const DHLDocumentsPage = () => {
  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DHL Dokumenty</h1>
          <p className="text-muted-foreground">Správa všech vašich DHL dokumentů na jednom místě</p>
        </div>
        <DHLDocumentManagement />
      </div>
    </ModernLayout>
  );
};

export default DHLDocumentsPage;