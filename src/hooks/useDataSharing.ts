
import { useState, useEffect, useCallback } from 'react';
import { dataSharingService, CrossModuleInsight } from '@/services/DataSharingService';

export const useDataSharing = (moduleId: string) => {
  const [moduleData, setModuleData] = useState<any>(null);
  const [crossModuleInsights, setCrossModuleInsights] = useState<CrossModuleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update module data
  const updateData = useCallback((data: any) => {
    dataSharingService.updateModuleData(moduleId, data);
    setModuleData(data);
  }, [moduleId]);

  // Get data from other modules
  const getOtherModuleData = useCallback((targetModuleId: string) => {
    return dataSharingService.getModuleData(targetModuleId);
  }, []);

  // Get all module data
  const getAllData = useCallback(() => {
    return dataSharingService.getAllModuleData();
  }, []);

  // Get insights relevant to this module
  const getRelevantInsights = useCallback(() => {
    return dataSharingService.getCrossModuleInsights([moduleId]);
  }, [moduleId]);

  // Subscribe to data changes
  useEffect(() => {
    const subscriptionId = dataSharingService.subscribe(
      moduleId,
      ['*'],
      (updateData) => {
        setModuleData(updateData.data);
      }
    );

    // Load initial data
    const initialData = dataSharingService.getModuleData(moduleId);
    setModuleData(initialData);
    setIsLoading(false);

    // Load initial insights
    setCrossModuleInsights(getRelevantInsights());

    return () => {
      dataSharingService.unsubscribe(subscriptionId);
    };
  }, [moduleId, getRelevantInsights]);

  // Listen for new insights
  useEffect(() => {
    const handleInsightGenerated = (event: any) => {
      const insight = event.detail;
      if (insight.modules.includes(moduleId)) {
        setCrossModuleInsights(prev => [...prev, insight]);
      }
    };

    dataSharingService.addEventListener('insight-generated', handleInsightGenerated);

    return () => {
      dataSharingService.removeEventListener('insight-generated', handleInsightGenerated);
    };
  }, [moduleId]);

  // Dismiss insight
  const dismissInsight = useCallback((insightId: string) => {
    setCrossModuleInsights(prev => prev.filter(insight => insight.id !== insightId));
  }, []);

  return {
    moduleData,
    crossModuleInsights,
    isLoading,
    updateData,
    getOtherModuleData,
    getAllData,
    getRelevantInsights,
    dismissInsight
  };
};
