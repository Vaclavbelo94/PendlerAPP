
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useLanguageContext } from '../LanguageManager';
import { grammarExercises2, GrammarCategory } from '@/data/germanExercises';
import { BookOpen, Book } from 'lucide-react';
import LearningSessionHistory from '../LearningSessionHistory';
import LimitedExamples from '../LimitedExamples';
import ExercisesTabContent from '../exercise/ExercisesTabContent';
import PremiumExercisesBanner from '../exercise/PremiumExercisesBanner';

const GrammarTab: React.FC = () => {
  const { isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { addXp } = useLanguageContext();
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('beginner');
  
  // Sample daily statistics for demonstration
  const dailyStats = [
    { date: '2025-05-10', wordsReviewed: 25, correctCount: 18, incorrectCount: 7 },
    { date: '2025-05-11', wordsReviewed: 15, correctCount: 12, incorrectCount: 3 },
    { date: '2025-05-12', wordsReviewed: 8, correctCount: 6, incorrectCount: 2 },
    { date: '2025-05-13', wordsReviewed: 0, correctCount: 0, incorrectCount: 0 },
    { date: '2025-05-14', wordsReviewed: 20, correctCount: 15, incorrectCount: 5 },
    { date: '2025-05-15', wordsReviewed: 30, correctCount: 22, incorrectCount: 8 },
    { date: '2025-05-16', wordsReviewed: 12, correctCount: 10, incorrectCount: 2 },
    { date: '2025-05-17', wordsReviewed: 5, correctCount: 5, incorrectCount: 0 },
  ];
  
  // Load saved completed exercises from localStorage
  useEffect(() => {
    const savedCompletedExercises = localStorage.getItem('completed_exercises');
    if (savedCompletedExercises) {
      try {
        setCompletedExercises(JSON.parse(savedCompletedExercises));
      } catch (e) {
        console.error('Chyba při načítání dokončených cvičení:', e);
      }
    }
  }, []);
  
  // Save completed exercises to localStorage
  useEffect(() => {
    if (completedExercises.length > 0) {
      localStorage.setItem('completed_exercises', JSON.stringify(completedExercises));
    }
  }, [completedExercises]);
  
  const handleExerciseComplete = (exerciseId: number) => {
    // Add exercise to completed
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Add XP for completing exercise
      addXp(15);
    }
    
    // Close exercise
    setActiveExercise(null);
  };
  
  // Filter exercises based on active tab
  const filteredExercises = grammarExercises2.filter(ex => ex.category.toLowerCase() === activeTab);
  
  const beginnerCount = grammarExercises2.filter(ex => ex.category.toLowerCase() === 'beginner').length;
  const intermediateCount = grammarExercises2.filter(ex => ex.category.toLowerCase() === 'intermediate').length;
  const advancedCount = grammarExercises2.filter(ex => ex.category.toLowerCase() === 'advanced').length;
  
  const beginnerCompleted = completedExercises.filter(id => 
    grammarExercises2.find(ex => ex.id === id && ex.category.toLowerCase() === 'beginner')
  ).length;
  
  const intermediateCompleted = completedExercises.filter(id => 
    grammarExercises2.find(ex => ex.id === id && ex.category.toLowerCase() === 'intermediate')
  ).length;
  
  const advancedCompleted = completedExercises.filter(id => 
    grammarExercises2.find(ex => ex.id === id && ex.category.toLowerCase() === 'advanced')
  ).length;

  // Store the currently active grammar category
  const [activeCategory, setActiveCategory] = useState<GrammarCategory | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Learning History */}
      <LearningSessionHistory dailyStats={dailyStats} />
      
      {/* Grammar content */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>Gramatická cvičení</span>
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-muted/50">
                {beginnerCompleted + intermediateCompleted + advancedCompleted}/{grammarExercises2.length} dokončeno
              </Badge>
            </div>
          </div>
          <CardDescription>Procvičte si německou gramatiku pomocí interaktivních cvičení</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="beginner" className="relative">
                Začátečník
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {beginnerCompleted}/{beginnerCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="intermediate" className="relative">
                Střední
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {intermediateCompleted}/{intermediateCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="relative">
                Pokročilý
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {advancedCompleted}/{advancedCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <TabsContent key={level} value={level}>
                <ExercisesTabContent
                  exercises={grammarExercises2.filter(ex => ex.category.toLowerCase() === level)}
                  completedExercises={completedExercises}
                  activeExercise={activeExercise}
                  setActiveExercise={setActiveExercise}
                  onComplete={handleExerciseComplete}
                  isPremium={isPremium}
                />
              </TabsContent>
            ))}
          </Tabs>
          
          {!isPremium && <PremiumExercisesBanner />}
        </CardContent>
      </Card>
      
      {/* Examples section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Book className="h-5 w-5" />
            <span>Příklady z reálných konverzací</span>
          </CardTitle>
          <CardDescription>
            Ukázky německých vět a frází z každodenních situací
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass empty array if we don't have a selected category */}
          <LimitedExamples examples={activeCategory?.rules?.[0]?.examples || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GrammarTab;
