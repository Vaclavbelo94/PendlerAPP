
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

export const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <Car className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">Nemáte žádná vozidla</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground max-w-md mx-auto">
          Přidejte své první vozidlo pro sledování nákladů, servisních intervalů a pojištění.
        </p>
        
        <div className="flex justify-center">
          <Button onClick={onAddVehicle} size="lg" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Přidat vozidlo
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <span className="font-medium">1</span>
            </div>
            <h3 className="font-medium mb-1">Evidence nákladů</h3>
            <p className="text-sm text-muted-foreground text-center">
              Sledujte náklady na pohonné hmoty, servis a údržbu
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
              <span className="font-medium">2</span>
            </div>
            <h3 className="font-medium mb-1">Servisní intervaly</h3>
            <p className="text-sm text-muted-foreground text-center">
              Nezapomeňte na pravidelné servisní prohlídky
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <span className="font-medium">3</span>
            </div>
            <h3 className="font-medium mb-1">Dokumenty</h3>
            <p className="text-sm text-muted-foreground text-center">
              Ukládejte důležité dokumenty jako pojištění nebo technický průkaz
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyVehicleState;
