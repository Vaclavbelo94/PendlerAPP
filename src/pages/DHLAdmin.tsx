
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Users, Calendar, Settings, Upload, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { canAccessDHLAdmin } from '@/utils/dhlAuthUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import DHLImportPanel from '@/components/dhl/admin/DHLImportPanel';

const DHLAdmin: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['overview', 'import', 'positions', 'settings'];
  
  const { containerRef, currentIndex } = useSwipeNavigation({
    items: tabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: true
  });

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
      href: '#positions',
      count: '0 pozic'
    },
    {
      title: 'Pracovní skupiny',
      description: 'Konfigurace pracovních skupin a směn',
      icon: Calendar,
      action: 'Spravovat skupiny',
      href: '#workgroups',
      count: '0 skupin'
    },
    {
      title: 'Import dat',
      description: 'Import směn a dat z DHL systémů',
      icon: Upload,
      action: 'Importovat data',
      href: '#import',
      count: 'Nová funkce'
    },
    {
      title: 'Nastavení systému',
      description: 'Obecná nastavení DHL modulu',
      icon: Settings,
      action: 'Nastavení',
      href: '#settings',
      count: 'Konfigurace'
    }
  ];

  const tabTitles = {
    overview: 'Přehled',
    import: 'Import dat',
    positions: 'Pozice',
    settings: 'Nastavení'
  };

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Admin Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {adminCards.map((card) => {
              const Icon = card.icon;
              return (
                <CarouselItem key={card.title} className="pl-2 md:pl-4 md:basis-1/2">
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <CardDescription>{card.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {card.count}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          if (card.href === '#import') {
                            setActiveTab('import');
                          }
                        }}
                      >
                        {card.action}
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600">Aktivní</div>
                <div className="text-sm text-green-700 dark:text-green-300">DHL modul</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Registrovaní zaměstnanci</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Aktivní směny</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-800">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Importované plány</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderImportContent = () => <DHLImportPanel />;

  const renderPositionsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Správa pozic</CardTitle>
        <CardDescription>
          Konfigurace DHL pozic a jejich vlastností
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Funkce bude brzy k dispozici</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSettingsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Systémové nastavení</CardTitle>
        <CardDescription>
          Obecná konfigurace DHL modulu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Funkce bude brzy k dispozici</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'import':
        return renderImportContent();
      case 'positions':
        return renderPositionsContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderOverviewContent();
    }
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Admin Panel | PendlerApp</title>
        <meta name="description" content="DHL administration panel for managing positions, work groups, and shifts" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container max-w-7xl py-8 px-4">
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

          {/* Tab Navigation with Swipe Support */}
          <div className="mb-6" ref={containerRef}>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx > 0) {
                    setActiveTab(tabs[currentIdx - 1]);
                  }
                }}
                disabled={currentIndex === 0}
                className="md:hidden"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold">{tabTitles[activeTab as keyof typeof tabTitles]}</h2>
                <div className="flex justify-center gap-2 mt-2">
                  {tabs.map((tab, index) => (
                    <div
                      key={tab}
                      className={`h-2 w-8 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx < tabs.length - 1) {
                    setActiveTab(tabs[currentIdx + 1]);
                  }
                }}
                disabled={currentIndex === tabs.length - 1}
                className="md:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex gap-2 p-1 bg-muted rounded-lg">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1"
                >
                  {tabTitles[tab as keyof typeof tabTitles]}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLAdmin;
