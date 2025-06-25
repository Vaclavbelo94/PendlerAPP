
import React from 'react';
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import ShiftsMainContainer from '@/components/shifts/ShiftsMainContainer';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Shifts = () => {
  const { t } = useTranslation(['shifts', 'common']);

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('shifts:shiftsManagement')} | PendlerApp</title>
        <meta name="description" content={t('shifts:shiftsInfo')} />
      </Helmet>
      
      <ShiftsMainContainer />
    </Layout>
  );
};

export default Shifts;
