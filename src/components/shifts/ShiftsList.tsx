
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Shift {
  id: string;
  date: string;
  type: string;
  hours?: number;
  location?: string;
  notes?: string;
}

interface ShiftsListProps {
  shifts: Shift[];
  onUpdateShift: (id: string, data: any) => void;
  onDeleteShift: (id: string) => void;
}

const ShiftsList = ({ shifts, onUpdateShift, onDeleteShift }: ShiftsListProps) => {
  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Žádné směny k zobrazení</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <Card key={shift.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {format(new Date(shift.date), 'EEEE, d. MMMM yyyy', { locale: cs })}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <Badge variant="secondary">
                    {shift.type === "morning" ? "Ranní směna" : 
                     shift.type === "afternoon" ? "Odpolední směna" : "Noční směna"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDeleteShift(shift.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          {shift.notes && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{shift.notes}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ShiftsList;
