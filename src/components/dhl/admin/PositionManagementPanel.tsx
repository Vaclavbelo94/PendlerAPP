
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DHLPosition, DHLPositionType } from '@/types/dhl';

export const PositionManagementPanel: React.FC = () => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position_type: 'technik' as DHLPositionType,
    description: '',
    requirements: [] as string[],
    cycle_weeks: [] as number[]
  });

  // Load positions
  const loadPositions = async () => {
    try {
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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      position_type: 'technik',
      description: '',
      requirements: [],
      cycle_weeks: []
    });
    setEditingPosition(null);
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const positionData = {
        name: formData.name,
        position_type: formData.position_type,
        description: formData.description || null,
        requirements: formData.requirements.length > 0 ? formData.requirements : null,
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
          .insert([positionData]);

        if (error) throw error;
        toast.success('Pozice byla úspěšně vytvořena');
      }

      resetForm();
      loadPositions();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Chyba při ukládání pozice');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (position: DHLPosition) => {
    setFormData({
      name: position.name,
      position_type: position.position_type,
      description: position.description || '',
      requirements: position.requirements || [],
      cycle_weeks: position.cycle_weeks || []
    });
    setEditingPosition(position);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (positionId: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) return;

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .delete()
        .eq('id', positionId);

      if (error) throw error;
      toast.success('Pozice byla smazána');
      loadPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  // Handle requirements change
  const handleRequirementsChange = (value: string) => {
    const requirements = value.split('\n').filter(req => req.trim() !== '');
    setFormData(prev => ({ ...prev, requirements }));
  };

  // Handle cycle weeks change
  const handleCycleWeeksChange = (value: string) => {
    const weeks = value.split(',').map(w => parseInt(w.trim())).filter(w => !isNaN(w) && w >= 1 && w <= 15);
    setFormData(prev => ({ ...prev, cycle_weeks: weeks }));
  };

  const positionTypeLabels: Record<DHLPositionType, string> = {
    'technik': 'Technik',
    'rangierer': 'Rangierer',
    'verlader': 'Verlader',
    'sortierer': 'Sortierer',
    'fahrer': 'Fahrer',
    'other': 'Ostatní'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Správa pozic</h3>
          <p className="text-sm text-muted-foreground">
            Spravujte DHL pozice a jejich vlastnosti
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          disabled={showForm || Boolean(editingPosition)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nová pozice
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
            </CardTitle>
            <CardDescription>
              {editingPosition ? 'Upravte vlastnosti pozice' : 'Vytvořte novou DHL pozici'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Název pozice *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Např. Technik - ranní směna"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position_type">Typ pozice *</Label>
                  <Select
                    value={formData.position_type}
                    onValueChange={(value: DHLPositionType) => 
                      setFormData(prev => ({ ...prev, position_type: value }))
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(positionTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
                  placeholder="Popis pozice a jejích povinností..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Požadavky (jeden na řádek)</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleRequirementsChange(e.target.value)}
                  placeholder="Řidičský průkaz\nZnalost němčiny\nFyzická kondice"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle_weeks">Týdny v cyklu (oddělené čárkou)</Label>
                <Input
                  id="cycle_weeks"
                  value={formData.cycle_weeks.join(', ')}
                  onChange={(e) => handleCycleWeeksChange(e.target.value)}
                  placeholder="1, 2, 3, 4, 5"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Zadejte čísla týdnů (1-15), které jsou součástí cyklu této pozice
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Ukládám...' : editingPosition ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Zrušit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Positions List */}
      <div className="grid gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{position.name}</h4>
                    <Badge variant="secondary">
                      {positionTypeLabels[position.position_type]}
                    </Badge>
                    {!position.is_active && (
                      <Badge variant="destructive">Neaktivní</Badge>
                    )}
                  </div>
                  
                  {position.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {position.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {position.requirements && position.requirements.length > 0 && (
                      <div>
                        <strong>Požadavky:</strong> {position.requirements.join(', ')}
                      </div>
                    )}
                    {position.cycle_weeks && position.cycle_weeks.length > 0 && (
                      <div>
                        <strong>Týdny:</strong> {position.cycle_weeks.join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    Vytvořeno: {new Date(position.created_at).toLocaleDateString('cs-CZ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(position)}
                    disabled={isSubmitting || Boolean(editingPosition)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(position.id)}
                    disabled={isSubmitting || Boolean(editingPosition)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {positions.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Žádné pozice nebyly nalezeny</p>
              <p className="text-sm text-gray-500 mt-2">
                Kliknutím na "Nová pozice" vytvoříte první pozici
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
