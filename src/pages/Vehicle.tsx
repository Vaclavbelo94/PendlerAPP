
import React from 'react';
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import OptimizedPremiumCheck from '@/components/premium/OptimizedPremiumCheck';
import VehicleMainContainer from '@/components/vehicle/VehicleMainContainer';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Vehicle = () => {
  const { t } = useTranslation(['vehicle', 'common']);

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('vehicle:vehicleManagement')} | PendlerApp</title>
        <meta name="description" content={t('vehicle:vehicleInfo')} />
      </Helmet>
      
      <OptimizedPremiumCheck featureKey="vehicle_management">
        <VehicleMainContainer />
      </OptimizedPremiumCheck>
    </Layout>
  );
};

export default Vehicle;
