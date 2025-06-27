
import { useState } from 'react';

interface CrossModuleInsight {
  id: string;
  type: 'recommendation' | 'optimization' | 'prediction' | 'warning';
  title: string;
  description: string;
  modules: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  action?: {
    type: string;
    payload: any;
  };
}

export const useDataSharing = (currentModule: string) => {
  const [crossModuleInsights, setCrossModuleInsights] = useState<CrossModuleInsight[]>([]);

  const dismissInsight = (id: string) => {
    setCrossModuleInsights(prev => prev.filter(insight => insight.id !== id));
  };

  const getAllData = () => {
    return {
      insights: crossModuleInsights,
      module: currentModule,
      shifts: [], // Mock shifts data
      vehicles: [], // Mock vehicles data
      language: 'cs', // Mock language preference
    };
  };

  return {
    crossModuleInsights,
    dismissInsight,
    getAllData,
  };
};
