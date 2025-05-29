
import { useState, useEffect, useCallback } from 'react';
import { personalizationEngine, UserProfile } from '@/services/PersonalizationEngine';

export const usePersonalization = (userId: string) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [personalizations, setPersonalizations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize personalization engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        await personalizationEngine.initializePersonalization();
      } catch (err) {
        console.error('Failed to initialize personalization engine:', err);
        setError('Failed to initialize personalization');
      }
    };

    initializeEngine();
  }, []);

  // Load user profile
  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profile = personalizationEngine.getUserProfile(userId);
      
      if (!profile) {
        // Create default profile if none exists
        const newProfile = await personalizationEngine.createUserProfile(userId);
        setUserProfile(newProfile);
      } else {
        setUserProfile(profile);
      }

      // Apply personalization
      const applied = await personalizationEngine.applyPersonalization(userId);
      setPersonalizations(applied);
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Load profile error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update user preferences
  const updatePreferences = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await personalizationEngine.updateUserProfile(userId, updates);
      setUserProfile(updatedProfile);

      // Re-apply personalization with new preferences
      const applied = await personalizationEngine.applyPersonalization(userId);
      setPersonalizations(applied);
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Update preferences error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userProfile]);

  // Record user behavior
  const recordBehavior = useCallback(async (action: string, context: Record<string, any>) => {
    try {
      await personalizationEngine.recordUserBehavior(userId, action, context);
      
      // Optionally refresh personalizations after significant actions
      if (context.significant) {
        const applied = await personalizationEngine.applyPersonalization(userId);
        setPersonalizations(applied);
      }
    } catch (err) {
      console.error('Failed to record behavior:', err);
    }
  }, [userId]);

  // Get personalized recommendations
  const getRecommendations = useCallback(async () => {
    try {
      const recommendations = await personalizationEngine.getPersonalizedRecommendations(userId);
      return recommendations;
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      return [];
    }
  }, [userId]);

  // Update content effectiveness
  const updateContentEffectiveness = useCallback(async (contentId: string, effectiveness: number) => {
    try {
      await personalizationEngine.updatePersonalizationEffectiveness(contentId, effectiveness);
    } catch (err) {
      console.error('Failed to update content effectiveness:', err);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId, loadUserProfile]);

  // Helper functions
  const getDashboardPersonalization = useCallback(() => {
    return personalizations?.dashboard || null;
  }, [personalizations]);

  const getContentPersonalization = useCallback(() => {
    return personalizations?.content || null;
  }, [personalizations]);

  const getLearningPersonalization = useCallback(() => {
    return personalizations?.learning || null;
  }, [personalizations]);

  const getNotificationPersonalization = useCallback(() => {
    return personalizations?.notifications || null;
  }, [personalizations]);

  return {
    userProfile,
    personalizations,
    isLoading,
    error,
    loadUserProfile,
    updatePreferences,
    recordBehavior,
    getRecommendations,
    updateContentEffectiveness,
    getDashboardPersonalization,
    getContentPersonalization,
    getLearningPersonalization,
    getNotificationPersonalization
  };
};
