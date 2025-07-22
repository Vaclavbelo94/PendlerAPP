
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useShiftsData } from '@/hooks/shifts/useShiftsData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Calculator, 
  Car, 
  Languages, 
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardCardsProps {
  isDHLUser: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ isDHLUser }) => {
  const { user } = useAuth();
  const { t } = useTranslation(['dashboard', 'common']);
  const navigate = useNavigate();
  const { shifts } = useShiftsData({ userId: user?.id });

  const recentShifts = shifts.slice(0, 3);
  const hasShifts = shifts.length > 0;

  const cards = [
    {
      id: 'shifts',
      title: t('dashboard:shiftManagement'),
      description: hasShifts 
        ? t('dashboard:shiftsCount', { count: shifts.length })
        : t('dashboard:noShiftsYet'),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      path: '/shifts',
      content: hasShifts ? (
        <div className="space-y-2">
          {recentShifts.map((shift, index) => (
            <div key={shift.id} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {new Date(shift.date).toLocaleDateString('cs-CZ')}
              </span>
              <Badge variant="secondary" className="text-xs">
                {shift.type}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <Button 
          onClick={() => navigate('/shifts')} 
          variant="outline" 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard:addFirstShift')}
        </Button>
      )
    },
    {
      id: 'tax',
      title: t('dashboard:taxAdvisor'),
      description: t('dashboard:taxAdvisorDescription'),
      icon: Calculator,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      path: '/tax-advisor',
      content: (
        <div className="text-sm text-muted-foreground">
          {t('dashboard:optimizeYourTaxes')}
        </div>
      )
    },
    {
      id: 'vehicle',
      title: t('dashboard:vehicleManagement'),
      description: t('dashboard:vehicleDescription'),
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      path: '/vehicle',
      content: (
        <div className="text-sm text-muted-foreground">
          {t('dashboard:manageYourVehicles')}
        </div>
      )
    },
    {
      id: 'translator',
      title: t('dashboard:languageTools'),
      description: t('dashboard:translatorDescription'),
      icon: Languages,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      path: '/translator',
      content: (
        <div className="text-sm text-muted-foreground">
          {t('dashboard:translateAndLearn')}
        </div>
      )
    },
    {
      id: 'activity',
      title: t('dashboard:recentActivity'),
      description: t('dashboard:activityDescription'),
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      path: '/profile',
      content: (
        <div className="space-y-2">
          {hasShifts ? (
            <>
              <div className="text-sm text-muted-foreground">
                {t('dashboard:lastShift')}: {new Date(shifts[0]?.date).toLocaleDateString('cs-CZ')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('dashboard:totalShifts')}: {shifts.length}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t('dashboard:noActivityYet')}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="h-full"
        >
          <Card 
            className={`h-full transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${card.borderColor} hover:scale-[1.02]`}
            onClick={() => navigate(card.path)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardTitle className="text-lg font-semibold">
                {card.title}
              </CardTitle>
              <CardDescription>
                {card.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              {card.content}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
