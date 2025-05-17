
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
  const [preferences, setPreferences] = useState<WorkPreferencesData>({
    preferred_shift_type: "any",
    max_shifts_per_week: 5,
    willing_to_travel_km: 50,
    carpool_driver: false,
    carpool_passenger: false,
    preferred_locations: [],
    notes: ""
  });
  const [newLocation, setNewLocation] = useState("");

  const targetUserId = userId || user?.id;

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
            preferred_shift_type: data.preferred_shift_type || "any",
            max_shifts_per_week: data.max_shifts_per_week || 5,
            willing_to_travel_km: data.willing_to_travel_km || 50,
            carpool_driver: data.carpool_driver || false,
            carpool_passenger: data.carpool_passenger || false,
            preferred_locations: data.preferred_locations || [],
            notes: data.notes || ""
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
    
    setLoading(true);
    try {
      // Kontrola, zda záznam existuje
      const { data: existingPrefs, error: checkError } = await supabase
        .from('user_work_preferences')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Chyba při kontrole existence pracovních preferencí:', checkError);
        throw checkError;
      }

      let result;
      if (existingPrefs) {
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
            notes: preferences.notes,
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
            notes: preferences.notes
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
      setLoading(false);
    }
  };

  const addLocation = () => {
    if (newLocation && !preferences.preferred_locations.includes(newLocation)) {
      setPreferences(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, newLocation]
      }));
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev, 
      preferred_locations: prev.preferred_locations.filter(loc => loc !== location)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pracovní preference</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Preference pro práci a dojíždění" 
            : "Nastavte své preference pro pracovní směny a dojíždění"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shiftType">Preferovaný typ směny</Label>
            {readOnly ? (
              <p>{preferences.preferred_shift_type === "day" 
                  ? "Denní" 
                  : preferences.preferred_shift_type === "night" 
                    ? "Noční" 
                    : "Jakákoliv"}</p>
            ) : (
              <Select 
                value={preferences.preferred_shift_type} 
                onValueChange={(value) => setPreferences(prev => ({ ...prev, preferred_shift_type: value }))}
                disabled={readOnly}
              >
                <SelectTrigger id="shiftType" className="w-full">
                  <SelectValue placeholder="Vyberte typ směny" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Jakákoliv</SelectItem>
                  <SelectItem value="day">Denní</SelectItem>
                  <SelectItem value="night">Noční</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxShifts">Maximální počet směn za týden</Label>
              <span className="text-sm font-medium">{preferences.max_shifts_per_week}</span>
            </div>
            {readOnly ? (
              <p>{preferences.max_shifts_per_week}</p>
            ) : (
              <Slider
                id="maxShifts"
                min={1}
                max={7}
                step={1}
                value={[preferences.max_shifts_per_week]}
                onValueChange={([value]) => setPreferences(prev => ({ ...prev, max_shifts_per_week: value }))}
                disabled={readOnly}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="travelDistance">Ochota cestovat (km)</Label>
              <span className="text-sm font-medium">{preferences.willing_to_travel_km} km</span>
            </div>
            {readOnly ? (
              <p>{preferences.willing_to_travel_km} km</p>
            ) : (
              <Slider
                id="travelDistance"
                min={5}
                max={200}
                step={5}
                value={[preferences.willing_to_travel_km]}
                onValueChange={([value]) => setPreferences(prev => ({ ...prev, willing_to_travel_km: value }))}
                disabled={readOnly}
              />
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Spolujízda</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="carpoolDriver">Nabízím místo v autě</Label>
              <p className="text-sm text-muted-foreground">Jezdím autem a mohu vzít kolegy</p>
            </div>
            {readOnly ? (
              <div className="text-sm font-medium">
                {preferences.carpool_driver ? "Ano" : "Ne"}
              </div>
            ) : (
              <Switch
                id="carpoolDriver"
                checked={preferences.carpool_driver}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, carpool_driver: checked }))}
                disabled={readOnly}
              />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="carpoolPassenger">Hledám spolujízdu</Label>
              <p className="text-sm text-muted-foreground">Mohu se přidat jako spolujezdec</p>
            </div>
            {readOnly ? (
              <div className="text-sm font-medium">
                {preferences.carpool_passenger ? "Ano" : "Ne"}
              </div>
            ) : (
              <Switch
                id="carpoolPassenger"
                checked={preferences.carpool_passenger}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, carpool_passenger: checked }))}
                disabled={readOnly}
              />
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferované lokality</h3>
          
          {readOnly ? (
            <div className="flex flex-wrap gap-2">
              {preferences.preferred_locations.length > 0 ? (
                preferences.preferred_locations.map((location, index) => (
                  <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                    {location}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Žádné preferované lokality</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Input 
                  placeholder="Zadejte lokalitu"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={addLocation} disabled={!newLocation}>
                  Přidat
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {preferences.preferred_locations.map((location, index) => (
                  <div 
                    key={index} 
                    className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{location}</span>
                    <button 
                      onClick={() => removeLocation(location)}
                      className="h-4 w-4 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center hover:bg-muted-foreground/50 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {preferences.preferred_locations.length === 0 && (
                  <p className="text-sm text-muted-foreground">Žádné preferované lokality</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workNotes">Poznámky</Label>
          {readOnly ? (
            <p className="text-sm whitespace-pre-line">
              {preferences.notes || "Žádné poznámky"}
            </p>
          ) : (
            <Input
              id="workNotes"
              value={preferences.notes}
              onChange={(e) => setPreferences(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Další poznámky k pracovním preferencím"
              disabled={readOnly}
            />
          )}
        </div>
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleSavePreferences} disabled={loading}>
            {loading ? "Ukládání..." : "Uložit preference"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkPreferences;
