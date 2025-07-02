
import { useState, useEffect } from 'react';

export const useExerciseProgress = () => {
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
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

      return true; // Indicates exercise was newly completed
    }
    return false; // Exercise was already completed
  };

  return {
    completedExercises,
    dailyProgress,
    handleCompleteExercise
  };
};
