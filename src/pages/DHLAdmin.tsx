
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Users, Calendar, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { canAccessDHLAdmin } from '@/utils/dhlAuthUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DHLAdmin: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();

  // Check access
  if (!canAccessDHLAdmin(user)) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Přístup zamítnut</h2>
            <p className="text-muted-foreground">Nemáte oprávnění k přístupu do DHL admin panelu.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const adminCards = [
    {
      title: 'Správa pozic',
      description: 'Spravujte DHL pozice a jejich nastavení',
      icon: Users,
      action: 'Spravovat pozice',
      href: '#positions'
    },
    {
      title: 'Pracovní skupiny',
      description: 'Konfigurace pracovních skupin a směn',
      icon: Calendar,
      action: 'Spravovat skupiny',
      href: '#workgroups'
    },
    {
      title: 'Import dat',
      description: 'Import směn a dat z DHL systémů',
      icon: Truck,
      action: 'Importovat data',
      href: '#import'
    },
    {
      title: 'Nastavení systému',
      description: 'Obecná nastavení DHL modulu',
      icon: Settings,
      action: 'Nastavení',
      href: '#settings'
    }
  ];

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Admin Panel | PendlerApp</title>
        <meta name="description" content="DHL administration panel for managing positions, work groups, and shifts" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container max-w-6xl py-8 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-sm">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  DHL Admin Panel
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Správa DHL systému a zaměstnanců
                </p>
              </div>
            </div>
          </motion.div>

          {/* Admin Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {adminCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      {card.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Stav systému</CardTitle>
                <CardDescription>Aktuální stav DHL modulu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">Aktivní</div>
                    <div className="text-sm text-green-700">DHL modul</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-blue-700">Registrovaní zaměstnanci</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-purple-700">Aktivní směny</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLAdmin;
