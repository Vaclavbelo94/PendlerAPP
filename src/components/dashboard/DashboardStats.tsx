
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Euro, 
  Calendar, 
  TrendingUp, 
  Car, 
  FileText 
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const DashboardStats: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('monthlyHours'),
      value: '142',
      target: '160',
      progress: 89,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t('monthlyEarnings'),
      value: '€4,680',
      target: '€5,200',
      progress: 90,
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: t('shiftsThisMonth'),
      value: '18',
      target: '20',
      progress: 90,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t('efficiency'),
      value: '94%',
      target: '95%',
      progress: 94,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: t('travelCosts'),
      value: '€280',
      target: '€300',
      progress: 93,
      icon: Car,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: t('documentsReady'),
      value: '12',
      target: '15',
      progress: 80,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('monthlyProgress')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">/ {stat.target}</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{stat.progress}% {t('completed')}</span>
                  <span>{100 - stat.progress}% {t('remaining')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
