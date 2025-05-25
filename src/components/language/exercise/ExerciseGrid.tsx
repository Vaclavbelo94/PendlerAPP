
import React from 'react';
import { Exercise } from "@/data/germanExercises";
import ExerciseCard from './ExerciseCard';

interface ExerciseGridProps {
  exercises: Exercise[];
  completedExercises: number[];
  onExerciseStart: (exercise: Exercise) => void;
  isPremium: boolean;
}

const ExerciseGrid: React.FC<ExerciseGridProps> = ({
  exercises,
  completedExercises,
  onExerciseStart,
  isPremium
}) => {
  const getExerciseStatus = (exercise: Exercise, index: number) => {
    const isCompleted = completedExercises.includes(exercise.id);
    const isLocked = !isPremium && index >= 3; // First 3 exercises free
    
    return { isCompleted, isLocked };
  };

  return (
    <div className="grid gap-4">
      {exercises.map((exercise, index) => {
        const { isCompleted, isLocked } = getExerciseStatus(exercise, index);
        
        return (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isCompleted={isCompleted}
            isLocked={isLocked}
            onStart={() => !isLocked && onExerciseStart(exercise)}
          />
        );
      })}
      
      {exercises.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Pro tuto úroveň nejsou k dispozici žádná cvičení.</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseGrid;
