
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Travel: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Cestování | PendlerApp</title>
        <meta name="description" content="Plánování cest a dopravy" />
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Cestování</h1>
        <p className="text-muted-foreground">Sekce cestování je v přípravě.</p>
      </div>
    </Layout>
  );
};

export default Travel;
