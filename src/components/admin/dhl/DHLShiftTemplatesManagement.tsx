
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { DHLShiftTemplate, DHLPosition, DHLWorkGroup } from '@/types/dhl';
import { DAY_NAMES } from '@/utils/dhl/dhlUtils';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLShiftTemplatesManagement: React.FC = () => {
  const [templates, setTemplates] = useState<DHLShiftTemplate[]>([]);
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<DHLShiftTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { success, error } = useStandardizedToast();

  const [formData, setFormData] = useState({
    position_id: '',
    work_group_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    break_duration: '30',
    is_required: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [templatesResult, positionsResult, groupsResult] = await Promise.all([
        supabase
          .from('dhl_shift_templates')
          .select(`
            *,
            position:dhl_positions(*),
            work_group:dhl_work_groups(*)
          `)
          .order('day_of_week'),
        supabase
          .from('dhl_positions')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('dhl_work_groups')
          .select('*')
          .eq('is_active', true)
          .order('week_number')
      ]);

      if (templatesResult.error) throw templatesResult.error;
      if (positionsResult.error) throw positionsResult.error;
      if (groupsResult.error) throw groupsResult.error;

      setTemplates(templatesResult.data || []);
      setPositions(positionsResult.data || []);
      setWorkGroups(groupsResult.data || []);
    } catch (err) {
      error('Chyba', 'Nepodařilo se načíst data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const templateData = {
        position_id: formData.position_id || null,
        work_group_id: formData.work_group_id || null,
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        break_duration: parseInt(formData.break_duration),
        is_required: formData.is_required
      };

      if (editingTemplate) {
        const { error: updateError } = await supabase
          .from('dhl_shift_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (updateError) throw updateError;
        success('Úspěch', 'Šablona směny byla aktualizována');
      } else {
        const { error: insertError } = await supabase
          .from('dhl_shift_templates')
          .insert(templateData);

        if (insertError) throw insertError;
        success('Úspěch', 'Šablona směny byla vytvořena');
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      error('Chyba', 'Nepodařilo se uložit šablonu směny');
      console.error('Error saving template:', err);
    }
  };

  const handleDelete = async (template: DHLShiftTemplate) => {
    if (!confirm('Opravdu chcete smazat tuto šablonu směny?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('dhl_shift_templates')
        .delete()
        .eq('id', template.id);

      if (deleteError) throw deleteError;
      
      success('Úspěch', 'Šablona směny byla smazána');
      await fetchData();
    } catch (err) {
      error('Chyba', 'Nepodařilo se smazat šablonu směny');
      console.error('Error deleting template:', err);
    }
  };

  const handleEdit = (template: DHLShiftTemplate) => {
    setEditingTemplate(template);
    setFormData({
      position_id: template.position_id || '',
      work_group_id: template.work_group_id || '',
      day_of_week: template.day_of_week.toString(),
      start_time: template.start_time,
      end_time: template.end_time,
      break_duration: template.break_duration.toString(),
      is_required: template.is_required
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
    setFormData({
      position_id: '',
      work_group_id: '',
      day_of_week: '',
      start_time: '',
      end_time: '',
      break_duration: '30',
      is_required: false
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Správa šablon směn</h2>
          <p className="text-muted-foreground">
            Definujte šablony směn pro různé pozice a pracovní skupiny
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Přidat šablonu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Upravit šablonu směny' : 'Nová šablona směny'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="position_id">Pozice</Label>
                <Select
                  value={formData.position_id}
                  onValueChange={(value) => setFormData({ ...formData, position_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pozici" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="work_group_id">Pracovní skupina</Label>
                <Select
                  value={formData.work_group_id}
                  onValueChange={(value) => setFormData({ ...formData, work_group_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte skupinu" />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="day_of_week">Den v týdnu</Label>
                <Select
                  value={formData.day_of_week}
                  onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte den" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DAY_NAMES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start_time">Začátek</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">Konec</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="break_duration">Přestávka (minuty)</Label>
                <Input
                  id="break_duration"
                  type="number"
                  min="0"
                  value={formData.break_duration}
                  onChange={(e) => setFormData({ ...formData, break_duration: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                />
                <Label htmlFor="is_required">Povinná směna</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTemplate ? 'Aktualizovat' : 'Vytvořit'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Zrušit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {DAY_NAMES[template.day_of_week as keyof typeof DAY_NAMES]}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-medium">
                  {template.start_time} - {template.end_time}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.position && (
                    <Badge variant="secondary" size="sm">
                      {template.position.name}
                    </Badge>
                  )}
                  {template.work_group && (
                    <Badge variant="outline" size="sm">
                      {template.work_group.name}
                    </Badge>
                  )}
                  {template.is_required && (
                    <Badge variant="destructive" size="sm">
                      Povinná
                    </Badge>
                  )}
                </div>
                
                {template.break_duration > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Přestávka: {template.break_duration} min
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Žádné šablony směn nebyly nalezeny. Přidejte první šablonu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DHLShiftTemplatesManagement;
