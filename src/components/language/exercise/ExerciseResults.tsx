
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Check } from "lucide-react";

interface ExerciseResultsProps {
  showAnswer: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

const ExerciseResults = ({ showAnswer, onSubmit, onNext }: ExerciseResultsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      {!showAnswer ? (
        <Button type="submit" onClick={onSubmit}>
          <Check className="mr-1 h-4 w-4" />
          Zkontrolovat
        </Button>
      ) : (
        <Button onClick={onNext}>
          Další otázka
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ExerciseResults;
