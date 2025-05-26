
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InsuranceRecord } from '@/types/vehicle';
import { fetchInsuranceRecords } from '@/services/vehicleService';
import { Shield, Plus } from 'lucide-react';
import InsuranceRecordDialog from './dialogs/InsuranceRecordDialog';

interface InsuranceCardProps {
  vehicleId?: string;
  fullView?: boolean;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ vehicleId, fullView = false }) => {
  const [insuranceRecords, setInsuranceRecords] = useState<InsuranceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      loadInsuranceRecords();
    }
  }, [vehicleId]);

  const loadInsuranceRecords = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const records = await fetchInsuranceRecords(vehicleId);
      setInsuranceRecords(records);
    } catch (error) {
      console.error('Chyba při načítání pojištění:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    loadInsuranceRecords();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Pojištění</CardTitle>
            <CardDescription>Přehled pojištění vozidla</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Přidat pojištění
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : insuranceRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Zatím zde nejsou žádné záznamy o pojištění</p>
              <p className="text-sm mt-2">Klikněte na "Přidat pojištění" pro vytvoření prvního záznamu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(fullView ? insuranceRecords : insuranceRecords.slice(0, 3)).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{record.provider}</h3>
                      <p className="text-sm text-muted-foreground">{record.coverage_type}</p>
                      <p className="text-sm">Číslo: {record.policy_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{record.monthly_cost} Kč/měsíc</p>
                      <p className="text-sm text-muted-foreground">
                        {record.valid_from} - {record.valid_until}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {!fullView && insuranceRecords.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="link">Zobrazit všechny záznamy</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <InsuranceRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId || ''}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};

export default InsuranceCard;
