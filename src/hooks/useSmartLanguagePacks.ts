
import { useState, useEffect } from 'react';
import { smartLanguagePackService, SmartPackRecommendation, PackUsageAnalytics } from '@/services/SmartLanguagePackService';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useSmartLanguagePacks = () => {
  const { user } = useAuth();
  const { success, error: showError, info } = useStandardizedToast();
  
  const [recommendations, setRecommendations] = useState<SmartPackRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<PackUsageAnalytics[]>([]);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [isCreatingPersonalizedPack, setIsCreatingPersonalizedPack] = useState(false);
  const [usageReport, setUsageReport] = useState<any>(null);

  // Generate AI-powered recommendations
  const generateRecommendations = async (userProgress: any[], userPreferences: any) => {
    if (!user) return;
    
    setIsGeneratingRecommendations(true);
    try {
      const newRecommendations = await smartLanguagePackService.generateRecommendations(
        userProgress, 
        userPreferences
      );
      setRecommendations(newRecommendations);
      
      if (newRecommendations.length > 0) {
        success('Doporučení připravena', `Nalezeno ${newRecommendations.length} personalizovaných doporučení`);
      } else {
        info('Žádná doporučení', 'Momentálně nemáme žádná nová doporučení pro vás');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      showError('Chyba při generování doporučení', 'Zkuste to prosím později');
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Create personalized language pack
  const createPersonalizedPack = async (preferences: any) => {
    if (!user) return null;
    
    setIsCreatingPersonalizedPack(true);
    try {
      const personalizedItems = await smartLanguagePackService.createPersonalizedPack(
        user.id, 
        preferences
      );
      
      success('Personalizovaný balíček vytvořen', `Vytvořen balíček s ${personalizedItems.length} položkami`);
      return personalizedItems;
    } catch (error) {
      console.error('Error creating personalized pack:', error);
      showError('Chyba při vytváření balíčku', 'Nepodařilo se vytvořit personalizovaný balíček');
      return null;
    } finally {
      setIsCreatingPersonalizedPack(false);
    }
  };

  // Track pack usage
  const trackPackUsage = async (packId: string, sessionDuration: number) => {
    try {
      await smartLanguagePackService.trackPackUsage(packId, sessionDuration);
      console.log(`Tracked usage for pack ${packId}: ${sessionDuration}ms`);
    } catch (error) {
      console.error('Error tracking pack usage:', error);
    }
  };

  // Get pack performance metrics
  const getPackMetrics = async (packId: string) => {
    try {
      return await smartLanguagePackService.getPackPerformanceMetrics(packId);
    } catch (error) {
      console.error('Error getting pack metrics:', error);
      return null;
    }
  };

  // Generate usage report
  const generateUsageReport = async () => {
    try {
      const report = await smartLanguagePackService.generateUsageReport();
      setUsageReport(report);
      return report;
    } catch (error) {
      console.error('Error generating usage report:', error);
      showError('Chyba při generování reportu', 'Nepodařilo se vygenerovat report o využití');
      return null;
    }
  };

  // Compress pack data
  const compressPackData = async (data: any[]) => {
    try {
      return await smartLanguagePackService.compressPackData(data);
    } catch (error) {
      console.error('Error compressing pack data:', error);
      return null;
    }
  };

  // Apply delta update
  const applyDeltaUpdate = async (packId: string, delta: any) => {
    try {
      await smartLanguagePackService.applyDeltaUpdate(packId, delta);
      success('Aktualizace aplikována', `Balíček ${packId} byl úspěšně aktualizován`);
    } catch (error) {
      console.error('Error applying delta update:', error);
      showError('Chyba při aktualizaci', 'Nepodařilo se aplikovat aktualizaci balíčku');
    }
  };

  // Create delta update
  const createDeltaUpdate = async (packId: string, oldVersion: any[], newVersion: any[]) => {
    try {
      return await smartLanguagePackService.createDeltaUpdate(packId, oldVersion, newVersion);
    } catch (error) {
      console.error('Error creating delta update:', error);
      return null;
    }
  };

  // Load analytics on mount
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      
      try {
        const report = await generateUsageReport();
        if (report) {
          // Transform report data to analytics format
          setAnalytics([]);
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, [user]);

  return {
    recommendations,
    analytics,
    usageReport,
    isGeneratingRecommendations,
    isCreatingPersonalizedPack,
    generateRecommendations,
    createPersonalizedPack,
    trackPackUsage,
    getPackMetrics,
    generateUsageReport,
    compressPackData,
    applyDeltaUpdate,
    createDeltaUpdate
  };
};
