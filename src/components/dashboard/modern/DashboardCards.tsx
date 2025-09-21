
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Calculator, 
  Car, 
  Map, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardCardsProps {
  isDHLUser: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ isDHLUser }) => {
  const { t } = useTranslation(['dashboard', 'travel']);
  const navigate = useNavigate();

  const mainWidgets = [
    {
      id: 'shifts',
      title: t('dashboard:shiftManagement'),
      description: t('dashboard:manageShifts'),
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      path: '/shifts',
      isPrimary: true
    },
    {
      id: 'tax',
      title: t('dashboard:taxAdvisor'),
      description: t('dashboard:optimizeYourTaxes'),
      icon: Calculator,
      gradient: 'from-emerald-500 to-emerald-600',
      path: '/tax-advisor',
      isPrimary: true
    },
    {
      id: 'vehicle',
      title: t('dashboard:vehicleManagement'),
      description: t('dashboard:manageYourVehicles'),
      icon: Car,
      gradient: 'from-violet-500 to-violet-600',
      path: '/vehicle',
      isPrimary: false
    },
    {
      id: 'travel',
      title: t('dashboard:travelPlanning'),
      description: t('dashboard:travelDescription'),
      icon: Map,
      gradient: 'from-teal-500 to-teal-600',
      path: '/travel',
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Actions - Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainWidgets.filter(w => w.isPrimary).map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
          >
            <Card 
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card/50 backdrop-blur-sm border-border/50 h-[200px]"
              onClick={() => navigate(widget.path)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${widget.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardContent className="relative p-8 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${widget.gradient} shadow-lg`}>
                    <widget.icon className="h-8 w-8 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {widget.title}
                    </h3>
                    {widget.isPrimary && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t('dashboard:popular')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {widget.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Actions - Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mainWidgets.filter(w => !w.isPrimary).map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 2) * 0.1, duration: 0.5 }}
            className="h-full"
          >
            <Card 
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-card/30 backdrop-blur-sm border-border/30 h-[140px]"
              onClick={() => navigate(widget.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${widget.gradient} opacity-3 group-hover:opacity-5 transition-opacity`} />
              
              <CardContent className="relative p-6 flex items-center gap-4 h-full">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.gradient} shadow-md`}>
                  <widget.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {widget.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {widget.description}
                  </p>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
