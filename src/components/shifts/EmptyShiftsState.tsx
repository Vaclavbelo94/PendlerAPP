
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, FileSpreadsheet, ChartBar } from 'lucide-react';

interface EmptyShiftsStateProps {
  onAddShift: () => void;
}

export const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({ onAddShift }) => {
  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <CalendarPlus className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">Nemáte žádné směny</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground max-w-md mx-auto">
          Přidáním směn začnete budovat přehled vašeho pracovního kalendáře a statistiky.
        </p>
        
        <div className="flex justify-center">
          <Button onClick={onAddShift} size="lg" className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Přidat první směnu
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-1">Pracovní kalendář</h3>
            <p className="text-sm text-muted-foreground text-center">
              Kompletní přehled vašich směn v kalendáři
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <ChartBar className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-1">Statistiky</h3>
            <p className="text-sm text-muted-foreground text-center">
              Přehledné statistiky o odpracovaných hodinách a směnách
            </p>
          </div>
          
          <div className="p-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-3">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="font-medium mb-1">Exporty</h3>
            <p className="text-sm text-muted-foreground text-center">
              Export dat do PDF, Excel nebo sdílení s kolegy
            </p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground px-4 pt-4">
          Pro plné využití funkcí doporučujeme pravidelně přidávat vaše pracovní směny
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyShiftsState;
