
import React from 'react';
import { Helmet } from 'react-helmet';
import { Scale } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Laws = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Právo | PendlerApp</title>
        <meta name="description" content="Právní informace a předpisy" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-red-100">
            <Scale className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Právo</h1>
            <p className="text-muted-foreground">Právní informace a předpisy</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Právní předpisy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Právní informace budou brzy k dispozici.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Laws;
