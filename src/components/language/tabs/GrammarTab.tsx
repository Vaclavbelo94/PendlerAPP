
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useLanguageContext } from '../LanguageManager';
import GrammarExercise from '../GrammarExercise';
import EnhancedGrammarExercise from '../EnhancedGrammarExercise';
import LimitedExamples from '../LimitedExamples';
import { grammarExercises } from '@/data/germanExercises';
import { FileText, BookOpen, CheckSquare, CircleCheck, PenTool, Book, ListTree } from 'lucide-react';
import { PremiumBadge } from '@/components/premium/PremiumBadge';
import LearningSessionHistory from '../LearningSessionHistory';

const GrammarTab: React.FC = () => {
  const { isPremium } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { addXp } = useLanguageContext();
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('beginner');
  
  // Simulace denních statistik pro demonstraci
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
  
  // Nahrání uložených dokončených cvičení z localStorage
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
  
  // Uložení dokončených cvičení do localStorage
  useEffect(() => {
    if (completedExercises.length > 0) {
      localStorage.setItem('completed_exercises', JSON.stringify(completedExercises));
    }
  }, [completedExercises]);
  
  const handleExerciseComplete = (exerciseId: number) => {
    // Přidat cvičení do dokončených
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
      
      // Přidat XP za dokončení cvičení
      addXp(15);
    }
    
    // Zavřít cvičení
    setActiveExercise(null);
  };
  
  const filteredExercises = grammarExercises.filter(ex => ex.level.toLowerCase() === activeTab);
  
  const beginnerCount = grammarExercises.filter(ex => ex.level.toLowerCase() === 'beginner').length;
  const intermediateCount = grammarExercises.filter(ex => ex.level.toLowerCase() === 'intermediate').length;
  const advancedCount = grammarExercises.filter(ex => ex.level.toLowerCase() === 'advanced').length;
  
  const beginnerCompleted = completedExercises.filter(id => 
    grammarExercises.find(ex => ex.id === id && ex.level.toLowerCase() === 'beginner')
  ).length;
  
  const intermediateCompleted = completedExercises.filter(id => 
    grammarExercises.find(ex => ex.id === id && ex.level.toLowerCase() === 'intermediate')
  ).length;
  
  const advancedCompleted = completedExercises.filter(id => 
    grammarExercises.find(ex => ex.id === id && ex.level.toLowerCase() === 'advanced')
  ).length;
  
  return (
    <div className="space-y-6">
      {/* Historie učení */}
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
                {beginnerCompleted + intermediateCompleted + advancedCompleted}/{grammarExercises.length} dokončeno
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
            
            <TabsContent value="beginner" className="space-y-4">
              {/* Render exercise list */}
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="border rounded-md p-4 bg-card">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {exercise.title}
                        {completedExercises.includes(exercise.id) && (
                          <CircleCheck className="h-5 w-5 text-green-500" />
                        )}
                      </h3>
                      <p className="text-muted-foreground text-sm">{exercise.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-muted/30">
                          {exercise.level}
                        </Badge>
                        <Badge variant="outline" className="bg-muted/30">
                          {exercise.topics.join(', ')}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveExercise(exercise.id)}
                      variant={completedExercises.includes(exercise.id) ? "outline" : "default"}
                      className="whitespace-nowrap"
                    >
                      {completedExercises.includes(exercise.id) ? 'Opakovat' : 'Začít'}
                    </Button>
                  </div>
                  
                  {/* Show exercise when active */}
                  {activeExercise === exercise.id && (
                    <div className="mt-4 border-t pt-4">
                      {isPremium ? (
                        <EnhancedGrammarExercise 
                          exercise={exercise} 
                          onComplete={() => handleExerciseComplete(exercise.id)}
                        />
                      ) : (
                        <GrammarExercise 
                          exercise={exercise}
                          onComplete={() => handleExerciseComplete(exercise.id)}  
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="intermediate" className="space-y-4">
              {/* Similar content as beginner */}
              <div className="text-center py-4">
                {filteredExercises.length === 0 ? (
                  <div className="p-4">
                    <p>Žádná cvičení pro tuto úroveň nejsou k dispozici</p>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="border rounded-md p-4 mb-4 bg-card">
                      {/* ... stejná struktura jako u začátečníka */}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              {/* Similar content as beginner */}
              <div className="text-center py-4">
                {filteredExercises.length === 0 ? (
                  <div className="p-4">
                    <p>Žádná cvičení pro tuto úroveň nejsou k dispozici</p>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="border rounded-md p-4 mb-4 bg-card">
                      {/* ... stejná struktura jako u začátečníka */}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {!isPremium && (
            <div className="mt-4 bg-primary/5 rounded-md p-4 border border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTree className="h-5 w-5 text-primary" />
                  <span className="font-medium">Další gramatická cvičení</span>
                  <PremiumBadge variant="compact" />
                </div>
                <Button variant="default" size="sm">
                  Aktivovat Premium
                </Button>
              </div>
            </div>
          )}
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
          <LimitedExamples />
        </CardContent>
      </Card>
    </div>
  );
};

export default GrammarTab;
