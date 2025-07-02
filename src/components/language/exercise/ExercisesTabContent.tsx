
import React, { useState } from 'react';
import { Exercise } from "@/data/germanExercises";
import ExerciseGrid from './ExerciseGrid';
import ExerciseDialog from './ExerciseDialog';

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
  onComplete,
  isPremium
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExerciseStart = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedExercise(null);
  };

  const handleExerciseComplete = (exerciseId: number) => {
    onComplete(exerciseId);
    handleDialogClose();
  };

  return (
    <>
      <ExerciseGrid
        exercises={exercises}
        completedExercises={completedExercises}
        onExerciseStart={handleExerciseStart}
        isPremium={isPremium}
      />

      <ExerciseDialog
        exercise={selectedExercise}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onComplete={handleExerciseComplete}
      />
    </>
  );
};

export default ExercisesTabContent;
