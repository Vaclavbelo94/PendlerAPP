
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ExerciseResultsProps {
  showAnswer: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

const ExerciseResults: React.FC<ExerciseResultsProps> = ({ 
  showAnswer, 
  onSubmit, 
  onNext 
}) => {
  return (
    <div className="flex justify-between">
      {!showAnswer ? (
        <Button type="button" onClick={onSubmit} disabled={showAnswer}>
          Zkontrolovat
        </Button>
      ) : (
        <Button type="button" onClick={onNext} className="flex items-center gap-2">
          Další <Play className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ExerciseResults;
