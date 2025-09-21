import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Calculator, 
  Car, 
  Map, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface MobileDashboardProps {
  isDHLUser: boolean;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ isDHLUser }) => {
  const { t } = useTranslation(['dashboard', 'travel']);
  const navigate = useNavigate();

  const mainActions = [
    {
      id: 'shifts',
      title: t('dashboard:shiftManagement'),
      description: t('dashboard:manageShifts'),
      icon: Calendar,
      color: 'hsl(var(--chart-1))',
      path: '/shifts',
      isPrimary: true
    },
    {
      id: 'tax',
      title: t('dashboard:taxAdvisor'),
      description: t('dashboard:optimizeYourTaxes'),
      icon: Calculator,
      color: 'hsl(var(--chart-2))',
      path: '/tax-advisor',
      isPrimary: true
    },
    {
      id: 'vehicle',
      title: t('dashboard:vehicleManagement'),
      description: t('dashboard:manageYourVehicles'),
      icon: Car,
      color: 'hsl(var(--chart-3))',
      path: '/vehicle',
      isPrimary: false
    },
    {
      id: 'travel',
      title: t('dashboard:travelPlanning'),
      description: t('dashboard:travelDescription'),
      icon: Map,
      color: 'hsl(var(--chart-4))',
      path: '/travel',
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-4 px-4">
      {/* Primary Actions - Large Cards */}
      <div className="space-y-4">
        {mainActions.filter(action => action.isPrimary).map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => navigate(action.path)}
            className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${action.color}08 0%, ${action.color}03 100%)`,
              border: `1px solid ${action.color}15`
            }}
          >
            {/* Background gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-active:opacity-5 transition-opacity duration-200"
              style={{ backgroundColor: action.color }}
            />
            
            <div className="relative flex items-center justify-between">
              {/* Left content */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Icon */}
                <div 
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon 
                    className="h-6 w-6" 
                    style={{ color: action.color }}
                  />
                </div>
                
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Arrow */}
              <ChevronRight 
                className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Actions - Compact Grid */}
      <div className="pt-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
          {t('dashboard:moreFeatures')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          {mainActions.filter(action => !action.isPrimary).map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1, duration: 0.4 }}
              onClick={() => navigate(action.path)}
              className="group relative overflow-hidden rounded-xl p-4 cursor-pointer bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:bg-card/80 active:scale-[0.95]"
            >
              {/* Subtle hover background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-3 transition-opacity duration-300"
                style={{ backgroundColor: action.color }}
              />
              
              <div className="relative space-y-3">
                {/* Icon */}
                <div 
                  className="p-2.5 rounded-lg w-fit"
                  style={{ backgroundColor: `${action.color}10` }}
                >
                  <action.icon 
                    className="h-5 w-5" 
                    style={{ color: action.color }}
                  />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;