
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { taxService, TaxCalculation, TaxDocument, TaxFormDraft } from '@/services/taxService';
import { toast } from '@/components/ui/use-toast';

export const useTaxManagement = () => {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<TaxCalculation[]>([]);
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCalculations = async (calculationType?: string) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await taxService.getTaxCalculations(user.id, calculationType);
      setCalculations(data);
    } catch (error) {
      console.error('Error loading calculations:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst výpočty",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalculation = async (calculation: Omit<TaxCalculation, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user?.id) return;

    try {
      const newCalculation = await taxService.saveTaxCalculation({
        ...calculation,
        user_id: user.id,
      });
      
      setCalculations(prev => [newCalculation, ...prev]);
      
      toast({
        title: "Úspěch",
        description: "Výpočet byl uložen",
      });
      
      return newCalculation;
    } catch (error) {
      console.error('Error saving calculation:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit výpočet",
        variant: "destructive",
      });
    }
  };

  const deleteCalculation = async (id: string) => {
    try {
      await taxService.deleteTaxCalculation(id);
      setCalculations(prev => prev.filter(calc => calc.id !== id));
      
      toast({
        title: "Úspěch",
        description: "Výpočet byl smazán",
      });
    } catch (error) {
      console.error('Error deleting calculation:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat výpočet",
        variant: "destructive",
      });
    }
  };

  const loadDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await taxService.getTaxDocuments(user.id);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst dokumenty",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async (document: Omit<TaxDocument, 'id' | 'created_at' | 'user_id'>) => {
    if (!user?.id) return;

    try {
      const newDocument = await taxService.saveTaxDocument({
        ...document,
        user_id: user.id,
      });
      
      setDocuments(prev => [newDocument, ...prev]);
      
      toast({
        title: "Úspěch",
        description: "Dokument byl uložen",
      });
      
      return newDocument;
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit dokument",
        variant: "destructive",
      });
    }
  };

  const saveFormDraft = async (formType: string, formData: Record<string, any>) => {
    if (!user?.id) return;

    try {
      await taxService.saveFormDraft({
        user_id: user.id,
        form_type: formType,
        form_data: formData,
      });
    } catch (error) {
      console.error('Error saving form draft:', error);
    }
  };

  const loadFormDraft = async (formType: string) => {
    if (!user?.id) return null;

    try {
      return await taxService.getFormDraft(user.id, formType);
    } catch (error) {
      console.error('Error loading form draft:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCalculations();
      loadDocuments();
    }
  }, [user?.id]);

  return {
    calculations,
    documents,
    isLoading,
    loadCalculations,
    saveCalculation,
    deleteCalculation,
    loadDocuments,
    saveDocument,
    saveFormDraft,
    loadFormDraft,
  };
};
