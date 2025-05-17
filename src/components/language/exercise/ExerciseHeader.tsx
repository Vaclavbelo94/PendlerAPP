
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

interface ExerciseHeaderProps {
  currentExercise: number;
  totalExercises: number;
  category?: string;
  score: { correct: number; total: number };
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ 
  currentExercise, 
  totalExercises, 
  category, 
  score 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Cvičení {currentExercise + 1}/{totalExercises}</CardTitle>
        {category && <CardDescription>{category}</CardDescription>}
      </div>
      <div className="text-sm text-muted-foreground">
        Skóre: {score.correct}/{score.total}
      </div>
    </div>
  );
};

export default ExerciseHeader;
