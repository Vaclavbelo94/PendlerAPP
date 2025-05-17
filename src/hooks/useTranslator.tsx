
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { translateText } from '@/services/translationAPI';

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
}

export const useTranslator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("cs");
  const [targetLanguage, setTargetLanguage] = useState("de");
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [autoTranslate, setAutoTranslate] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Chyba při načítání historie překladů:', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('translationHistory', JSON.stringify(history));
    }
  }, [history]);

  // Auto-translate effect
  useEffect(() => {
    if (autoTranslate && sourceText.trim().length > 0) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [sourceText, autoTranslate, sourceLanguage, targetLanguage]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Zadejte text k překladu"
      });
      return;
    }

    setIsTranslating(true);

    try {
      // Call our translation API service
      const result = await translateText(sourceText.trim(), sourceLanguage, targetLanguage);
      
      setTranslatedText(result.translatedText);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        sourceText,
        translatedText: result.translatedText,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date()
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Chyba při překladu:', error);
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Došlo k chybě při překladu"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTextToSpeech = (text: string, language: string) => {
    if (!text.trim()) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'cs' ? 'cs-CZ' : language === 'de' ? 'de-DE' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Váš prohlížeč nepodporuje převod textu na řeč"
      });
    }
  };

  const handleLoadFromHistory = (item: TranslationHistoryItem) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLanguage(item.sourceLanguage);
    setTargetLanguage(item.targetLanguage);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translationHistory');
    toast({
      title: "Historie vymazána",
      description: "Historie překladů byla vymazána"
    });
  };

  const handleUsePhrase = (phrase: string) => {
    setSourceText(phrase);
    if (autoTranslate) {
      handleTranslate();
    }
  };

  return {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isTranslating,
    history,
    autoTranslate,
    setAutoTranslate,
    handleTranslate,
    handleSwapLanguages,
    handleTextToSpeech,
    handleLoadFromHistory,
    handleClearHistory,
    handleUsePhrase
  };
};
