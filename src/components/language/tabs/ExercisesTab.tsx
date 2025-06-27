
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { grammarExercises as germanExercises } from "@/data/exercises/grammarExercises";
import DailyProgressCards from '../exercise/DailyProgressCards';
import LevelSelector from '../exercise/LevelSelector';
import { useExerciseProgress } from '../exercise/hooks/useExerciseProgress';

const ExercisesTab = () => {
  const { unifiedUser } = useAuth();
  const { toast } = useToast();
  
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  
  const {
    completedExercises,
    dailyProgress,
    handleCompleteExercise: handleExerciseComplete
  } = useExerciseProgress();

  const handleCompleteExercise = (exerciseId: number) => {
    const wasNewlyCompleted = handleExerciseComplete(exerciseId);
    
    if (wasNewlyCompleted) {
      toast({
        title: "Cvičení dokončeno!",
        description: "Získali jste body za dokončení cvičení."
      });
    }
    
    setActiveExercise(null);
  };

  // Filter exercises by difficulty level based on exercise ID ranges
  const exercisesByLevel = {
    beginner: germanExercises.filter(ex => ex.id <= 6), // First 6 exercises for beginners
    intermediate: germanExercises.filter(ex => ex.id > 6 && ex.id <= 12), // Next 6 for intermediate
    advanced: germanExercises.filter(ex => ex.id > 12) // Remaining for advanced
  };

  return (
    <div className="space-y-6">
      <DailyProgressCards
        dailyProgress={dailyProgress}
        totalCompleted={completedExercises.length}
      />

      <LevelSelector
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        exercisesByLevel={exercisesByLevel}
        completedExercises={completedExercises}
        activeExercise={activeExercise}
        setActiveExercise={setActiveExercise}
        onComplete={handleCompleteExercise}
        isPremium={unifiedUser?.isPremium || false}
      />
    </div>
  );
};

export default ExercisesTab;
