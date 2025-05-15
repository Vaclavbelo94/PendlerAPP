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

// Extended vocabulary list with more items
const defaultVocabularyItems: VocabularyItem[] = [
  // Původní slovíčka
  { id: "v1", german: "das Haus", czech: "dům", category: "bydlení" },
  { id: "v2", german: "die Familie", czech: "rodina", category: "rodina" },
  { id: "v3", german: "das Auto", czech: "auto", category: "doprava" },
  { id: "v4", german: "die Arbeit", czech: "práce", category: "práce" },
  { id: "v5", german: "das Büro", czech: "kancelář", category: "práce" },
  { id: "v6", german: "der Computer", czech: "počítač", category: "technologie" },
  { id: "v7", german: "das Telefon", czech: "telefon", category: "technologie" },
  { id: "v8", german: "essen", czech: "jíst", category: "slovesa" },
  { id: "v9", german: "trinken", czech: "pít", category: "slovesa" },
  { id: "v10", german: "schlafen", czech: "spát", category: "slovesa" },
  
  // Nová slovíčka podle kategorií
  // Bydlení
  { id: "v11", german: "die Wohnung", czech: "byt", category: "bydlení" },
  { id: "v12", german: "das Zimmer", czech: "pokoj", category: "bydlení" },
  { id: "v13", german: "die Küche", czech: "kuchyně", category: "bydlení" },
  { id: "v14", german: "das Badezimmer", czech: "koupelna", category: "bydlení" },
  { id: "v15", german: "das Schlafzimmer", czech: "ložnice", category: "bydlení" },
  { id: "v16", german: "der Garten", czech: "zahrada", category: "bydlení" },
  
  // Rodina
  { id: "v17", german: "die Eltern", czech: "rodiče", category: "rodina" },
  { id: "v18", german: "der Vater", czech: "otec", category: "rodina" },
  { id: "v19", german: "die Mutter", czech: "matka", category: "rodina" },
  { id: "v20", german: "der Bruder", czech: "bratr", category: "rodina" },
  { id: "v21", german: "die Schwester", czech: "sestra", category: "rodina" },
  { id: "v22", german: "die Großeltern", czech: "prarodiče", category: "rodina" },
  
  // Doprava
  { id: "v23", german: "der Bus", czech: "autobus", category: "doprava" },
  { id: "v24", german: "der Zug", czech: "vlak", category: "doprava" },
  { id: "v25", german: "das Fahrrad", czech: "kolo", category: "doprava" },
  { id: "v26", german: "das Flugzeug", czech: "letadlo", category: "doprava" },
  { id: "v27", german: "die U-Bahn", czech: "metro", category: "doprava" },
  { id: "v28", german: "die Straßenbahn", czech: "tramvaj", category: "doprava" },
  
  // Práce
  { id: "v29", german: "der Chef", czech: "šéf", category: "práce" },
  { id: "v30", german: "der Kollege", czech: "kolega", category: "práce" },
  { id: "v31", german: "die Kollegin", czech: "kolegyně", category: "práce" },
  { id: "v32", german: "das Gehalt", czech: "plat", category: "práce" },
  { id: "v33", german: "die Besprechung", czech: "porada", category: "práce" },
  { id: "v34", german: "der Termin", czech: "termín", category: "práce" },
  
  // Technologie
  { id: "v35", german: "das Handy", czech: "mobil", category: "technologie" },
  { id: "v36", german: "das Internet", czech: "internet", category: "technologie" },
  { id: "v37", german: "die E-Mail", czech: "e-mail", category: "technologie" },
  { id: "v38", german: "die Tastatur", czech: "klávesnice", category: "technologie" },
  { id: "v39", german: "der Bildschirm", czech: "obrazovka", category: "technologie" },
  { id: "v40", german: "die Software", czech: "software", category: "technologie" },
  
  // Slovesa
  { id: "v41", german: "arbeiten", czech: "pracovat", category: "slovesa" },
  { id: "v42", german: "spielen", czech: "hrát", category: "slovesa" },
  { id: "v43", german: "lernen", czech: "učit se", category: "slovesa" },
  { id: "v44", german: "lesen", czech: "číst", category: "slovesa" },
  { id: "v45", german: "schreiben", czech: "psát", category: "slovesa" },
  { id: "v46", german: "fahren", czech: "jet", category: "slovesa" },
  
  // Jídlo - nová kategorie
  { id: "v47", german: "das Brot", czech: "chléb", category: "jídlo" },
  { id: "v48", german: "der Käse", czech: "sýr", category: "jídlo" },
  { id: "v49", german: "das Fleisch", czech: "maso", category: "jídlo" },
  { id: "v50", german: "das Gemüse", czech: "zelenina", category: "jídlo" },
  { id: "v51", german: "das Obst", czech: "ovoce", category: "jídlo" },
  { id: "v52", german: "das Wasser", czech: "voda", category: "jídlo" },
  
  // Barvy - nová kategorie
  { id: "v53", german: "rot", czech: "červený", category: "barvy" },
  { id: "v54", german: "blau", czech: "modrý", category: "barvy" },
  { id: "v55", german: "grün", czech: "zelený", category: "barvy" },
  { id: "v56", german: "gelb", czech: "žlutý", category: "barvy" },
  { id: "v57", german: "schwarz", czech: "černý", category: "barvy" },
  { id: "v58", german: "weiß", czech: "bílý", category: "barvy" },
  
  // Čísla - nová kategorie
  { id: "v59", german: "eins", czech: "jedna", category: "čísla" },
  { id: "v60", german: "zwei", czech: "dva", category: "čísla" },
  { id: "v61", german: "drei", czech: "tři", category: "čísla" },
  { id: "v62", german: "vier", czech: "čtyři", category: "čísla" },
  { id: "v63", german: "fünf", czech: "pět", category: "čísla" },
  { id: "v64", german: "zehn", czech: "deset", category: "čísla" },
  { id: "v65", german: "zwanzig", czech: "dvacet", category: "čísla" },
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
