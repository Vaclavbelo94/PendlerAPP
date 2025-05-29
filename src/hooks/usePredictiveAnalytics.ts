
import { useState, useEffect, useCallback } from 'react';
import { predictiveAnalyticsService, Prediction, UserBehaviorPattern } from '@/services/PredictiveAnalyticsService';

export const usePredictiveAnalytics = (userId: string) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userPattern, setUserPattern] = useState<UserBehaviorPattern | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await predictiveAnalyticsService.initializeModels();
      } catch (err) {
        setError('Failed to initialize predictive analytics');
        console.error('Predictive analytics initialization error:', err);
      }
    };

    initializeService();
  }, []);

  // Load existing predictions
  const loadPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const existingPredictions = predictiveAnalyticsService.getUserPredictions(userId);
      setPredictions(existingPredictions);

      const pattern = predictiveAnalyticsService.getUserPattern(userId);
      setUserPattern(pattern);
    } catch (err) {
      setError('Failed to load predictions');
      console.error('Load predictions error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Generate new predictions
  const generatePredictions = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const newPredictions = await predictiveAnalyticsService.generatePredictions(userId);
      setPredictions(newPredictions);

      const pattern = predictiveAnalyticsService.getUserPattern(userId);
      setUserPattern(pattern);
    } catch (err) {
      setError('Failed to generate predictions');
      console.error('Generate predictions error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  // Analyze user behavior
  const analyzeUserBehavior = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const pattern = await predictiveAnalyticsService.analyzeUserBehavior(userId);
      setUserPattern(pattern);
    } catch (err) {
      setError('Failed to analyze user behavior');
      console.error('Analyze behavior error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  // Get predictions by type
  const getPredictionsByType = useCallback((type: Prediction['type']) => {
    return predictions.filter(prediction => prediction.type === type);
  }, [predictions]);

  // Get high confidence predictions
  const getHighConfidencePredictions = useCallback((threshold: number = 0.7) => {
    return predictions.filter(prediction => prediction.confidence >= threshold);
  }, [predictions]);

  // Get actionable predictions
  const getActionablePredictions = useCallback(() => {
    return predictions.filter(prediction => prediction.actionable);
  }, [predictions]);

  // Get model accuracy for specific type
  const getModelAccuracy = useCallback((modelId: string) => {
    return predictiveAnalyticsService.getModelAccuracy(modelId);
  }, []);

  // Load predictions on mount
  useEffect(() => {
    if (userId) {
      loadPredictions();
    }
  }, [userId, loadPredictions]);

  return {
    predictions,
    userPattern,
    isLoading,
    isAnalyzing,
    error,
    loadPredictions,
    generatePredictions,
    analyzeUserBehavior,
    getPredictionsByType,
    getHighConfidencePredictions,
    getActionablePredictions,
    getModelAccuracy
  };
};
