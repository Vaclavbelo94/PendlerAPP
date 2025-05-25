
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Car, Train, DollarSign, Fuel, Clock } from 'lucide-react';

interface CostCalculation {
  transport: string;
  distance: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  timeMinutes: number;
  co2Emissions: number;
}

const CommuteCostCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    distance: '',
    workDays: '22',
    fuelPrice: '35',
    consumption: '7',
    publicTransportPrice: '45',
    parkingCost: '0'
  });
  const [results, setResults] = useState<CostCalculation[]>([]);

  const calculateCosts = () => {
    const distance = parseFloat(formData.distance);
    const workDays = parseInt(formData.workDays);
    const fuelPrice = parseFloat(formData.fuelPrice);
    const consumption = parseFloat(formData.consumption);
    const publicPrice = parseFloat(formData.publicTransportPrice);
    const parking = parseFloat(formData.parkingCost);

    if (!distance || distance <= 0) return;

    const calculations: CostCalculation[] = [];

    // Výpočet pro auto
    const fuelCostPerKm = (consumption / 100) * fuelPrice;
    const carDailyCost = (distance * 2 * fuelCostPerKm) + parking; // tam i zpět
    const carTimeMinutes = Math.round((distance * 2) / 50 * 60); // průměrná rychlost 50 km/h

    calculations.push({
      transport: 'Auto',
      distance: distance * 2,
      dailyCost: carDailyCost,
      monthlyCost: carDailyCost * workDays,
      yearlyCost: carDailyCost * workDays * 12,
      timeMinutes: carTimeMinutes,
      co2Emissions: (distance * 2) * 0.12 // kg CO2 na km
    });

    // Výpočet pro veřejnou dopravu
    const publicTimeMinutes = Math.round(carTimeMinutes * 1.5); // veřejná doprava je obvykle pomalejší

    calculations.push({
      transport: 'Veřejná doprava',
      distance: distance * 2,
      dailyCost: publicPrice,
      monthlyCost: publicPrice * workDays,
      yearlyCost: publicPrice * workDays * 12,
      timeMinutes: publicTimeMinutes,
      co2Emissions: (distance * 2) * 0.05 // kg CO2 na km
    });

    // Výpočet pro kombinovanou dopravu (auto + vlak)
    const combinedDailyCost = carDailyCost * 0.3 + publicPrice * 0.8; // mix
    const combinedTimeMinutes = Math.round((carTimeMinutes + publicTimeMinutes) / 2);

    calculations.push({
      transport: 'Kombinovaná',
      distance: distance * 2,
      dailyCost: combinedDailyCost,
      monthlyCost: combinedDailyCost * workDays,
      yearlyCost: combinedDailyCost * workDays * 12,
      timeMinutes: combinedTimeMinutes,
      co2Emissions: (distance * 2) * 0.08 // kg CO2 na km
    });

    setResults(calculations);
  };

  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'Auto': return <Car className="h-5 w-5" />;
      case 'Veřejná doprava': return <Train className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Kalkulačka nákladů na dojíždění
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="distance">Vzdálenost (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="50"
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workDays">Pracovních dní/měsíc</Label>
              <Input
                id="workDays"
                type="number"
                value={formData.workDays}
                onChange={(e) => setFormData(prev => ({ ...prev, workDays: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelPrice">Cena paliva (Kč/l)</Label>
              <Input
                id="fuelPrice"
                type="number"
                step="0.1"
                value={formData.fuelPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelPrice: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consumption">Spotřeba (l/100km)</Label>
              <Input
                id="consumption"
                type="number"
                step="0.1"
                value={formData.consumption}
                onChange={(e) => setFormData(prev => ({ ...prev, consumption: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicPrice">Veřejná doprava (Kč/den)</Label>
              <Input
                id="publicPrice"
                type="number"
                value={formData.publicTransportPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, publicTransportPrice: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parkování (Kč/den)</Label>
              <Input
                id="parking"
                type="number"
                value={formData.parkingCost}
                onChange={(e) => setFormData(prev => ({ ...prev, parkingCost: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={calculateCosts} className="w-full">
            Vypočítat náklady
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((result, index) => (
            <Card key={index} className={index === 0 ? 'border-primary' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTransportIcon(result.transport)}
                    <h3 className="font-semibold text-lg">{result.transport}</h3>
                  </div>
                  {index === 0 && (
                    <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                      Nejlevnější
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Denně</span>
                    </div>
                    <p className="text-xl font-bold">{result.dailyCost.toFixed(0)} Kč</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Měsíčně</span>
                    </div>
                    <p className="text-xl font-bold">{result.monthlyCost.toFixed(0)} Kč</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Čas</span>
                    </div>
                    <p className="text-xl font-bold">{result.timeMinutes} min</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">CO₂</span>
                    </div>
                    <p className="text-xl font-bold">{result.co2Emissions.toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Roční náklady:</strong> {result.yearlyCost.toLocaleString()} Kč
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommuteCostCalculator;
