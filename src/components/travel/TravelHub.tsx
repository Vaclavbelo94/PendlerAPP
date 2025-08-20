import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Navigation, Users, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import RidesharingDashboard from './rideshare/RidesharingDashboard';
import { cn } from '@/lib/utils';

type ActiveTab = 'rideshare' | 'traffic';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  stats,
  isActive,
  onClick,
  disabled = false
}) => (
  <motion.div
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg',
        'border border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90',
        isActive && 'ring-2 ring-primary/20 border-primary/30 shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-3 rounded-xl transition-colors duration-300',
            isActive 
              ? 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary' 
              : 'bg-gradient-to-br from-muted/40 to-muted/20 text-muted-foreground'
          )}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn(
                'font-bold text-lg transition-colors duration-300',
                isActive ? 'text-primary' : 'text-foreground'
              )}>
                {title}
              </h3>
              {isActive && (
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Active
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stats}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TravelHub: React.FC = () => {
  const { t } = useTranslation('travel');
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<ActiveTab>('rideshare');

  const features = [
    {
      id: 'rideshare' as ActiveTab,
      icon: <Car className="h-6 w-6" />,
      title: t('ridesharing'),
      description: t('ridesharingDesc'),
      stats: '12+ ' + t('activeRides'),
      disabled: false
    },
    {
      id: 'traffic' as ActiveTab,
      icon: <Navigation className="h-6 w-6" />,
      title: t('commuteTraffic'),
      description: t('commuteTrafficDesc'),
      stats: t('realTimeUpdates'),
      disabled: false
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'rideshare':
        return <RidesharingDashboard />;
      case 'traffic':
        return <div>Dopravní monitoring bude dostupný brzy</div>;
      default:
        return <RidesharingDashboard />;
    }
  };

  return (
    <ResponsiveContainer className="py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('travelPlanning')}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('travelDescription')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            stats={feature.stats}
            isActive={activeTab === feature.id}
            onClick={() => setActiveTab(feature.id)}
            disabled={feature.disabled}
          />
        ))}
      </motion.div>

      {/* Mobile Quick Actions */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {features.map((feature) => (
            <Button
              key={feature.id}
              variant={activeTab === feature.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(feature.id)}
              className={cn(
                "flex-shrink-0 min-h-[44px] touch-manipulation",
                "transition-all duration-200"
              )}
              disabled={feature.disabled}
            >
              {feature.icon}
              <span className="ml-2">{feature.title}</span>
            </Button>
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-h-[400px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </ResponsiveContainer>
  );
};

export default TravelHub;