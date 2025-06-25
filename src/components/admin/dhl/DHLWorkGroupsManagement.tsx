
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { DHLWorkGroup } from '@/types/dhl';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLWorkGroupsManagement: React.FC = () => {
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<DHLWorkGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { success, error } = useStandardizedToast();

  const [formData, setFormData] = useState({
    name: '',
    week_number: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    fetchWorkGroups();
  }, []);

  const fetchWorkGroups = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dhl_work_groups')
        .select('*')
        .order('week_number');

      if (fetchError) throw fetchError;
      setWorkGroups(data || []);
    } catch (err) {
      error('Chyba', 'Nepodařilo se načíst pracovní skupiny');
      console.error('Error fetching work groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const groupData = {
        name: formData.name,
        week_number: parseInt(formData.week_number),
        description: formData.description || null,
        is_active: formData.is_active
      };

      if (editingGroup) {
        const { error: updateError } = await supabase
          .from('dhl_work_groups')
          .update(groupData)
          .eq('id', editingGroup.id);

        if (updateError) throw updateError;
        success('Úspěch', 'Pracovní skupina byla aktualizována');
      } else {
        const { error: insertError } = await supabase
          .from('dhl_work_groups')
          .insert(groupData);

        if (insertError) throw insertError;
        success('Úspěch', 'Pracovní skupina byla vytvořena');
      }

      await fetchWorkGroups();
      handleCloseDialog();
    } catch (err) {
      error('Chyba', 'Nepodařilo se uložit pracovní skupinu');
      console.error('Error saving work group:', err);
    }
  };

  const handleDelete = async (group: DHLWorkGroup) => {
    if (!confirm(`Opravdu chcete smazat pracovní skupinu "${group.name}"?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('dhl_work_groups')
        .delete()
        .eq('id', group.id);

      if (deleteError) throw deleteError;
      
      success('Úspěch', 'Pracovní skupina byla smazána');
      await fetchWorkGroups();
    } catch (err) {
      error('Chyba', 'Nepodařilo se smazat pracovní skupinu');
      console.error('Error deleting work group:', err);
    }
  };

  const handleEdit = (group: DHLWorkGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      week_number: group.week_number.toString(),
      description: group.description || '',
      is_active: group.is_active
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingGroup(null);
    setFormData({
      name: '',
      week_number: '',
      description: '',
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
          <h2 className="text-2xl font-bold">Správa pracovních skupin</h2>
          <p className="text-muted-foreground">
            Spravujte pracovní skupiny (týdny) v DHL systému
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Přidat skupinu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Upravit pracovní skupinu' : 'Nová pracovní skupina'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Název skupiny</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="např. Woche 1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="week_number">Číslo týdne (1-15)</Label>
                <Input
                  id="week_number"
                  type="number"
                  min="1"
                  max="15"
                  value={formData.week_number}
                  onChange={(e) => setFormData({ ...formData, week_number: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Popis pracovní skupiny..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktivní skupina</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingGroup ? 'Aktualizovat' : 'Vytvořit'}
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
        {workGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {group.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(group)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Týden {group.week_number}
                  </Badge>
                  <Badge variant={group.is_active ? "success" : "destructive"} size="sm">
                    {group.is_active ? 'Aktivní' : 'Neaktivní'}
                  </Badge>
                </div>
                
                {group.description && (
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Vytvořeno: {new Date(group.created_at).toLocaleDateString('cs-CZ')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workGroups.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Žádné pracovní skupiny nebyly nalezeny. Přidejte první skupinu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DHLWorkGroupsManagement;
