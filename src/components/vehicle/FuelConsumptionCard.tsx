
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FuelRecord } from '@/types/vehicle';
import { fetchFuelRecords } from '@/services/vehicleService';
import { Gauge, Plus } from 'lucide-react';
import FuelRecordDialog from './dialogs/FuelRecordDialog';

interface FuelConsumptionCardProps {
  vehicleId?: string;
  fullView?: boolean;
}

const FuelConsumptionCard: React.FC<FuelConsumptionCardProps> = ({ vehicleId, fullView = false }) => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      loadFuelRecords();
    }
  }, [vehicleId]);

  const loadFuelRecords = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchFuelRecords(vehicleId);
      setFuelRecords(records);
    } catch (error) {
      console.error('Chyba při načítání spotřeby:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    loadFuelRecords();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Spotřeba paliva</CardTitle>
            <CardDescription>Sledování spotřeby a nákladů na palivo</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Přidat tankování
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : fuelRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gauge className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Zatím zde nejsou žádné záznamy o tankování</p>
              <p className="text-sm mt-2">Klikněte na "Přidat tankování" pro vytvoření prvního záznamu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(fullView ? fuelRecords : fuelRecords.slice(0, 3)).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{record.station}</h3>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                      <p className="text-sm">{record.amount_liters}L • {record.total_cost} Kč</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{record.price_per_liter} Kč/L</p>
                      <p className="text-sm text-muted-foreground">{record.mileage} km</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {!fullView && fuelRecords.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="link">Zobrazit všechny záznamy</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <FuelRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId || ''}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};

export default FuelConsumptionCard;
