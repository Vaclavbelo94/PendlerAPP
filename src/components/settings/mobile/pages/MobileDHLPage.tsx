import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Briefcase, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

const MobileDHLPage = () => {
  const { t } = useTranslation('settings');
  const { unifiedUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dhlSettings, setDhlSettings] = useState({ woche: '', position: '', standort: '' });
  const [positions, setPositions] = useState<any[]>([]);
  const [assignment, setAssignment] = useState<any>(null);

  useEffect(() => { loadDHLData(); }, [unifiedUser?.id]);

  const loadDHLData = async () => {
    if (!unifiedUser?.id) return;
    try {
      setLoading(true);
      const { data: positionsData } = await supabase.from('dhl_positions').select('*').eq('is_active', true);
      if (positionsData) setPositions(positionsData);
      const { data: assignmentData } = await supabase.from('user_dhl_assignments').select('*, dhl_positions(*)').eq('user_id', unifiedUser.id).eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
      if (assignmentData) {
        setAssignment(assignmentData);
        setDhlSettings({ woche: assignmentData.current_woche?.toString() || '', position: assignmentData.dhl_position_id || '', standort: assignmentData.location || '' });
      }
    } catch (error) {
      console.error('Error loading DHL data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDHLSettings = async () => {
    if (!unifiedUser?.id) return;
    try {
      setSaving(true);
      const assignmentData = { user_id: unifiedUser.id, dhl_position_id: dhlSettings.position || null, current_woche: parseInt(dhlSettings.woche) || null, location: dhlSettings.standort || null, is_active: true, updated_at: new Date().toISOString() };
      if (assignment) {
        const { error } = await supabase.from('user_dhl_assignments').update(assignmentData).eq('id', assignment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_dhl_assignments').insert(assignmentData);
        if (error) throw error;
      }
      if (dhlSettings.standort) await supabase.from('profiles').update({ location: dhlSettings.standort }).eq('id', unifiedUser.id);
      toast.success('DHL nastavení uloženo');
      loadDHLData();
    } catch (error) {
      console.error('Error saving DHL settings:', error);
      toast.error('Chyba při ukládání');
    } finally {
      setSaving(false);
    }
  };

  const dhlOptions = [
    { id: 'woche', label: t('week'), description: t('selectWeek'), icon: Calendar, options: [{ value: '1', label: 'Woche 1 (A)' }, { value: '2', label: 'Woche 2 (B)' }] },
    { id: 'position', label: t('position'), description: t('selectPosition'), icon: Briefcase, options: positions.map(p => ({ value: p.id, label: p.name })) },
    { id: 'standort', label: t('location'), description: t('selectLocation'), icon: MapPin, options: [{ value: 'Praha', label: 'Praha' }, { value: 'Brno', label: 'Brno' }, { value: 'Ostrava', label: 'Ostrava' }, { value: 'Plzeň', label: 'Plzeň' }] }
  ];

  if (loading) return <div className="p-4">Načítání...</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="font-semibold text-primary mb-2">DHL Zaměstnanec</h3>
        <p className="text-sm text-muted-foreground">Nastavte si své pracovní preference pro automatické generování směn.</p>
      </div>
      <div className="space-y-4">
        {dhlOptions.map((option) => (
          <div key={option.id} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <option.icon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label className="font-medium">{option.label}</Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
            <Select value={dhlSettings[option.id as keyof typeof dhlSettings]} onValueChange={(value) => setDhlSettings(prev => ({ ...prev, [option.id]: value }))}>
              <SelectTrigger><SelectValue placeholder={option.description} /></SelectTrigger>
              <SelectContent>{option.options.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button onClick={saveDHLSettings} disabled={saving} className="w-full" size="lg">{saving ? 'Ukládání...' : t('saveChanges')}</Button>
      <Button variant="outline" size="lg" onClick={() => toast.info('Rozvrh bude brzy k dispozici')} className="w-full justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">{t('dhlSchedule')}</div>
            <div className="text-sm text-muted-foreground">{t('dhlScheduleDesc')}</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileDHLPage;
