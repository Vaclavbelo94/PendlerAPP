
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save, X } from 'lucide-react';
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { validateShiftNotes, sanitizeInput } from '@/utils/inputValidation';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | undefined;
  shiftNotes: string;
  onNotesChange: (notes: string) => void;
  onSaveNote: () => void;
}

export const EditNoteDialog: React.FC<EditNoteDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  shiftNotes,
  onNotesChange,
  onSaveNote,
}) => {
  const [localNotes, setLocalNotes] = useState(shiftNotes);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLocalNotes(shiftNotes);
    setValidationErrors([]);
  }, [shiftNotes, open]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    
    // Real-time validation
    const validation = validateShiftNotes(value);
    setValidationErrors(validation.errors);
  };

  const handleSave = async () => {
    const validation = validateShiftNotes(localNotes);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedNotes = sanitizeInput(localNotes);
      onNotesChange(sanitizedNotes);
      await onSaveNote();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocalNotes(shiftNotes);
    setValidationErrors([]);
    onOpenChange(false);
  };

  const remainingChars = 500 - localNotes.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]"
        aria-describedby="edit-note-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Upravit poznámku ke směně
          </DialogTitle>
          <DialogDescription id="edit-note-description">
            {selectedDate && (
              <>Směna pro {format(selectedDate, "dd.MM.yyyy", { locale: cs })}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shift-notes" className="text-sm font-medium">
              Poznámka
            </Label>
            <Textarea
              id="shift-notes"
              placeholder="Zadejte poznámku ke směně..."
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className={`min-h-[120px] resize-none ${
                validationErrors.length > 0 ? 'border-red-500 focus:border-red-500' : ''
              }`}
              maxLength={500}
              aria-describedby={validationErrors.length > 0 ? "validation-errors" : "char-count"}
              aria-invalid={validationErrors.length > 0}
            />
            
            <div className="flex justify-between items-center text-xs">
              <span 
                id="char-count"
                className={`${remainingChars < 50 ? 'text-orange-600' : 'text-muted-foreground'}`}
              >
                {remainingChars} znaků zbývá
              </span>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive" id="validation-errors">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Zrušit
          </Button>
          <Button
            onClick={handleSave}
            disabled={validationErrors.length > 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Ukládám...' : 'Uložit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
