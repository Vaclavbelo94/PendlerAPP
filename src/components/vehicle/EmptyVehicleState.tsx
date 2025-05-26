
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  return (
    <Card className="text-center py-12">
      <CardHeader>
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Car className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>Zatím nemáte žádná vozidla</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Přidejte své první vozidlo a začněte sledovat spotřebu, servisní záznamy a dokumenty.
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
