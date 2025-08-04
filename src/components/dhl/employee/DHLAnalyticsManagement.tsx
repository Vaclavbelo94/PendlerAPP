import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Trophy, 
  Brain,
  Activity,
  Calendar,
  Download,
  Share2,
  Settings,
  Plus
} from 'lucide-react';
import { DHLAnalyticsDashboard } from './analytics/DHLAnalyticsDashboard';
import { DHLPerformanceCharts } from './analytics/DHLPerformanceCharts';
import { DHLGoalsAndMilestones } from './analytics/DHLGoalsAndMilestones';

interface AnalyticsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

export const DHLAnalyticsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs: AnalyticsTab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Přehled výkonnosti a AI insights'
    },
    {
      id: 'charts',
      label: 'Grafy',
      icon: TrendingUp,
      description: 'Detailní analýza a trendy'
    },
    {
      id: 'goals',
      label: 'Cíle',
      icon: Target,
      badge: '3',
      description: 'Osobní cíle a milníky'
    },
    {
      id: 'reports',
      label: 'Reporty',
      icon: Activity,
      description: 'Generování a export reportů'
    }
  ];

  const quickStats = [
    {
      label: 'Týdenní pokrok',
      value: '87%',
      trend: '+5%',
      color: 'text-green-500'
    },
    {
      label: 'Aktivní cíle',
      value: '3',
      trend: '2 blízko',
      color: 'text-blue-500'
    },
    {
      label: 'Celkem bodů',
      value: '2,450',
      trend: '+150',
      color: 'text-purple-500'
    },
    {
      label: 'Série dní',
      value: '12',
      trend: 'Aktivní',
      color: 'text-orange-500'
    }
  ];

  const renderQuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {quickStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Reporty a export</h3>
          <p className="text-muted-foreground">
            Generujte a sdílejte své výsledky
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Sdílet
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Týdenní report
            </CardTitle>
            <CardDescription>
              Detailní přehled za posledních 7 dní
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Generovat PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Měsíční analýza
            </CardTitle>
            <CardDescription>
              Komplexní analýza pokroku za měsíc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Generovat Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Personalizované doporučení a trendy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Exportovat JSON
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Milestone report
            </CardTitle>
            <CardDescription>
              Přehled dosažených milníků a cílů
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Generovat PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Výkonnostní data
            </CardTitle>
            <CardDescription>
              Raw data pro další analýzu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Export CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Vlastní report
            </CardTitle>
            <CardDescription>
              Vytvořte si report dle svých potřeb
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Konfigurace
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plánované reporty</CardTitle>
          <CardDescription>
            Nastavte si automatické generování reportů
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Týdenní přehled</div>
                <div className="text-sm text-muted-foreground">Každé pondělí v 9:00</div>
              </div>
              <Badge variant="secondary">Aktivní</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Měsíční analýza</div>
                <div className="text-sm text-muted-foreground">1. den v měsíci v 10:00</div>
              </div>
              <Badge variant="outline">Pozastaveno</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Přidat nový plán
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">
            Komplexní přehled výkonnosti a pokroku
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Brain className="h-3 w-3" />
          AI Powered
        </Badge>
      </motion.div>

      {renderQuickStats()}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="relative">
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.badge && (
                <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DHLAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Výkonnostní grafy</h3>
            <p className="text-muted-foreground">
              Detailní vizualizace vašeho pokroku
            </p>
          </div>
          <DHLPerformanceCharts />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <DHLGoalsAndMilestones />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {renderReportsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};