
import { useState, useEffect } from 'react';
import { VignetteRecord } from '@/types/vehicle';
import { 
  fetchVignetteRecords, 
  saveVignetteRecord, 
  deleteVignetteRecord 
} from '@/services/vehicleService';
import { useToast } from '@/hooks/use-toast';

export const useVignetteRecords = (vehicleId: string) => {
  const [vignettes, setVignettes] = useState<VignetteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadVignettes = async () => {
    if (!vehicleId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchVignetteRecords(vehicleId);
      setVignettes(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst záznamy dálničních známek."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveVignette = async (vignette: Partial<VignetteRecord>) => {
    try {
      setIsLoading(true);
      const savedVignette = await saveVignetteRecord(vignette);
      if (savedVignette) {
        await loadVignettes();
        toast({
          title: "Úspěch",
          description: vignette.id ? "Dálniční známka byla upravena." : "Dálniční známka byla přidána."
        });
        return savedVignette;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit dálniční známku."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVignette = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteVignetteRecord(id);
      await loadVignettes();
      toast({
        title: "Úspěch",
        description: "Dálniční známka byla odstraněna."
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při mazání",
        description: "Nepodařilo se odstranit dálniční známku."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVignettes();
  }, [vehicleId]);

  return {
    vignettes,
    isLoading,
    error,
    saveVignette,
    deleteVignette,
    refreshVignettes: loadVignettes
  };
};
