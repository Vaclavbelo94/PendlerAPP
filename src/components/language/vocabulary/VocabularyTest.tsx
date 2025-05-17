
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw, ChevronRight, Shuffle, Settings } from 'lucide-react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VocabularyTestResults from './VocabularyTestResults';
import { useToast } from '@/hooks/use-toast';

interface VocabularyTestProps {
  vocabularyItems: VocabularyItem[];
  onCompleteTest: (results: TestResult) => void;
}

export interface TestResult {
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  testItems: Array<{
    item: VocabularyItem;
    wasCorrect: boolean;
    userAnswer?: string;
  }>;
}

interface TestSettings {
  maxQuestions: number;
  testDirection: 'toForeign' | 'toNative' | 'mixed';
  shuffleItems: boolean;
  categories: string[];
  difficulties: ('easy' | 'medium' | 'hard')[];
  timeLimit: number; // v sekundách, 0 = neomezeno
}

const VocabularyTest: React.FC<VocabularyTestProps> = ({ vocabularyItems, onCompleteTest }) => {
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [testItems, setTestItems] = useState<VocabularyItem[]>([]);
  const [results, setResults] = useState<TestResult>({
    startTime: new Date(),
    endTime: new Date(),
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    testItems: []
  });
  const [settings, setSettings] = useState<TestSettings>({
    maxQuestions: 10,
    testDirection: 'toForeign',
    shuffleItems: true,
    categories: [],
    difficulties: ['easy', 'medium', 'hard'],
    timeLimit: 0
  });
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [direction, setDirection] = useState<'toForeign' | 'toNative'>('toForeign');
  const { toast } = useToast();

  const uniqueCategories = [...new Set(vocabularyItems.map(item => item.category || 'Obecné'))];

  // Příprava testu
  const prepareTest = () => {
    // Filtrování podle kategorií a obtížnosti
    let filteredItems = vocabularyItems;
    
    if (settings.categories.length > 0) {
      filteredItems = filteredItems.filter(item => 
        settings.categories.includes(item.category || 'Obecné')
      );
    }
    
    if (settings.difficulties.length > 0) {
      filteredItems = filteredItems.filter(item => 
        !item.difficulty || settings.difficulties.includes(item.difficulty)
      );
    }
    
    // Pokud nejsou k dispozici žádná slovíčka, zobrazíme upozornění
    if (filteredItems.length === 0) {
      toast({
        title: "Není co testovat",
        description: "Pro vybrané kategorie a obtížnosti nejsou k dispozici žádná slovíčka.",
        variant: "destructive",
      });
      return;
    }
    
    // Zamíchání položek, pokud je to požadováno
    let preparedItems = [...filteredItems];
    if (settings.shuffleItems) {
      preparedItems.sort(() => Math.random() - 0.5);
    }
    
    // Omezení počtu položek podle nastavení
    if (settings.maxQuestions > 0 && preparedItems.length > settings.maxQuestions) {
      preparedItems = preparedItems.slice(0, settings.maxQuestions);
    }
    
    // Určení směru testu (z češtiny do cizího jazyka nebo naopak)
    if (settings.testDirection === 'mixed') {
      setDirection(Math.random() > 0.5 ? 'toForeign' : 'toNative');
    } else {
      setDirection(settings.testDirection);
    }
    
    // Nastavení časového limitu, pokud je definován
    if (settings.timeLimit > 0) {
      setRemainingTime(settings.timeLimit);
    }
    
    // Nastavení testu
    setTestItems(preparedItems);
    setCurrentItemIndex(0);
    setAnswer('');
    setResults({
      startTime: new Date(),
      endTime: new Date(),
      totalQuestions: preparedItems.length,
      correctAnswers: 0,
      wrongAnswers: 0,
      testItems: []
    });
    
    setIsTestActive(true);
    setIsTestCompleted(false);
  };

  // Kontrola odpovědi
  const checkAnswer = () => {
    if (currentItemIndex >= testItems.length) return;
    
    const currentItem = testItems[currentItemIndex];
    const correctAnswer = direction === 'toForeign' ? currentItem.word : currentItem.translation;
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    // Aktualizace výsledků
    const newResults = {
      ...results,
      correctAnswers: isCorrect ? results.correctAnswers + 1 : results.correctAnswers,
      wrongAnswers: !isCorrect ? results.wrongAnswers + 1 : results.wrongAnswers,
      testItems: [
        ...results.testItems,
        {
          item: currentItem,
          wasCorrect: isCorrect,
          userAnswer: answer.trim()
        }
      ]
    };
    
    setResults(newResults);
    
    // Přechod na další položku nebo dokončení testu
    if (currentItemIndex < testItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setAnswer('');
      
      // Pokud je test typu mixed, náhodně určíme směr pro další položku
      if (settings.testDirection === 'mixed') {
        setDirection(Math.random() > 0.5 ? 'toForeign' : 'toNative');
      }
    } else {
      // Test je dokončen
      const endTime = new Date();
      const finalResults = {
        ...newResults,
        endTime
      };
      setResults(finalResults);
      setIsTestCompleted(true);
      setIsTestActive(false);
      onCompleteTest(finalResults);
    }
  };

  // Skip current question
  const skipQuestion = () => {
    if (currentItemIndex >= testItems.length) return;
    
    const currentItem = testItems[currentItemIndex];
    
    // Aktualizace výsledků
    const newResults = {
      ...results,
      wrongAnswers: results.wrongAnswers + 1,
      testItems: [
        ...results.testItems,
        {
          item: currentItem,
          wasCorrect: false,
          userAnswer: "přeskočeno"
        }
      ]
    };
    
    setResults(newResults);
    
    // Přechod na další položku nebo dokončení testu
    if (currentItemIndex < testItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setAnswer('');
      
      if (settings.testDirection === 'mixed') {
        setDirection(Math.random() > 0.5 ? 'toForeign' : 'toNative');
      }
    } else {
      // Test je dokončen
      const endTime = new Date();
      const finalResults = {
        ...newResults,
        endTime
      };
      setResults(finalResults);
      setIsTestCompleted(true);
      setIsTestActive(false);
      onCompleteTest(finalResults);
    }
  };

  // Handle time limit
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTestActive && remainingTime !== null && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          }
          
          // Čas vypršel
          clearInterval(timer);
          
          const endTime = new Date();
          const finalResults = {
            ...results,
            endTime
          };
          
          setResults(finalResults);
          setIsTestCompleted(true);
          setIsTestActive(false);
          onCompleteTest(finalResults);
          
          toast({
            title: "Čas vypršel",
            description: "Čas na test vypršel. Vaše výsledky byly zaznamenány.",
          });
          
          return 0;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestActive, remainingTime, results, onCompleteTest, toast]);

  // Restart test
  const restartTest = () => {
    prepareTest();
  };

  // Updaet settings
  const updateSettings = (key: keyof TestSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="w-full">
      {!isTestActive && !isTestCompleted ? (
        <>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Testovací režim</span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Nastavení
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Nastavení testu</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxQuestions">Počet otázek</Label>
                      <Select
                        value={String(settings.maxQuestions)}
                        onValueChange={(val) => updateSettings('maxQuestions', Number(val))}
                      >
                        <SelectTrigger id="maxQuestions">
                          <SelectValue placeholder="Vyberte počet otázek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 otázek</SelectItem>
                          <SelectItem value="10">10 otázek</SelectItem>
                          <SelectItem value="15">15 otázek</SelectItem>
                          <SelectItem value="20">20 otázek</SelectItem>
                          <SelectItem value="30">30 otázek</SelectItem>
                          <SelectItem value="50">50 otázek</SelectItem>
                          <SelectItem value="0">Všechna slovíčka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testDirection">Směr testu</Label>
                      <Select
                        value={settings.testDirection}
                        onValueChange={(val) => updateSettings('testDirection', val as 'toForeign' | 'toNative' | 'mixed')}
                      >
                        <SelectTrigger id="testDirection">
                          <SelectValue placeholder="Vyberte směr testu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toForeign">Čeština → Němčina</SelectItem>
                          <SelectItem value="toNative">Němčina → Čeština</SelectItem>
                          <SelectItem value="mixed">Náhodně (mix obou směrů)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shuffleItems">Zamíchat slovíčka</Label>
                      <Switch
                        id="shuffleItems"
                        checked={settings.shuffleItems}
                        onCheckedChange={(checked) => updateSettings('shuffleItems', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categories">Kategorie</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {uniqueCategories.map((category) => (
                          <Badge
                            key={category}
                            variant={settings.categories.includes(category) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              if (settings.categories.includes(category)) {
                                updateSettings('categories', settings.categories.filter(c => c !== category));
                              } else {
                                updateSettings('categories', [...settings.categories, category]);
                              }
                            }}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Obtížnost</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          { id: 'easy', label: 'Lehká' },
                          { id: 'medium', label: 'Střední' },
                          { id: 'hard', label: 'Těžká' }
                        ].map((difficulty) => (
                          <Badge
                            key={difficulty.id}
                            variant={settings.difficulties.includes(difficulty.id as any) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              if (settings.difficulties.includes(difficulty.id as any)) {
                                updateSettings('difficulties', settings.difficulties.filter(d => d !== difficulty.id));
                              } else {
                                updateSettings('difficulties', [...settings.difficulties, difficulty.id]);
                              }
                            }}
                          >
                            {difficulty.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Časový limit</Label>
                      <Select
                        value={String(settings.timeLimit)}
                        onValueChange={(val) => updateSettings('timeLimit', Number(val))}
                      >
                        <SelectTrigger id="timeLimit">
                          <SelectValue placeholder="Vyberte časový limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Bez limitu</SelectItem>
                          <SelectItem value="60">1 minuta</SelectItem>
                          <SelectItem value="120">2 minuty</SelectItem>
                          <SelectItem value="180">3 minuty</SelectItem>
                          <SelectItem value="300">5 minut</SelectItem>
                          <SelectItem value="600">10 minut</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Připraveni na test?</h3>
                <p className="text-muted-foreground mt-1">
                  Vyzkoušejte své znalosti v testu slovíček
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full max-w-md">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                  <span className="text-2xl font-bold">{
                    settings.maxQuestions > 0 && vocabularyItems.length > settings.maxQuestions 
                      ? settings.maxQuestions 
                      : vocabularyItems.length
                  }</span>
                  <span className="text-sm text-muted-foreground">Slovíček</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                  <span className="text-2xl font-bold">{
                    settings.timeLimit > 0 
                      ? `${Math.floor(settings.timeLimit / 60)}:${String(settings.timeLimit % 60).padStart(2, '0')}` 
                      : "∞"
                  }</span>
                  <span className="text-sm text-muted-foreground">Času</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={prepareTest} className="min-w-32">Začít test</Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Nastavení
                    </Button>
                  </SheetTrigger>
                  {/* Sheet content is reused from above */}
                </Sheet>
              </div>
            </div>
          </CardContent>
        </>
      ) : isTestCompleted ? (
        <VocabularyTestResults 
          results={results}
          onRestart={restartTest}
        />
      ) : (
        <>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Test slovíček</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Otázka {currentItemIndex + 1} z {testItems.length}
                </p>
              </div>
              {remainingTime !== null && remainingTime > 0 && (
                <Badge variant="outline" className="text-base">
                  {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                </Badge>
              )}
            </div>
            <Progress value={(currentItemIndex / testItems.length) * 100} className="mt-2" />
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItemIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {testItems[currentItemIndex] && (
                  <>
                    <div className="bg-muted p-4 rounded-md text-center">
                      <h3 className="text-xl font-medium mb-1">
                        {direction === 'toForeign' 
                          ? testItems[currentItemIndex].translation 
                          : testItems[currentItemIndex].word
                        }
                      </h3>
                      {testItems[currentItemIndex].category && (
                        <Badge variant="outline" className="mt-2">{testItems[currentItemIndex].category}</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="answer" className="text-sm font-medium">
                        Přeložit jako:
                      </label>
                      <input
                        type="text"
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            checkAnswer();
                          }
                        }}
                        className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        placeholder="Zadejte překlad..."
                        autoFocus
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={skipQuestion}>
                <ChevronRight className="h-4 w-4" />
                Přeskočit
              </Button>
            </div>
            
            <Button onClick={checkAnswer} disabled={!answer.trim()}>
              Zkontrolovat
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default VocabularyTest;

