
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  shiftNotes: string;
  onNotesChange: (notes: string) => void;
  onSaveNote: () => void;
}

export const EditNoteDialog = ({
  open,
  onOpenChange,
  selectedDate,
  shiftNotes,
  onNotesChange,
  onSaveNote
}: EditNoteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upravit poznámku ke směně</DialogTitle>
          <DialogDescription>
            {selectedDate && format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-text">Poznámka</Label>
            <Textarea
              id="note-text"
              value={shiftNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Zadejte poznámku ke směně..."
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušit
          </Button>
          <Button onClick={onSaveNote}>
            Uložit poznámku
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
