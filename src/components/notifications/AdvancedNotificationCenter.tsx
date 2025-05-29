
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Brain, 
  Clock, 
  MapPin, 
  Smartphone, 
  TrendingUp,
  Settings,
  Users,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

interface AdvancedNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedNotificationCenter: React.FC<AdvancedNotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const {
    isInitialized,
    permissionGranted,
    behaviorPattern,
    requestPermission,
    syncAcrossDevices,
    analyzeUserBehavior
  } = useAdvancedNotifications();

  const [smartScheduling, setSmartScheduling] = useState(true);
  const [contextAware, setContextAware] = useState(true);
  const [batchNotifications, setBatchNotifications] = useState(false);

  if (!isOpen) return null;

  const handleAnalyzeClick = async () => {
    // Mock interaction data for demo
    const mockInteractions = [
      { timestamp: new Date(), type: 'learning', responded: true, device: 'mobile' },
      { timestamp: new Date(Date.now() - 3600000), type: 'shift', responded: false, device: 'desktop' },
      // Add more mock data...
    ];
    
    await analyzeUserBehavior(mockInteractions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Pokročilé notifikace
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            Zavřít
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Přehled</TabsTrigger>
              <TabsTrigger value="behavior">Chování</TabsTrigger>
              <TabsTrigger value="settings">Nastavení</TabsTrigger>
              <TabsTrigger value="analytics">Analytika</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Stav systému
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Inicializováno</span>
                        <Badge variant={isInitialized ? "default" : "secondary"}>
                          {isInitialized ? "Ano" : "Ne"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Oprávnění</span>
                        <Badge variant={permissionGranted ? "default" : "destructive"}>
                          {permissionGranted ? "Povoleno" : "Zamítnuto"}
                        </Badge>
                      </div>
                      {!permissionGranted && (
                        <Button 
                          onClick={requestPermission}
                          size="sm" 
                          className="w-full mt-2"
                        >
                          Povolit notifikace
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Rychlé akce
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        onClick={syncAcrossDevices}
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Synchronizovat
                      </Button>
                      <Button 
                        onClick={handleAnalyzeClick}
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Analyzovat chování
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Inteligentní funkce
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Smart plánování</span>
                        <Switch 
                          checked={smartScheduling}
                          onCheckedChange={setSmartScheduling}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Context-aware</span>
                        <Switch 
                          checked={contextAware}
                          onCheckedChange={setContextAware}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dávky</span>
                        <Switch 
                          checked={batchNotifications}
                          onCheckedChange={setBatchNotifications}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              {behaviorPattern ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preferované časy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {behaviorPattern.preferredTimes
                          .filter(time => time.score > 0.3)
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 5)
                          .map(time => (
                            <div key={time.hour} className="flex items-center justify-between">
                              <span className="text-sm">{time.hour}:00</span>
                              <div className="flex items-center gap-2">
                                <Progress value={time.score * 100} className="w-16 h-2" />
                                <span className="text-xs text-gray-500">
                                  {Math.round(time.score * 100)}%
                                </span>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Míra odezvy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {behaviorPattern.responseRates.map(rate => (
                          <div key={rate.type} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{rate.type}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={rate.rate * 100} className="w-16 h-2" />
                              <span className="text-xs text-gray-500">
                                {Math.round(rate.rate * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Zařízení
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {behaviorPattern.devicePreferences.map((device, index) => (
                          <div key={device} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{device}</span>
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {index === 0 ? "Preferované" : "Sekundární"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Skóre zapojení
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {Math.round(behaviorPattern.engagementScore * 100)}%
                        </div>
                        <Progress value={behaviorPattern.engagementScore * 100} className="mb-2" />
                        <p className="text-sm text-gray-600">
                          {behaviorPattern.engagementScore > 0.7 ? 'Vysoké zapojení' : 
                           behaviorPattern.engagementScore > 0.4 ? 'Střední zapojení' : 'Nízké zapojení'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Zatím nemáme dostatek dat pro analýzu vašeho chování
                    </p>
                    <Button onClick={handleAnalyzeClick}>
                      Spustit analýzu
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Inteligentní nastavení
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Adaptivní plánování</p>
                        <p className="text-xs text-gray-500">Automaticky optimalizuje časy notifikací</p>
                      </div>
                      <Switch checked={smartScheduling} onCheckedChange={setSmartScheduling} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Kontextové notifikace</p>
                        <p className="text-xs text-gray-500">Používá polohu a aktivitu pro lepší načasování</p>
                      </div>
                      <Switch checked={contextAware} onCheckedChange={setContextAware} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Dávkové notifikace</p>
                        <p className="text-xs text-gray-500">Seskupuje podobné notifikace dohromady</p>
                      </div>
                      <Switch checked={batchNotifications} onCheckedChange={setBatchNotifications} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Denní statistiky</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Odesláno dnes</span>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Otevřeno</span>
                        <span className="text-sm font-medium">8 (67%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Akcí provedeno</span>
                        <span className="text-sm font-medium">5 (42%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Týdenní trendy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Průměrná odezva</span>
                        <span className="text-sm font-medium">73%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Nejlepší den</span>
                        <span className="text-sm font-medium">Středa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Preferovaný čas</span>
                        <span className="text-sm font-medium">14:00-16:00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
