
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
    <div className="space-y-8">
      {/* Primary Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mainWidgets.filter(w => w.isPrimary).map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
          >
            <div 
              className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
              onClick={() => navigate(widget.path)}
              style={{
                background: `linear-gradient(135deg, ${widget.color}15 0%, ${widget.color}08 100%)`,
                border: `1px solid ${widget.color}20`
              }}
            >
              {/* Animated background pattern */}
              <div 
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 70% 30%, ${widget.color}30 0%, transparent 50%)`
                }}
              />
              
              {/* Content */}
              <div className="relative p-8 h-48 flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div 
                    className="p-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: widget.color }}
                  >
                    <widget.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className="text-xs px-2 py-1 border-0 font-medium"
                      style={{ 
                        backgroundColor: `${widget.color}20`,
                        color: widget.color
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('dashboard:popular')}
                    </Badge>
                    <ArrowRight 
                      className="h-5 w-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" 
                      style={{ color: widget.color }}
                    />
                  </div>
                </div>
                
                {/* Bottom section */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {widget.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {widget.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mainWidgets.filter(w => !w.isPrimary).map((widget, index) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 2) * 0.1, duration: 0.5 }}
          >
            <div 
              className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-card/60 backdrop-blur-sm border border-border/50 p-6 h-28"
              onClick={() => navigate(widget.path)}
            >
              {/* Subtle hover background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ backgroundColor: widget.color }}
              />
              
              <div className="relative flex items-center gap-4 h-full">
                {/* Icon */}
                <div 
                  className="p-3 rounded-xl shadow-md"
                  style={{ backgroundColor: `${widget.color}15` }}
                >
                  <widget.icon 
                    className="h-5 w-5" 
                    style={{ color: widget.color }}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {widget.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {widget.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <ArrowRight 
                  className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  style={{ color: widget.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
