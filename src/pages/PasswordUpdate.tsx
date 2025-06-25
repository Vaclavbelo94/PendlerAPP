
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const PasswordUpdate: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Aktualizace hesla | PendlerApp</title>
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Aktualizace hesla</h1>
        <p className="text-muted-foreground">Funkce aktualizace hesla je v přípravě.</p>
      </div>
    </Layout>
  );
};

export default PasswordUpdate;
