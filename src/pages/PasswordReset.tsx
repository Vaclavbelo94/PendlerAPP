
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const PasswordReset: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Reset hesla | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Reset hesla</h1>
        <p className="text-muted-foreground">Funkce resetování hesla je v přípravě.</p>
      </div>
    </Layout>
  );
};

export default PasswordReset;
