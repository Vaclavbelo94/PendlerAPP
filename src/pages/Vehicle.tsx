
import React from 'react';
import { Helmet } from "react-helmet";
import { useLanguage } from '@/hooks/useLanguage';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import VehicleMainContainer from '@/components/vehicle/VehicleMainContainer';

const Vehicle = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('vehicle')} | PendlerApp</title>
        <meta name="description" content="Správa vozidel, spotřeby a dokumentů" />
      </Helmet>
      
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <VehicleMainContainer />
      </OptimizedPremiumCheck>
    </>
  );
};

export default Vehicle;
