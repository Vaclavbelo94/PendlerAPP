
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const DashboardWidgets: React.FC = () => {
  const { t } = useLanguage();

  const notifications = [
    {
      type: 'success',
      title: t('shiftCompleted'),
      message: t('shiftCompletedMessage'),
      time: '2 ' + t('hoursAgo'),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      type: 'warning',
      title: t('documentExpiring'),
      message: t('documentExpiringMessage'),
      time: '1 ' + t('dayAgo'),
      icon: AlertCircle,
      color: 'text-orange-600',
    },
    {
      type: 'info',
      title: t('newTaxUpdate'),
      message: t('newTaxUpdateMessage'),
      time: '3 ' + t('daysAgo'),
      icon: FileText,
      color: 'text-blue-600',
    },
  ];

  const goals = [
    {
      title: t('monthlyHoursGoal'),
      current: 142,
      target: 160,
      unit: 'h',
      progress: 89,
    },
    {
      title: t('savingsGoal'),
      current: 2400,
      target: 3000,
      unit: '€',
      progress: 80,
    },
    {
      title: t('germanLessons'),
      current: 18,
      target: 25,
      unit: t('lessons'),
      progress: 72,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{t('recentActivity')}</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-1 rounded-full ${notification.color}`}>
                  <notification.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/profile">
              <Button variant="outline" className="w-full mt-4">
                {t('viewAllNotifications')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{t('goals')}</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {goal.current}{goal.unit} / {goal.target}{goal.unit}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.progress}% {t('completed')}</span>
                  <span>{goal.target - goal.current}{goal.unit} {t('remaining')}</span>
                </div>
              </div>
            ))}
            <Link to="/profile">
              <Button variant="outline" className="w-full mt-4">
                {t('manageGoals')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardWidgets;
