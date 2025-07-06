import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PositionFormDialog } from './PositionFormDialog';

export const PositionManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const { positions, isLoading, refreshData } = useDHLData(user?.id || null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<any>(null);

  const handleEditPosition = (position: any) => {
    setEditingPosition(position);
    setIsFormOpen(true);
  };

  const handleDeletePosition = async (positionId: string) => {
    if (!confirm('Opravdu chcete smazat tuto pozici?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dhl_positions')
        .update({ is_active: false })
        .eq('id', positionId);

      if (error) throw error;
      
      toast.success('Pozice byla úspěšně smazána');
      refreshData();
    } catch (error) {
      console.error('Error deleting position:', error);
      toast.error('Chyba při mazání pozice');
    }
  };

  const handleFormSuccess = () => {
    refreshData();
    setEditingPosition(null);
  };

  const handleAddPosition = () => {
    setEditingPosition(null);
    setIsFormOpen(true);
  };

  const positionTypes = [
    { value: 'fahrer', label: 'Fahrer' },
    { value: 'rangierer', label: 'Rangierer' },
    { value: 'sortierer', label: 'Sortierer' },
    { value: 'technik', label: 'Technik' },
    { value: 'verlader', label: 'Verlader' },
    { value: 'other', label: 'Ostatní' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Správa pozic</h2>
          <p className="text-muted-foreground">Spravujte DHL pozice a jejich nastavení</p>
        </div>
        <Button onClick={handleAddPosition}>
          <Plus className="h-4 w-4 mr-2" />
          Přidat pozici
        </Button>
      </div>

      {/* Position Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((position) => (
          <Card key={position.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{position.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {position.position_type}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPosition(position)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePosition(position.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {position.description && (
                <p className="text-sm text-muted-foreground">
                  {position.description}
                </p>
              )}
              {position.hourly_rate && (
                <p className="text-sm">
                  <strong>Hodinová sazba:</strong> {position.hourly_rate} €/h
                </p>
              )}
              {position.cycle_weeks && position.cycle_weeks.length > 0 && (
                <div className="text-sm">
                  <strong>Cyklus týdnů:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {position.cycle_weeks.map((week) => (
                      <Badge key={week} variant="outline" className="text-xs">
                        {week}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {positions.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Žádné pozice</h3>
          <p className="text-muted-foreground mb-4">
            Zatím nebyly vytvořeny žádné DHL pozice.
          </p>
          <Button onClick={handleAddPosition}>
            <Plus className="h-4 w-4 mr-2" />
            Přidat první pozici
          </Button>
        </Card>
      )}
      <PositionFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editingPosition={editingPosition}
      />
    </div>
  );
};
