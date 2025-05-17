
import React from 'react';
import { CircleCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/data/germanExercises";
import GrammarExercise from '../GrammarExercise';

interface ExerciseItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  isActive: boolean;
  onExerciseClick: (id: number) => void;
  onComplete: (id: number) => void;
  isPremium: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  isCompleted,
  isActive,
  onExerciseClick,
  onComplete,
  isPremium
}) => {
  return (
    <div className="border rounded-md p-4 bg-card mb-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {exercise.question}
            {isCompleted && (
              <CircleCheck className="h-5 w-5 text-green-500" />
            )}
          </h3>
          <p className="text-muted-foreground text-sm">{exercise.explanation}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-muted/30">
              {exercise.category}
            </Badge>
            <Badge variant="outline" className="bg-muted/30">
              {exercise.type}
            </Badge>
          </div>
        </div>
        <Button 
          onClick={() => onExerciseClick(exercise.id)}
          variant={isCompleted ? "outline" : "default"}
          className="whitespace-nowrap"
        >
          {isCompleted ? 'Opakovat' : 'Začít'}
        </Button>
      </div>
      
      {/* Show exercise when active */}
      {isActive && (
        <div className="mt-4 border-t pt-4">
          <GrammarExercise 
            exercises={[exercise]}
            onComplete={() => onComplete(exercise.id)}
          />
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
