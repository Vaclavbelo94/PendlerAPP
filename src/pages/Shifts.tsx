
import React from 'react';
import { Helmet } from 'react-helmet';
import { Calendar } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Shifts = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Směny | PendlerApp</title>
        <meta name="description" content="Správa pracovních směn" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-purple-100">
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Směny</h1>
            <p className="text-muted-foreground">Plánování a sledování pracovních směn</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kalendář směn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funkce pro správu směn bude brzy k dispozici.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Shifts;
