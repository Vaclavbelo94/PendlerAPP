
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Car, 
  Globe, 
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const DashboardActions: React.FC = () => {
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t('addShift'),
      description: t('addShiftDescription'),
      icon: Plus,
      href: '/shifts',
      color: 'bg-blue-500 hover:bg-blue-600',
      badge: t('quick'),
    },
    {
      title: t('taxAdvisor'),
      description: t('taxAdvisorDescription'),
      icon: FileText,
      href: '/tax-advisor',
      color: 'bg-orange-500 hover:bg-orange-600',
      badge: t('premium'),
    },
    {
      title: t('translator'),
      description: t('translatorDescription'),
      icon: Globe,
      href: '/translator',
      color: 'bg-purple-500 hover:bg-purple-600',
      badge: t('ai'),
    },
    {
      title: t('vehicle'),
      description: t('vehicleDescription'),
      icon: Car,
      href: '/vehicle',
      color: 'bg-green-500 hover:bg-green-600',
      badge: t('premium'),
    },
  ];

  const upcomingShifts = [
    {
      date: t('tomorrow'),
      time: '07:00 - 15:00',
      location: 'Berlin, DE',
      type: t('regular'),
    },
    {
      date: t('friday'),
      time: '08:00 - 16:00',
      location: 'München, DE',
      type: t('overtime'),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href} className="group">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg text-white ${action.color} transition-transform group-hover:scale-110`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    {t('open')}
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t('upcomingShifts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingShifts.map((shift, index) => (
              <div key={index} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{shift.date}</span>
                  <Badge variant={shift.type === t('overtime') ? 'destructive' : 'default'} className="text-xs">
                    {shift.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  <span>{shift.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{shift.location}</span>
                </div>
              </div>
            ))}
            <Link to="/shifts">
              <Button variant="outline" className="w-full">
                {t('viewAllShifts')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
