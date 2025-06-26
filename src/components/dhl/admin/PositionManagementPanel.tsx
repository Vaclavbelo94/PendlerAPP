
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DHLPosition, DHLPositionType } from '@/types/dhl';

export const PositionManagementPanel: React.FC = () => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position_type: '' as DHLPositionType,
    description: '',
    requirements: [] as string[],
    cycle_weeks: [] as number[]
  });

  const positionTypes: { value: DHLPositionType; label: string }[] = [
    { value: 'technik', label: 'Technik' },
    { value: 'rangierer', label: 'Rangierer' },
    { value: 'verlader', label: 'Verlader' },
    { value: 'sortierer', label: 'Sortierer' },
    { value: 'fahrer', label: 'Fahrer' },
    { value: 'other', label: 'Ostatní' }
  ];

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
      toast.error('Chyba při načítání pozic');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position_type: '' as DHLPositionType,
      description: '',
      requirements: [],
      cycle_weeks: []
    });
    setEditingPosition(null);
    setIsCreating(false);
  };

  const handleEdit = (position: DHLPosition) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      position_type: position.position_type,
      description: position.description || '',
      requirements: position.requirements || [],
      cycle_weeks: position.cycle_weeks || []
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.position_type) {
      toast.error('Vyplňte všechna povinná pole');
      return;
    }

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
        const { error } = await supabase
          .from('dhl_positions')
          .update(positionData)
          .eq('id', editingPosition.id);

        if (error) throw error;
        toast.success('Pozice byla úspěšně upravena');
      } else {
        const { error } = await supabase
          .from('dhl_positions')
          .insert([positionData]);

        if (error) throw error;
        toast.success('Pozice byla úspěšně vytvořena');
      }

      loadPositions();
      resetForm();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Chyba při ukládání pozice');
    }
  };

  const handleDelete = async (positionId: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .delete()
        .eq('id', positionId);

      if (error) throw error;
      toast.success('Pozice byla úspěšně smazána');
      loadPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addCycleWeek = () => {
    const week = prompt('Zadejte číslo týdne (1-15):');
    if (week && !isNaN(Number(week))) {
      const weekNum = Number(week);
      if (weekNum >= 1 && weekNum <= 15 && !formData.cycle_weeks.includes(weekNum)) {
        setFormData(prev => ({
          ...prev,
          cycle_weeks: [...prev.cycle_weeks, weekNum].sort((a, b) => a - b)
        }));
      }
    }
  };

  const removeCycleWeek = (week: number) => {
    setFormData(prev => ({
      ...prev,
      cycle_weeks: prev.cycle_weeks.filter(w => w !== week)
    }));
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Správa pozic</CardTitle>
              <CardDescription>
                Spravujte DHL pozice a jejich nastavení
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="gap-2" disabled={isCreating || editingPosition}>
              <Plus className="h-4 w-4" />
              Nová pozice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Form for creating/editing */}
          {(isCreating || editingPosition) && (
            <div className="border rounded-lg p-4 mb-6 bg-muted/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Název pozice *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Např. Rangierer - Směna A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position_type">Typ pozice *</Label>
                    <Select
                      value={formData.position_type}
                      onValueChange={(value: DHLPositionType) => 
                        setFormData(prev => ({ ...prev, position_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ pozice" />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Popis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Popis pozice a jejích specifik"
                    rows={3}
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Požadavky</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                      <Plus className="h-3 w-3 mr-1" />
                      Přidat
                    </Button>
                  </div>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Požadavek"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Cycle Weeks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Cyklus týdnů</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCycleWeek}>
                      <Plus className="h-3 w-3 mr-1" />
                      Přidat týden
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.cycle_weeks.map((week) => (
                      <Badge key={week} variant="secondary" className="gap-1">
                        Týden {week}
                        <button
                          type="button"
                          onClick={() => removeCycleWeek(week)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    {editingPosition ? 'Uložit změny' : 'Vytvořit pozici'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Zrušit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Positions List */}
          <div className="space-y-4">
            {positions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Žádné pozice nejsou vytvořeny
              </div>
            ) : (
              positions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{position.name}</h3>
                        <Badge variant="outline">
                          {positionTypes.find(t => t.value === position.position_type)?.label}
                        </Badge>
                        {!position.is_active && (
                          <Badge variant="destructive">Neaktivní</Badge>
                        )}
                      </div>
                      
                      {position.description && (
                        <p className="text-sm text-muted-foreground">
                          {position.description}
                        </p>
                      )}

                      {position.requirements && position.requirements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Požadavky:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {position.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {position.cycle_weeks && position.cycle_weeks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Cyklus týdnů:</p>
                          <div className="flex flex-wrap gap-1">
                            {position.cycle_weeks.map((week) => (
                              <Badge key={week} variant="secondary" className="text-xs">
                                {week}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(position)}
                        disabled={isCreating || editingPosition}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(position.id)}
                        disabled={isCreating || editingPosition}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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
