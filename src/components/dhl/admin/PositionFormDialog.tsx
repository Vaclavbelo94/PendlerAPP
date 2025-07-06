import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PositionFormData {
  name: string;
  position_type: 'technik' | 'rangierer' | 'verlader' | 'sortierer' | 'fahrer' | 'other' | 'pakettiere' | 'cutter' | 'shipper' | 'buehne' | 'teamleiter' | 'standortleiter' | 'schichtleiter' | 'qualitaetskontrolle' | 'administrativ' | 'sicherheit' | 'reinigung' | 'wartung';
  description: string;
  hourly_rate: string;
  cycle_weeks: number[];
}

interface PositionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPosition?: any;
}

const positionTypes = [
  { value: 'fahrer' as const, label: 'Fahrer' },
  { value: 'rangierer' as const, label: 'Rangierer' },
  { value: 'sortierer' as const, label: 'Sortierer' },
  { value: 'technik' as const, label: 'Technik' },
  { value: 'verlader' as const, label: 'Verlader' },
  { value: 'pakettiere' as const, label: 'Pakettiere' },
  { value: 'cutter' as const, label: 'Cutter' },
  { value: 'shipper' as const, label: 'Shipper' },
  { value: 'buehne' as const, label: 'Bühne' },
  { value: 'teamleiter' as const, label: 'Teamleiter' },
  { value: 'standortleiter' as const, label: 'Standortleiter' },
  { value: 'schichtleiter' as const, label: 'Schichtleiter' },
  { value: 'qualitaetskontrolle' as const, label: 'Qualitätskontrolle' },
  { value: 'administrativ' as const, label: 'Administrativ' },
  { value: 'sicherheit' as const, label: 'Sicherheit' },
  { value: 'reinigung' as const, label: 'Reinigung' },
  { value: 'wartung' as const, label: 'Wartung' },
  { value: 'other' as const, label: 'Ostatní' }
];

export const PositionFormDialog: React.FC<PositionFormDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingPosition
}) => {
  const [formData, setFormData] = useState<PositionFormData>({
    name: '',
    position_type: 'sortierer',
    description: '',
    hourly_rate: '',
    cycle_weeks: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes or when editing position changes
  useEffect(() => {
    if (isOpen) {
      if (editingPosition) {
        setFormData({
          name: editingPosition.name || '',
          position_type: editingPosition.position_type || 'sortierer',
          description: editingPosition.description || '',
          hourly_rate: editingPosition.hourly_rate ? editingPosition.hourly_rate.toString() : '',
          cycle_weeks: editingPosition.cycle_weeks || []
        });
      } else {
        setFormData({
          name: '',
          position_type: 'sortierer',
          description: '',
          hourly_rate: '',
          cycle_weeks: []
        });
      }
    }
  }, [isOpen, editingPosition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePositionTypeChange = (value: PositionFormData['position_type']) => {
    setFormData(prev => ({ ...prev, position_type: value }));
  };

  const handleCycleWeekToggle = (week: number) => {
    setFormData(prev => {
      if (prev.cycle_weeks.includes(week)) {
        return {
          ...prev,
          cycle_weeks: prev.cycle_weeks.filter(w => w !== week)
        };
      } else {
        return {
          ...prev,
          cycle_weeks: [...prev.cycle_weeks, week].sort((a, b) => a - b)
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Název pozice je povinný');
      return;
    }

    setIsLoading(true);

    try {
      const positionData = {
        name: formData.name.trim(),
        position_type: formData.position_type,
        description: formData.description.trim() || null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        cycle_weeks: formData.cycle_weeks.length > 0 ? formData.cycle_weeks : null,
        is_active: true
      };

      if (editingPosition) {
        // Update existing position
        const { error } = await supabase
          .from('dhl_positions')
          .update(positionData)
          .eq('id', editingPosition.id);

        if (error) throw error;
        toast.success('Pozice byla úspěšně aktualizována');
      } else {
        // Create new position
        const { error } = await supabase
          .from('dhl_positions')
          .insert(positionData);

        if (error) throw error;
        toast.success('Pozice byla úspěšně vytvořena');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Chyba při ukládání pozice');
    } finally {
      setIsLoading(false);
    }
  };

  const getPositionTypeLabel = (value: string) => {
    return positionTypes.find(type => type.value === value)?.label || value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPosition ? 'Upravit pozici' : 'Přidat novou pozici'}
          </DialogTitle>
          <DialogDescription>
            {editingPosition 
              ? 'Upravte informace o DHL pozici' 
              : 'Vytvořte novou DHL pozici s požadovanými parametry'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Název pozice *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="např. Sortierer Frühdienst"
              required
            />
          </div>

          <div>
            <Label htmlFor="position_type">Typ pozice *</Label>
            <Select value={formData.position_type} onValueChange={handlePositionTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {positionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Popis pozice, požadavky, zodpovědnosti..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hourly_rate">Hodinová sazba (€)</Label>
            <Input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              step="0.01"
              min="0"
              value={formData.hourly_rate}
              onChange={handleInputChange}
              placeholder="např. 12.50"
            />
          </div>

          <div>
            <Label>Cyklus týdnů (1-15)</Label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
                <Button
                  key={week}
                  type="button"
                  variant={formData.cycle_weeks.includes(week) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCycleWeekToggle(week)}
                  className="h-8"
                >
                  {week}
                </Button>
              ))}
            </div>
            {formData.cycle_weeks.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.cycle_weeks.map((week) => (
                  <Badge key={week} variant="secondary" className="text-xs">
                    Týden {week}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleCycleWeekToggle(week)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Zrušit
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Ukládám...' : editingPosition ? 'Aktualizovat' : 'Vytvořit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};