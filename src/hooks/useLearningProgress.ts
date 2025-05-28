
import { useState, useEffect, useCallback } from 'react';

interface LearningStats {
  phrasesLearned: number;
  timeSpent: number; // in minutes
  dailyGoal: number;
  currentStreak: number;
  totalSessions: number;
  lastSessionDate: string;
}

export const useLearningProgress = () => {
  const [stats, setStats] = useState<LearningStats>({
    phrasesLearned: 0,
    timeSpent: 0,
    dailyGoal: 10,
    currentStreak: 0,
    totalSessions: 0,
    lastSessionDate: ''
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('german_learning_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading learning stats:', error);
      }
    }
  }, []);

  const saveStats = useCallback((newStats: LearningStats) => {
    setStats(newStats);
    localStorage.setItem('german_learning_stats', JSON.stringify(newStats));
  }, []);

  const recordPhraseStudied = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const newStats = {
      ...stats,
      phrasesLearned: stats.phrasesLearned + 1,
      lastSessionDate: today
    };
    saveStats(newStats);
  }, [stats, saveStats]);

  const recordStudyTime = useCallback((minutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newStats = {
      ...stats,
      timeSpent: stats.timeSpent + minutes,
      totalSessions: stats.totalSessions + 1,
      lastSessionDate: today
    };
    saveStats(newStats);
  }, [stats, saveStats]);

  const updateDailyGoal = useCallback((goal: number) => {
    const newStats = { ...stats, dailyGoal: goal };
    saveStats(newStats);
  }, [stats, saveStats]);

  const resetStats = useCallback(() => {
    const resetStats: LearningStats = {
      phrasesLearned: 0,
      timeSpent: 0,
      dailyGoal: 10,
      currentStreak: 0,
      totalSessions: 0,
      lastSessionDate: ''
    };
    saveStats(resetStats);
  }, [saveStats]);

  return {
    stats,
    recordPhraseStudied,
    recordStudyTime,
    updateDailyGoal,
    resetStats
  };
};
