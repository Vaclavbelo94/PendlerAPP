
import { useState, useEffect } from 'react';
import { InspectionRecord } from '@/types/vehicle';
import { 
  fetchInspectionRecords, 
  saveInspectionRecord, 
  deleteInspectionRecord 
} from '@/services/vehicleService';
import { useToast } from '@/hooks/use-toast';

export const useInspectionRecords = (vehicleId: string) => {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadInspections = async () => {
    if (!vehicleId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchInspectionRecords(vehicleId);
      setInspections(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst záznamy STK kontrol."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveInspection = async (inspection: Partial<InspectionRecord>) => {
    try {
      setIsLoading(true);
      const savedInspection = await saveInspectionRecord(inspection);
      if (savedInspection) {
        await loadInspections();
        toast({
          title: "Úspěch",
          description: inspection.id ? "STK kontrola byla upravena." : "STK kontrola byla přidána."
        });
        return savedInspection;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit STK kontrolu."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInspection = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteInspectionRecord(id);
      await loadInspections();
      toast({
        title: "Úspěch",
        description: "STK kontrola byla odstraněna."
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Chyba při mazání",
        description: "Nepodařilo se odstranit STK kontrolu."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInspections();
  }, [vehicleId]);

  return {
    inspections,
    isLoading,
    error,
    saveInspection,
    deleteInspection,
    refreshInspections: loadInspections
  };
};
