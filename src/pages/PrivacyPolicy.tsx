
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Zásady ochrany osobních údajů | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Zásady ochrany osobních údajů</h1>
        <p className="text-muted-foreground">Zásady ochrany osobních údajů jsou v přípravě.</p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
