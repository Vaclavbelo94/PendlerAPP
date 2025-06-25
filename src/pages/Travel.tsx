
import React from 'react';
import { Helmet } from 'react-helmet';
import { Map } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Travel = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Cestování | PendlerApp</title>
        <meta name="description" content="Plánování cest a dopravy" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-teal-100">
            <Map className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Cestování</h1>
            <p className="text-muted-foreground">Plánování cest a optimalizace dopravy</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plánování cest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funkce pro plánování cest bude brzy k dispozici.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Travel;
