
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { DHLPosition, DHLPositionType } from '@/types/dhl';
import { POSITION_TYPE_NAMES, getPositionTypeColor } from '@/utils/dhl/dhlUtils';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLPositionsManagement: React.FC = () => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { success, error } = useStandardizedToast();

  const [formData, setFormData] = useState({
    name: '',
    position_type: 'other' as DHLPositionType,
    description: '',
    hourly_rate: '',
    requirements: [] as string[],
    is_active: true
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dhl_positions')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setPositions(data || []);
    } catch (err) {
      error('Chyba', 'Nepodařilo se načíst pozice');
      console.error('Error fetching positions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const positionData = {
        name: formData.name,
        position_type: formData.position_type,
        description: formData.description || null,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        requirements: formData.requirements.length > 0 ? formData.requirements : null,
        is_active: formData.is_active
      };

      if (editingPosition) {
        const { error: updateError } = await supabase
          .from('dhl_positions')
          .update(positionData)
          .eq('id', editingPosition.id);

        if (updateError) throw updateError;
        success('Úspěch', 'Pozice byla aktualizována');
      } else {
        const { error: insertError } = await supabase
          .from('dhl_positions')
          .insert(positionData);

        if (insertError) throw insertError;
        success('Úspěch', 'Pozice byla vytvořena');
      }

      await fetchPositions();
      handleCloseDialog();
    } catch (err) {
      error('Chyba', 'Nepodařilo se uložit pozici');
      console.error('Error saving position:', err);
    }
  };

  const handleDelete = async (position: DHLPosition) => {
    if (!confirm(`Opravdu chcete smazat pozici "${position.name}"?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('dhl_positions')
        .delete()
        .eq('id', position.id);

      if (deleteError) throw deleteError;
      
      success('Úspěch', 'Pozice byla smazána');
      await fetchPositions();
    } catch (err) {
      error('Chyba', 'Nepodařilo se smazat pozici');
      console.error('Error deleting position:', err);
    }
  };

  const handleEdit = (position: DHLPosition) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      position_type: position.position_type,
      description: position.description || '',
      hourly_rate: position.hourly_rate?.toString() || '',
      requirements: position.requirements || [],
      is_active: position.is_active
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPosition(null);
    setFormData({
      name: '',
      position_type: 'other',
      description: '',
      hourly_rate: '',
      requirements: [],
      is_active: true
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Správa DHL pozic</h2>
          <p className="text-muted-foreground">
            Spravujte pozice dostupné v DHL systému
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Přidat pozici
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Název pozice</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="position_type">Typ pozice</Label>
                <Select
                  value={formData.position_type}
                  onValueChange={(value) => setFormData({ ...formData, position_type: value as DHLPositionType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(POSITION_TYPE_NAMES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hourly_rate">Hodinová sazba (€)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktivní pozice</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingPosition ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Zrušit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{position.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(position)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(position)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getPositionTypeColor(position.position_type)}>
                    {POSITION_TYPE_NAMES[position.position_type]}
                  </Badge>
                  <Badge variant={position.is_active ? "success" : "destructive"} size="sm">
                    {position.is_active ? 'Aktivní' : 'Neaktivní'}
                  </Badge>
                </div>
                
                {position.hourly_rate && (
                  <p className="text-sm font-medium text-green-600">
                    {position.hourly_rate.toFixed(2)} €/hod
                  </p>
                )}
                
                {position.description && (
                  <p className="text-sm text-muted-foreground">
                    {position.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Žádné pozice nebyly nalezeny. Přidejte první pozici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DHLPositionsManagement;
