import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DHLPosition, DHLWorkGroup } from '@/types/dhl';

interface EmployeeGroup {
  id: string;
  name: string;
  description: string;
  positionIds: string[];
  positions?: DHLPosition[];
  location?: string;
  employeeCount: number;
}

const GroupManager = () => {
  const { t } = useTranslation(['dhl', 'common']);
  const [groups, setGroups] = useState<EmployeeGroup[]>([]);
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<EmployeeGroup | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [groupLocation, setGroupLocation] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('dhl_positions')
        .select('*')
        .eq('is_active', true);

      if (positionsError) throw positionsError;
      setPositions((positionsData || []) as DHLPosition[]);

      // Load work groups
      const { data: workGroupsData, error: workGroupsError } = await supabase
        .from('dhl_work_groups')
        .select('*')
        .eq('is_active', true);

      if (workGroupsError) throw workGroupsError;
      setWorkGroups(workGroupsData || []);

      // Create mock groups for demonstration - in real app this would come from database
      const mockGroups: EmployeeGroup[] = [
        {
          id: '1',
          name: t('admin.groups.examples.earlyShift'),
          description: t('admin.groups.examples.earlyShiftDesc'),
          positionIds: positionsData?.slice(0, 2).map(p => p.id) || [],
          positions: (positionsData?.slice(0, 2) || []) as DHLPosition[],
          location: 'Brno',
          employeeCount: 12
        },
        {
          id: '2',
          name: t('admin.groups.examples.lateShift'),
          description: t('admin.groups.examples.lateShiftDesc'),
          positionIds: positionsData?.slice(2, 4).map(p => p.id) || [],
          positions: (positionsData?.slice(2, 4) || []) as DHLPosition[],
          location: 'Praha',
          employeeCount: 8
        }
      ];

      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setSelectedPositions([]);
    setGroupLocation('');
    setEditingGroup(null);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error(t('admin.groups.validation.nameRequired'));
      return;
    }

    const newGroup: EmployeeGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      positionIds: selectedPositions,
      positions: positions.filter(p => selectedPositions.includes(p.id)),
      location: groupLocation,
      employeeCount: 0
    };

    setGroups(prev => [...prev, newGroup]);
    toast.success(t('admin.groups.success.created'));
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    toast.success(t('admin.groups.success.deleted'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.groups.title')}</h2>
          <p className="text-muted-foreground">
            {t('admin.groups.subtitle')}
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.groups.createNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('admin.groups.createDialog.title')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="groupName">{t('admin.groups.form.name')}</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={t('admin.groups.form.namePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="groupDescription">{t('admin.groups.form.description')}</Label>
                <Textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder={t('admin.groups.form.descriptionPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="groupLocation">{t('admin.groups.form.location')}</Label>
                <Input
                  id="groupLocation"
                  value={groupLocation}
                  onChange={(e) => setGroupLocation(e.target.value)}
                  placeholder={t('admin.groups.form.locationPlaceholder')}
                />
              </div>

              <div>
                <Label>{t('admin.groups.form.positions')}</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {positions.map((position) => (
                    <label key={position.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPositions.includes(position.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPositions(prev => [...prev, position.id]);
                          } else {
                            setSelectedPositions(prev => prev.filter(id => id !== position.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{position.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateGroup} className="flex-1">
                  {t('common.create')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {group.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('admin.groups.positions')}</span>
                  <Badge variant="secondary">
                    {group.positions?.length || 0} {t('admin.groups.positions')}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.positions?.map((position) => (
                    <Badge key={position.id} variant="outline" className="text-xs">
                      {position.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm">
                  <span className="font-medium">{group.employeeCount}</span>{' '}
                  <span className="text-muted-foreground">{t('admin.groups.employees')}</span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {t('common.active')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('admin.groups.empty.title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('admin.groups.empty.description')}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.groups.createFirst')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupManager;