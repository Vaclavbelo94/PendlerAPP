import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Navigation,
  RefreshCw,
  Bell,
  BarChart3,
  Route,
  Timer,
  Car,
  Activity
} from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { trafficService } from '@/services/trafficService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface TrafficUpdate {
  current_duration: number;
  normal_duration: number;
  traffic_level: 'excellent' | 'good' | 'fair' | 'poor';
  incidents: any[];
  weather_impact: any;
  last_updated: string;
}

const DHLRealTimeTrafficMonitor: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation('travel');
  const { homeAddress, loading: addressLoading } = useUserAddresses();
  
  const [trafficData, setTrafficData] = useState<TrafficUpdate | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nextUpdateIn, setNextUpdateIn] = useState(300); // 5 minutes
  const [smartAlertsEnabled, setSmartAlertsEnabled] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // DHL destination address
  const dhlDestination = "DHL-Ottendorf, Bergener Ring, Ottendorf-Okrilla, Deutschland";
  
  useEffect(() => {
    if (homeAddress && !addressLoading) {
      loadTrafficData();
    }
  }, [homeAddress, addressLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && homeAddress) {
      interval = setInterval(() => {
        setNextUpdateIn(prev => {
          if (prev <= 1) {
            loadTrafficData();
            return 300; // Reset to 5 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, homeAddress]);

  const loadTrafficData = async () => {
    if (!homeAddress || !user) return;
    
    setLoading(true);
    try {
      // Get traffic data from service
      const traffic = await trafficService.getTrafficData(homeAddress, dhlDestination, 'driving', ['driving'], user.id);
      
      // Process and store data
      const processedData: TrafficUpdate = {
        current_duration: traffic.routes?.[0]?.duration_in_traffic ? 
          parseInt(traffic.routes[0].duration_in_traffic.split(' ')[0]) : 0,
        normal_duration: traffic.routes?.[0]?.duration ? 
          parseInt(traffic.routes[0].duration.split(' ')[0]) : 0,
        traffic_level: getTrafficLevel(traffic.routes?.[0]?.traffic_conditions),
        incidents: traffic.routes?.[0]?.incidents || [],
        weather_impact: {},
        last_updated: new Date().toISOString()
      };
      
      setTrafficData(processedData);
      
      // Store in database
      await supabase.from('real_time_traffic_data').upsert({
        user_id: user.id,
        route_origin: homeAddress,
        route_destination: dhlDestination,
        current_duration: processedData.current_duration,
        normal_duration: processedData.normal_duration,
        traffic_level: processedData.traffic_level,
        incidents: processedData.incidents,
        weather_impact: processedData.weather_impact,
        last_updated: processedData.last_updated
      });
      
    } catch (error) {
      console.error('Error loading traffic data:', error);
      toast({
        title: t('trafficCheckError'),
        description: t('error'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrafficLevel = (condition: string): 'excellent' | 'good' | 'fair' | 'poor' => {
    switch (condition) {
      case 'light': return 'excellent';
      case 'normal': return 'good';
      case 'heavy': return 'fair';
      case 'severe': return 'poor';
      default: return 'good';
    }
  };

  const getTrafficLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSmartDepartureRecommendation = () => {
    if (!trafficData) return null;
    
    const delayMinutes = trafficData.current_duration - trafficData.normal_duration;
    const now = new Date();
    const recommendedTime = new Date(now.getTime() + (delayMinutes * 60000));
    
    if (delayMinutes <= 2) {
      return {
        action: t('leaveNow'),
        reason: t('optimalRoute'),
        color: 'text-green-600'
      };
    } else if (delayMinutes <= 10) {
      return {
        action: `${t('leaveIn')} ${Math.max(5, delayMinutes)} ${t('waitMinutes')}`,
        reason: t('trafficImproving'),
        color: 'text-yellow-600'
      };
    } else {
      return {
        action: t('leaveEarlier'),
        reason: t('trafficWorsening'),
        color: 'text-red-600'
      };
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (addressLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!homeAddress) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {t('addressesRequired')}
        </AlertDescription>
      </Alert>
    );
  }

  const recommendation = getSmartDepartureRecommendation();

  return (
    <div className="space-y-6">
      {/* Quick Route Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              {t('quickDHLRoute')}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTrafficData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('update')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium truncate">{homeAddress}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium text-primary">DHL Ottendorf</span>
            </div>
            
            {/* Route Duration Display */}
            {trafficData && (
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {t('routeShouldTake')}:
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatTime(trafficData.current_duration)}
                  </div>
                </div>
                {trafficData.current_duration !== trafficData.normal_duration && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t('normal')}: {formatTime(trafficData.normal_duration)}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Traffic Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {t('realTimeMonitoring')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('autoRefresh')}
              </span>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trafficData ? (
            <div className="space-y-4">
              {/* Traffic Quality Badge */}
              <div className="flex items-center justify-between">
                <Badge 
                  className={`px-4 py-2 text-base ${getTrafficLevelColor(trafficData.traffic_level)}`}
                >
                  {t('routeQuality')}: {t(trafficData.traffic_level)}
                </Badge>
                {autoRefresh && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    {t('nextUpdate')}: {Math.floor(nextUpdateIn / 60)}:{(nextUpdateIn % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Duration Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('currentStatus')}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatTime(trafficData.current_duration)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('normal')}</span>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {formatTime(trafficData.normal_duration)}
                  </div>
                </div>
              </div>

              {/* Smart Departure Recommendation */}
              {recommendation && (
                <Alert className="border-l-4 border-l-primary">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div className="font-semibold text-primary">
                        {t('smartDeparture')}
                      </div>
                      <div className={`text-base ${recommendation.color}`}>
                        {recommendation.action}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recommendation.reason}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Incidents Display */}
              {trafficData.incidents.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        {t('trafficIncidents')} ({trafficData.incidents.length})
                      </div>
                      {trafficData.incidents.slice(0, 2).map((incident, idx) => (
                        <div key={idx} className="text-sm">
                          • {incident.description || incident}
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Last Updated */}
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t('lastUpdated')}: {new Date(trafficData.last_updated).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t('noSignificantProblems')}
              </p>
              <Button onClick={loadTrafficData} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                {t('trafficStatus')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t('smartNotifications')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">{t('enableSmartAlerts')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('morningBriefingAlert')}
                </div>
              </div>
              <Switch
                checked={smartAlertsEnabled}
                onCheckedChange={setSmartAlertsEnabled}
              />
            </div>
            
            {smartAlertsEnabled && (
              <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                <div className="text-sm">
                  <div className="font-medium mb-1">{t('departureAlerts')}</div>
                  <div className="text-muted-foreground">
                    {t('morningBriefing')} • 07:00
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">{t('trafficChangeAlerts')}</div>
                  <div className="text-muted-foreground">
                    {t('realTimeUpdates')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('trafficAnalytics')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              {showAnalytics ? 'Skrýt' : 'Zobrazit'}
            </Button>
          </div>
        </CardHeader>
        {showAnalytics && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">15min</div>
                <div className="text-sm text-muted-foreground">{t('timesSaved')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">2.1L</div>
                <div className="text-sm text-muted-foreground">{t('fuelSaved')}</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DHLRealTimeTrafficMonitor;