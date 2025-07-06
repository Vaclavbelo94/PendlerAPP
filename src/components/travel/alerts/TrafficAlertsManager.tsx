import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Bell, Plus, Trash2, MapPin, Clock } from "lucide-react";
import { useAuth } from '@/hooks/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface TrafficAlert {
  id: string;
  route_origin: string;
  route_destination: string;
  alert_type: string;
  severity: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export const TrafficAlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<TrafficAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    route_origin: '',
    route_destination: '',
    alert_type: 'traffic_jam',
    severity: 'medium'
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('travel');

  useEffect(() => {
    if (user?.id) {
      loadTrafficAlerts();
    }
  }, [user]);

  const loadTrafficAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('traffic_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading traffic alerts:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se načíst dopravní upozornění',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!user?.id || !newAlert.route_origin || !newAlert.route_destination) {
      toast({
        title: t('error'),
        description: 'Vyplňte všechna povinná pole',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    try {
      const alertData = {
        user_id: user.id,
        route_origin: newAlert.route_origin,
        route_destination: newAlert.route_destination,
        alert_type: newAlert.alert_type,
        severity: newAlert.severity,
        message: `Upozornění na ${newAlert.alert_type} pro trasu ${newAlert.route_origin} → ${newAlert.route_destination}`,
        is_active: true
      };

      const { data, error } = await supabase
        .from('traffic_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;

      setAlerts(prev => [data, ...prev]);
      setNewAlert({
        route_origin: '',
        route_destination: '',
        alert_type: 'traffic_jam',
        severity: 'medium'
      });

      toast({
        title: t('success'),
        description: 'Dopravní upozornění bylo vytvořeno',
      });
    } catch (error) {
      console.error('Error creating traffic alert:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se vytvořit upozornění',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('traffic_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_active: isActive } : alert
      ));

      toast({
        title: t('success'),
        description: isActive ? 'Upozornění aktivováno' : 'Upozornění deaktivováno',
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se změnit stav upozornění',
        variant: 'destructive'
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('traffic_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));

      toast({
        title: t('success'),
        description: 'Upozornění bylo smazáno',
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se smazat upozornění',
        variant: 'destructive'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      traffic_jam: 'Dopravní zácpa',
      accident: 'Nehoda',
      construction: 'Stavební práce',
      weather: 'Počasí',
      event: 'Událost'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Dopravní upozornění
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nové dopravní upozornění
          </CardTitle>
          <CardDescription>
            Vytvořte si personalizovaná upozornění pro vaše oblíbené trasy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Odkud</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="origin"
                  className="pl-10"
                  placeholder="Výchozí místo"
                  value={newAlert.route_origin}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, route_origin: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Kam</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination"
                  className="pl-10"
                  placeholder="Cílové místo"
                  value={newAlert.route_destination}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, route_destination: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Typ upozornění</Label>
              <Select 
                value={newAlert.alert_type} 
                onValueChange={(value) => setNewAlert(prev => ({ ...prev, alert_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic_jam">Dopravní zácpa</SelectItem>
                  <SelectItem value="accident">Nehoda</SelectItem>
                  <SelectItem value="construction">Stavební práce</SelectItem>
                  <SelectItem value="weather">Počasí</SelectItem>
                  <SelectItem value="event">Událost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Závažnost</Label>
              <Select 
                value={newAlert.severity} 
                onValueChange={(value) => setNewAlert(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Nízká</SelectItem>
                  <SelectItem value="medium">Střední</SelectItem>
                  <SelectItem value="high">Vysoká</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={createAlert} 
            disabled={creating || !newAlert.route_origin || !newAlert.route_destination}
            className="w-full"
          >
            {creating ? 'Vytváření...' : 'Vytvořit upozornění'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Moje upozornění ({alerts.length})
          </CardTitle>
          <CardDescription>
            Spravujte svá dopravní upozornění
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatím nemáte žádná dopravní upozornění</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {getAlertTypeLabel(alert.alert_type)}
                          </Badge>
                          <Badge variant={alert.is_active ? "default" : "secondary"}>
                            {alert.is_active ? 'Aktivní' : 'Neaktivní'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.route_origin} → {alert.route_destination}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Vytvořeno {new Date(alert.created_at).toLocaleDateString('cs-CZ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {alert.message && (
                      <Alert>
                        <AlertDescription>
                          {alert.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAlertsManager;