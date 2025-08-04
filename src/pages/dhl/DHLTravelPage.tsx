import React from 'react';
import ModernLayout from '@/components/modern/ModernLayout';
import DHLTravelManagement from '@/components/dhl/employee/DHLTravelManagement';

const DHLTravelPage = () => {
  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DHL Cestování</h1>
          <p className="text-muted-foreground">Plánování a správa vašich služebních cest a přepravy</p>
        </div>
        <DHLTravelManagement />
      </div>
    </ModernLayout>
  );
};

export default DHLTravelPage;