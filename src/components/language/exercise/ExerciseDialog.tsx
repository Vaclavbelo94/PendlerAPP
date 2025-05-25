
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Exercise } from "@/data/germanExercises";
import ExerciseQuestion from './ExerciseQuestion';

interface ExerciseDialogProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (exerciseId: number) => void;
}

const ExerciseDialog: React.FC<ExerciseDialogProps> = ({
  exercise,
  isOpen,
  onClose,
  onComplete
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const form = useForm({
    defaultValues: {
      answer: ""
    }
  });

  const handleSubmit = (data: { answer: string }) => {
    if (!exercise) return;
    
    const correct = data.answer === exercise.correctAnswer;
    setIsAnswerCorrect(correct);
    setShowAnswer(true);
  };

  const handleComplete = () => {
    if (exercise) {
      onComplete(exercise.id);
    }
    handleClose();
  };

  const handleClose = () => {
    setShowAnswer(false);
    setIsAnswerCorrect(false);
    form.reset();
    onClose();
  };

  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cvičení #{exercise.id}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ExerciseQuestion
              exercise={exercise}
              form={form}
              showAnswer={showAnswer}
            />

            <div className="flex gap-3">
              {!showAnswer ? (
                <>
                  <Button type="submit" className="flex-1">
                    Zkontrolovat odpověď
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Zrušit
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    type="button" 
                    onClick={handleComplete}
                    className="flex-1"
                    variant={isAnswerCorrect ? "default" : "secondary"}
                  >
                    {isAnswerCorrect ? 'Dokončit cvičení' : 'Pokračovat'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Zavřít
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;
