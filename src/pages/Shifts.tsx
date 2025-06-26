
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import PremiumCheck from '@/components/premium/PremiumCheck';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import ShiftsMainContainer from '@/components/shifts/ShiftsMainContainer';

const Shifts: React.FC = () => {
  const { t } = useTranslation('shifts');

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('shiftsDescription')} />
      </Helmet>
      
      <PremiumCheck featureKey="shifts">
        <ShiftsMainContainer />
      </PremiumCheck>
    </Layout>
  );
};

export default Shifts;
