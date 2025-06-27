import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  fuelConsumption: number;
}

export const useOfflineVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!user) {
          setError('Uživatel není přihlášen');
          return;
        }

        // Fetch vehicles from Supabase
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw new Error(`Chyba při načítání vozidel: ${error.message}`);
        }

        if (data) {
          setVehicles(data);
        }
      } catch (err: any) {
        setError(err.message || 'Chyba při načítání vozidel');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [user]);

  return {
    vehicles,
    isLoading,
    error,
  };
};

