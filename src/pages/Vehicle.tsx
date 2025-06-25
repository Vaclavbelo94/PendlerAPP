
import React from 'react';
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
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
      
      <VehicleMainContainer />
    </Layout>
  );
};

export default Vehicle;
