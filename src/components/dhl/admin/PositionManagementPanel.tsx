
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit, Plus, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

interface DHLPosition {
  id: string;
  name: string;
  position_type: string;
  description?: string;
  hourly_rate?: number;
  requirements?: string[];
  cycle_weeks?: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const PositionManagementPanel: React.FC = () => {
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState<DHLPosition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSavePosition = async (positionData: Partial<DHLPosition>) => {
    try {
      if (editingPosition) {
        // Update existing position
        const { error } = await supabase
          .from('dhl_positions')
          .update({
            name: positionData.name,
            position_type: positionData.position_type,
            description: positionData.description,
            hourly_rate: positionData.hourly_rate,
            requirements: positionData.requirements,
            cycle_weeks: positionData.cycle_weeks,
            is_active: positionData.is_active
          })
          .eq('id', editingPosition.id);

        if (error) throw error;
        toast.success('Pozice byla aktualizována');
      } else {
        // Create new position
        const { error } = await supabase
          .from('dhl_positions')
          .insert({
            name: positionData.name,
            position_type: positionData.position_type,
            description: positionData.description,
            hourly_rate: positionData.hourly_rate,
            requirements: positionData.requirements,
            cycle_weeks: positionData.cycle_weeks,
            is_active: positionData.is_active ?? true
          });

        if (error) throw error;
        toast.success('Nová pozice byla vytvořena');
      }

      setIsDialogOpen(false);
      setEditingPosition(null);
      loadPositions();
    } catch (error) {
      console.error('Error saving position:', error);
      toast.error('Chyba při ukládání pozice');
    }
  };

  const handleDeletePosition = async (positionId: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) return;

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-medium dhl-text-wrap">
          DHL Pozice ({positions.filter(p => p.is_active).length})
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingPosition(null);
                setIsDialogOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Přidat pozici
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPosition ? 'Upravit pozici' : 'Nová pozice'}
              </DialogTitle>
              <DialogDescription>
                Definujte DHL pozici s týdny v plánu směn
              </DialogDescription>
            </DialogHeader>
            <PositionForm
              position={editingPosition}
              onSave={handleSavePosition}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingPosition(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {positions.filter(p => p.is_active).map((position) => (
          <Card key={position.id} className="dhl-mobile-card">
            <CardHeader className="dhl-mobile-card-header">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="dhl-mobile-card-title flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="dhl-text-wrap">{position.name}</span>
                    </CardTitle>
                    <CardDescription className="dhl-mobile-card-description mt-1">
                      {position.description || 'Žádný popis'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {position.position_type}
                    </Badge>
                    {position.hourly_rate && (
                      <Badge variant="outline" className="text-xs">
                        {position.hourly_rate}€/h
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="dhl-mobile-card-content">
              <div className="space-y-4">
                {/* Cycle weeks info */}
                <div className="dhl-mobile-schedule-item">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="dhl-mobile-schedule-label">Týdny v cyklu</div>
                      <div className="dhl-mobile-schedule-value">
                        {position.cycle_weeks && position.cycle_weeks.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {position.cycle_weeks.sort((a, b) => a - b).map((week) => (
                              <Badge key={week} variant="outline" className="text-xs">
                                W{week}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Nejsou definovány týdny</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {position.requirements && position.requirements.length > 0 && (
                  <div className="dhl-mobile-schedule-item">
                    <div className="dhl-mobile-schedule-label">Požadavky</div>
                    <div className="text-xs text-muted-foreground">
                      {position.requirements.join(', ')}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="dhl-mobile-actions">
                  <div className="dhl-mobile-button-group">
                    <Button
                      variant="outline"
                      className="dhl-mobile-button-secondary"
                      onClick={() => {
                        setEditingPosition(position);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                      Upravit
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="dhl-mobile-button-secondary"
                      onClick={() => handleDeletePosition(position.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Smazat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.filter(p => p.is_active).length === 0 && (
        <Card className="dhl-mobile-card">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Žádné pozice</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Zatím nebyly vytvořeny žádné DHL pozice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Form component for creating/editing positions
interface PositionFormProps {
  position: DHLPosition | null;
  onSave: (data: Partial<DHLPosition>) => void;
  onCancel: () => void;
}

const PositionForm: React.FC<PositionFormProps> = ({ position, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: position?.name || '',
    position_type: position?.position_type || 'sortierer',
    description: position?.description || '',
    hourly_rate: position?.hourly_rate || 0,
    requirements: position?.requirements?.join(', ') || '',
    cycle_weeks: position?.cycle_weeks || [],
    is_active: position?.is_active ?? true
  });

  const [selectedWeeks, setSelectedWeeks] = useState<number[]>(position?.cycle_weeks || []);

  const handleWeekToggle = (week: number) => {
    setSelectedWeeks(prev => {
      const updated = prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week].sort((a, b) => a - b);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requirementsArray = formData.requirements
      .split(',')
      .map(req => req.trim())
      .filter(req => req.length > 0);

    onSave({
      ...formData,
      requirements: requirementsArray.length > 0 ? requirementsArray : undefined,
      cycle_weeks: selectedWeeks,
      hourly_rate: formData.hourly_rate > 0 ? formData.hourly_rate : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Název pozice</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="position_type">Typ pozice</Label>
          <Select
            value={formData.position_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, position_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sortierer">Sortierer</SelectItem>
              <SelectItem value="verlader">Verlader</SelectItem>
              <SelectItem value="rangierer">Rangierer</SelectItem>
              <SelectItem value="technik">Technik</SelectItem>
              <SelectItem value="fahrer">Fahrer</SelectItem>
              <SelectItem value="other">Ostatní</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hourly_rate">Hodinová sazba (€)</Label>
          <Input
            id="hourly_rate"
            type="number"
            step="0.01"
            min="0"
            value={formData.hourly_rate}
            onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label>Aktivní pozice</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="requirements">Požadavky (oddělené čárkou)</Label>
        <Input
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
          placeholder="např. Řidičský průkaz, Zkušenosti s..."
        />
      </div>

      <div>
        <Label>Týdny v cyklu (Woche 1-15)</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => (
            <Button
              key={week}
              type="button"
              variant={selectedWeeks.includes(week) ? "default" : "outline"}
              size="sm"
              onClick={() => handleWeekToggle(week)}
              className="text-xs"
            >
              W{week}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Vyberte týdny, které má tato pozice v plánu směn
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button type="submit" className="w-full sm:w-auto">
          {position ? 'Aktualizovat' : 'Vytvořit'} pozici
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Zrušit
        </Button>
      </div>
    </form>
  );
};
