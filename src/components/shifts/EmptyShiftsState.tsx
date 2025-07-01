
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface EmptyShiftsStateProps {
  onAddShift: () => void;
}

const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({ onAddShift }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Zatím nemáte žádné směny</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Začněte přidáním své první směny. Můžete sledovat ranní, odpolední nebo noční směny.
        </p>
        <Button onClick={onAddShift} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Přidat první směnu
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyShiftsState;
