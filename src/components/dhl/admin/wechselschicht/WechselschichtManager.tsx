import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  Edit, 
  Save, 
  X, 
  Users, 
  Calendar,
  Sun,
  Moon,
  Sunrise,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';
import WochePatternEditor from './WochePatternEditor';
import WochePatternCard from './WochePatternCard';
import FlexibleTimeManager from './FlexibleTimeManager';
import RotationAlgorithm from './RotationAlgorithm';

interface WechselschichtPattern {
  id: string;
  woche_number: number;
  pattern_name: string;
  description: string | null;
  monday_shift: string | null;
  tuesday_shift: string | null;
  wednesday_shift: string | null;
  thursday_shift: string | null;
  friday_shift: string | null;
  saturday_shift: string | null;
  sunday_shift: string | null;
  morning_start_time: string;
  morning_end_time: string;
  afternoon_start_time: string;
  afternoon_end_time: string;
  night_start_time: string;
  night_end_time: string;
  weekly_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const WechselschichtManager = () => {
  const { t } = useTranslation(['dhl', 'common']);
  const [patterns, setPatterns] = useState<WechselschichtPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPattern, setEditingPattern] = useState<WechselschichtPattern | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dhl_wechselschicht_patterns')
        .select('*')
        .order('woche_number');

      if (error) throw error;
      setPatterns(data || []);
    } catch (error) {
      console.error('Error loading patterns:', error);
      toast.error('Chyba při načítání Wechselschicht vzorců');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPattern = (pattern: WechselschichtPattern) => {
    setEditingPattern(pattern);
    setShowEditor(true);
  };

  const handleSavePattern = async (updatedPattern: WechselschichtPattern) => {
    try {
      const { error } = await supabase
        .from('dhl_wechselschicht_patterns')
        .update({
          pattern_name: updatedPattern.pattern_name,
          description: updatedPattern.description,
          monday_shift: updatedPattern.monday_shift,
          tuesday_shift: updatedPattern.tuesday_shift,
          wednesday_shift: updatedPattern.wednesday_shift,
          thursday_shift: updatedPattern.thursday_shift,
          friday_shift: updatedPattern.friday_shift,
          saturday_shift: updatedPattern.saturday_shift,
          sunday_shift: updatedPattern.sunday_shift,
          morning_start_time: updatedPattern.morning_start_time,
          morning_end_time: updatedPattern.morning_end_time,
          afternoon_start_time: updatedPattern.afternoon_start_time,
          afternoon_end_time: updatedPattern.afternoon_end_time,
          night_start_time: updatedPattern.night_start_time,
          night_end_time: updatedPattern.night_end_time,
          weekly_hours: updatedPattern.weekly_hours,
          is_active: updatedPattern.is_active
        })
        .eq('id', updatedPattern.id);

      if (error) throw error;
      
      toast.success(`Woche ${updatedPattern.woche_number} vzorec aktualizován`);
      setShowEditor(false);
      setEditingPattern(null);
      loadPatterns();
    } catch (error) {
      console.error('Error updating pattern:', error);
      toast.error('Chyba při aktualizaci vzorce');
    }
  };

  const getShiftIcon = (shiftType: string | null) => {
    switch (shiftType) {
      case 'morning':
        return <Sunrise className="h-4 w-4 text-yellow-600" />;
      case 'afternoon':
        return <Sun className="h-4 w-4 text-orange-600" />;
      case 'night':
        return <Moon className="h-4 w-4 text-blue-600" />;
      default:
        return <X className="h-4 w-4 text-gray-400" />;
    }
  };

  const getShiftBadgeColor = (shiftType: string | null) => {
    switch (shiftType) {
      case 'morning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'afternoon':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'night':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShiftLabel = (shiftType: string | null) => {
    switch (shiftType) {
      case 'morning':
        return 'Ranní';
      case 'afternoon':
        return 'Odpolední';
      case 'night':
        return 'Noční';
      default:
        return 'Volno';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Načítání Wechselschicht vzorců...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Wechselschicht 30h Manager</h2>
          <p className="text-muted-foreground">
            Kompletní správa 15 rotačních vzorců s flexibilními časy a automatickou rotací
          </p>
        </div>
        <Button onClick={loadPatterns} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Obnovit
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Celkem vzorců</p>
                <p className="text-2xl font-bold">{patterns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Aktivní vzorce</p>
                <p className="text-2xl font-bold">{patterns.filter(p => p.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Průměr hodin/týden</p>
                <p className="text-2xl font-bold">
                  {Math.round(patterns.reduce((sum, p) => sum + p.weekly_hours, 0) / patterns.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sunrise className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Různé směny</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Ranní, Odpolední, Noční</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Vzorce směn
          </TabsTrigger>
          <TabsTrigger value="flexible" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Flexibilní časy
          </TabsTrigger>
          <TabsTrigger value="rotation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Rotační algoritmus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          {/* Pattern Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <WochePatternCard
                key={pattern.id}
                pattern={pattern}
                onEdit={handleEditPattern}
                getShiftIcon={getShiftIcon}
                getShiftBadgeColor={getShiftBadgeColor}
                getShiftLabel={getShiftLabel}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flexible" className="space-y-6">
          <FlexibleTimeManager 
            patterns={patterns}
            onTimeChange={() => loadPatterns()}
          />
        </TabsContent>

        <TabsContent value="rotation" className="space-y-6">
          <RotationAlgorithm patterns={patterns} />
        </TabsContent>
      </Tabs>

      {/* Pattern Editor Modal */}
      {showEditor && editingPattern && (
        <WochePatternEditor
          pattern={editingPattern}
          onSave={handleSavePattern}
          onCancel={() => {
            setShowEditor(false);
            setEditingPattern(null);
          }}
          getShiftIcon={getShiftIcon}
          getShiftBadgeColor={getShiftBadgeColor}
          getShiftLabel={getShiftLabel}
        />
      )}
    </div>
  );
};

export default WechselschichtManager;