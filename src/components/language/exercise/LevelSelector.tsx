
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { Exercise } from "@/data/germanExercises";
import ExercisesTabContent from './ExercisesTabContent';

interface LevelSelectorProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  exercisesByLevel: {
    beginner: Exercise[];
    intermediate: Exercise[];
    advanced: Exercise[];
  };
  completedExercises: number[];
  activeExercise: number | null;
  setActiveExercise: (id: number | null) => void;
  onComplete: (id: number) => void;
  isPremium: boolean;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  setSelectedLevel,
  exercisesByLevel,
  completedExercises,
  activeExercise,
  setActiveExercise,
  onComplete,
  isPremium
}) => {
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

  const currentExercises = exercisesByLevel[selectedLevel as keyof typeof exercisesByLevel] || [];
  const completedCount = currentExercises.filter(ex => completedExercises.includes(ex.id)).length;
  const progressPercentage = currentExercises.length > 0 ? (completedCount / currentExercises.length) * 100 : 0;

  return (
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

          <TabsContent value="beginner" className="mt-6">
            <ExercisesTabContent
              exercises={exercisesByLevel.beginner}
              completedExercises={completedExercises}
              activeExercise={activeExercise}
              setActiveExercise={setActiveExercise}
              onComplete={onComplete}
              isPremium={isPremium}
            />
          </TabsContent>

          <TabsContent value="intermediate" className="mt-6">
            <ExercisesTabContent
              exercises={exercisesByLevel.intermediate}
              completedExercises={completedExercises}
              activeExercise={activeExercise}
              setActiveExercise={setActiveExercise}
              onComplete={onComplete}
              isPremium={isPremium}
            />
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <ExercisesTabContent
              exercises={exercisesByLevel.advanced}
              completedExercises={completedExercises}
              activeExercise={activeExercise}
              setActiveExercise={setActiveExercise}
              onComplete={onComplete}
              isPremium={isPremium}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LevelSelector;
