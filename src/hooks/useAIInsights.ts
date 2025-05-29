
import { useState, useEffect, useCallback } from 'react';
import { aiInsightsService, AIInsight, AIModel, PredictionResult } from '@/services/AIInsightsService';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useAIInsights = () => {
  const { user } = useAuth();
  const { success, error: showError, info } = useStandardizedToast();
  
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize AI insights service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await aiInsightsService.initializeModels();
        setModels(aiInsightsService.getModelInfo());
        setIsInitialized(true);
        console.log('AI Insights service initialized');
      } catch (error) {
        console.error('Error initializing AI Insights service:', error);
        showError('Chyba inicializace', 'Nepodařilo se inicializovat AI služby');
      }
    };

    initializeService();
  }, [showError]);

  // Generate insights from user data
  const generateInsights = useCallback(async (userData?: any) => {
    if (!user || !isInitialized) return [];

    setIsGeneratingInsights(true);
    try {
      // Use provided data or fetch user data
      const dataToAnalyze = userData || await fetchUserData();
      
      const newInsights = await aiInsightsService.generateInsights(dataToAnalyze);
      setInsights(newInsights);
      
      if (newInsights.length > 0) {
        success('AI pozorování připravena', `Vygenerováno ${newInsights.length} nových pozorování`);
      } else {
        info('Žádná nová pozorování', 'V současnosti nemáme nová AI pozorování');
      }
      
      return newInsights;
    } catch (error) {
      console.error('Error generating insights:', error);
      showError('Chyba při generování pozorování', 'Nepodařilo se vygenerovat AI pozorování');
      return [];
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [user, isInitialized, success, info, showError]);

  // Make AI prediction
  const makePrediction = useCallback(async (
    modelName: string, 
    inputData: any
  ): Promise<PredictionResult | null> => {
    if (!isInitialized) return null;

    try {
      const prediction = await aiInsightsService.predict(modelName, inputData);
      return prediction;
    } catch (error) {
      console.error('Error making prediction:', error);
      showError('Chyba predikce', 'Nepodařilo se provést AI predikci');
      return null;
    }
  }, [isInitialized, showError]);

  // Optimize learning path
  const optimizeLearningPath = useCallback(async (currentProgress: any) => {
    if (!user || !isInitialized) return null;

    try {
      const optimization = await aiInsightsService.optimizeLearningPath(
        user.id, 
        currentProgress
      );
      
      success(
        'Cesta optimalizována', 
        `Očekávané zlepšení: ${Math.round(optimization.expectedImprovement * 100)}%`
      );
      
      return optimization;
    } catch (error) {
      console.error('Error optimizing learning path:', error);
      showError('Chyba optimalizace', 'Nepodařilo se optimalizovat cestu učení');
      return null;
    }
  }, [user, isInitialized, success, showError]);

  // Adjust difficulty
  const adjustDifficulty = useCallback(async (currentPerformance: any) => {
    if (!user || !isInitialized) return null;

    try {
      const adjustment = await aiInsightsService.adjustDifficulty(
        user.id, 
        currentPerformance
      );
      
      info(
        'Obtížnost upravena', 
        `Nová úroveň: ${adjustment.newDifficulty} (spolehlivost: ${Math.round(adjustment.confidence * 100)}%)`
      );
      
      return adjustment;
    } catch (error) {
      console.error('Error adjusting difficulty:', error);
      showError('Chyba úpravy obtížnosti', 'Nepodařilo se upravit úroveň obtížnosti');
      return null;
    }
  }, [user, isInitialized, info, showError]);

  // Predict engagement
  const predictEngagement = useCallback(async (sessionData: any) => {
    if (!user || !isInitialized) return null;

    try {
      const engagement = await aiInsightsService.predictEngagement(
        user.id, 
        sessionData
      );
      
      if (engagement.riskLevel === 'high') {
        showError(
          'Riziko snížení motivace', 
          'Doporučujeme aplikovat navrhované intervence'
        );
      } else if (engagement.riskLevel === 'medium') {
        info('Střední riziko', 'Sledujte zapojení uživatele');
      }
      
      return engagement;
    } catch (error) {
      console.error('Error predicting engagement:', error);
      showError('Chyba predikce zapojení', 'Nepodařilo se předpovědět úroveň zapojení');
      return null;
    }
  }, [user, isInitialized, info, showError]);

  // Train AI model
  const trainModel = useCallback(async (
    modelName: string, 
    trainingData: any[]
  ) => {
    if (!isInitialized) return null;

    setIsTrainingModel(true);
    try {
      const result = await aiInsightsService.trainModel(modelName, trainingData);
      
      if (result.success) {
        success(
          'Model úspěšně vytrénován', 
          `Zlepšení přesnosti: ${result.improvementPercent.toFixed(1)}%`
        );
        
        // Update model info
        setModels(aiInsightsService.getModelInfo());
      }
      
      return result;
    } catch (error) {
      console.error('Error training model:', error);
      showError('Chyba trénování', 'Nepodařilo se vytrénovat AI model');
      return null;
    } finally {
      setIsTrainingModel(false);
    }
  }, [isInitialized, success, showError]);

  // Get insights by type
  const getInsightsByType = useCallback((type: AIInsight['type']) => {
    return insights.filter(insight => insight.type === type);
  }, [insights]);

  // Get high-impact insights
  const getHighImpactInsights = useCallback(() => {
    return insights.filter(insight => insight.impact === 'high');
  }, [insights]);

  // Get actionable insights
  const getActionableInsights = useCallback(() => {
    return insights.filter(insight => insight.actionable);
  }, [insights]);

  // Helper function to fetch user data
  const fetchUserData = async () => {
    // This would typically fetch from your data stores
    return {
      learningHistory: JSON.parse(localStorage.getItem('learning_history') || '[]'),
      sessionTimes: JSON.parse(localStorage.getItem('session_times') || '[]'),
      contentPerformance: JSON.parse(localStorage.getItem('content_performance') || '{}'),
      sessionPattern: JSON.parse(localStorage.getItem('session_pattern') || '[]')
    };
  };

  // Auto-generate insights when user changes
  useEffect(() => {
    if (user && isInitialized) {
      const timer = setTimeout(() => {
        generateInsights();
      }, 3000); // Delay to avoid immediate generation on login

      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, generateInsights]);

  return {
    // State
    insights,
    models,
    isGeneratingInsights,
    isTrainingModel,
    isInitialized,
    
    // Actions
    generateInsights,
    makePrediction,
    optimizeLearningPath,
    adjustDifficulty,
    predictEngagement,
    trainModel,
    
    // Getters
    getInsightsByType,
    getHighImpactInsights,
    getActionableInsights
  };
};
