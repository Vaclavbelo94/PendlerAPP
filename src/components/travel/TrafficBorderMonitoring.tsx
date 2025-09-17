import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, ExternalLink, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrafficEvent {
  id: string;
  source: 'ndic' | 'autobahn';
  type: 'accident' | 'closure' | 'congestion' | 'warning';
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number];
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  detailUrl?: string;
  icon: string;
}

interface TrafficData {
  events: TrafficEvent[];
  route: {
    d8: {
      start: [number, number];
      end: [number, number];
      name: string;
    };
    a17: {
      coordinates: [number, number][];
      name: string;
    };
  };
  lastUpdate: string;
  totalEvents: number;
}

const TrafficBorderMonitoring: React.FC = () => {
  const { t } = useTranslation(['travel', 'common']);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrafficData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      
      const { data, error } = await supabase.functions.invoke('traffic-border-monitoring');
      
      if (error) throw error;
      
      setTrafficData(data);
      
      if (showRefreshToast) {
        toast.success('Dopravní data aktualizována');
      }
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      toast.error('Chyba při načítání dopravních dat');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchTrafficData();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSourceLabel = (source: string) => {
    return source === 'ndic' ? 'NDIC (ŘSD ČR)' : 'Autobahn.de';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Dopravní monitoring D8/A17
          </h2>
          <p className="text-muted-foreground text-sm">
            Aktuální situace na trase do Německa
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTrafficData(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Aktualizovat
        </Button>
      </div>

      {/* Stats Overview */}
      {trafficData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{trafficData.totalEvents}</div>
                  <div className="text-sm text-muted-foreground">Aktivní události</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">D8 km 82-92</div>
                  <div className="text-xs text-muted-foreground">+ navazující A17</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {trafficData.lastUpdate ? formatTimestamp(trafficData.lastUpdate) : 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Poslední aktualizace</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Traffic Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Aktuální události</h3>
        
        {!trafficData || trafficData.events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-medium mb-2">Žádné dopravní události</h3>
              <p className="text-muted-foreground">
                Na sledované trase D8/A17 nejsou aktuálně hlášeny žádné dopravní problémy.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {trafficData.events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{event.icon}</div>
                      <div>
                        <CardTitle className="text-base">{event.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getSourceLabel(event.source)}
                          </Badge>
                          <Badge variant={getSeverityColor(event.severity) as any} className="text-xs">
                            {event.severity === 'high' ? 'Vysoká' : 
                             event.severity === 'medium' ? 'Střední' : 'Nízká'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>{formatTimestamp(event.timestamp)}</div>
                      <div className="mt-1">{event.location}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  
                  {event.detailUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(event.detailUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Detail
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Route Info */}
      {trafficData?.route && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sledovaná trasa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="font-medium">🇨🇿 {trafficData.route.d8.name}</span>
                <span className="text-sm text-muted-foreground">
                  Směr hranice s Německem
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="font-medium">🇩🇪 {trafficData.route.a17.name}</span>
                <span className="text-sm text-muted-foreground">
                  Pokračování do Drážďan
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrafficBorderMonitoring;