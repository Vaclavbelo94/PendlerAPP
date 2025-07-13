import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DHLPosition {
  id: string;
  name: string;
  position_type: string;
  description?: string;
  hourly_rate?: number;
  requirements?: string[];
  is_active: boolean;
  cycle_weeks: number[];
}

interface ShiftTemplate {
  id?: string;
  position_id: string;
  woche_number: number;
  calendar_week: number;
  monday_shift: string | null;
  tuesday_shift: string | null;
  wednesday_shift: string | null;
  thursday_shift: string | null;
  friday_shift: string | null;
  saturday_shift: string | null;
  sunday_shift: string | null;
}

interface ShiftTemplateEditorProps {
  positions: DHLPosition[];
}

const SHIFT_TYPES = [
  { value: '', label: 'Nevybráno' },
  { value: 'R', label: 'Ranní (R)' },
  { value: 'O', label: 'Odpolední (O)' },
  { value: 'N', label: 'Noční (N)' },
  { value: 'OFF', label: 'Volno (OFF)' }
];

const DAYS = [
  { key: 'monday_shift', label: 'Po' },
  { key: 'tuesday_shift', label: 'Út' },
  { key: 'wednesday_shift', label: 'St' },
  { key: 'thursday_shift', label: 'Čt' },
  { key: 'friday_shift', label: 'Pá' },
  { key: 'saturday_shift', label: 'So' },
  { key: 'sunday_shift', label: 'Ne' }
];

export function ShiftTemplateEditor({ positions }: ShiftTemplateEditorProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [templates, setTemplates] = useState<ShiftTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySourceKW, setCopySourceKW] = useState<string>('');

  const selectedPos = positions.find(p => p.id === selectedPosition);
  const availableWochen = selectedPos?.cycle_weeks || [];

  // Load templates for selected position
  useEffect(() => {
    if (selectedPosition) {
      loadTemplates();
    } else {
      setTemplates([]);
    }
  }, [selectedPosition]);

  const loadTemplates = async () => {
    if (!selectedPosition) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dhl_position_shift_templates')
        .select('*')
        .eq('position_id', selectedPosition)
        .order('woche_number', { ascending: true })
        .order('calendar_week', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst šablony směn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemplate = (woche: number, kw: number): ShiftTemplate => {
    return templates.find(t => t.woche_number === woche && t.calendar_week === kw) || {
      position_id: selectedPosition,
      woche_number: woche,
      calendar_week: kw,
      monday_shift: null,
      tuesday_shift: null,
      wednesday_shift: null,
      thursday_shift: null,
      friday_shift: null,
      saturday_shift: null,
      sunday_shift: null,
    };
  };

  const updateTemplate = (woche: number, kw: number, day: string, shift: string) => {
    const existingTemplate = templates.find(t => t.woche_number === woche && t.calendar_week === kw);
    
    if (existingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.woche_number === woche && t.calendar_week === kw
          ? { ...t, [day]: shift || null }
          : t
      ));
    } else {
      const newTemplate: ShiftTemplate = {
        position_id: selectedPosition,
        woche_number: woche,
        calendar_week: kw,
        monday_shift: null,
        tuesday_shift: null,
        wednesday_shift: null,
        thursday_shift: null,
        friday_shift: null,
        saturday_shift: null,
        sunday_shift: null,
        [day]: shift || null,
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
  };

  const saveTemplates = async () => {
    if (!selectedPosition) return;

    setLoading(true);
    try {
      // Filter out templates with all null shifts
      const templatesWithShifts = templates.filter(t => 
        t.monday_shift || t.tuesday_shift || t.wednesday_shift || 
        t.thursday_shift || t.friday_shift || t.saturday_shift || t.sunday_shift
      );

      // Delete existing templates for this position
      await supabase
        .from('dhl_position_shift_templates')
        .delete()
        .eq('position_id', selectedPosition);

      // Insert new templates
      if (templatesWithShifts.length > 0) {
        const { error } = await supabase
          .from('dhl_position_shift_templates')
          .insert(templatesWithShifts.map(({ id, ...template }) => template));

        if (error) throw error;
      }

      toast({
        title: "Uloženo",
        description: "Šablony směn byly úspěšně uloženy",
      });

      loadTemplates(); // Reload to get IDs
    } catch (error) {
      console.error('Error saving templates:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit šablony směn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyKWPattern = (sourceKW: number, targetKW: number, woche: number) => {
    const sourceTemplate = getTemplate(woche, sourceKW);
    updateTemplate(targetKW, woche, 'monday_shift', sourceTemplate.monday_shift || '');
    updateTemplate(targetKW, woche, 'tuesday_shift', sourceTemplate.tuesday_shift || '');
    updateTemplate(targetKW, woche, 'wednesday_shift', sourceTemplate.wednesday_shift || '');
    updateTemplate(targetKW, woche, 'thursday_shift', sourceTemplate.thursday_shift || '');
    updateTemplate(targetKW, woche, 'friday_shift', sourceTemplate.friday_shift || '');
    updateTemplate(targetKW, woche, 'saturday_shift', sourceTemplate.saturday_shift || '');
    updateTemplate(targetKW, woche, 'sunday_shift', sourceTemplate.sunday_shift || '');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editor šablon směn</CardTitle>
        <div className="flex gap-4 items-center">
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Vyberte pozici" />
            </SelectTrigger>
            <SelectContent>
              {positions.map(position => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={saveTemplates} 
            disabled={!selectedPosition || loading}
            className="ml-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Uložit šablony
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedPosition ? (
          <div className="text-center text-muted-foreground py-8">
            Vyberte pozici pro editaci šablon směn
          </div>
        ) : (
          <Tabs defaultValue={availableWochen[0]?.toString()} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {availableWochen.slice(0, 5).map(woche => (
                <TabsTrigger key={woche} value={woche.toString()}>
                  Woche {woche}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {availableWochen.length > 5 && (
              <TabsList className="grid w-full grid-cols-5 mt-2">
                {availableWochen.slice(5, 10).map(woche => (
                  <TabsTrigger key={woche} value={woche.toString()}>
                    Woche {woche}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            {availableWochen.length > 10 && (
              <TabsList className="grid w-full grid-cols-5 mt-2">
                {availableWochen.slice(10, 15).map(woche => (
                  <TabsTrigger key={woche} value={woche.toString()}>
                    Woche {woche}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            {availableWochen.map(woche => (
              <TabsContent key={woche} value={woche.toString()} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline">Woche {woche}</Badge>
                    <div className="flex items-center gap-2">
                      <Select value={copySourceKW} onValueChange={setCopySourceKW}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="KW" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 53 }, (_, i) => i + 1).map(kw => (
                            <SelectItem key={kw} value={kw.toString()}>
                              KW{kw.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!copySourceKW}
                        onClick={() => {
                          const sourceKW = parseInt(copySourceKW);
                          // Copy to next 10 weeks
                          for (let i = 1; i <= 10; i++) {
                            const targetKW = sourceKW + i;
                            if (targetKW <= 53) {
                              copyKWPattern(sourceKW, targetKW, woche);
                            }
                          }
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Kopírovat vzor
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 53 }, (_, i) => i + 1).map(kw => {
                      const template = getTemplate(woche, kw);
                      
                      return (
                        <Card key={kw} className="p-4">
                          <div className="font-medium mb-3 text-center">
                            KW{kw.toString().padStart(2, '0')}
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1">
                            {DAYS.map(({ key, label }) => (
                              <div key={key} className="space-y-1">
                                <div className="text-xs text-center font-medium">
                                  {label}
                                </div>
                                <Select
                                  value={template[key as keyof ShiftTemplate] as string || ''}
                                  onValueChange={(value) => updateTemplate(woche, kw, key, value)}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {SHIFT_TYPES.map(type => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.value || '-'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}