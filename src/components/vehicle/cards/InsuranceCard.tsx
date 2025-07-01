
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Calendar, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InsuranceRecordDialog from '../dialogs/InsuranceRecordDialog';

interface InsuranceCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ vehicleId, fullView = false }) => {
  const { t } = useTranslation(['vehicle']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data - replace with real data fetching
  const insuranceRecords = [
    {
      id: '1',
      provider: 'Allianz',
      coverage_type: 'comprehensive',
      policy_number: 'POL-123456',
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
      monthly_cost: '1200',
      notes: ''
    }
  ];

  const handleSuccess = () => {
    console.log('Insurance record operation completed');
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">Pojištění</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {insuranceRecords.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">
                Žádné záznamy o pojištění
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Přidat pojištění
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {insuranceRecords.slice(0, fullView ? undefined : 2).map((record) => (
                <div key={record.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{record.provider}</div>
                    <Badge variant="outline">
                      {record.coverage_type === 'comprehensive' ? 'Havarijní' : 
                       record.coverage_type === 'liability' ? 'Povinné ručení' : 'Kasko'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Platnost do: {new Date(record.valid_until).toLocaleDateString('cs-CZ')}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {record.monthly_cost} Kč/měsíc
                    </div>
                  </div>
                </div>
              ))}
              
              {!fullView && insuranceRecords.length > 2 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm">
                    Zobrazit vše ({insuranceRecords.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <InsuranceRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default InsuranceCard;
