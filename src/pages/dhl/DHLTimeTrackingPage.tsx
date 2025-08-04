import React from 'react';
import ModernLayout from '@/components/modern/ModernLayout';
import { TimeTrackingWidget } from '@/components/dhl/employee/timeTracking/TimeTrackingWidget';

const DHLTimeTrackingPage = () => {
  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DHL Sledování času</h1>
          <p className="text-muted-foreground">Pokročilé sledování pracovního času s AI analýzami</p>
        </div>
        <div className="grid gap-6">
          <TimeTrackingWidget />
        </div>
      </div>
    </ModernLayout>
  );
};

export default DHLTimeTrackingPage;