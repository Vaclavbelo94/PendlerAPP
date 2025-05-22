
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ExerciseHeaderProps {
  currentExercise: number;
  totalExercises: number;
  category?: string;
  score: {
    correct: number;
    total: number;
  };
}

const ExerciseHeader = ({ currentExercise, totalExercises, category, score }: ExerciseHeaderProps) => {
  const progressPercentage = totalExercises > 0 ? (currentExercise / totalExercises) * 100 : 0;
  
  return (
    <>
      <CardTitle className="flex justify-between items-center text-lg">
        <span>
          Gramatické cvičení 
          {category && <Badge variant="outline" className="ml-2">{category}</Badge>}
        </span>
        {score.total > 0 && (
          <span className="text-sm font-medium">
            Skóre: {score.correct}/{score.total}
          </span>
        )}
      </CardTitle>
      <CardDescription>
        <div className="flex justify-between items-center mt-1">
          <span>Otázka {currentExercise + 1} z {totalExercises}</span>
          <span className="text-sm">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mt-2" />
      </CardDescription>
    </>
  );
};

export default ExerciseHeader;
