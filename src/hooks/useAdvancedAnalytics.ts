
import { useState, useEffect, useCallback } from 'react';
import { advancedAnalyticsService, LearningPattern, PredictiveInsight, AnalyticsReport, UserBehaviorData } from '@/services/AdvancedAnalyticsService';
import { useAuth } from '@/hooks/useAuth';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useAdvancedAnalytics = () => {
  const { user } = useAuth();
  const { success, error: showError, info } = useStandardizedToast();
  
  const [learningPattern, setLearningPattern] = useState<LearningPattern | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [analyticsReport, setAnalyticsReport] = useState<AnalyticsReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Track user behavior
  const trackBehavior = useCallback(async (
    action: string,
    context: Record<string, any> = {},
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await advancedAnalyticsService.trackUserBehavior({
        userId: user.id,
        sessionId: `session_${Date.now()}`, // Simple session ID
        action,
        context,
        metadata
      });
    } catch (error) {
      console.error('Error tracking behavior:', error);
    }
  }, [user]);

  // Analyze learning patterns
  const analyzeLearningPatterns = useCallback(async () => {
    if (!user) return null;

    setIsAnalyzing(true);
    try {
      const pattern = await advancedAnalyticsService.analyzeLearningPatterns(user.id);
      setLearningPattern(pattern);
      
      success('Analýza dokončena', 'Vaše vzorce učení byly úspěšně analyzovány');
      return pattern;
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      showError('Chyba při analýze', 'Nepodařilo se analyzovat vzorce učení');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, success, showError]);

  // Generate predictive insights
  const generatePredictiveInsights = useCallback(async () => {
    if (!user) return [];

    try {
      const insights = await advancedAnalyticsService.generatePredictiveInsights(user.id);
      setPredictiveInsights(insights);
      
      if (insights.length > 0) {
        info('Predikce připraveny', `Nalezeno ${insights.length} prediktivních pozorování`);
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      showError('Chyba při generování predikcí', 'Nepodařilo se vygenerovat prediktivní pozorování');
      return [];
    }
  }, [user, info, showError]);

  // Generate comprehensive analytics report
  const generateAdvancedReport = useCallback(async (type: AnalyticsReport['type'] = 'comprehensive') => {
    if (!user) return null;

    setIsGeneratingReport(true);
    try {
      const report = await advancedAnalyticsService.generateAdvancedReport(user.id, type);
      setAnalyticsReport(report);
      
      success('Report vygenerován', 'Pokročilý analytický report je připraven');
      return report;
    } catch (error) {
      console.error('Error generating advanced report:', error);
      showError('Chyba při generování reportu', 'Nepodařilo se vygenerovat pokročilý report');
      return null;
    } finally {
      setIsGeneratingReport(false);
    }
  }, [user, success, showError]);

  // Convenience methods for common tracking scenarios
  const trackLearningSession = useCallback((sessionData: {
    lessonId?: string;
    duration: number;
    completed: boolean;
    accuracy?: number;
    area?: string;
  }) => {
    trackBehavior('learning_session', {
      success: sessionData.completed,
      duration: sessionData.duration,
      accuracy: sessionData.accuracy,
      area: sessionData.area
    }, {
      lessonId: sessionData.lessonId
    });
  }, [trackBehavior]);

  const trackVocabularyPractice = useCallback((practiceData: {
    wordsLearned: number;
    correctAnswers: number;
    totalAnswers: number;
    category?: string;
  }) => {
    trackBehavior('vocabulary_practice', {
      accuracy: practiceData.totalAnswers > 0 ? practiceData.correctAnswers / practiceData.totalAnswers : 0,
      wordsLearned: practiceData.wordsLearned,
      area: practiceData.category || 'vocabulary'
    });
  }, [trackBehavior]);

  const trackQuizCompletion = useCallback((quizData: {
    quizId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    difficulty?: string;
  }) => {
    trackBehavior('quiz_completed', {
      success: true,
      accuracy: quizData.score / quizData.totalQuestions,
      timeSpent: quizData.timeSpent,
      difficulty: quizData.difficulty
    }, {
      quizId: quizData.quizId,
      score: quizData.score,
      totalQuestions: quizData.totalQuestions
    });
  }, [trackBehavior]);

  const trackPageVisit = useCallback((page: string, timeSpent?: number) => {
    trackBehavior('page_visited', {
      page,
      timeSpent: timeSpent || 0
    });
  }, [trackBehavior]);

  // Auto-analyze patterns when user changes
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        analyzeLearningPatterns();
      }, 2000); // Delay to avoid immediate analysis on login

      return () => clearTimeout(timer);
    }
  }, [user, analyzeLearningPatterns]);

  // Auto-generate insights when patterns are available
  useEffect(() => {
    if (learningPattern && predictiveInsights.length === 0) {
      generatePredictiveInsights();
    }
  }, [learningPattern, predictiveInsights.length, generatePredictiveInsights]);

  return {
    // State
    learningPattern,
    predictiveInsights,
    analyticsReport,
    isAnalyzing,
    isGeneratingReport,
    
    // Analysis methods
    analyzeLearningPatterns,
    generatePredictiveInsights,
    generateAdvancedReport,
    
    // Tracking methods
    trackBehavior,
    trackLearningSession,
    trackVocabularyPractice,
    trackQuizCompletion,
    trackPageVisit
  };
};
