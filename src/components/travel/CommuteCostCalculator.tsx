
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Euro, DollarSign, Fuel, Car, Train } from "lucide-react";

const CommuteCostCalculator = () => {
  const [transportMode, setTransportMode] = useState("car");
  const [distance, setDistance] = useState("50");
  const [frequency, setFrequency] = useState("22"); // Default 22 working days per month
  const [fuelPrice, setFuelPrice] = useState("40"); // CZK per liter
  const [fuelConsumption, setFuelConsumption] = useState("7"); // L/100km
  const [publicTransportCost, setPublicTransportCost] = useState("200"); // CZK per day
  const [includeWearAndTear, setIncludeWearAndTear] = useState(true);
  const [includeTolls, setIncludeTolls] = useState(false);
  const [tollCost, setTollCost] = useState("0");
  
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [yearlyCost, setYearlyCost] = useState(0);
  const [annualCO2, setAnnualCO2] = useState(0);
  
  const handleCalculate = () => {
    const distanceNum = parseFloat(distance);
    const frequencyNum = parseFloat(frequency);
    const fuelPriceNum = parseFloat(fuelPrice);
    const fuelConsumptionNum = parseFloat(fuelConsumption);
    const publicTransportCostNum = parseFloat(publicTransportCost);
    const tollCostNum = parseFloat(tollCost);
    
    let costPerMonth = 0;
    
    if (transportMode === "car") {
      // Fuel cost calculation: distance * 2 (round trip) * days per month * fuel consumption / 100 * fuel price
      const fuelCostPerMonth = distanceNum * 2 * frequencyNum * (fuelConsumptionNum / 100) * fuelPriceNum;
      
      // Add wear and tear (approx. 3 CZK per km)
      const wearAndTearPerMonth = includeWearAndTear ? distanceNum * 2 * frequencyNum * 3 : 0;
      
      // Add tolls
      const tollsPerMonth = includeTolls ? tollCostNum * frequencyNum : 0;
      
      costPerMonth = fuelCostPerMonth + wearAndTearPerMonth + tollsPerMonth;
    } else if (transportMode === "public") {
      // Public transport cost calculation: cost per day * days per month
      costPerMonth = publicTransportCostNum * frequencyNum;
    }
    
    const costPerYear = costPerMonth * 12;
    
    // Calculate CO2 emissions (rough estimate: 120g CO2 per km for car, 50g for public transport)
    const co2PerKm = transportMode === "car" ? 120 : 50;
    const annualCO2Emissions = distanceNum * 2 * frequencyNum * 12 * co2PerKm / 1000; // in kg
    
    setMonthlyCost(Math.round(costPerMonth));
    setYearlyCost(Math.round(costPerYear));
    setAnnualCO2(Math.round(annualCO2Emissions));
  };
  
  // Calculate automatically when values change
  useEffect(() => {
    handleCalculate();
  }, [
    transportMode, 
    distance, 
    frequency, 
    fuelPrice, 
    fuelConsumption, 
    publicTransportCost, 
    includeWearAndTear, 
    includeTolls, 
    tollCost
  ]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Kalkulačka nákladů na dojíždění</CardTitle>
          <CardDescription>
            Vypočítejte si měsíční a roční náklady na dojíždění do práce.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transport-mode">Způsob dopravy</Label>
            <Select 
              value={transportMode} 
              onValueChange={setTransportMode}
            >
              <SelectTrigger id="transport-mode">
                <SelectValue placeholder="Vyberte způsob dopravy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car" className="flex items-center">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" /> Auto
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Train className="h-4 w-4" /> Veřejná doprava
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distance">Vzdálenost (km)</Label>
            <Input 
              id="distance" 
              type="number" 
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min="0"
            />
            <p className="text-xs text-muted-foreground">Jednosměrná vzdálenost z bydliště do práce</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Počet dní v měsíci</Label>
            <Input 
              id="frequency" 
              type="number" 
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              min="0"
              max="31"
            />
          </div>
          
          {transportMode === "car" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fuel-price">Cena paliva (CZK/litr)</Label>
                <Input 
                  id="fuel-price" 
                  type="number" 
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuel-consumption">Spotřeba (litrů/100km)</Label>
                <Input 
                  id="fuel-consumption" 
                  type="number" 
                  value={fuelConsumption}
                  onChange={(e) => setFuelConsumption(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="wear-and-tear" 
                  checked={includeWearAndTear}
                  onCheckedChange={setIncludeWearAndTear}
                />
                <Label htmlFor="wear-and-tear">Zahrnout opotřebení vozidla</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-tolls" 
                  checked={includeTolls}
                  onCheckedChange={setIncludeTolls}
                />
                <Label htmlFor="include-tolls">Zahrnout dálniční poplatky</Label>
              </div>
              
              {includeTolls && (
                <div className="space-y-2">
                  <Label htmlFor="toll-cost">Cena dálničních poplatků (CZK/den)</Label>
                  <Input 
                    id="toll-cost" 
                    type="number" 
                    value={tollCost}
                    onChange={(e) => setTollCost(e.target.value)}
                    min="0"
                  />
                </div>
              )}
            </>
          )}
          
          {transportMode === "public" && (
            <div className="space-y-2">
              <Label htmlFor="public-transport-cost">Cena jízdenky (CZK/den)</Label>
              <Input 
                id="public-transport-cost" 
                type="number" 
                value={publicTransportCost}
                onChange={(e) => setPublicTransportCost(e.target.value)}
                min="0"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Výsledky kalkulace</CardTitle>
          <CardDescription>
            Přehled nákladů na vaše pravidelné dojíždění.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">Měsíční náklady</p>
                <p className="text-muted-foreground text-sm">Přibližné náklady za měsíc</p>
              </div>
              <p className="text-2xl font-bold">{monthlyCost.toLocaleString()} CZK</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <div>
                <p className="text-sm font-medium">Roční náklady</p>
                <p className="text-muted-foreground text-sm">Přibližné náklady za celý rok</p>
              </div>
              <p className="text-xl font-bold">{yearlyCost.toLocaleString()} CZK</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Environmentální dopad</p>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Roční emise CO2</p>
                <p className="text-muted-foreground text-sm">Přibližné množství vyprodukovaného CO2</p>
              </div>
              <p className="text-lg font-medium">{annualCO2} kg</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Optimalizační tipy</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              {transportMode === "car" && (
                <>
                  <li>Sdílení jízdy může snížit náklady až o 50%</li>
                  <li>Ekonomický styl jízdy může snížit spotřebu o 15%</li>
                  <li>Pravidelná údržba vozidla snižuje náklady na opravy</li>
                </>
              )}
              {transportMode === "public" && (
                <>
                  <li>Předplatné jízdenky mohou být až o 30% levnější</li>
                  <li>Kombinace veřejné dopravy s kolem zvyšuje flexibilitu</li>
                  <li>Zaměstnavatelské příspěvky mohou pokrýt část nákladů</li>
                </>
              )}
              <li>Práce z domova několik dní v týdnu výrazně sníží náklady</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommuteCostCalculator;
