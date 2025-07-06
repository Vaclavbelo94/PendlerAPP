import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface QuickRouteSelectorProps {
  onRouteSelect: (origin: string, destination: string) => void;
  className?: string;
}

export const QuickRouteSelector: React.FC<QuickRouteSelectorProps> = ({
  onRouteSelect,
  className = ''
}) => {
  const { quickRoutes, hasAddresses, loading } = useUserAddresses();
  const { t, i18n } = useTranslation('travel');

  if (loading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasAddresses) {
    return (
      <Card className={`${className} border-dashed border-2`}>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            {t('useMyAddresses')}
          </p>
          <p className="text-xs text-muted-foreground">
            Nastavte adresy v profilu pro rychlé vyhledávání
          </p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <a href="/profile">Nastavit adresy</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRouteLabel = (route: any) => {
    switch (i18n.language) {
      case 'de': return route.labelDE;
      case 'pl': return route.labelPL;
      default: return route.label;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          {t('quickRoutes')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-3 hover:bg-primary/5"
                onClick={() => onRouteSelect(route.origin, route.destination)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-1">
                    {route.id === 'home-to-work' ? (
                      <Home className="h-4 w-4 text-green-600" />
                    ) : (
                      <MapPin className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {getRouteLabel(route)}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {route.origin.substring(0, 30)}...
                    </div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickRouteSelector;