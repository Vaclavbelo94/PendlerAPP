
import React from 'react';
import { Helmet } from "react-helmet";
import { useLanguage } from '@/hooks/useLanguage';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import VehicleMainContainer from '@/components/vehicle/VehicleMainContainer';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Vehicle = () => {
  const { t } = useLanguage();

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('vehicle')} | PendlerApp</title>
        <meta name="description" content={t('vehicleDescription')} />
      </Helmet>
      
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <VehicleMainContainer />
      </OptimizedPremiumCheck>
    </Layout>
  );
};

export default Vehicle;
