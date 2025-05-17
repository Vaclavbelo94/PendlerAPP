
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface WorkPreferencesProps {
  userId?: string;
  readOnly?: boolean;
}

interface WorkPreferencesData {
  preferred_shift_type: string;
  max_shifts_per_week: number;
  willing_to_travel_km: number;
  carpool_driver: boolean;
  carpool_passenger: boolean;
  preferred_locations: string[];
  notes: string;
}

const WorkPreferences = ({ userId, readOnly = false }: WorkPreferencesProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [preferences, setPreferences] = useState<WorkPreferencesData>({
    preferred_shift_type: "any",
    max_shifts_per_week: 5,
    willing_to_travel_km: 50,
    carpool_driver: false,
    carpool_passenger: false,
    preferred_locations: [],
    notes: ""
  });

  const targetUserId = userId || user?.id;
  
  // Možnosti pro směny
  const shiftTypes = [
    { value: "any", label: "Jakýkoli typ" },
    { value: "morning", label: "Ranní" },
    { value: "afternoon", label: "Odpolední" },
    { value: "night", label: "Noční" },
    { value: "weekday", label: "Pouze pracovní dny" },
    { value: "weekend", label: "Pouze víkendy" }
  ];

  useEffect(() => {
    const loadWorkPreferences = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_work_preferences')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání pracovních preferencí:', error);
          throw error;
        }

        if (data) {
          setPreferences({
            preferred_shift_type: data.preferred_shift_type || 'any',
            max_shifts_per_week: data.max_shifts_per_week || 5,
            willing_to_travel_km: data.willing_to_travel_km || 50,
            carpool_driver: data.carpool_driver || false,
            carpool_passenger: data.carpool_passenger || false,
            preferred_locations: data.preferred_locations || [],
            notes: data.notes || ''
          });
        }
      } catch (error) {
        console.error('Chyba při načítání pracovních preferencí:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkPreferences();
  }, [targetUserId]);

  const handleSavePreferences = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Kontrola, zda záznam existuje
      const { data: existingData, error: checkError } = await supabase
        .from('user_work_preferences')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      if (existingData) {
        // Aktualizace existujícího záznamu
        result = await supabase
          .from('user_work_preferences')
          .update({
            preferred_shift_type: preferences.preferred_shift_type,
            max_shifts_per_week: preferences.max_shifts_per_week,
            willing_to_travel_km: preferences.willing_to_travel_km,
            carpool_driver: preferences.carpool_driver,
            carpool_passenger: preferences.carpool_passenger,
            preferred_locations: preferences.preferred_locations,
            notes: preferences.notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Vytvoření nového záznamu
        result = await supabase
          .from('user_work_preferences')
          .insert({
            user_id: user.id,
            preferred_shift_type: preferences.preferred_shift_type,
            max_shifts_per_week: preferences.max_shifts_per_week,
            willing_to_travel_km: preferences.willing_to_travel_km,
            carpool_driver: preferences.carpool_driver,
            carpool_passenger: preferences.carpool_passenger,
            preferred_locations: preferences.preferred_locations,
            notes: preferences.notes || null
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Pracovní preference byly úspěšně uloženy");
    } catch (error) {
      console.error('Chyba při ukládání pracovních preferencí:', error);
      toast.error("Nepodařilo se uložit pracovní preference");
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    if (!newLocation.trim()) return;
    if (preferences.preferred_locations.includes(newLocation.trim())) {
      toast.error("Tato lokalita již byla přidána");
      return;
    }
    setPreferences(prev => ({
      ...prev,
      preferred_locations: [...prev.preferred_locations, newLocation.trim()]
    }));
    setNewLocation("");
  };

  const removeLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(loc => loc !== location)
    }));
  };

  const getShiftTypeLabel = (type: string) => {
    const found = shiftTypes.find(st => st.value === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pracovní preference</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Přehled pracovních preferencí" 
            : "Nastavte své preference pro práci a směny"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {readOnly ? (
          // Zobrazení preferencí pro čtení
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground">Preferovaný typ směny</h3>
                <p className="font-medium">{getShiftTypeLabel(preferences.preferred_shift_type)}</p>
              </div>
              
              <div className="p-3 border rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground">Maximum směn za týden</h3>
                <p className="font-medium">{preferences.max_shifts_per_week}</p>
              </div>
              
              <div className="p-3 border rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground">Ochota cestovat</h3>
                <p className="font-medium">Do {preferences.willing_to_travel_km} km</p>
              </div>
              
              <div className="p-3 border rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground">Spolujízda</h3>
                <p className="font-medium">
                  {preferences.carpool_driver && preferences.carpool_passenger 
                    ? "Řidič i spolujezdec" 
                    : preferences.carpool_driver 
                      ? "Řidič" 
                      : preferences.carpool_passenger 
                        ? "Spolujezdec" 
                        : "Ne"}
                </p>
              </div>
            </div>
            
            <div className="p-3 border rounded-md">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Preferované lokality</h3>
              {preferences.preferred_locations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferences.preferred_locations.map(loc => (
                    <Badge key={loc} variant="secondary">{loc}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Bez preferovaných lokalit</p>
              )}
            </div>
            
            {preferences.notes && (
              <div className="p-3 border rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Poznámky</h3>
                <p className="text-sm whitespace-pre-wrap">{preferences.notes}</p>
              </div>
            )}
          </div>
        ) : (
          // Formulář pro editaci
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shiftType">Preferovaný typ směny</Label>
              <Select 
                value={preferences.preferred_shift_type} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_shift_type: value }))}
              >
                <SelectTrigger id="shiftType" className="w-full">
                  <SelectValue placeholder="Vyberte typ směny" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxShifts">Maximum směn za týden</Label>
                <Input
                  id="maxShifts"
                  type="number"
                  min="1"
                  max="7"
                  value={preferences.max_shifts_per_week}
                  onChange={(e) => setPreferences(prev => ({ ...prev, max_shifts_per_week: parseInt(e.target.value) || 5 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="travelDistance">Ochota cestovat (km)</Label>
                <Input
                  id="travelDistance"
                  type="number"
                  min="0"
                  value={preferences.willing_to_travel_km}
                  onChange={(e) => setPreferences(prev => ({ ...prev, willing_to_travel_km: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Spolujízda</Label>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="carpoolDriver" className="cursor-pointer">Jsem ochotný řídit</Label>
                </div>
                <Switch 
                  id="carpoolDriver" 
                  checked={preferences.carpool_driver}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, carpool_driver: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="carpoolPassenger" className="cursor-pointer">Jsem ochotný jet jako spolujezdec</Label>
                </div>
                <Switch 
                  id="carpoolPassenger" 
                  checked={preferences.carpool_passenger}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, carpool_passenger: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Preferované lokality</Label>
              
              <div className="flex gap-2 items-center">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Přidat lokalitu"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                />
                <Button type="button" onClick={addLocation} className="shrink-0">
                  Přidat
                </Button>
              </div>
              
              {preferences.preferred_locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferences.preferred_locations.map(loc => (
                    <Badge 
                      key={loc}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {loc}
                      <button 
                        type="button"
                        onClick={() => removeLocation(loc)}
                        className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Poznámky</Label>
              <Textarea
                id="notes"
                value={preferences.notes}
                onChange={(e) => setPreferences(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Další poznámky a preference ohledně práce..."
                rows={4}
              />
            </div>
          </div>
        )}
      </CardContent>
      {!readOnly && (
        <CardFooter>
          <Button onClick={handleSavePreferences} disabled={saving} className="ml-auto">
            {saving ? "Ukládání..." : "Uložit preference"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkPreferences;
