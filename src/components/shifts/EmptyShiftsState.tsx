
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock } from 'lucide-react';

interface EmptyShiftsStateProps {
  onAddShift: () => void;
}

const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({ onAddShift }) => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vítejte v evidenci směn!</CardTitle>
          <CardDescription>
            Zatím nemáte žádné směny. Začněte sledovat svou pracovní dobu přidáním první směny.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-left space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Sledujte pracovní hodiny</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Plánujte směny v kalendáři</span>
            </div>
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Exportujte data pro daně</span>
            </div>
          </div>
          
          <Button onClick={onAddShift} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Přidat první směnu
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Tip: Můžete také importovat stávající data ze souboru Excel
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyShiftsState;
