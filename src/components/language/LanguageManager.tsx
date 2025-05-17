
import React, { useState, useEffect } from "react";
import { grammarExercises } from "@/data/germanExercises";
import { useToast } from "@/components/ui/use-toast";

interface LanguageManagerProps {
  children: React.ReactNode;
}

interface OfflineStatus {
  grammarSaved: boolean;
  vocabularySaved: boolean;
  phrasesSaved: boolean;
}

interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  dailyGoalCompleted: boolean;
  lastActivity: string | null;
  achievements: {
    id: string;
    name: string;
    unlocked: boolean;
    date: string | null;
  }[];
}

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
  
  // Při prvním načtení zkontrolujeme, zda máme uložená offline data a gamifikační data
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
        
        // Kontrola denního cíle - pokud je poslední aktivita z jiného dne, resetujeme dailyGoalCompleted
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
  
  // Ukládání gamifikačních dat při změně
  useEffect(() => {
    localStorage.setItem('gamification_data', JSON.stringify(gamificationData));
  }, [gamificationData]);

  // Funkce pro stažení dat pro offline použití
  const saveForOffline = (type: 'grammar' | 'vocabulary' | 'phrases') => {
    try {
      switch(type) {
        case 'grammar':
          localStorage.setItem('offline_grammar', JSON.stringify(grammarExercises));
          break;
        case 'vocabulary':
          // Zde by byl kód pro uložení slovní zásoby
          const vocabulary = [
            { word: "der Hund", translation: "pes", example: "Der Hund bellt." },
            { word: "die Katze", translation: "kočka", example: "Die Katze miaut." },
            // ... další slovíčka
          ];
          localStorage.setItem('offline_vocabulary', JSON.stringify(vocabulary));
          break;
        case 'phrases':
          // Zde by byl kód pro uložení frází
          const phrases = [
            { category: "Pozdravy", phrase: "Guten Tag", translation: "Dobrý den" },
            { category: "Pozdravy", phrase: "Auf Wiedersehen", translation: "Na shledanou" },
            // ... další fráze
          ];
          localStorage.setItem('offline_phrases', JSON.stringify(phrases));
          break;
      }
      
      setOfflineStatus(prev => ({
        ...prev,
        [`${type}Saved`]: true
      }));
      
      // Přidat XP za stažení obsahu pro offline použití
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
  
  // Funkce pro přidání XP
  const addXp = (amount: number) => {
    setGamificationData(prev => {
      const newXp = prev.xp + amount;
      const xpForNextLevel = prev.level * 100;
      
      // Pokud jsme dosáhli nové úrovně
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
  
  // Funkce pro splnění denního cíle
  const completeDailyGoal = () => {
    const today = new Date().toISOString();
    const yesterdayData = gamificationData.lastActivity ? new Date(gamificationData.lastActivity) : null;
    const yesterday = yesterdayData ? 
      new Date(yesterdayData.setDate(yesterdayData.getDate() - 1)).toDateString() : 
      null;
    const todayStr = new Date().toDateString();
    
    let newStreak = gamificationData.streak;
    
    // Kontrola série (streak)
    if (yesterdayData && yesterday === todayStr) {
      // Pokud aktivita byla včera, zvýšit streak
      newStreak += 1;
    } else if (!yesterdayData || yesterday !== todayStr) {
      // Reset streaku, pokud nebyla aktivita včera
      newStreak = 1;
    }
    
    setGamificationData(prev => ({
      ...prev,
      streak: newStreak,
      dailyGoalCompleted: true,
      lastActivity: today
    }));
    
    // Přidat XP za splnění denního cíle
    addXp(20);
    
    // Kontrola, zda odemknout achievement za 3denní streak
    if (newStreak >= 3) {
      unlockAchievement("three-day-streak");
    }
    
    toast({
      title: "Denní cíl splněn!",
      description: `Série ${newStreak} dnů. +20 XP!`,
    });
  };
  
  // Funkce pro odemknutí achievementu
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
      
      // Přidat XP za odemknutí achievementu
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

const LanguageManager: React.FC<LanguageManagerProps> = ({ children }) => {
  const languageManager = useLanguageManager();
  
  return (
    <LanguageContext.Provider value={languageManager}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a context to make the language state available throughout the component tree
export const LanguageContext = React.createContext<ReturnType<typeof useLanguageManager>>({} as ReturnType<typeof useLanguageManager>);

// Hook for using the language context
export const useLanguageContext = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageManager');
  }
  return context;
};

export default LanguageManager;
