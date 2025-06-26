
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DHLPosition, DHLPositionType } from '@/types/dhl';

export const PositionManagementPanel = () => {
  const { toast } = useToast();
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cycle_weeks: ''
  });

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('dhl_positions')
        .select('*')
        .order('name');

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst pozice",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.cycle_weeks.trim()) {
      toast({
        title: "Chyba",
        description: "Vyplňte všechna povinná pole",
        variant: "destructive"
      });
      return;
    }

    const weeksArray = formData.cycle_weeks
      .split(',')
      .map(w => parseInt(w.trim()))
      .filter(w => !isNaN(w) && w >= 1 && w <= 15);

    if (weeksArray.length === 0) {
      toast({
        title: "Chyba",
        description: "Zadejte platná čísla týdnů (1-15)",
        variant: "destructive"
      });
      return;
    }

    try {
      const positionData = {
        name: formData.name.trim(),
        cycle_weeks: weeksArray,
        position_type: 'other' as DHLPositionType // Default position type since it's required
      };

      if (editingPosition) {
        const { error } = await supabase
          .from('dhl_positions')
          .update(positionData)
          .eq('id', editingPosition.id);

        if (error) throw error;
        
        toast({
          title: "Úspěch",
          description: "Pozice byla aktualizována"
        });
      } else {
        const { error } = await supabase
          .from('dhl_positions')
          .insert([positionData]);

        if (error) throw error;
        
        toast({
          title: "Úspěch",
          description: "Pozice byla vytvořena"
        });
      }

      resetForm();
      loadPositions();
    } catch (error) {
      console.error('Error saving position:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit pozici",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (position: DHLPosition) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      cycle_weeks: position.cycle_weeks.join(', ')
    });
    setIsCreating(true);
  };

  const handleDelete = async (position: DHLPosition) => {
    if (!confirm(`Opravdu chcete smazat pozici "${position.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .delete()
        .eq('id', position.id);

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Pozice byla smazána"
      });
      
      loadPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat pozici",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cycle_weeks: ''
    });
    setIsCreating(false);
    setEditingPosition(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Načítám pozice...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Správa pozic
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Nová pozice
            </Button>
          </CardTitle>
          <CardDescription>
            Správa DHL pozic s definicí týdnů v cyklu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-medium">
                {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Název pozice *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Např. Technik - ranní směna"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle_weeks">Týdny v cyklu (oddělené čárkou) *</Label>
                <Input
                  id="cycle_weeks"
                  value={formData.cycle_weeks}
                  onChange={(e) => setFormData({ ...formData, cycle_weeks: e.target.value })}
                  placeholder="1, 2, 3, 4, 5"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Zadejte čísla týdnů (1-15), které jsou součástí cyklu této pozice
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingPosition ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Zrušit
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {positions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Zatím nejsou vytvořeny žádné pozice
              </p>
            ) : (
              positions.map((position) => (
                <div key={position.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{position.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Týdny v cyklu: {position.cycle_weeks.join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(position)}
                      disabled={Boolean(editingPosition)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(position)}
                      disabled={Boolean(editingPosition)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
