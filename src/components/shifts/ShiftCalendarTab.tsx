
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SwipeableCalendar } from "./calendar/SwipeableCalendar";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarDays, Clock, FileText, Trash2 } from "lucide-react";
import { ShiftType } from "./types";

interface ShiftCalendarTabProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  shifts: any[];
  currentShift?: any;
  shiftType: ShiftType;
  setShiftType: (type: ShiftType) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
}

export const ShiftCalendarTab: React.FC<ShiftCalendarTabProps> = ({
  selectedDate,
  onSelectDate,
  shifts,
  currentShift,
  shiftType,
  setShiftType,
  shiftNotes,
  setShiftNotes,
  user,
  onSaveShift,
  onDeleteShift,
  onOpenNoteDialog
}) => {
  // Funkce pro získání směn pro daný den
  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.toDateString() === date.toDateString();
    });
  };

  const modifiers = {
    hasShift: (date: Date) => getShiftsForDate(date).length > 0,
  };

  const modifiersStyles = {
    hasShift: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      borderRadius: '50%'
    }
  };

  const handleMonthChange = (date: Date) => {
    // Kalendář změnil měsíc pomocí swipe
    console.log('Měsíc změněn na:', format(date, 'MMMM yyyy', { locale: cs }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kalendář */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SwipeableCalendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            onMonthChange={handleMonthChange}
            className="rounded-md border"
          />
          
          {selectedDate && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">
                {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
              </h3>
              {currentShift ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <Clock className="h-3 w-3" />
                    {currentShift.type === "morning" ? "Ranní směna" : 
                     currentShift.type === "afternoon" ? "Odpolední směna" : "Noční směna"}
                  </Badge>
                  {currentShift.notes && (
                    <p className="text-sm text-muted-foreground">
                      <FileText className="h-3 w-3 inline mr-1" />
                      {currentShift.notes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Žádná směna naplánována</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail směny */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentShift ? "Upravit směnu" : "Přidat směnu"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Typ směny</label>
                <Select value={shiftType} onValueChange={setShiftType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ směny" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">🌅 Ranní (6:00 - 14:00)</SelectItem>
                    <SelectItem value="afternoon">☀️ Odpolední (14:00 - 22:00)</SelectItem>
                    <SelectItem value="night">🌙 Noční (22:00 - 6:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Poznámka</label>
                <Textarea 
                  placeholder="Volitelná poznámka k směně..."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={onSaveShift} className="flex-1">
                  {currentShift ? "Aktualizovat" : "Uložit směnu"}
                </Button>
                {currentShift && (
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={onDeleteShift}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Vyberte datum pro přidání nebo úpravu směny</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
