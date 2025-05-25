
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Trash2, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { routeService, SavedRoute } from '@/services/routeService';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface SavedRoutesProps {
  onRouteSelect?: (route: SavedRoute) => void;
}

const SavedRoutes: React.FC<SavedRoutesProps> = ({ onRouteSelect }) => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.id) {
      loadSavedRoutes();
    }
  }, [user?.id]);

  const loadSavedRoutes = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const routes = await routeService.getSavedRoutes(user.id);
      setSavedRoutes(routes);
    } catch (error) {
      console.error('Error loading saved routes:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst uložené trasy.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      await routeService.deleteSavedRoute(routeId);
      setSavedRoutes(prev => prev.filter(route => route.id !== routeId));
      toast({
        title: "Úspěch",
        description: "Trasa byla smazána."
      });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat trasu.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Pro ukládání tras se prosím přihlaste.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Načítám uložené trasy...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
          <Bookmark className="h-5 w-5" />
          Uložené trasy
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedRoutes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Zatím nemáte žádné uložené trasy.
          </p>
        ) : (
          <div className="space-y-3">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {route.name}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {route.origin_address} → {route.destination_address}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {route.transport_modes.map((mode) => (
                      <Badge key={mode} variant="secondary" className="text-xs">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  {onRouteSelect && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRouteSelect(route)}
                      className="h-8 w-8 p-0"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => route.id && handleDeleteRoute(route.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedRoutes;
