
import React from 'react';
import { Helmet } from 'react-helmet';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import OptimizedShiftsContainer from '@/components/shifts/OptimizedShiftsContainer';

const Shifts = () => {
  return (
    <OptimizedPremiumCheck featureKey="shifts">
      <ResponsivePage enableMobileSafeArea>
        <Helmet>
          <title>Směny | Pendlerův Pomocník</title>
        </Helmet>
        
        <OptimizedShiftsContainer />
      </ResponsivePage>
    </OptimizedPremiumCheck>
  );
};

export default Shifts;
