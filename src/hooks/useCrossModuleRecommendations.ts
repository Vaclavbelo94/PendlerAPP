
import { useState, useEffect, useCallback } from 'react';
import { 
  crossModuleRecommendationsService, 
  SmartRecommendation 
} from '@/services/CrossModuleRecommendationsService';
import { useAuth } from '@/hooks/useAuth';
import { useDataSharing } from '@/hooks/useDataSharing';

export const useCrossModuleRecommendations = (currentModule: string) => {
  const { user } = useAuth();
  const { getAllData } = useDataSharing(currentModule);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate recommendations based on current context
  const generateRecommendations = useCallback(async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const allData = getAllData();
      
      // Convert data to activity format for recommendation engine
      const recentActivity = [
        ...((allData.shifts || []).map((shift: any) => ({ ...shift, type: 'shift' }))),
        ...((allData.vehicles || []).map((vehicle: any) => ({ ...vehicle, type: 'vehicle' }))),
        ...(allData.analytics ? [{ ...allData.analytics, type: 'analytics' }] : []),
        ...(allData.language ? [{ ...allData.language, type: 'language' }] : [])
      ];

      const context = {
        userId: user.id,
        currentModule,
        timestamp: new Date(),
        userPreferences: {}, // Could be loaded from user settings
        recentActivity
      };

      const newRecommendations = await crossModuleRecommendationsService.generateRecommendations(context);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [user, currentModule, getAllData]);

  // Get recommendations for current module
  const getModuleRecommendations = useCallback(() => {
    if (!user) return [];
    return crossModuleRecommendationsService.getRecommendationsByModule(user.id, currentModule);
  }, [user, currentModule]);

  // Dismiss recommendation
  const dismissRecommendation = useCallback((recommendationId: string) => {
    if (!user) return;
    
    crossModuleRecommendationsService.dismissRecommendation(user.id, recommendationId);
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  }, [user]);

  // Execute recommendation action
  const executeRecommendation = useCallback((recommendation: SmartRecommendation) => {
    if (!recommendation.action) return;

    // Emit event for other components to handle
    window.dispatchEvent(new CustomEvent('execute-recommendation', {
      detail: {
        type: recommendation.action.type,
        payload: recommendation.action.payload,
        sourceModule: recommendation.sourceModules[0],
        targetModule: recommendation.targetModule
      }
    }));

    // Optionally dismiss after execution
    dismissRecommendation(recommendation.id);
  }, [dismissRecommendation]);

  // Auto-generate recommendations when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      generateRecommendations();
    }, 2000); // Delay to avoid excessive generation

    return () => clearTimeout(timer);
  }, [generateRecommendations]);

  // Cleanup expired recommendations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      crossModuleRecommendationsService.cleanupExpiredRecommendations();
      if (user) {
        setRecommendations(crossModuleRecommendationsService.getRecommendations(user.id));
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  return {
    recommendations,
    isGenerating,
    generateRecommendations,
    getModuleRecommendations,
    dismissRecommendation,
    executeRecommendation
  };
};
