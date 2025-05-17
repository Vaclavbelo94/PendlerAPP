
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Hourglass, Trophy, Star, Book } from 'lucide-react';

interface TestModeProps {
  vocabularyItems: VocabularyItem[];
}

interface QuestionConfig {
  amount: number;
  categories: string[];
  difficulty: ('easy' | 'medium' | 'hard' | 'all')[];
  questionTypes: ('multiple' | 'type-in' | 'true-false')[];
}

type Question = {
  type: 'multiple' | 'type-in' | 'true-false';
  item: VocabularyItem;
  options?: string[];
  correctIndex?: number;
};

const TestMode: React.FC<TestModeProps> = ({ vocabularyItems }) => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [config, setConfig] = useState<QuestionConfig>({
    amount: 10,
    categories: ['all'],
    difficulty: ['all'],
    questionTypes: ['multiple', 'type-in', 'true-false']
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Get unique categories from vocabulary items
  const categories = ['all', ...Array.from(new Set(vocabularyItems.map(item => item.category || 'Obecné')))];
  
  // Generate random questions based on config
  const generateQuestions = () => {
    // Filter items based on config
    let filteredItems = [...vocabularyItems];
    
    // Filter by category if not 'all'
    if (!config.categories.includes('all')) {
      filteredItems = filteredItems.filter(item => 
        config.categories.includes(item.category || 'Obecné')
      );
    }
    
    // Filter by difficulty if not 'all'
    if (!config.difficulty.includes('all')) {
      filteredItems = filteredItems.filter(item => 
        item.difficulty && config.difficulty.includes(item.difficulty)
      );
    }
    
    // Shuffle and limit to the requested amount
    const shuffledItems = filteredItems.sort(() => Math.random() - 0.5);
    const selectedItems = shuffledItems.slice(0, Math.min(config.amount, shuffledItems.length));
    
    // Generate questions
    const generatedQuestions: Question[] = selectedItems.map(item => {
      // Randomly select question type from available types
      const questionType = config.questionTypes[
        Math.floor(Math.random() * config.questionTypes.length)
      ];
      
      switch (questionType) {
        case 'multiple': {
          // Generate 4 options with the correct one randomized
          const correctIndex = Math.floor(Math.random() * 4);
          const otherItems = vocabularyItems
            .filter(i => i.id !== item.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
            
          const options = Array(4).fill('');
          options[correctIndex] = item.translation;
          
          // Fill in other options
          let j = 0;
          for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
              options[i] = otherItems[j]?.translation || `Nesprávná odpověď ${i}`;
              j++;
            }
          }
          
          return { type: 'multiple', item, options, correctIndex };
        }
        case 'type-in':
          return { type: 'type-in', item };
        case 'true-false': {
          // 50% chance to show correct translation
          const isCorrectPair = Math.random() > 0.5;
          let options: string[];
          
          if (isCorrectPair) {
            options = [item.translation, 'true'];
          } else {
            // Pick a different random translation
            const randomItem = vocabularyItems
              .filter(i => i.id !== item.id)
              .sort(() => Math.random() - 0.5)[0];
            
            options = [randomItem?.translation || 'Nesprávný překlad', 'false'];
          }
          
          return { 
            type: 'true-false', 
            item, 
            options, 
            correctIndex: isCorrectPair ? 0 : 1 
          };
        }
        default:
          return { type: 'multiple', item };
      }
    });
    
    return generatedQuestions;
  };
  
  // Start the test
  const startTest = () => {
    const generatedQuestions = generateQuestions();
    
    if (generatedQuestions.length === 0) {
      toast({
        title: "Nedostatek slovíček",
        description: "Pro vytvoření testu nemáte dostatek slovíček odpovídajících zvolené konfiguraci.",
        variant: "destructive"
      });
      return;
    }
    
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsConfiguring(false);
    setIsRunning(true);
    setIsComplete(false);
    setStartTime(new Date());
    setTimeSpent(0);
  };
  
  // Check the answer
  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let correct = false;
    
    switch (currentQuestion.type) {
      case 'multiple':
        correct = selectedAnswer === String(currentQuestion.correctIndex);
        break;
      case 'type-in':
        // Case insensitive check, allowing for small typos
        const normalizedTyped = typedAnswer.toLowerCase().trim();
        const normalizedCorrect = currentQuestion.item.translation.toLowerCase().trim();
        correct = normalizedTyped === normalizedCorrect;
        break;
      case 'true-false':
        if (currentQuestion.options && currentQuestion.options[1] === 'true') {
          correct = selectedAnswer === 'true';
        } else {
          correct = selectedAnswer === 'false';
        }
        break;
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      nextQuestion();
    }, 1500);
  };
  
  // Move to next question or complete the test
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
    } else {
      // Test complete
      const endTime = new Date();
      const timeInMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
      setTimeSpent(Math.floor(timeInMs / 1000)); // in seconds
      setIsRunning(false);
      setIsComplete(true);
    }
  };
  
  // Restart the test
  const restartTest = () => {
    setIsConfiguring(true);
    setIsComplete(false);
  };

  // Update config when user changes settings
  const updateConfig = (key: keyof QuestionConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  // Toggle selection in a multiple-select setting
  const toggleSelection = (key: keyof QuestionConfig, value: string) => {
    setConfig(prev => {
      const currentValues = prev[key] as string[];
      
      // Handle special case for 'all'
      if (value === 'all') {
        // If adding 'all', remove everything else
        if (!currentValues.includes('all')) {
          return { ...prev, [key]: ['all'] };
        }
        // If removing 'all', add first non-all option
        const options = key === 'categories' ? categories : ['easy', 'medium', 'hard'];
        return { ...prev, [key]: [options[1]] };
      } else {
        // If this is not 'all'
        let newValues: string[];
        
        // If we already have the value, remove it (unless it would make the array empty)
        if (currentValues.includes(value)) {
          const filtered = currentValues.filter(v => v !== value);
          // Ensure we always have at least one value
          newValues = filtered.length > 0 ? filtered : currentValues;
        } else {
          // Add the value and remove 'all' if it's there
          newValues = [...currentValues.filter(v => v !== 'all'), value];
        }
        
        return { ...prev, [key]: newValues };
      }
    });
  };
  
  // Toggle question type selection
  const toggleQuestionType = (type: 'multiple' | 'type-in' | 'true-false') => {
    setConfig(prev => {
      const currentTypes = prev.questionTypes;
      
      // Ensure we always have at least one type
      if (currentTypes.includes(type) && currentTypes.length > 1) {
        return { ...prev, questionTypes: currentTypes.filter(t => t !== type) };
      } else if (!currentTypes.includes(type)) {
        return { ...prev, questionTypes: [...currentTypes, type] };
      }
      
      return prev;
    });
  };

  // Render progress indicator
  const renderProgress = () => {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>Otázka {currentQuestionIndex + 1} z {questions.length}</span>
          <span>Skóre: {score}</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  };
  
  // Render current question
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return null;
    
    return (
      <div className="space-y-4">
        <div className="text-xl font-semibold">
          {currentQuestion.type === 'true-false' 
            ? `Je "${currentQuestion.item.word}" český překlad pro "${currentQuestion.options?.[0]}"?`
            : `Co znamená "${currentQuestion.item.word}"?`}
        </div>
        
        {currentQuestion.item.category && (
          <div className="text-sm text-muted-foreground">
            Kategorie: {currentQuestion.item.category}
          </div>
        )}
        
        {currentQuestion.type === 'multiple' && (
          <RadioGroup 
            value={selectedAnswer || ''} 
            onValueChange={setSelectedAnswer}
          >
            <div className="grid gap-3">
              {currentQuestion.options?.map((option, i) => (
                <div 
                  key={i}
                  className={`border rounded-md p-3 cursor-pointer transition-colors
                    ${showFeedback && i === currentQuestion.correctIndex ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                    ${showFeedback && selectedAnswer === String(i) && i !== currentQuestion.correctIndex ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={String(i)} 
                      id={`option-${i}`} 
                      disabled={showFeedback}
                    />
                    <Label htmlFor={`option-${i}`} className="w-full cursor-pointer">
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        {currentQuestion.type === 'type-in' && (
          <div className="space-y-2">
            <Label htmlFor="answer">Váš překlad:</Label>
            <div className={`
              ${showFeedback ? (isCorrect ? 'border-green-500 ring-green-500' : 'border-red-500 ring-red-500') : ''}
            `}>
              <Input
                id="answer"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Napište překlad..."
                disabled={showFeedback}
                className={`
                  ${showFeedback ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}
                `}
              />
            </div>
            
            {showFeedback && !isCorrect && (
              <div className="text-sm font-medium text-red-500">
                Správná odpověď: {currentQuestion.item.translation}
              </div>
            )}
          </div>
        )}
        
        {currentQuestion.type === 'true-false' && (
          <RadioGroup 
            value={selectedAnswer || ''} 
            onValueChange={setSelectedAnswer}
          >
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`border rounded-md p-3 cursor-pointer transition-colors
                  ${showFeedback && 'true' === (currentQuestion.options?.[1] === 'true' ? 'true' : 'false') ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                  ${showFeedback && selectedAnswer === 'true' && 'true' !== (currentQuestion.options?.[1] === 'true' ? 'true' : 'false') ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="true" 
                    id="true-option" 
                    disabled={showFeedback}
                  />
                  <Label htmlFor="true-option" className="w-full cursor-pointer">
                    Ano
                  </Label>
                </div>
              </div>
              
              <div 
                className={`border rounded-md p-3 cursor-pointer transition-colors
                  ${showFeedback && 'false' === (currentQuestion.options?.[1] === 'true' ? 'true' : 'false') ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                  ${showFeedback && selectedAnswer === 'false' && 'false' !== (currentQuestion.options?.[1] === 'true' ? 'true' : 'false') ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
                `}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="false" 
                    id="false-option" 
                    disabled={showFeedback}
                  />
                  <Label htmlFor="false-option" className="w-full cursor-pointer">
                    Ne
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>
        )}

        {showFeedback ? (
          <div className={`flex items-center justify-center p-3 rounded-md font-medium ${
            isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Správně!
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-5 w-5" />
                Nesprávně
              </>
            )}
          </div>
        ) : (
          <Button 
            onClick={checkAnswer} 
            className="w-full"
            disabled={
              (currentQuestion.type === 'multiple' && selectedAnswer === null) ||
              (currentQuestion.type === 'type-in' && !typedAnswer.trim()) ||
              (currentQuestion.type === 'true-false' && selectedAnswer === null)
            }
          >
            Odpovědět
          </Button>
        )}
      </div>
    );
  };
  
  // Render test configuration
  const renderConfig = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Počet otázek</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          max={50}
          value={config.amount}
          onChange={(e) => updateConfig('amount', Number(e.target.value))}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Kategorie</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={config.categories.includes(category) ? "default" : "outline"}
              onClick={() => toggleSelection('categories', category)}
              className="text-xs"
              size="sm"
            >
              {category === 'all' ? 'Všechny' : category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Obtížnost</Label>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={config.difficulty.includes('all') ? "default" : "outline"}
            onClick={() => toggleSelection('difficulty', 'all')}
            size="sm"
          >
            Všechny
          </Button>
          <Button
            variant={config.difficulty.includes('easy') ? "default" : "outline"}
            onClick={() => toggleSelection('difficulty', 'easy')}
            size="sm"
          >
            Lehká
          </Button>
          <Button
            variant={config.difficulty.includes('medium') ? "default" : "outline"}
            onClick={() => toggleSelection('difficulty', 'medium')}
            size="sm"
          >
            Střední
          </Button>
          <Button
            variant={config.difficulty.includes('hard') ? "default" : "outline"}
            onClick={() => toggleSelection('difficulty', 'hard')}
            size="sm"
          >
            Těžká
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Typy otázek</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant={config.questionTypes.includes('multiple') ? "default" : "outline"}
            onClick={() => toggleQuestionType('multiple')}
            size="sm"
          >
            Výběr z možností
          </Button>
          <Button
            variant={config.questionTypes.includes('type-in') ? "default" : "outline"}
            onClick={() => toggleQuestionType('type-in')}
            size="sm"
          >
            Psaní odpovědi
          </Button>
          <Button
            variant={config.questionTypes.includes('true-false') ? "default" : "outline"}
            onClick={() => toggleQuestionType('true-false')}
            size="sm"
          >
            Ano/Ne
          </Button>
        </div>
      </div>
      
      <Button onClick={startTest} className="w-full">
        Spustit test
      </Button>
    </div>
  );
  
  // Render test results
  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let icon = null;
    
    if (percentage >= 90) {
      message = 'Vynikající výsledek! Jste opravdový znalec.';
      icon = <Trophy className="h-12 w-12 text-amber-500" />;
    } else if (percentage >= 70) {
      message = 'Velmi dobrý výsledek! Jste na správné cestě.';
      icon = <Star className="h-12 w-12 text-amber-400" />;
    } else if (percentage >= 50) {
      message = 'Dobrý výsledek, ale ještě je prostor pro zlepšení.';
      icon = <Book className="h-12 w-12 text-blue-500" />;
    } else {
      message = 'Zkuste to znovu a procvičujte více.';
      icon = <Hourglass className="h-12 w-12 text-gray-400" />;
    }
    
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 flex items-center justify-center">
          {icon}
        </div>
        
        <div>
          <div className="text-3xl font-bold mb-1">{score} / {questions.length}</div>
          <div className="text-lg text-muted-foreground mb-4">{percentage}%</div>
          <p className="text-md">{message}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center pt-4">
          <div className="border rounded-md p-3">
            <div className="text-md font-medium">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Celkem otázek</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-md font-medium">{timeSpent} s</div>
            <div className="text-sm text-muted-foreground">Celkový čas</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={restartTest} className="flex-1">
            Nový test
          </Button>
          <Button variant="outline" onClick={() => setIsConfiguring(true)} className="flex-1">
            Změnit nastavení
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test znalostí</CardTitle>
        <CardDescription>
          Otestujte své znalosti německé slovní zásoby
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConfiguring ? renderConfig() : isRunning ? (
          <div className="space-y-4">
            {renderProgress()}
            {renderQuestion()}
          </div>
        ) : isComplete ? (
          renderResults()
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TestMode;
