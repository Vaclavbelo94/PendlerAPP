
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

export const useLanguageManager = () => {
  const [activeTab, setActiveTab] = useState("grammar");
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
    grammarSaved: false,
    vocabularySaved: false,
    phrasesSaved: false
  });
  const { toast } = useToast();
  
  // Při prvním načtení zkontrolujeme, zda máme uložená offline data
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
    
    checkOfflineData();
  }, []);

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
      
      toast({
        title: "Úspěšně uloženo",
        description: `Data pro ${
          type === 'grammar' ? 'gramatiku' : 
          type === 'vocabulary' ? 'slovní zásobu' : 'fráze'
        } byla uložena pro offline použití.`,
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

  return {
    activeTab,
    setActiveTab,
    offlineStatus,
    saveForOffline
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
