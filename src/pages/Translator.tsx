
import React from 'react';
import { Helmet } from 'react-helmet';
import { Globe } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Translator = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Překladač | PendlerApp</title>
        <meta name="description" content="Překladač a jazykové nástroje" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-indigo-100">
            <Globe className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Překladač</h1>
            <p className="text-muted-foreground">Překladač a jazykové nástroje</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Překladač</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Překladač bude brzy k dispozici.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Translator;
