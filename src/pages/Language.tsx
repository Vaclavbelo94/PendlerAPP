
import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Language: React.FC = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>Jazyky | PendlerApp</title>
        <meta name="description" content="Výuka jazyků a překladač" />
      </Helmet>
      
      <div className="container max-w-6xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Jazyky</h1>
        <p className="text-muted-foreground">Sekce jazyků je v přípravě.</p>
      </div>
    </Layout>
  );
};

export default Language;
