import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Navigation,
  TrendingUp,
  Bell,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';

interface DHLEmployeeDashboardProps {
  className?: string;
}

export const DHLEmployeeDashboard: React.FC<DHLEmployeeDashboardProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();

  const quickActions = [
    {
      id: 'timeTracking',
      icon: Clock,
      title: t('navigation.timeTracking'),
      description: 'Rychlé zapsání příchodu/odchodu',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'shifts',
      icon: Calendar,
      title: t('navigation.shifts'),
      description: 'Přehled nadcházejících směn',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'team',
      icon: Users,
      title: t('navigation.team'),
      description: 'Komunikace s týmem',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'documents',
      icon: FileText,
      title: t('navigation.documents'),
      description: 'Správa dokumentů',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  const stats = [
    {
      title: t('dashboard.thisWeek'),
      value: '38.5h',
      change: '+2.5h',
      trend: 'up',
      icon: Clock
    },
    {
      title: t('dashboard.thisMonth'),
      value: '156h',
      change: '+12h',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('dashboard.welcomeBack')}, {user?.email?.split('@')[0] || 'Uživatel'}!
        </h1>
        <p className="text-lg text-muted-foreground">
          {new Date().toLocaleDateString('cs-CZ', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </motion.div>

      {/* Today's Shift Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('dashboard.todaysShift')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Ranní směna</p>
                <p className="text-sm text-muted-foreground">06:00 - 14:00</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Dnes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} od minulého období
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {t('dashboard.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border ${action.borderColor} ${action.bgColor} cursor-pointer transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-3 rounded-full bg-white shadow-sm`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('dashboard.recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Příchod do práce</p>
                  <p className="text-xs text-muted-foreground">Dnes 06:15</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Přestávka</p>
                  <p className="text-xs text-muted-foreground">Dnes 10:00 - 10:30</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nahrán dokument</p>
                  <p className="text-xs text-muted-foreground">Včera 16:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                {t('dashboard.upcomingReminders')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Bell className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Platnost pojištění</p>
                  <p className="text-xs text-muted-foreground">Vyprší za 15 dní</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Měsíční report</p>
                  <p className="text-xs text-muted-foreground">Deadline 31.1.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Týmová schůzka</p>
                  <p className="text-xs text-muted-foreground">Zítra 14:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DHLEmployeeDashboard;