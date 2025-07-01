
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building2, Users } from 'lucide-react';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DHLSetupFormData {
  positionId: string;
  workGroupId: string;
}

const DHLSetupForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { positions, workGroups, isLoading: dataLoading } = useDHLData(user?.id || null);
  const [formData, setFormData] = useState<DHLSetupFormData>({
    positionId: '',
    workGroupId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !formData.positionId || !formData.workGroupId) {
      toast.error('Prosím vyplňte všechna povinná pole');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('user_dhl_assignments')
        .insert({
          user_id: user.id,
          dhl_position_id: formData.positionId,
          dhl_work_group_id: formData.workGroupId,
          reference_date: new Date().toISOString().split('T')[0],
          reference_woche: Math.ceil((new Date().getTime() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) % 15 + 1
        });

      if (error) throw error;

      toast.success('DHL nastavení bylo úspěšně uloženo!');
      
      // Redirect to dashboard after successful setup
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Error saving DHL setup:', error);
      toast.error('Chyba při ukládání nastavení: ' + (error.message || 'Neznámá chyba'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPosition = positions.find(p => p.id === formData.positionId);
  const selectedWorkGroup = workGroups.find(w => w.id === formData.workGroupId);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Výběr pozice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">DHL Pozice *</Label>
            <Select
              value={formData.positionId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, positionId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte svou pozici v DHL" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{position.name}</span>
                      {position.description && (
                        <span className="text-sm text-muted-foreground">{position.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPosition && (
              <div className="text-sm text-muted-foreground mt-2">
                <p><strong>Typ:</strong> {selectedPosition.position_type}</p>
                {selectedPosition.hourly_rate && (
                  <p><strong>Hodinová sazba:</strong> {selectedPosition.hourly_rate} €</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Výběr pracovní skupiny
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workGroup">Pracovní skupina (Woche) *</Label>
            <Select
              value={formData.workGroupId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, workGroupId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte svou pracovní skupinu" />
              </SelectTrigger>
              <SelectContent>
                {workGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{group.name}</span>
                      {group.description && (
                        <span className="text-sm text-muted-foreground">{group.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWorkGroup && (
              <div className="text-sm text-muted-foreground mt-2">
                <p><strong>Týden:</strong> {selectedWorkGroup.week_number}/15</p>
                {selectedWorkGroup.description && (
                  <p><strong>Popis:</strong> {selectedWorkGroup.description}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
          disabled={isSubmitting}
        >
          Zrušit
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.positionId || !formData.workGroupId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ukládám...
            </>
          ) : (
            'Dokončit nastavení'
          )}
        </Button>
      </div>
    </form>
  );
};

export default DHLSetupForm;
