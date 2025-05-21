
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const MapFilters: React.FC = () => {
  const [distance, setDistance] = useState<number[]>([50]);
  const [showPublicTransport, setShowPublicTransport] = useState(true);
  const [showCarRoutes, setShowCarRoutes] = useState(true);
  const [showPendlerCommunities, setShowPendlerCommunities] = useState(true);
  const [transportType, setTransportType] = useState("all");
  const [homeCountry, setHomeCountry] = useState("cz");
  
  const handleApplyFilters = () => {
    // V reálné implementaci by zde byl kód pro aplikování filtrů na mapu
    // Pro tuto ukázku jen vypíšeme hodnoty do konzole
    console.log({
      maxDistance: distance[0],
      showPublicTransport,
      showCarRoutes,
      showPendlerCommunities,
      transportType,
      homeCountry
    });
    
    alert("Filtry byly aplikovány!");
  };
  
  const handleResetFilters = () => {
    setDistance([50]);
    setShowPublicTransport(true);
    setShowCarRoutes(true);
    setShowPendlerCommunities(true);
    setTransportType("all");
    setHomeCountry("cz");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtry a nastavení mapy</CardTitle>
        <CardDescription>
          Přizpůsobte zobrazení mapy podle vašich preferencí
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="distance">Maximální vzdálenost dojíždění ({distance}km)</Label>
            <Slider
              id="distance"
              defaultValue={[50]}
              min={10}
              max={200}
              step={5}
              value={distance}
              onValueChange={setDistance}
              className="mt-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dopravní prostředky</Label>
            <RadioGroup value={transportType} onValueChange={setTransportType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Všechny</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="car" id="car" />
                <Label htmlFor="car">Pouze auto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Pouze veřejná doprava</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Země bydliště</Label>
            <Select value={homeCountry} onValueChange={setHomeCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte zemi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cz">Česká republika</SelectItem>
                <SelectItem value="de">Německo</SelectItem>
                <SelectItem value="at">Rakousko</SelectItem>
                <SelectItem value="sk">Slovensko</SelectItem>
                <SelectItem value="pl">Polsko</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Zobrazení na mapě</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-public" className="cursor-pointer">Zobrazit veřejnou dopravu</Label>
              <Switch
                id="show-public"
                checked={showPublicTransport}
                onCheckedChange={setShowPublicTransport}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-car-routes" className="cursor-pointer">Zobrazit automobilové trasy</Label>
              <Switch
                id="show-car-routes"
                checked={showCarRoutes}
                onCheckedChange={setShowCarRoutes}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-communities" className="cursor-pointer">Zobrazit komunity pendlerů</Label>
              <Switch
                id="show-communities"
                checked={showPendlerCommunities}
                onCheckedChange={setShowPendlerCommunities}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleResetFilters}
          >
            Resetovat
          </Button>
          
          <Button
            onClick={handleApplyFilters}
          >
            Aplikovat filtry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapFilters;
