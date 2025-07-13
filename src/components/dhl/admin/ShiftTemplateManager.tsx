import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash, 
  Copy, 
  Clock, 
  Users,
  Calendar,
  Save,
  X,
  BookTemplate
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShiftTemplate {
  id?: string;
  name: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  position_id?: string;
  work_group_id?: string;
  break_duration: number;
  is_required: boolean;
  tags: string[];
}

const ShiftTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [workGroups, setWorkGroups] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultTemplate: ShiftTemplate = {
    name: '',
    description: '',
    type: 'ranní',
    start_time: '06:00',
    end_time: '14:00',
    break_duration: 30,
    is_required: false,
    tags: []
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Načtení pozic
      const { data: positionsData } = await supabase
        .from('dhl_positions')
        .select('*')
        .eq('is_active', true);

      // Načtení pracovních skupin
      const { data: workGroupsData } = await supabase
        .from('dhl_work_groups')
        .select('*')
        .eq('is_active', true);

      setPositions(positionsData || []);
      setWorkGroups(workGroupsData || []);

      // Mock data pro templates - v reálné aplikaci by se načítaly z databáze
      const mockTemplates: ShiftTemplate[] = [
        {
          id: '1',
          name: 'Ranní směna - Sortovna',
          description: 'Standardní ranní směna pro sortovnu',
          type: 'ranní',
          start_time: '06:00',
          end_time: '14:00',
          break_duration: 30,
          is_required: true,
          tags: ['sortovna', 'standardní']
        },
        {
          id: '2',
          name: 'Odpolední směna - Nakládka',
          description: 'Odpolední směna pro nakládkové práce',
          type: 'odpolední',
          start_time: '14:00',
          end_time: '22:00',
          break_duration: 45,
          is_required: false,
          tags: ['nakládka', 'težké']
        },
        {
          id: '3',
          name: 'Noční směna - Údržba',
          description: 'Noční směna pro údržbové práce',
          type: 'noční',
          start_time: '22:00',
          end_time: '06:00',
          break_duration: 60,
          is_required: false,
          tags: ['údržba', 'noční']
        }
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Chyba při načítání dat');
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name || !editingTemplate.start_time || !editingTemplate.end_time) {
      toast.error('Vyplňte povinná pole');
      return;
    }

    setLoading(true);
    try {
      if (isCreating) {
        // Vytvoření nové šablony
        const newTemplate = {
          ...editingTemplate,
          id: Math.random().toString(36).substr(2, 9)
        };
        setTemplates(prev => [...prev, newTemplate]);
        toast.success('Šablona směny byla vytvořena');
      } else {
        // Aktualizace existující šablony
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id ? editingTemplate : t
        ));
        toast.success('Šablona směny byla aktualizována');
      }

      setEditingTemplate(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Chyba při ukládání šablony');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Opravdu chcete smazat tuto šablonu?')) return;

    try {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Šablona směny byla smazána');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Chyba při mazání šablony');
    }
  };

  const handleDuplicateTemplate = (template: ShiftTemplate) => {
    const duplicated = {
      ...template,
      id: undefined,
      name: `${template.name} (kopie)`,
    };
    setEditingTemplate(duplicated);
    setIsCreating(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ranní': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'odpolední': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'noční': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'víkendová': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    if (end < start) {
      // Přes půlnoc
      end.setDate(end.getDate() + 1);
    }
    
    const diff = end.getTime() - start.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 10)) / 10; // Hodiny s desetinami
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookTemplate className="h-5 w-5" />
                Správa šablon směn
              </CardTitle>
              <CardDescription>
                Vytváření a správa opakovaně použitelných šablon směn
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setEditingTemplate(defaultTemplate);
                setIsCreating(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nová šablona
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Template Editor */}
      {editingTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Vytvoření nové šablony' : 'Úprava šablony'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Název šablony *</Label>
                <Input
                  id="template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  placeholder="Název šablony směny"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-type">Typ směny</Label>
                <Select
                  value={editingTemplate.type}
                  onValueChange={(value) => setEditingTemplate(prev => 
                    prev ? { ...prev, type: value } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranní">Ranní směna</SelectItem>
                    <SelectItem value="odpolední">Odpolední směna</SelectItem>
                    <SelectItem value="noční">Noční směna</SelectItem>
                    <SelectItem value="víkendová">Víkendová směna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Popis</Label>
              <Textarea
                id="template-description"
                value={editingTemplate.description}
                onChange={(e) => setEditingTemplate(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
                placeholder="Popis šablony směny"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-start">Začátek směny *</Label>
                <Input
                  id="template-start"
                  type="time"
                  value={editingTemplate.start_time}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, start_time: e.target.value } : null
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-end">Konec směny *</Label>
                <Input
                  id="template-end"
                  type="time"
                  value={editingTemplate.end_time}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, end_time: e.target.value } : null
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-break">Přestávka (minuty)</Label>
                <Input
                  id="template-break"
                  type="number"
                  value={editingTemplate.break_duration}
                  onChange={(e) => setEditingTemplate(prev => 
                    prev ? { ...prev, break_duration: parseInt(e.target.value) || 0 } : null
                  )}
                  min="0"
                  max="120"
                />
              </div>
            </div>

            {editingTemplate.start_time && editingTemplate.end_time && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Celková doba směny: {calculateDuration(editingTemplate.start_time, editingTemplate.end_time)} hodin
                  {editingTemplate.break_duration > 0 && (
                    <span> (včetně {editingTemplate.break_duration} min přestávky)</span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-position">Pozice</Label>
                <Select
                  value={editingTemplate.position_id || ''}
                  onValueChange={(value) => setEditingTemplate(prev => 
                    prev ? { ...prev, position_id: value || undefined } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte pozici" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Žádná pozice</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-workgroup">Pracovní skupina</Label>
                <Select
                  value={editingTemplate.work_group_id || ''}
                  onValueChange={(value) => setEditingTemplate(prev => 
                    prev ? { ...prev, work_group_id: value || undefined } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte skupinu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Žádná skupina</SelectItem>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveTemplate}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreating ? 'Vytvořit šablonu' : 'Uložit změny'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTemplate(null);
                  setIsCreating(false);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Zrušit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Existující šablony</CardTitle>
          <CardDescription>
            Seznam všech dostupných šablon směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{template.start_time} - {template.end_time}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {calculateDuration(template.start_time, template.end_time)}h
                        </div>
                      </div>
                      
                      {template.break_duration > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Přestávka: {template.break_duration} minut
                        </div>
                      )}
                      
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTemplate(template);
                            setIsCreating(false);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Upravit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Duplikovat
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => template.id && handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookTemplate className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Žádné šablony</h3>
              <p className="text-muted-foreground mb-4">
                Zatím nebyly vytvořeny žádné šablony směn
              </p>
              <Button
                onClick={() => {
                  setEditingTemplate(defaultTemplate);
                  setIsCreating(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Vytvořit první šablonu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftTemplateManager;