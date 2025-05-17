
import React from 'react';
import { Exercise } from "@/data/germanExercises";
import ExerciseItem from './ExerciseItem';

interface ExercisesTabContentProps {
  exercises: Exercise[];
  completedExercises: number[];
  activeExercise: number | null;
  setActiveExercise: (id: number | null) => void;
  onComplete: (id: number) => void;
  isPremium: boolean;
}

const ExercisesTabContent: React.FC<ExercisesTabContentProps> = ({
  exercises,
  completedExercises,
  activeExercise,
  setActiveExercise,
  onComplete,
  isPremium
}) => {
  return (
    <div className="space-y-4">
      {exercises.length === 0 ? (
        <div className="p-4">
          <p>Žádná cvičení pro tuto úroveň nejsou k dispozici</p>
        </div>
      ) : (
        exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            isCompleted={completedExercises.includes(exercise.id)}
            isActive={activeExercise === exercise.id}
            onExerciseClick={setActiveExercise}
            onComplete={onComplete}
            isPremium={isPremium}
          />
        ))
      )}
    </div>
  );
};

export default ExercisesTabContent;
