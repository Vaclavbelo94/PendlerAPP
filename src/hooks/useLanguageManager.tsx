
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { grammarExercises } from "@/data/germanExercises";
import { GamificationData, OfflineStatus } from '@/types/language';

export const useLanguageManager = () => {
  const [activeTab, setActiveTab] = useState("grammar");
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    grammarSaved: false,
    vocabularySaved: false,
    phrasesSaved: false
  });
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    xp: 0,
    level: 1,
    streak: 0,
    dailyGoalCompleted: false,
    lastActivity: null,
    achievements: [
      { id: "first-lesson", name: "První lekce", unlocked: false, date: null },
      { id: "three-day-streak", name: "3 dny v řadě", unlocked: false, date: null },
      { id: "grammar-master", name: "Mistr gramatiky", unlocked: false, date: null },
      { id: "vocabulary-pro", name: "Slovníkový profesionál", unlocked: false, date: null },
      { id: "quiz-perfect", name: "Perfektní kvíz", unlocked: false, date: null }
    ]
  });
  const { toast } = useToast();
  
  // Load data from localStorage on first render
  useEffect(() => {
    const checkOfflineData = () => {
      const savedGrammar = localStorage.getItem('offline_grammar');
      const savedVocabulary = localStorage.getItem('offline_vocabulary');
      const savedPhrases = localStorage.getItem('offline_phrases');
      
      setOfflineStatus({
        grammarSaved: !!savedGrammar,
        vocabularySaved: !!savedVocabulary,
        phrasesSaved: !!savedPhrases
      });
    };
    
    const loadGamificationData = () => {
      const savedData = localStorage.getItem('gamification_data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setGamificationData(parsedData);
        
        // Check if daily goal needs to be reset
        if (parsedData.lastActivity) {
          const today = new Date().toDateString();
          const lastActivityDate = new Date(parsedData.lastActivity).toDateString();
          
          if (lastActivityDate !== today) {
            setGamificationData(prev => ({
              ...prev,
              dailyGoalCompleted: false
            }));
          }
        }
      }
    };
    
    checkOfflineData();
    loadGamificationData();
  }, []);
  
  // Save gamification data when it changes
  useEffect(() => {
    localStorage.setItem('gamification_data', JSON.stringify(gamificationData));
  }, [gamificationData]);

  // Save data for offline use
  const saveForOffline = (type: 'grammar' | 'vocabulary' | 'phrases') => {
    try {
      switch(type) {
        case 'grammar':
          localStorage.setItem('offline_grammar', JSON.stringify(grammarExercises));
          break;
        case 'vocabulary':
          // Mock vocabulary data for offline use
          const vocabulary = [
            { word: "der Hund", translation: "pes", example: "Der Hund bellt." },
            { word: "die Katze", translation: "kočka", example: "Die Katze miaut." },
          ];
          localStorage.setItem('offline_vocabulary', JSON.stringify(vocabulary));
          break;
        case 'phrases':
          // Mock phrases data for offline use
          const phrases = [
            { category: "Pozdravy", phrase: "Guten Tag", translation: "Dobrý den" },
            { category: "Pozdravy", phrase: "Auf Wiedersehen", translation: "Na shledanou" },
          ];
          localStorage.setItem('offline_phrases', JSON.stringify(phrases));
          break;
      }
      
      setOfflineStatus(prev => ({
        ...prev,
        [`${type}Saved`]: true
      }));
      
      // Add XP for downloading content
      addXp(5);
      
      toast({
        title: "Úspěšně uloženo",
        description: `Data pro ${
          type === 'grammar' ? 'gramatiku' : 
          type === 'vocabulary' ? 'slovní zásobu' : 'fráze'
        } byla uložena pro offline použití. +5 XP!`,
      });
    } catch (error) {
      console.error('Chyba při ukládání offline dat:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit data pro offline použití.",
        variant: "destructive"
      });
    }
  };
  
  // Add XP points
  const addXp = (amount: number) => {
    setGamificationData(prev => {
      const newXp = prev.xp + amount;
      const xpForNextLevel = prev.level * 100;
      
      // Level up if enough XP
      if (newXp >= xpForNextLevel) {
        toast({
          title: "Nová úroveň!",
          description: `Gratulujeme! Dosáhli jste úrovně ${prev.level + 1}.`,
        });
        
        return {
          ...prev,
          xp: newXp - xpForNextLevel,
          level: prev.level + 1,
          lastActivity: new Date().toISOString()
        };
      }
      
      return {
        ...prev,
        xp: newXp,
        lastActivity: new Date().toISOString()
      };
    });
  };
  
  // Complete daily goal
  const completeDailyGoal = () => {
    const today = new Date().toISOString();
    const yesterdayData = gamificationData.lastActivity ? new Date(gamificationData.lastActivity) : null;
    const yesterday = yesterdayData ? 
      new Date(yesterdayData.setDate(yesterdayData.getDate() - 1)).toDateString() : 
      null;
    const todayStr = new Date().toDateString();
    
    let newStreak = gamificationData.streak;
    
    // Check streak
    if (yesterdayData && yesterday === todayStr) {
      // Increase streak if activity was yesterday
      newStreak += 1;
    } else if (!yesterdayData || yesterday !== todayStr) {
      // Reset streak if no activity yesterday
      newStreak = 1;
    }
    
    setGamificationData(prev => ({
      ...prev,
      streak: newStreak,
      dailyGoalCompleted: true,
      lastActivity: today
    }));
    
    // Add XP for completing daily goal
    addXp(20);
    
    // Unlock achievement for 3-day streak
    if (newStreak >= 3) {
      unlockAchievement("three-day-streak");
    }
    
    toast({
      title: "Denní cíl splněn!",
      description: `Série ${newStreak} dnů. +20 XP!`,
    });
  };
  
  // Unlock achievement
  const unlockAchievement = (achievementId: string) => {
    const achievement = gamificationData.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.unlocked) {
      setGamificationData(prev => ({
        ...prev,
        achievements: prev.achievements.map(a => 
          a.id === achievementId ? 
          { ...a, unlocked: true, date: new Date().toISOString() } : 
          a
        )
      }));
      
      // Add XP for unlocking achievement
      addXp(30);
      
      toast({
        title: "Nový úspěch odemčen!",
        description: `${achievement.name} - Získáváš +30 XP!`,
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    offlineStatus,
    saveForOffline,
    gamificationData,
    addXp,
    completeDailyGoal,
    unlockAchievement
  };
};
