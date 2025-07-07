import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { 
  Menu, 
  Calculator, 
  FileText, 
  TrendingUp,
  Home,
  Settings,
  User,
  ChevronRight,
  Euro,
  Calendar,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaxWizardData, TaxCalculationResult } from '../wizard/types';
import TaxWizardCarousel from '../wizard/TaxWizardCarousel';

interface MobileTaxAdvisorProps {
  currentData?: TaxWizardData;
  currentResult?: TaxCalculationResult;
}

const MobileTaxAdvisor: React.FC<MobileTaxAdvisorProps> = ({
  currentData,
  currentResult
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const quickActions = [
    {
      id: 'new-calculation',
      title: t('mobile.quickActions.newCalculation'),
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      id: 'export-pdf',
      title: t('mobile.quickActions.exportPDF'),
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      id: 'view-analytics',
      title: t('mobile.quickActions.viewAnalytics'),
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'schedule-reminder',
      title: t('mobile.quickActions.scheduleReminder'),
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  const navigationItems = [
    { id: 'dashboard', title: t('mobile.navigation.dashboard'), icon: Home },
    { id: 'calculator', title: t('mobile.navigation.calculator'), icon: Calculator },
    { id: 'analytics', title: t('mobile.navigation.analytics'), icon: TrendingUp },
    { id: 'export', title: t('mobile.navigation.export'), icon: Download }
  ];

  const MobileHeader = () => (
    <div className="sticky top-0 z-50 bg-background border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{t('mobile.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('mobile.subtitle')}</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>{t('mobile.menu')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  const MobileDashboard = () => (
    <div className="space-y-4">
      {/* Key Metrics - Mobile Optimized */}
      {currentResult && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">{t('mobile.metrics.totalDeductions')}</span>
              </div>
              <div className="text-lg font-bold">{formatCurrency(currentResult.totalDeductions)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">{t('mobile.metrics.estimatedRefund')}</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(currentResult.totalDeductions * 0.25)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('mobile.progress.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{t('mobile.progress.completion')}</span>
              <span>85%</span>
            </div>
            <Progress value={85} />
            <p className="text-xs text-muted-foreground">
              {t('mobile.progress.readyForSubmission')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Horizontal Scroll */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('mobile.quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <div key={action.id} className="flex-shrink-0">
                <Button
                  variant="outline"
                  className="h-20 w-20 flex-col gap-2 p-2"
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-center leading-tight">
                    {action.title}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('mobile.recentActivity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t('mobile.recentActivity.calculationUpdated')}</p>
                <p className="text-xs text-muted-foreground">2 {t('mobile.hoursAgo')}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t('mobile.recentActivity.pdfExported')}</p>
                <p className="text-xs text-muted-foreground">1 {t('mobile.dayAgo')}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('mobile.importantDates.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('mobile.importantDates.taxDeadline')}</p>
                <p className="text-xs text-muted-foreground">31.05.2024</p>
              </div>
              <Badge variant="destructive">127 {t('mobile.days')}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('mobile.importantDates.quarterlyReport')}</p>
                <p className="text-xs text-muted-foreground">15.03.2024</p>
              </div>
              <Badge variant="secondary">45 {t('mobile.days')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MobileCalculator = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('mobile.calculator.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t('mobile.calculator.description')}
          </p>
          <TaxWizardCarousel />
        </CardContent>
      </Card>
    </div>
  );

  const MobileBottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            className="flex-col h-12 gap-1"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-xs">{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MobileDashboard />;
      case 'calculator':
        return <MobileCalculator />;
      case 'analytics':
        return (
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('mobile.comingSoon')}</p>
            </CardContent>
          </Card>
        );
      case 'export':
        return (
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('mobile.comingSoon')}</p>
            </CardContent>
          </Card>
        );
      default:
        return <MobileDashboard />;
    }
  };

  if (!isMobile) {
    return null; // Render pouze na mobilních zařízeních
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <div className="px-4 py-4 pb-20">
        {renderContent()}
      </div>

      <MobileBottomNavigation />
    </div>
  );
};

export default MobileTaxAdvisor;