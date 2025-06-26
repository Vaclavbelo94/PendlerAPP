
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Users, Settings, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import './MobileDHLStyles.css';

interface Position {
  id: string;
  name: string;
  description?: string;
  position_type: string;
  requirements?: string[];
  cycle_weeks?: number[];
  is_active: boolean;
  created_at: string;
}

interface WorkGroup {
  id: string;
  name: string;
  description?: string;
  week_number: number;
  is_active: boolean;
}

export const PositionManagementPanel: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editingWorkGroup, setEditingWorkGroup] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState({
    name: '',
    description: '',
    position_type: 'operator',
    requirements: [] as string[],
    cycle_weeks: [] as number[]
  });
  const [newWorkGroup, setNewWorkGroup] = useState({
    name: '',
    description: '',
    week_number: 1
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [positionsResponse, workGroupsResponse] = await Promise.all([
        supabase.from('dhl_positions').select('*').order('name'),
        supabase.from('dhl_work_groups').select('*').order('week_number')
      ]);

      if (positionsResponse.error) throw positionsResponse.error;
      if (workGroupsResponse.error) throw workGroupsResponse.error;

      setPositions(positionsResponse.data || []);
      setWorkGroups(workGroupsResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Chyba při načítání dat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePosition = async () => {
    if (!newPosition.name.trim()) {
      toast.error('Název pozice je povinný');
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .insert([{
          name: newPosition.name,
          description: newPosition.description || null,
          position_type: newPosition.position_type,
          requirements: newPosition.requirements.length > 0 ? newPosition.requirements : null,
          cycle_weeks: newPosition.cycle_weeks.length > 0 ? newPosition.cycle_weeks : null
        }]);

      if (error) throw error;

      toast.success('Pozice byla vytvořena');
      setNewPosition({
        name: '',
        description: '',
        position_type: 'operator',
        requirements: [],
        cycle_weeks: []
      });
      loadData();
    } catch (error) {
      console.error('Error creating position:', error);
      toast.error('Chyba při vytváření pozice');
    }
  };

  const handleCreateWorkGroup = async () => {
    if (!newWorkGroup.name.trim()) {
      toast.error('Název pracovní skupiny je povinný');
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_work_groups')
        .insert([{
          name: newWorkGroup.name,
          description: newWorkGroup.description || null,
          week_number: newWorkGroup.week_number
        }]);

      if (error) throw error;

      toast.success('Pracovní skupina byla vytvořena');
      setNewWorkGroup({
        name: '',
        description: '',
        week_number: 1
      });
      loadData();
    } catch (error) {
      console.error('Error creating work group:', error);
      toast.error('Chyba při vytváření pracovní skupiny');
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) return;

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Pozice byla smazána');
      loadData();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  const handleDeleteWorkGroup = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto pracovní skupinu?')) return;

    try {
      const { error } = await supabase
        .from('dhl_work_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Pracovní skupina byla smazána');
      loadData();
    } catch (error) {
      console.error('Error deleting work group:', error);
      toast.error('Chyba při mazání pracovní skupiny');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Načítám data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Positions Section */}
      <Card className="dhl-mobile-card">
        <CardHeader className="dhl-mobile-card-header">
          <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
            <Users className="h-5 w-5" />
            Správa pozic
          </CardTitle>
          <CardDescription className="dhl-mobile-card-description">
            Spravujte dostupné pozice a jejich vlastnosti
          </CardDescription>
        </CardHeader>
        <CardContent className="dhl-mobile-card-content space-y-4">
          {/* Create New Position */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Vytvořit novou pozici</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="positionName">Název pozice</Label>
                  <Input
                    id="positionName"
                    value={newPosition.name}
                    onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
                    placeholder="např. Operátor linky"
                  />
                </div>
                <div>
                  <Label htmlFor="positionType">Typ pozice</Label>
                  <Select value={newPosition.position_type} onValueChange={(value) => setNewPosition({...newPosition, position_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Operátor</SelectItem>
                      <SelectItem value="supervisor">Supervizor</SelectItem>
                      <SelectItem value="manager">Manažer</SelectItem>
                      <SelectItem value="maintenance">Údržba</SelectItem>
                      <SelectItem value="quality">Kvalita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="positionDescription">Popis</Label>
                <Textarea
                  id="positionDescription"
                  value={newPosition.description}
                  onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
                  placeholder="Volitelný popis pozice..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreatePosition} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Vytvořit pozici
              </Button>
            </div>
          </div>

          {/* Positions List */}
          <div className="space-y-3">
            <h4 className="font-medium">Existující pozice ({positions.length})</h4>
            {positions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Žádné pozice nebyly vytvořeny</p>
              </div>
            ) : (
              positions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{position.name}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {position.position_type}
                        </Badge>
                        {!position.is_active && (
                          <Badge variant="destructive" className="text-xs">
                            Neaktivní
                          </Badge>
                        )}
                      </div>
                      {position.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {position.description}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Vytvořeno: {new Date(position.created_at).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDeletePosition(position.id)}
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

      {/* Work Groups Section */}
      <Card className="dhl-mobile-card">
        <CardHeader className="dhl-mobile-card-header">
          <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Správa pracovních skupin
          </CardTitle>
          <CardDescription className="dhl-mobile-card-description">
            Spravujte pracovní skupiny a jejich týdenní cykly
          </CardDescription>
        </CardHeader>
        <CardContent className="dhl-mobile-card-content space-y-4">
          {/* Create New Work Group */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3">Vytvořit novou pracovní skupinu</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="workGroupName">Název skupiny</Label>
                  <Input
                    id="workGroupName"
                    value={newWorkGroup.name}
                    onChange={(e) => setNewWorkGroup({...newWorkGroup, name: e.target.value})}
                    placeholder="např. Skupina A"
                  />
                </div>
                <div>
                  <Label htmlFor="weekNumber">Číslo týdne</Label>
                  <Select value={newWorkGroup.week_number.toString()} onValueChange={(value) => setNewWorkGroup({...newWorkGroup, week_number: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map(week => (
                        <SelectItem key={week} value={week.toString()}>
                          Týden {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="workGroupDescription">Popis</Label>
                <Textarea
                  id="workGroupDescription"
                  value={newWorkGroup.description}
                  onChange={(e) => setNewWorkGroup({...newWorkGroup, description: e.target.value})}
                  placeholder="Volitelný popis skupiny..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreateWorkGroup} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Vytvořit skupinu
              </Button>
            </div>
          </div>

          {/* Work Groups List */}
          <div className="space-y-3">
            <h4 className="font-medium">Existující pracovní skupiny ({workGroups.length})</h4>
            {workGroups.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Žádné pracovní skupiny nebyly vytvořeny</p>
              </div>
            ) : (
              workGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">{group.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          Týden {group.week_number}
                        </Badge>
                        {!group.is_active && (
                          <Badge variant="destructive" className="text-xs">
                            Neaktivní
                          </Badge>
                        )}
                      </div>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDeleteWorkGroup(group.id)}
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
