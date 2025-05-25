
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Leaf, Route, Save } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RouteOption {
  id: string;
  duration: string;
  cost: string;
  co2: string;
  transfers: number;
  modes: string[];
  distance: string;
}

interface ResultsDisplayProps {
  hasInput: boolean;
}

// Mock data pro demonstraci
const mockRoutes: RouteOption[] = [
  {
    id: '1',
    duration: '45 min',
    cost: '120 Kč',
    co2: '2.5 kg',
    transfers: 1,
    modes: ['metro', 'bus'],
    distance: '15.2 km'
  },
  {
    id: '2',
    duration: '35 min',
    cost: '85 Kč',
    co2: '8.2 kg',
    transfers: 0,
    modes: ['car'],
    distance: '18.7 km'
  },
  {
    id: '3',
    duration: '55 min',
    cost: '95 Kč',
    co2: '1.8 kg',
    transfers: 2,
    modes: ['tram', 'metro'],
    distance: '16.1 km'
  }
];

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ hasInput }) => {
  const isMobile = useIsMobile();

  if (!hasInput) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Zadejte výchozí bod a cíl pro zobrazení optimalizovaných tras.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <Route className="h-5 w-5" />
            Doporučené trasy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRoutes.map((route, index) => (
              <div
                key={route.id}
                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                  index === 0 ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Doporučeno
                      </Badge>
                    )}
                    <div className="flex gap-1">
                      {route.modes.map((mode, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 text-sm`}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{route.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{route.cost}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-muted-foreground" />
                    <span>{route.co2}</span>
                  </div>
                  
                  <div className="text-muted-foreground">
                    {route.transfers} přestupů • {route.distance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
