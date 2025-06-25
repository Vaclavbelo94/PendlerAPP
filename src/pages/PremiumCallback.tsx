
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const PremiumCallback: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Premium Callback | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Premium Callback</h1>
        <p className="text-muted-foreground">Zpracovávám platbu...</p>
      </div>
    </Layout>
  );
};

export default PremiumCallback;
