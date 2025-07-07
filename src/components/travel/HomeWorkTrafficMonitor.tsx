import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, MapPin, RefreshCw, Navigation } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useAuthState } from '@/hooks/useAuthState';
import { trafficService } from '@/services/trafficService';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface TrafficProblem {
  route: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  delay: string;
  recommendations: string[];
}

const HomeWorkTrafficMonitor: React.FC = () => {
  const { homeAddress, workAddress, loading: addressesLoading } = useUserAddresses();
  const { user } = useAuthState();
  const { t } = useTranslation('travel');
  const [trafficProblems, setTrafficProblems] = useState<TrafficProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const checkTrafficProblems = async () => {
    if (!homeAddress || !workAddress || !user?.id) {
      toast.error(t('missingAddresses'));
      return;
    }

    setIsLoading(true);
    try {
      // Kontrola dopravy domov → práce
      const homeToWorkData = await trafficService.getTrafficData(
        homeAddress,
        workAddress,
        'driving',
        ['driving'],
        user.id
      );

      // Kontrola dopravy práce → domov
      const workToHomeData = await trafficService.getTrafficData(
        workAddress,
        homeAddress,
        'driving',
        ['driving'],
        user.id
      );

      const problems: TrafficProblem[] = [];

      // Analyzuj trasu domov → práce
      const homeToWorkRoutes = homeToWorkData.routes || homeToWorkData.multi_modal_results?.[0]?.routes || [];
      homeToWorkRoutes.forEach((route, index) => {
        const routeProblems = analyzeRouteProblems(route, t('homeToWork'), index);
        problems.push(...routeProblems);
      });

      // Analyzuj trasu práce → domov  
      const workToHomeRoutes = workToHomeData.routes || workToHomeData.multi_modal_results?.[0]?.routes || [];
      workToHomeRoutes.forEach((route, index) => {
        const routeProblems = analyzeRouteProblems(route, t('workToHome'), index);
        problems.push(...routeProblems);
      });

      setTrafficProblems(problems);
      setLastUpdated(new Date());
      
      if (problems.length === 0) {
        toast.success(t('noTrafficProblemsFound'));
      } else {
        toast.warning(t('trafficProblemsFound', { count: problems.length }));
      }
    } catch (error) {
      console.error(t('trafficCheckError'), error);
      toast.error(t('trafficCheckFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeRouteProblems = (route: any, routeName: string, routeIndex: number): TrafficProblem[] => {
    const problems: TrafficProblem[] = [];
    const routeLabel = route.summary ? `${routeName} (${route.summary})` : `${routeName} - trasa ${routeIndex + 1}`;
    
    // Check for high-priority incidents
    if (route.incidents && route.incidents.length > 0) {
      const highPriorityIncidents = route.incidents.filter((incident: any) => incident.severity === 'high');
      if (highPriorityIncidents.length > 0) {
        problems.push({
          route: routeLabel,
          severity: 'high',
          description: t('seriousTrafficEvents'),
          delay: route.duration_in_traffic || route.duration,
          recommendations: [t('avoidRoute'), t('tryAlternative'), t('waitForResolution')]
        });
      }
    }
    
    // Check for warnings (closures, etc.)
    if (route.warnings && route.warnings.length > 0) {
      const hasClosures = route.warnings.some((warning: string) => 
        warning.toLowerCase().includes('uzavřen') || 
        warning.toLowerCase().includes('closure') ||
        warning.toLowerCase().includes('nehoda')
      );
      
      if (hasClosures) {
        problems.push({
          route: routeLabel,
          severity: 'high',
          description: t('closuresOrAccidents'),
          delay: route.duration_in_traffic || route.duration,
          recommendations: [t('useAlternativeRoute'), t('checkCurrentSituation')]
        });
      } else {
        problems.push({
          route: routeLabel,
          severity: 'medium',
          description: t('trafficWarningsOnRoute'),
          delay: route.duration_in_traffic || route.duration,
          recommendations: [t('monitorTraffic'), t('beCautious')]
        });
      }
    }
    
    // Check traffic conditions
    if (route.traffic_conditions === 'heavy') {
      problems.push({
        route: routeLabel,
        severity: 'high',
        description: t('heavyTrafficOnRoute'),
        delay: route.duration_in_traffic || route.duration,
        recommendations: [t('leaveEarlier'), t('tryAlternativeRoute')]
      });
    } else if (route.traffic_conditions === 'normal' && route.duration_in_traffic !== route.duration) {
      // Only add if there's actual delay
      const delayMatch = route.duration_in_traffic?.match(/\d+/) && route.duration?.match(/\d+/);
      if (delayMatch) {
        const trafficTime = parseInt(route.duration_in_traffic.match(/\d+/)[0]);
        const normalTime = parseInt(route.duration.match(/\d+/)[0]);
        if (trafficTime > normalTime + 5) { // At least 5 minutes delay
          problems.push({
            route: routeLabel,
            severity: 'medium',
            description: t('minorDelayOnRoute', { delay: trafficTime - normalTime }),
            delay: route.duration_in_traffic || route.duration,
            recommendations: [t('monitorTraffic'), t('leaveSlightlyEarlier')]
          });
        }
      }
    }
    
    return problems;
  };

  useEffect(() => {
    if (homeAddress && workAddress && user?.id) {
      checkTrafficProblems();
    }
  }, [homeAddress, workAddress, user?.id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      default: return Navigation;
    }
  };

  if (addressesLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
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
            <MapPin className="h-5 w-5 text-primary" />
            {t('trafficControlTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('addressesRequired')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('setupAddresses')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            {t('trafficMonitor')}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkTrafficProblems}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('update')}
          </Button>
        </CardTitle>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            {t('lastUpdated')}: {lastUpdated.toLocaleTimeString('cs-CZ')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Zobrazení adres */}
          <div className="grid gap-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="font-medium">{t('homeAddress')}:</span> {homeAddress}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{t('workAddress')}:</span> {workAddress}
            </div>
          </div>

          {/* Dopravní problémy */}
          {trafficProblems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">{t('allGood')}</h4>
                <p className="text-sm text-green-700">
                  {t('noSignificantProblems')}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                {t('foundTrafficProblems')} ({trafficProblems.length})
              </h4>
              
              {trafficProblems.map((problem, index) => {
                const SeverityIcon = getSeverityIcon(problem.severity);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getSeverityColor(problem.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <SeverityIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">{problem.route}</h5>
                          <Badge variant="outline" className="text-xs">
                            {problem.severity === 'high' ? t('high') : 
                             problem.severity === 'medium' ? t('medium') : t('low')}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{problem.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {problem.delay}
                          </span>
                        </div>
                        
                        {problem.recommendations.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">{t('recommendations')}:</p>
                            <ul className="text-xs list-disc list-inside space-y-0.5 opacity-80">
                              {problem.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeWorkTrafficMonitor;