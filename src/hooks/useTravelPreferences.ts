import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface TravelPreferences {
  homeAddress: string;
  workAddress: string;
  preferredTransport: string;
  fuelPricePerLiter: number;
  vehicleConsumption: number;
  monthlyTransportBudget: number;
}

export const useTravelPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<TravelPreferences>({
    homeAddress: '',
    workAddress: '',
    preferredTransport: 'car',
    fuelPricePerLiter: 0,
    vehicleConsumption: 0,
    monthlyTransportBudget: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Načtení preferencí z databáze
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_travel_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání cestovních preferencí:', error);
          throw error;
        }

        if (data) {
          setPreferences({
            homeAddress: data.home_address || '',
            workAddress: data.work_address || '',
            preferredTransport: data.preferred_transport || 'car',
            fuelPricePerLiter: data.fuel_price_per_liter || 0,
            vehicleConsumption: data.vehicle_consumption || 0,
            monthlyTransportBudget: data.monthly_transport_budget || 0
          });
        }
      } catch (error) {
        console.error('Chyba při načítání cestovních preferencí:', error);
        toast.error("Nepodařilo se načíst cestovní preference");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Uložení preferencí do databáze
  const savePreferences = async (newPreferences: Partial<TravelPreferences>) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      // Zkontrolujeme, zda preference už existují
      const { data: existingPreferences, error: checkError } = await supabase
        .from('user_travel_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const preferencesData = {
        user_id: user.id,
        home_address: updatedPreferences.homeAddress,
        work_address: updatedPreferences.workAddress,
        preferred_transport: updatedPreferences.preferredTransport,
        fuel_price_per_liter: updatedPreferences.fuelPricePerLiter,
        vehicle_consumption: updatedPreferences.vehicleConsumption,
        monthly_transport_budget: updatedPreferences.monthlyTransportBudget,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingPreferences) {
        // Aktualizace existujících preferencí
        result = await supabase
          .from('user_travel_preferences')
          .update(preferencesData)
          .eq('user_id', user.id);
      } else {
        // Vytvoření nových preferencí
        result = await supabase
          .from('user_travel_preferences')
          .insert(preferencesData);
      }

      if (result.error) {
        throw result.error;
      }

      setPreferences(updatedPreferences);
      toast.success("Cestovní preference byly uloženy");
      return true;
    } catch (error) {
      console.error('Chyba při ukládání cestovních preferencí:', error);
      toast.error("Nepodařilo se uložit cestovní preference");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Aktualizace jednotlivých polí
  const updatePreference = <K extends keyof TravelPreferences>(
    key: K,
    value: TravelPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updatePreference,
    savePreferences
  };
};
