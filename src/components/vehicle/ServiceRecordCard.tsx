
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceRecord } from '@/types/vehicle';
import { fetchServiceRecords } from '@/services/vehicleService';
import { Wrench, Plus } from 'lucide-react';
import ServiceRecordDialog from './dialogs/ServiceRecordDialog';

interface ServiceRecordCardProps {
  vehicleId?: string;
  fullView?: boolean;
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({ vehicleId, fullView = false }) => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      loadServiceRecords();
    }
  }, [vehicleId]);

  const loadServiceRecords = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchServiceRecords(vehicleId);
      setServiceRecords(records);
    } catch (error) {
      console.error('Chyba při načítání servisních záznamů:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    loadServiceRecords();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Servisní záznamy</CardTitle>
            <CardDescription>Historie údržby a oprav vozidla</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Přidat servis
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : serviceRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Zatím zde nejsou žádné servisní záznamy</p>
              <p className="text-sm mt-2">Klikněte na "Přidat servis" pro vytvoření prvního záznamu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(fullView ? serviceRecords : serviceRecords.slice(0, 3)).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{record.service_type}</h3>
                      <p className="text-sm text-muted-foreground">{record.service_date}</p>
                      <p className="text-sm">{record.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{record.cost} Kč</p>
                      <p className="text-sm text-muted-foreground">{record.mileage} km</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {!fullView && serviceRecords.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="link">Zobrazit všechny záznamy</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId || ''}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};

export default ServiceRecordCard;
