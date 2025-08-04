import React from 'react';
import ModernLayout from '@/components/modern/ModernLayout';
import { DHLAnalyticsManagement } from '@/components/dhl/employee/DHLAnalyticsManagement';

const DHLAnalyticsPage = () => {
  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DHL Analytika</h1>
          <p className="text-muted-foreground">Pokročilé analýzy výkonu a AI-powered insights</p>
        </div>
        <DHLAnalyticsManagement />
      </div>
    </ModernLayout>
  );
};

export default DHLAnalyticsPage;