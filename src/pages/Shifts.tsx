
import React from 'react';
import { Helmet } from 'react-helmet';
import PublicPageWithPremiumCheck from '@/components/premium/PublicPageWithPremiumCheck';
import ResponsivePage from '@/components/layouts/ResponsivePage';
import OptimizedShiftsContainer from '@/components/shifts/OptimizedShiftsContainer';

const Shifts = () => {
  return (
    <PublicPageWithPremiumCheck featureName="Správa směn" description="Pokročilá správa směn a plánování je dostupné pouze pro Premium uživatele.">
      <ResponsivePage enableMobileSafeArea>
        <Helmet>
          <title>Směny | Pendlerův Pomocník</title>
        </Helmet>
        
        <OptimizedShiftsContainer />
      </ResponsivePage>
    </PublicPageWithPremiumCheck>
  );
};

export default Shifts;
