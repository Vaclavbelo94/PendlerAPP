
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const TermsAndConditions: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Podmínky použití | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Podmínky použití</h1>
        <p className="text-muted-foreground">Podmínky použití jsou v přípravě.</p>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
