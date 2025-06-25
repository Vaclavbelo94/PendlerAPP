
import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3 } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <Helmet>
        <title>Analytika | PendlerApp</title>
        <meta name="description" content="Pokročilá analytika a statistiky" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-blue-100">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytika</h1>
            <p className="text-muted-foreground">Přehled vašich dat a statistik</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Přehled aktivit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailní analytika bude brzy k dispozici.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Výkonnost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sledování výkonnosti a pokroku.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trendy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analýza trendů v čase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
