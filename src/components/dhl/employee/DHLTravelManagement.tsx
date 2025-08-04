import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  BarChart3, 
  Car, 
  MapPin,
  TrendingUp,
  Route,
  Calendar
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import DHLCommuteOptimizer from './travel/DHLCommuteOptimizer';
import DHLTravelDashboard from './travel/DHLTravelDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const DHLTravelManagement: React.FC = () => {
  const { t } = useTranslation('travel');
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('optimizer');

  const tabs = [
    {
      id: 'optimizer',
      label: 'Optimalizace trasy',
      icon: Navigation,
      description: 'Najděte nejlepší cestu do práce'
    },
    {
      id: 'dashboard',
      label: 'Přehled',
      icon: BarChart3,
      description: 'Statistiky a analýza dojíždění'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold">Dojíždění do práce</h1>
              <p className="text-sm text-muted-foreground">DHL Travel Management</p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              <Car className="h-3 w-3 mr-1" />
              Optimalizace
            </Badge>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="border-b bg-background">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'optimizer' && <DHLCommuteOptimizer />}
            {activeTab === 'dashboard' && <DHLTravelDashboard />}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <motion.div 
        className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Travel Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Optimalizace dojíždění a analýza nákladů pro DHL zaměstnance
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              <Route className="h-4 w-4 mr-2" />
              DHL Business Travel
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Desktop Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Descriptions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.div key={tab.id} variants={itemVariants}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activeTab === tab.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{tab.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Tab Content */}
          <TabsContent value="optimizer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DHLCommuteOptimizer />
            </motion.div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DHLTravelDashboard />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DHLTravelManagement;