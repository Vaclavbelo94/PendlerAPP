
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Navigation, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { trafficService } from '@/services/trafficService';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface TrafficProblem {
  severity: 'low' | 'medium' | 'high';
  message: string;
  route: string;
  recommendations: string[];
}

const HomeWorkTrafficMonitor: React.FC = () => {
  const { t } = useTranslation('travel');
  const { user } = useAuth();
  const { homeAddress, workAddress, loading: addressesLoading } = useUserAddresses();
  const [problems, setProblems] = useState<TrafficProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const checkTrafficProblems = async () => {
    if (!homeAddress || !workAddress || !user) return;
    
    setIsLoading(true);
    try {
      const routes = [
        { origin: homeAddress, destination: workAddress, name: t('homeToWork') },
        { origin: workAddress, destination: homeAddress, name: t('workToHome') }
      ];

      const foundProblems: TrafficProblem[] = [];

      for (const route of routes) {
        try {
          const data = await trafficService.getTrafficData(
            route.origin,
            route.destination,
            'driving',
            ['driving'],
            user.id
          );

          if (data.routes && data.routes.length > 0) {
            const mainRoute = data.routes[0];
            
            // Check for serious traffic problems
            if (mainRoute.warnings && mainRoute.warnings.length > 0) {
              foundProblems.push({
                severity: 'high',
                message: t('seriousTrafficEvents'),
                route: route.name,
                recommendations: [t('avoidRoute'), t('tryAlternative'), t('waitForResolution')]
              });
            }

            // Check for incidents
            if (mainRoute.incidents && mainRoute.incidents.length > 0) {
              foundProblems.push({
                severity: 'medium',
                message: t('closuresOrAccidents'),
                route: route.name,
                recommendations: [t('useAlternativeRoute'), t('checkCurrentSituation')]
              });
            }

            // Check traffic conditions
            if (mainRoute.traffic_conditions === 'heavy') {
              foundProblems.push({
                severity: 'medium',
                message: t('heavyTrafficOnRoute'),
                route: route.name,
                recommendations: [t('leaveEarlier'), t('tryAlternativeRoute')]
              });
            }
          }
        } catch (error) {
          console.error(`Error checking traffic for ${route.name}:`, error);
        }
      }

      setProblems(foundProblems);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error checking traffic:', error);
      toast.error(t('trafficCheckError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (homeAddress && workAddress) {
      checkTrafficProblems();
    }
  }, [homeAddress, workAddress]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200 dark:text-red-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400';
      case 'low': return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <TrendingUp className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (addressesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {t('trafficControlTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!homeAddress || !workAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            {t('trafficControlTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              {t('addressesRequired')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {t('trafficControlTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('trafficMonitor')}
            </p>
          </div>
        </div>
        
        <Button
          onClick={checkTrafficProblems}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('update')}
        </Button>
      </div>

      {/* Route Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {t('homeAddress')}
            </CardTitle>
            <CardDescription className="text-sm truncate text-left break-words">
              {homeAddress}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {t('workAddress')}
            </CardTitle>
            <CardDescription className="text-sm truncate text-left break-words">
              {workAddress}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {t('trafficStatus')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={problems.length > 0 ? "destructive" : "default"}>
                {problems.length > 0 ? `${problems.length} ${t('problems')}` : t('allGood')}
              </Badge>
              {lastUpdate && (
                <span className="text-xs text-muted-foreground">
                  {t('lastUpdated')}: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {problems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('noSignificantProblems')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                {t('foundTrafficProblems')}
              </h3>
              
              {problems.map((problem, index) => (
                <div key={index} className="animate-fade-in">
                  <Alert className={getSeverityColor(problem.severity)}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(problem.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{problem.route}</span>
                          <Badge variant="outline" className="text-xs">
                            {t(problem.severity)}
                          </Badge>
                        </div>
                        <AlertDescription className="mb-3">
                          {problem.message}
                        </AlertDescription>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{t('recommendations')}:</p>
                          <ul className="text-sm space-y-1">
                            {problem.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-current rounded-full" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Alert>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeWorkTrafficMonitor;
