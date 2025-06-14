
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Car className="h-16 w-16 text-muted-foreground" />
        </div>
        <CardTitle>Žádná vozidla</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Začněte přidáním svého prvního vozidla a mějte vše pod kontrolou.
        </p>
        <Button onClick={onAddVehicle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Přidat první vozidlo
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyVehicleState;
