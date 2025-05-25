
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Lock } from "lucide-react";
import { Exercise } from "@/data/germanExercises";

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isCompleted,
  isLocked,
  onStart
}) => {
  return (
    <Card className={`border transition-colors ${
      isCompleted ? 'border-green-200 bg-green-50/50' : 
      isLocked ? 'border-gray-200 bg-gray-50/50' : 'border-border'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {exercise.question}
              {isCompleted && <CircleCheck className="h-5 w-5 text-green-600" />}
              {isLocked && <Lock className="h-4 w-4 text-gray-400" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {exercise.explanation}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {exercise.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {exercise.type === 'multiplechoice' ? 'Výběr' : 'Doplnění'}
            </Badge>
          </div>
          
          <Button 
            onClick={onStart}
            disabled={isLocked}
            variant={isCompleted ? "outline" : "default"}
            size="sm"
          >
            {isLocked ? 'Uzamčeno' : isCompleted ? 'Opakovat' : 'Začít'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
