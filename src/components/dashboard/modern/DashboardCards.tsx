
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
  Map, 
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
  const { t } = useTranslation(['dashboard', 'common', 'travel']);
  const navigate = useNavigate();

  // Main 2x2 grid widgets - simplified to 4 main functions
  const mainWidgets = [
    {
      id: 'shifts',
      title: t('dashboard:shiftManagement'),
      description: t('dashboard:manageShifts'),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      hoverColor: 'hover:border-blue-200',
      path: '/shifts'
    },
    {
      id: 'tax',
      title: t('dashboard:taxAdvisor'),
      description: t('dashboard:optimizeYourTaxes'),
      icon: Calculator,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      hoverColor: 'hover:border-green-200',
      path: '/tax-advisor'
    },
    {
      id: 'vehicle',
      title: t('dashboard:vehicleManagement'),
      description: t('dashboard:manageYourVehicles'),
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      hoverColor: 'hover:border-purple-200',
      path: '/vehicle'
    },
    {
      id: 'travel',
      title: t('travel:travelPlanning'),
      description: t('travel:travelDescription'),
      icon: Map,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      hoverColor: 'hover:border-teal-200',
      path: '/travel'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {mainWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="h-full"
        >
          <Card 
            className={`h-full transition-all duration-300 hover:shadow-lg cursor-pointer bg-card/80 backdrop-blur-sm border ${widget.borderColor} ${widget.hoverColor} hover:scale-[1.02] group min-h-[140px]`}
            onClick={() => navigate(widget.path)}
          >
            <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-center">
              <div className={`p-3 rounded-xl ${widget.bgColor} mb-4`}>
                <widget.icon className={`h-8 w-8 ${widget.color}`} />
              </div>
              <CardTitle className="text-base md:text-lg font-semibold text-foreground mb-2">
                {widget.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {widget.description}
              </CardDescription>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
