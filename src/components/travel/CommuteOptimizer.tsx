
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Train, Bus, Bike } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const CommuteOptimizer = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [transportModes, setTransportModes] = useState<string[]>(['car', 'public']);
  const [optimizationPreference, setOptimizationPreference] = useState('time');
  const isMobile = useIsMobile();
  
  const transportOptions = [
    { id: 'car', name: 'Auto', icon: Car },
    { id: 'public', name: 'Veřejná doprava', icon: Train },
    { id: 'bus', name: 'Autobus', icon: Bus },
    { id: 'bike', name: 'Kolo', icon: Bike },
  ];
  
  const handleTransportToggle = (mode: string) => {
    setTransportModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };
  
  const handleOptimize = () => {
    if (!origin || !destination) {
      toast({
        title: "Chybí údaje",
        description: "Zadejte prosím místo odjezdu a cíl.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would call an API to get optimized routes
    toast({
      title: "Trasa optimalizována",
      description: `Byla nalezena nejlepší trasa pro ${origin} → ${destination}.`,
    });
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
      <Card>
        <CardHeader>
          <CardTitle>Optimalizace dojíždění</CardTitle>
          <CardDescription>Najděte nejefektivnější způsob dojíždění do práce a zpět.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Místo odjezdu</Label>
            <Input 
              id="origin" 
              placeholder="Zadejte adresu nebo místo odjezdu" 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Cíl cesty</Label>
            <Input 
              id="destination" 
              placeholder="Zadejte adresu nebo cíl cesty" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="departure-time">Čas odjezdu</Label>
            <Input 
              id="departure-time" 
              type="time" 
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dopravní prostředky</Label>
            <div className="flex flex-wrap gap-2">
              {transportOptions.map(option => (
                <Button
                  key={option.id}
                  variant={transportModes.includes(option.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTransportToggle(option.id)}
                  className="flex items-center gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preference">Preferovat</Label>
            <Select 
              value={optimizationPreference} 
              onValueChange={setOptimizationPreference}
            >
              <SelectTrigger id="preference">
                <SelectValue placeholder="Vyberte preferenci" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Nejrychlejší trasa</SelectItem>
                <SelectItem value="cost">Nejlevnější trasa</SelectItem>
                <SelectItem value="eco">Ekologická trasa</SelectItem>
                <SelectItem value="balance">Vyvážená optimalizace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleOptimize}
            className="w-full mt-2"
          >
            Optimalizovat trasu
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Optimalizované trasy</CardTitle>
          <CardDescription>Výsledky optimalizace vašich cest.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground">
            <p>Zadejte místo odjezdu a cíl pro zobrazení optimalizovaných tras.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommuteOptimizer;
