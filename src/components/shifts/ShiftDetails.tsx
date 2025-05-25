
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Shift, ShiftType } from "./types";
import { formatShiftDate, getShiftColor, getShiftTimeByType } from "./utils";
import { toast } from "@/components/ui/use-toast";

interface ShiftDetailsProps {
  selectedDate: Date | undefined;
  currentShift: Shift | null;
  shiftType: ShiftType;
  setShiftType: (type: ShiftType) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
  user: any;
  onSaveShift: () => void;
  onDeleteShift: () => void;
  onOpenNoteDialog: () => void;
}

export const ShiftDetails = ({
  selectedDate,
  currentShift,
  shiftType,
  setShiftType,
  shiftNotes,
  setShiftNotes,
  user,
  onSaveShift,
  onDeleteShift,
  onOpenNoteDialog
}: ShiftDetailsProps) => {
  const navigate = useNavigate();

  if (!selectedDate) {
    return null;
  }

  return (
    <div className="bg-card border rounded-md p-4">
      <p className="font-medium text-foreground">
        {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
      </p>
      
      {currentShift ? (
        <div className="mt-2">
          <div className="flex justify-between items-start">
            <Badge className={`${getShiftColor(currentShift.type)} text-white hover:opacity-90`}>
              Naplánovaná směna
            </Badge>
            
            {user && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8" 
                onClick={onOpenNoteDialog}
                title="Upravit poznámku"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-foreground">Směna: {getShiftTimeByType(currentShift.type)}</p>
          
          {/* Zobrazení poznámky ke směně */}
          {currentShift.notes && (
            <div className="mt-3 bg-muted/50 p-3 rounded-md border">
              <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Poznámka:</span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground">{currentShift.notes}</p>
            </div>
          )}
          
          {user && (
            <div className="mt-3">
              <Label htmlFor="shift-type" className="text-foreground">Typ směny</Label>
              <Select 
                value={shiftType} 
                onValueChange={(value: ShiftType) => setShiftType(value)}
              >
                <SelectTrigger id="shift-type" className="mt-1">
                  <SelectValue placeholder="Vyberte typ směny" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Ranní (6:00 - 14:00)</SelectItem>
                  <SelectItem value="afternoon">Odpolední (14:00 - 22:00)</SelectItem>
                  <SelectItem value="night">Noční (22:00 - 6:00)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={onSaveShift} 
                  variant="default" 
                  className="flex-1"
                >
                  Aktualizovat směnu
                </Button>
                <Button 
                  onClick={onDeleteShift} 
                  variant="destructive"
                >
                  Odstranit
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2">
          {user ? (
            <div>
              <Badge variant="outline">Volný den</Badge>
              <p className="mt-2 text-muted-foreground">Žádná směna naplánovaná na tento den</p>
              
              <div className="mt-3">
                <Label htmlFor="shift-type" className="text-foreground">Typ směny</Label>
                <Select 
                  value={shiftType} 
                  onValueChange={(value: ShiftType) => setShiftType(value)}
                >
                  <SelectTrigger id="shift-type" className="mt-1">
                    <SelectValue placeholder="Vyberte typ směny" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Ranní (6:00 - 14:00)</SelectItem>
                    <SelectItem value="afternoon">Odpolední (14:00 - 22:00)</SelectItem>
                    <SelectItem value="night">Noční (22:00 - 6:00)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-3">
                  <Label htmlFor="shift-notes" className="text-foreground">Poznámka ke směně (volitelné)</Label>
                  <Textarea
                    id="shift-notes"
                    placeholder="Zadejte poznámku ke směně..."
                    value={shiftNotes}
                    onChange={(e) => setShiftNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={onSaveShift} 
                  className="mt-4 w-full"
                >
                  Přidat směnu
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Badge variant="outline">Nepřihlášený uživatel</Badge>
              <p className="mt-2 text-muted-foreground">Přihlaste se pro správu směn</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/login")}
                variant="default"
              >
                Přihlásit se
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
