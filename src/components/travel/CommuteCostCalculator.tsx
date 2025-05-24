
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Car, Train, Bus, Euro } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTravelPreferences } from "@/hooks/useTravelPreferences";

const CommuteCostCalculator = () => {
  const isMobile = useIsMobile();
  const { preferences, isLoading, updatePreference, savePreferences } = useTravelPreferences();
  
  const [distance, setDistance] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) return;

    const dailyCosts = {
      car: (dist * 2 * preferences.vehicleConsumption * preferences.fuelPricePerLiter) / 100,
      publicTransport: 120, // Průměrná cena jízdenky
      bike: 0
    };

    const monthlyCosts = {
      car: dailyCosts.car * 22, // 22 pracovních dní
      publicTransport: dailyCosts.publicTransport * 22,
      bike: 0
    };

    setResults({ dailyCosts, monthlyCosts, distance: dist });
  };

  const handleSavePreferences = async () => {
    await savePreferences({
      fuelPricePerLiter: preferences.fuelPricePerLiter,
      vehicleConsumption: preferences.vehicleConsumption,
      monthlyTransportBudget: preferences.monthlyTransportBudget
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      <Card>
        <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
            <Calculator className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            Kalkulačka nákladů na dojíždění
          </CardTitle>
          <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
            Vypočítejte si náklady na jednotlivé druhy dopravy
          </CardDescription>
        </CardHeader>
        <CardContent className={`space-y-${isMobile ? '4' : '6'}`}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            <div className="space-y-2">
              <Label htmlFor="distance" className={`${isMobile ? 'text-sm' : ''}`}>
                Vzdálenost do práce (km)
              </Label>
              <Input
                id="distance"
                type="number"
                placeholder="např. 25"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className={`${isMobile ? 'h-9' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelPrice" className={`${isMobile ? 'text-sm' : ''}`}>
                Cena paliva (Kč/l)
              </Label>
              <Input
                id="fuelPrice"
                type="number"
                step="0.1"
                placeholder="např. 35.5"
                value={preferences.fuelPricePerLiter || ''}
                onChange={(e) => updatePreference('fuelPricePerLiter', parseFloat(e.target.value) || 0)}
                className={`${isMobile ? 'h-9' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumption" className={`${isMobile ? 'text-sm' : ''}`}>
                Spotřeba auta (l/100km)
              </Label>
              <Input
                id="consumption"
                type="number"
                step="0.1"
                placeholder="např. 7.5"
                value={preferences.vehicleConsumption || ''}
                onChange={(e) => updatePreference('vehicleConsumption', parseFloat(e.target.value) || 0)}
                className={`${isMobile ? 'h-9' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className={`${isMobile ? 'text-sm' : ''}`}>
                Měsíční rozpočet (Kč)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="např. 5000"
                value={preferences.monthlyTransportBudget || ''}
                onChange={(e) => updatePreference('monthlyTransportBudget', parseFloat(e.target.value) || 0)}
                className={`${isMobile ? 'h-9' : ''}`}
              />
            </div>
          </div>

          <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Button 
              onClick={handleCalculate} 
              className={`${isMobile ? 'w-full' : ''}`}
              size={isMobile ? "sm" : "default"}
            >
              Vypočítat náklady
            </Button>
            <Button 
              onClick={handleSavePreferences} 
              variant="outline"
              className={`${isMobile ? 'w-full' : ''}`}
              size={isMobile ? "sm" : "default"}
            >
              Uložit preference
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
          <Card>
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Car className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
                <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>Auto</h3>
              </div>
              <div className="space-y-2">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Denně: {results.dailyCosts.car.toFixed(0)} Kč
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                  {results.monthlyCosts.car.toFixed(0)} Kč/měsíc
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Train className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-600`} />
                <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>MHD</h3>
              </div>
              <div className="space-y-2">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Denně: {results.dailyCosts.publicTransport.toFixed(0)} Kč
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                  {results.monthlyCosts.publicTransport.toFixed(0)} Kč/měsíc
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Bus className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-orange-600`} />
                <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>Kolo</h3>
              </div>
              <div className="space-y-2">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Denně: 0 Kč
                </p>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
                  0 Kč/měsíc
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommuteCostCalculator;
