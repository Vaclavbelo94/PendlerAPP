import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  Clock,
  Euro,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Bookmark,
  Bell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../wizard/types';

interface TaxDashboardProps {
  currentData?: TaxWizardData;
  currentResult?: TaxCalculationResult;
}

const TaxDashboard: React.FC<TaxDashboardProps> = ({
  currentData,
  currentResult
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [keyDates, setKeyDates] = useState<any[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  useEffect(() => {
    // Inicializace notifikací
    setNotifications([
      {
        id: 1,
        type: 'deadline',
        title: t('dashboard.notifications.taxDeadline'),
        description: t('dashboard.notifications.taxDeadlineDesc'),
        date: '2024-05-31',
        priority: 'high'
      },
      {
        id: 2,
        type: 'update',
        title: t('dashboard.notifications.newFeature'),
        description: t('dashboard.notifications.newFeatureDesc'),
        date: '2024-01-15',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'tip',
        title: t('dashboard.notifications.optimizationTip'),
        description: t('dashboard.notifications.optimizationTipDesc'),
        date: '2024-01-10',
        priority: 'low'
      }
    ]);

    // Inicializace rychlých akcí
    setQuickActions([
      {
        id: 'new-calculation',
        title: t('dashboard.actions.newCalculation'),
        description: t('dashboard.actions.newCalculationDesc'),
        icon: FileText,
        color: 'blue'
      },
      {
        id: 'export-data',
        title: t('dashboard.actions.exportData'),
        description: t('dashboard.actions.exportDataDesc'),
        icon: TrendingUp,
        color: 'green'
      },
      {
        id: 'schedule-reminder',
        title: t('dashboard.actions.scheduleReminder'),
        description: t('dashboard.actions.scheduleReminderDesc'),
        icon: Calendar,
        color: 'purple'
      },
      {
        id: 'view-analytics',
        title: t('dashboard.actions.viewAnalytics'),
        description: t('dashboard.actions.viewAnalyticsDesc'),
        icon: BarChart3,
        color: 'orange'
      }
    ]);

    // Inicializace klíčových dat
    setKeyDates([
      {
        date: '2024-05-31',
        title: t('dashboard.dates.taxReturnDeadline'),
        type: 'deadline',
        importance: 'high'
      },
      {
        date: '2024-03-15',
        title: t('dashboard.dates.quarterlyReport'),
        type: 'report',
        importance: 'medium'
      },
      {
        date: '2024-12-31',
        title: t('dashboard.dates.yearEndPreparation'),
        type: 'preparation',
        importance: 'medium'
      }
    ]);
  }, [t]);

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'update': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'tip': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getActionIcon = (IconComponent: any, color: string) => {
    const colorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };
    return <IconComponent className={`h-5 w-5 ${colorClasses[color as keyof typeof colorClasses]}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Přehled klíčových metrik */}
      {currentResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.metrics.currentCalculation')}</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentResult.totalDeductions)}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.metrics.totalDeductions')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.metrics.estimatedSavings')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(currentResult.totalDeductions * 0.25)}
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.metrics.potentialRefund')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.metrics.completionStatus')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{t('dashboard.metrics.readyForSubmission')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.metrics.timeRemaining')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.metrics.daysUntilDeadline')}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="actions">{t('dashboard.tabs.quickActions')}</TabsTrigger>
          <TabsTrigger value="calendar">{t('dashboard.tabs.calendar')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('dashboard.tabs.notifications')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('dashboard.currentStatus')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.personalInfo')}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.employmentData')}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.deductions')}</span>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('dashboard.validation')}</span>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('dashboard.recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">{t('dashboard.activity.calculationUpdated')}</p>
                      <p className="text-xs text-muted-foreground">2 {t('dashboard.hoursAgo')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">{t('dashboard.activity.pdfExported')}</p>
                      <p className="text-xs text-muted-foreground">1 {t('dashboard.dayAgo')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">{t('dashboard.activity.dataValidated')}</p>
                      <p className="text-xs text-muted-foreground">3 {t('dashboard.daysAgo')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getActionIcon(action.icon, action.color)}
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <Button size="sm" className="w-full">
                    {t('dashboard.startAction')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('dashboard.importantDates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyDates.map((dateItem, index) => {
                  const daysUntil = getDaysUntil(dateItem.date);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{dateItem.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(dateItem.date).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={daysUntil < 30 ? 'destructive' : 'secondary'}>
                          {daysUntil > 0 ? `${daysUntil} ${t('dashboard.days')}` : t('dashboard.overdue')}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('dashboard.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.date).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxDashboard;