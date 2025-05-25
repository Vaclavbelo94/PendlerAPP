
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, Trash2, MapPin, Clock, Car, Train, Bus, Bike } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { routeService, SavedRoute } from "@/services/routeService";

interface SavedRoutesProps {
  onLoadRoute?: (route: SavedRoute) => void;
}

const SavedRoutes = ({ onLoadRoute }: SavedRoutesProps) => {
  const { user } = useAuth();
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [routeName, setRouteName] = useState('');

  const transportIcons = {
    car: Car,
    public: Train,
    bus: Bus,
    bike: Bike,
  };

  useEffect(() => {
    if (user?.id) {
      loadSavedRoutes();
    }
  }, [user?.id]);

  const loadSavedRoutes = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const routes = await routeService.getSavedRoutes(user.id);
      setSavedRoutes(routes);
    } catch (error) {
      console.error('Error loading saved routes:', error);
      toast.error('Nepodařilo se načíst uložené trasy');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async (routeData: Omit<SavedRoute, 'id' | 'user_id'>) => {
    if (!user?.id || !routeName.trim()) return;

    try {
      await routeService.saveRoute({
        ...routeData,
        name: routeName.trim(),
        user_id: user.id
      });
      
      toast.success('Trasa byla uložena');
      setRouteName('');
      setSaveDialogOpen(false);
      loadSavedRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Nepodařilo se uložit trasu');
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await routeService.deleteSavedRoute(routeId);
      toast.success('Trasa byla smazána');
      loadSavedRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Nepodařilo se smazat trasu');
    }
  };

  const handleLoadRoute = (route: SavedRoute) => {
    onLoadRoute?.(route);
    toast.success(`Trasa "${route.name}" byla načtena`);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Pro ukládání tras se přihlaste</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Uložené trasy</h3>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Uložit aktuální trasu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uložit trasu</DialogTitle>
              <DialogDescription>
                Zadejte název pro uložení aktuální trasy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="route-name">Název trasy</Label>
                <Input
                  id="route-name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Např. Domů z práce"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Zrušit
                </Button>
                <Button 
                  onClick={() => handleSaveRoute({
                    name: routeName,
                    origin_address: '',
                    destination_address: '',
                    transport_modes: [],
                    optimization_preference: 'time'
                  })}
                  disabled={!routeName.trim()}
                >
                  Uložit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>Načítám uložené trasy...</p>
          </CardContent>
        </Card>
      ) : savedRoutes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nemáte žádné uložené trasy</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {savedRoutes.map((route) => (
            <Card key={route.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{route.name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{route.origin_address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{route.destination_address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {route.transport_modes.map((mode) => {
                        const Icon = transportIcons[mode as keyof typeof transportIcons];
                        return Icon ? (
                          <Badge key={mode} variant="outline" className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {mode}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleLoadRoute(route)}
                    >
                      Načíst
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteRoute(route.id!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRoutes;
