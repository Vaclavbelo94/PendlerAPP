
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Target, Trophy, Clock, Brain, CheckCircle } from "lucide-react";
import { germanExercises, Exercise } from "@/data/germanExercises";
import ExercisesTabContent from '../exercise/ExercisesTabContent';

const ExercisesTab = () => {
  const { isPremium } = useAuth();
  const { toast } = useToast();
  
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [dailyProgress, setDailyProgress] = useState({
    completed: 0,
    target: 5,
    streak: 0
  });

  // Load completed exercises from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completed-exercises');
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    }
  }, []);

  // Save completed exercises to localStorage
  const saveCompletedExercises = (exercises: number[]) => {
    localStorage.setItem('completed-exercises', JSON.stringify(exercises));
  };

  const handleCompleteExercise = (exerciseId: number) => {
    if (!completedExercises.includes(exerciseId)) {
      const newCompleted = [...completedExercises, exerciseId];
      setCompletedExercises(newCompleted);
      saveCompletedExercises(newCompleted);
      
      // Update daily progress
      setDailyProgress(prev => ({
        ...prev,
        completed: prev.completed + 1
      }));

      toast({
        title: "Cvičení dokončeno!",
        description: "Získali jste body za dokončení cvičení."
      });
    }
    
    setActiveExercise(null);
  };

  // Filter exercises by level
  const exercisesByLevel = {
    beginner: germanExercises.filter(ex => ex.difficulty === "beginner"),
    intermediate: germanExercises.filter(ex => ex.difficulty === "intermediate"),
    advanced: germanExercises.filter(ex => ex.difficulty === "advanced")
  };

  const currentExercises = exercisesByLevel[selectedLevel as keyof typeof exercisesByLevel] || [];
  const completedCount = currentExercises.filter(ex => completedExercises.includes(ex.id)).length;
  const progressPercentage = currentExercises.length > 0 ? (completedCount / currentExercises.length) * 100 : 0;

  const levelInfo = {
    beginner: {
      title: "Začátečník",
      description: "Základní gramatika a jednoduché konstrukce",
      color: "bg-green-100 text-green-800 border-green-200"
    },
    intermediate: {
      title: "Pokročilý",
      description: "Složitější gramatické struktury",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    advanced: {
      title: "Expert",
      description: "Pokročilá gramatika a komplexní věty",
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Denní cíl
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{dailyProgress.completed} / {dailyProgress.target} cvičení</span>
                <span>{Math.round((dailyProgress.completed / dailyProgress.target) * 100)}%</span>
              </div>
              <Progress 
                value={(dailyProgress.completed / dailyProgress.target) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Série
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyProgress.streak}</div>
            <p className="text-xs text-muted-foreground">
              dní v řadě
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Dokončeno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedExercises.length}</div>
            <p className="text-xs text-muted-foreground">
              celkem cvičení
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Úroveň obtížnosti
          </CardTitle>
          <CardDescription>
            Vyberte úroveň podle vašich znalostí němčiny
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLevel} onValueChange={setSelectedLevel}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Začátečník</TabsTrigger>
              <TabsTrigger value="intermediate">Pokročilý</TabsTrigger>
              <TabsTrigger value="advanced">Expert</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <div className={`p-4 rounded-lg border ${levelInfo[selectedLevel as keyof typeof levelInfo].color}`}>
                <h3 className="font-medium mb-2">
                  {levelInfo[selectedLevel as keyof typeof levelInfo].title}
                </h3>
                <p className="text-sm mb-3">
                  {levelInfo[selectedLevel as keyof typeof levelInfo].description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Pokrok: {completedCount}/{currentExercises.length}
                    </span>
                    <Badge variant="outline">
                      {Math.round(progressPercentage)}%
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="w-24 h-2" />
                </div>
              </div>
            </div>

            {/* Exercise Content */}
            <TabsContent value="beginner" className="mt-6">
              <ExercisesTabContent
                exercises={exercisesByLevel.beginner}
                completedExercises={completedExercises}
                activeExercise={activeExercise}
                setActiveExercise={setActiveExercise}
                onComplete={handleCompleteExercise}
                isPremium={isPremium}
              />
            </TabsContent>

            <TabsContent value="intermediate" className="mt-6">
              <ExercisesTabContent
                exercises={exercisesByLevel.intermediate}
                completedExercises={completedExercises}
                activeExercise={activeExercise}
                setActiveExercise={setActiveExercise}
                onComplete={handleCompleteExercise}
                isPremium={isPremium}
              />
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <ExercisesTabContent
                exercises={exercisesByLevel.advanced}
                completedExercises={completedExercises}
                activeExercise={activeExercise}
                setActiveExercise={setActiveExercise}
                onComplete={handleCompleteExercise}
                isPremium={isPremium}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesTab;
