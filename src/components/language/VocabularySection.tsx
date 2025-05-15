
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Volume2, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the vocabulary item type
interface VocabularyItem {
  id: string;
  german: string;
  czech: string;
  category: string;
}

interface VocabularySectionProps {
  vocabularyItems?: VocabularyItem[];
}

const defaultVocabularyItems: VocabularyItem[] = [
  { id: "v1", german: "das Haus", czech: "dům", category: "housing" },
  { id: "v2", german: "die Familie", czech: "rodina", category: "family" },
  { id: "v3", german: "das Auto", czech: "auto", category: "transport" },
  { id: "v4", german: "die Arbeit", czech: "práce", category: "work" },
  { id: "v5", german: "das Büro", czech: "kancelář", category: "work" },
  { id: "v6", german: "der Computer", czech: "počítač", category: "technology" },
  { id: "v7", german: "das Telefon", czech: "telefon", category: "technology" },
  { id: "v8", german: "essen", czech: "jíst", category: "verbs" },
  { id: "v9", german: "trinken", czech: "pít", category: "verbs" },
  { id: "v10", german: "schlafen", czech: "spát", category: "verbs" }
];

const VocabularySection: React.FC<VocabularySectionProps> = ({ vocabularyItems = defaultVocabularyItems }) => {
  const [currentMode, setCurrentMode] = useState<'learn' | 'practice'>('learn');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(vocabularyItems.map(item => item.category)))];

  // Filter vocabulary items based on category and search term
  const filteredItems = vocabularyItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.german.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.czech.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get practice items based on selected category
  const practiceItems = vocabularyItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const handlePracticeCheck = () => {
    const isCorrect = userAnswer.toLowerCase() === practiceItems[practiceIndex].czech.toLowerCase();
    setShowResult(true);
    
    if (isCorrect) {
      toast({
        title: "Správně!",
        description: `${practiceItems[practiceIndex].german} = ${practiceItems[practiceIndex].czech}`,
      });
    } else {
      toast({
        title: "Zkuste to znovu",
        description: `Správná odpověď: ${practiceItems[practiceIndex].czech}`,
        variant: "destructive",
      });
    }
  };

  const handleNextWord = () => {
    setUserAnswer('');
    setShowResult(false);
    if (practiceIndex < practiceItems.length - 1) {
      setPracticeIndex(p => p + 1);
    } else {
      setPracticeIndex(0);
      toast({
        title: "Dokončeno!",
        description: "Prošli jste všechna slovíčka v této kategorii.",
      });
    }
  };

  // Text to speech function - would be implemented with actual TTS API in production
  const speakWord = (word: string) => {
    toast({
      title: "Přehráváno",
      description: `Přehrává se: "${word}"`,
    });
    // In a real implementation, we would use the browser's speech synthesis:
    // const speech = new SpeechSynthesisUtterance(word);
    // speech.lang = 'de-DE';
    // window.speechSynthesis.speak(speech);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Slovní zásoba</CardTitle>
        <CardDescription>Naučte se nová německá slovíčka</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={currentMode === 'learn' ? "default" : "outline"}
            onClick={() => setCurrentMode('learn')}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Učení
          </Button>
          <Button 
            variant={currentMode === 'practice' ? "default" : "outline"}
            onClick={() => setCurrentMode('practice')}
          >
            <Check className="w-4 h-4 mr-2" /> Procvičování
          </Button>
        </div>

        <div className="mb-4">
          <Label>Kategorie</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setPracticeIndex(0);
                }}
              >
                {category === 'all' ? 'Vše' : category}
              </Button>
            ))}
          </div>
        </div>

        {currentMode === 'learn' && (
          <>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Hledat slovíčko..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-md flex items-center justify-between"
                >
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">{item.german}</span>
                    </div>
                    <div>{item.czech}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => speakWord(item.german)}
                    title="Přehrát výslovnost"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="text-center p-4">
                  Žádná slovíčka nenalezena pro zadané kritéria.
                </div>
              )}
            </div>
          </>
        )}

        {currentMode === 'practice' && practiceItems.length > 0 && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-sm text-slate-500 mb-1">
                  Slovo {practiceIndex + 1} z {practiceItems.length}
                </div>
                <div className="text-xl font-medium flex items-center justify-center gap-2">
                  {practiceItems[practiceIndex].german}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => speakWord(practiceItems[practiceIndex].german)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="answer">Překlad do češtiny:</Label>
                <Input
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Zadejte český překlad..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !showResult) handlePracticeCheck();
                  }}
                  disabled={showResult}
                />
              </div>
              
              {!showResult ? (
                <Button 
                  className="w-full mt-4" 
                  onClick={handlePracticeCheck}
                >
                  Zkontrolovat
                </Button>
              ) : (
                <Button 
                  className="w-full mt-4 flex items-center" 
                  onClick={handleNextWord}
                >
                  Další slovo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {currentMode === 'practice' && practiceItems.length === 0 && (
          <div className="text-center p-4">
            Pro vybranou kategorii nejsou k dispozici žádná slovíčka.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularySection;
