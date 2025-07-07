
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Settings, Calendar, User, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserAssignment {
  id: string;
  user_id: string;
  reference_date?: string;
  reference_woche?: number;
  user_profile: {
    username: string;
    email: string;
  };
  dhl_positions: {
    name: string;
  };
  dhl_work_groups: {
    name: string;
    week_number: number;
  };
}

const WocheReferenceManager: React.FC = () => {
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  
  const [referenceData, setReferenceData] = useState<{
    [key: string]: {
      date: string;
      woche: number;
    }
  }>({});

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_dhl_assignments')
        .select(`
          id,
          user_id,
          reference_date,
          reference_woche,
          dhl_positions(name),
          dhl_work_groups(name, week_number)
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Get user profiles separately
      const userIds = data?.map(assignment => assignment.user_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = data?.map(assignment => ({
        ...assignment,
        user_profile: profiles?.find(profile => profile.id === assignment.user_id) || {
          username: 'Unknown',
          email: 'Unknown'
        }
      })) as UserAssignment[];

      setAssignments(combinedData || []);
      
      // Initialize reference data
      const initialData: typeof referenceData = {};
      combinedData?.forEach(assignment => {
        initialData[assignment.id] = {
          date: assignment.reference_date || new Date().toISOString().split('T')[0],
          woche: assignment.reference_woche || assignment.dhl_work_groups.week_number
        };
      });
      setReferenceData(initialData);

    } catch (error) {
      console.error('Chyba při načítání přiřazení:', error);
      toast.error('Chyba při načítání dat');
    } finally {
      setIsLoading(false);
    }
  };

  const updateReference = async (assignmentId: string) => {
    const refData = referenceData[assignmentId];
    if (!refData) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('user_dhl_assignments')
        .update({
          reference_date: refData.date,
          reference_woche: refData.woche
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Referenční bod aktualizován');
      setEditingAssignment(null);
      await loadAssignments();

    } catch (error) {
      console.error('Chyba při aktualizaci:', error);
      toast.error('Chyba při aktualizaci referenčního bodu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReferenceChange = (assignmentId: string, field: 'date' | 'woche', value: string | number) => {
    setReferenceData(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Načítání přiřazení...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Nastavení Woche referenčních bodů
          </CardTitle>
          <CardDescription>
            Správa individuálních referenčních bodů zaměstnanců pro výpočet Woche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nebyly nalezeny žádné aktivní přiřazení zaměstnanců
              </div>
            ) : (
              assignments.map((assignment) => {
                const isEditing = editingAssignment === assignment.id;
                const refData = referenceData[assignment.id];
                
                return (
                  <Card key={assignment.id} className="border">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Informace o uživateli */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{assignment.user_profile.username}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.user_profile.email}
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {assignment.dhl_positions.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {assignment.dhl_work_groups.name}
                            </Badge>
                          </div>
                        </div>

                        {/* Referenční datum */}
                        <div className="space-y-2">
                          <Label className="text-sm">Referenční datum</Label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={refData?.date || ''}
                              onChange={(e) => handleReferenceChange(assignment.id, 'date', e.target.value)}
                              className="w-full"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {refData?.date || 'Nenastaveno'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Referenční Woche */}
                        <div className="space-y-2">
                          <Label className="text-sm">Referenční Woche</Label>
                          {isEditing ? (
                            <Select
                              value={refData?.woche?.toString() || ''}
                              onValueChange={(value) => handleReferenceChange(assignment.id, 'woche', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Vyberte Woche" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 15 }, (_, i) => i + 1).map(woche => (
                                  <SelectItem key={woche} value={woche.toString()}>
                                    Woche {woche}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline">
                              Woche {refData?.woche || assignment.dhl_work_groups.week_number}
                            </Badge>
                          )}
                        </div>

                        {/* Akce */}
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateReference(assignment.id)}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingAssignment(null)}
                                disabled={isSaving}
                              >
                                Zrušit
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAssignment(assignment.id)}
                            >
                              Upravit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WocheReferenceManager;
