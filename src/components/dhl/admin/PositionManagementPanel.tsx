import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Check, X } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DHLPositionType } from '@/types/dhl';

interface PositionFormData {
  name: string;
  position_type: DHLPositionType;
  description: string;
  hourly_rate: number | null;
  requirements: string[];
  cycle_weeks: number[];
}

const defaultFormData: PositionFormData = {
  name: '',
  position_type: 'sortierer',
  description: '',
  hourly_rate: null,
  requirements: [],
  cycle_weeks: []
};

export const PositionManagementPanel: React.FC = () => {
  const { positions, workGroups, isLoading, refetch } = useDHLData();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PositionFormData>(defaultFormData);
  const [requirementInput, setRequirementInput] = useState('');
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const positionTypes: { value: DHLPositionType; label: string }[] = [
    { value: 'technik', label: 'Technik' },
    { value: 'rangierer', label: 'Rangierer' },
    { value: 'verlader', label: 'Verlader' },
    { value: 'sortierer', label: 'Sortierer' },
    { value: 'fahrer', label: 'Fahrer' },
    { value: 'other', label: 'Ostatní' }
  ];

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Název pozice je povinný');
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .insert({
          name: formData.name,
          position_type: formData.position_type as DHLPositionType,
          description: formData.description || null,
          hourly_rate: formData.hourly_rate,
          requirements: formData.requirements,
          cycle_weeks: formData.cycle_weeks,
          is_active: true
        });

      if (error) throw error;

      toast.success('Pozice byla vytvořena');
      setFormData(defaultFormData);
      setSelectedWeeks([]);
      setIsCreating(false);
      refetch();
    } catch (error) {
      console.error('Error creating position:', error);
      toast.error('Chyba při vytváření pozice');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dhl_positions')
        .update({
          name: formData.name,
          position_type: formData.position_type as DHLPositionType,
          description: formData.description || null,
          hourly_rate: formData.hourly_rate,
          requirements: formData.requirements,
          cycle_weeks: formData.cycle_weeks
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Pozice byla aktualizována');
      setEditingId(null);
      setFormData(defaultFormData);
      setSelectedWeeks([]);
      refetch();
    } catch (error) {
      console.error('Error updating position:', error);
      toast.error('Chyba při aktualizaci pozice');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) return;

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Pozice byla smazána');
      refetch();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  const startEdit = (position: any) => {
    setEditingId(position.id);
    setFormData({
      name: position.name,
      position_type: position.position_type as DHLPositionType,
      description: position.description || '',
      hourly_rate: position.hourly_rate,
      requirements: position.requirements || [],
      cycle_weeks: position.cycle_weeks || []
    });
    setSelectedWeeks(position.cycle_weeks || []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(defaultFormData);
    setSelectedWeeks([]);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const toggleWeek = (week: number) => {
    const newWeeks = selectedWeeks.includes(week)
      ? selectedWeeks.filter(w => w !== week)
      : [...selectedWeeks, week].sort((a, b) => a - b);
    
    setSelectedWeeks(newWeeks);
    setFormData(prev => ({ ...prev, cycle_weeks: newWeeks }));
  };

  if (isLoading) {
    return <div className="p-4">Načítání pozic...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Position */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Správa pozic</CardTitle>
              <CardDescription>
                Spravujte DHL pozice a jejich cykly týdnů
              </CardDescription>
            </div>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nová pozice
              </Button>
            )}
          </div>
        </CardHeader>

        {isCreating && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Název pozice *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="např. Sortierer Linie A"
                />
              </div>

              <div>
                <Label htmlFor="position_type">Typ pozice *</Label>
                <Select 
                  value={formData.position_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, position_type: value as DHLPositionType }))}
                >
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
                <Label htmlFor="hourly_rate">Hodinová sazba (CZK)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    hourly_rate: e.target.value ? parseFloat(e.target.value) : null 
                  }))}
                  placeholder="např. 150"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Popis pozice a odpovědností"
                  rows={3}
                />
              </div>
            </div>

            {/* Cycle Weeks Selection */}
            <div>
              <Label>Týdny v cyklu *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from({ length: 15 }, (_, i) => i + 1).map(week => (
                  <Badge
                    key={week}
                    variant={selectedWeeks.includes(week) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleWeek(week)}
                  >
                    W{week}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Vyberte týdny, které tato pozice má ve svém cyklu
              </p>
            </div>

            {/* Requirements */}
            <div>
              <Label>Požadavky</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="Přidat požadavek"
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <Button type="button" onClick={addRequirement} size="sm">
                  Přidat
                </Button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {req}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeRequirement(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                <Check className="h-4 w-4 mr-2" />
                Vytvořit
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Zrušit
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Existing Positions */}
      <div className="grid gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardContent className="pt-6">
              {editingId === position.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${position.id}`}>Název pozice *</Label>
                      <Input
                        id={`name-${position.id}`}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`type-${position.id}`}>Typ pozice *</Label>
                      <Select 
                        value={formData.position_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, position_type: value as DHLPositionType }))}
                      >
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
                      <Label htmlFor={`rate-${position.id}`}>Hodinová sazba (CZK)</Label>
                      <Input
                        id={`rate-${position.id}`}
                        type="number"
                        value={formData.hourly_rate || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          hourly_rate: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor={`desc-${position.id}`}>Popis</Label>
                      <Textarea
                        id={`desc-${position.id}`}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Cycle Weeks Selection */}
                  <div>
                    <Label>Týdny v cyklu *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(week => (
                        <Badge
                          key={week}
                          variant={selectedWeeks.includes(week) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleWeek(week)}
                        >
                          W{week}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(position.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Uložit
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Zrušit
                    </Button>
                  </div>
                </div>
              ) : (
                // Display View
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{position.name}</h3>
                      <Badge variant="outline">
                        {positionTypes.find(t => t.value === position.position_type)?.label}
                      </Badge>
                    </div>
                    
                    {position.description && (
                      <p className="text-sm text-muted-foreground">{position.description}</p>
                    )}
                    
                    {position.hourly_rate && (
                      <p className="text-sm"><strong>Sazba:</strong> {position.hourly_rate} CZK/hod</p>
                    )}
                    
                    {position.cycle_weeks && position.cycle_weeks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Cyklus týdnů:</p>
                        <div className="flex flex-wrap gap-1">
                          {position.cycle_weeks.map(week => (
                            <Badge key={week} variant="secondary" className="text-xs">
                              W{week}
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
                      onClick={() => startEdit(position)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(position.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Žádne pozice nenalezeny</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
