
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Settings, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DHLPosition } from '@/types/dhl';

const POSITION_TYPES = [
  { value: 'fahrer', label: 'Fahrer' },
  { value: 'beifahrer', label: 'Beifahrer' },
  { value: 'sortierer', label: 'Sortierer' },
  { value: 'other', label: 'Ostatní' }
];

export const PositionManagementPanel: React.FC = () => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    position_type: 'fahrer' as const,
    requirements: [] as string[],
    cycle_weeks: [] as number[]
  });

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
      toast.error('Chyba při načítání pozic');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      position_type: 'fahrer',
      requirements: [],
      cycle_weeks: []
    });
    setEditingPosition(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (position: DHLPosition) => {
    setFormData({
      name: position.name,
      description: position.description || '',
      position_type: position.position_type,
      requirements: position.requirements || [],
      cycle_weeks: position.cycle_weeks || []
    });
    setEditingPosition(position);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const positionData = {
        name: formData.name,
        description: formData.description,
        position_type: formData.position_type,
        requirements: formData.requirements,
        cycle_weeks: formData.cycle_weeks,
        is_active: true
      };

      if (editingPosition) {
        const { error } = await supabase
          .from('dhl_positions')
          .update(positionData)
          .eq('id', editingPosition.id);

        if (error) throw error;
        toast.success('Pozice byla aktualizována');
      } else {
        const { error } = await supabase
          .from('dhl_positions')
          .insert(positionData);

        if (error) throw error;
        toast.success('Pozice byla vytvořena');
      }

      setIsDialogOpen(false);
      resetForm();
      loadPositions();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Chyba při ukládání pozice');
    }
  };

  const handleDelete = async (positionId: string) => {
    try {
      const { error } = await supabase
        .from('dhl_positions')
        .update({ is_active: false })
        .eq('id', positionId);

      if (error) throw error;
      toast.success('Pozice byla deaktivována');
      loadPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  const handleRequirementsChange = (value: string) => {
    const requirements = value.split('\n').filter(req => req.trim() !== '');
    setFormData(prev => ({ ...prev, requirements }));
  };

  const handleCycleWeeksChange = (value: string) => {
    const weeks = value.split(',').map(w => parseInt(w.trim())).filter(w => !isNaN(w) && w > 0);
    setFormData(prev => ({ ...prev, cycle_weeks: weeks }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Načítám pozice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Správa pozic</h2>
          <p className="text-muted-foreground">
            Spravujte DHL pozice a jejich vlastnosti
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Nová pozice
        </Button>
      </div>

      <div className="grid gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{position.name}</CardTitle>
                  <CardDescription>{position.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {POSITION_TYPES.find(t => t.value === position.position_type)?.label}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(position)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deaktivovat pozici</AlertDialogTitle>
                        <AlertDialogDescription>
                          Opravdu chcete deaktivovat pozici "{position.name}"? 
                          Tato akce je vratná - pozici můžete znovu aktivovat.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(position.id)}>
                          Deaktivovat
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {position.requirements && position.requirements.length > 0 && (
                  <div>
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Požadavky
                    </div>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {position.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {position.cycle_weeks && position.cycle_weeks.length > 0 && (
                  <div>
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Cyklus týdnů
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {position.cycle_weeks.map((week, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {week}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
            </DialogTitle>
            <DialogDescription>
              {editingPosition 
                ? 'Upravte detaily pozice' 
                : 'Vytvořte novou DHL pozici'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Název pozice *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="např. Řidič nákladního vozidla"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position_type">Typ pozice *</Label>
                <Select
                  value={formData.position_type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, position_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Podrobný popis pozice..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Požadavky (každý na novém řádku)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements.join('\n')}
                onChange={(e) => handleRequirementsChange(e.target.value)}
                placeholder="např.&#10;Řidičský průkaz C+E&#10;Profesní způsobilost&#10;Zkušenosti s nákladní dopravou"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle_weeks">Cyklus týdnů (čárkou oddělené)</Label>
              <Input
                id="cycle_weeks"
                value={formData.cycle_weeks.join(', ')}
                onChange={(e) => handleCycleWeeksChange(e.target.value)}
                placeholder="např. 1, 2, 3, 4"
              />
              <p className="text-xs text-muted-foreground">
                Zadejte čísla týdnů v cyklu, například: 1, 2, 3, 4
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Zrušit
              </Button>
              <Button type="submit">
                {editingPosition ? 'Uložit změny' : 'Vytvořit pozici'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
