
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Car, 
  User, 
  FileText,
  Route,
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DashboardActions: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      label: t('addShift'),
      description: 'Zaznamenat novou směnu',
      action: () => navigate('/shifts'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Car,
      label: 'Vozidlo',
      description: 'Přidat vozidlo',
      action: () => navigate('/vehicle'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: User,
      label: 'Profil',
      description: 'Upravit profil',
      action: () => navigate('/profile'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      icon: Route,
      label: 'Trasy',
      description: 'Najít nejlepší cestu',
      action: () => navigate('/routes'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      icon: Users,
      label: 'Spolujízda',
      description: 'Najít spolucestující',
      action: () => navigate('/rideshare'),
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: FileText,
      label: t('taxAdvisor'),
      description: 'Daňové poradenství',
      action: () => navigate('/tax-advisor'),
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.action}
              className="h-auto flex-col items-center justify-center gap-2 p-4 hover:bg-accent/50 transition-all duration-200"
            >
              <div className={`p-3 rounded-full ${action.bgColor}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActions;
