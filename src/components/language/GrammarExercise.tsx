
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Exercise } from "@/data/germanExercises";
import ExerciseHeader from './exercise/ExerciseHeader';
import ExerciseQuestion from './exercise/ExerciseQuestion';
import ExerciseResults from './exercise/ExerciseResults';

type GrammarExerciseProps = {
  exercises: Exercise[];
  category?: string;
  onComplete?: (exerciseId: number) => void;
}

const formSchema = z.object({
  answer: z.string().min(1, "Prosím vyberte odpověď")
});

const GrammarExercise = ({ exercises, category, onComplete }: GrammarExerciseProps) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  // Filter exercises by category if provided
  useEffect(() => {
    if (category) {
      setFilteredExercises(exercises.filter(ex => ex.category === category));
    } else {
      setFilteredExercises(exercises);
    }
    // Reset score when exercises change
    setScore({ correct: 0, total: 0 });
    setCurrentExercise(0);
    setShowAnswer(false);
  }, [category, exercises]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  // Handle submit logic 
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const isCorrect = values.answer === filteredExercises[currentExercise].correctAnswer;
    setShowAnswer(true);
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (isCorrect) {
      toast({
        title: "Správně!",
        description: filteredExercises[currentExercise].explanation,
      });
    } else {
      toast({
        title: "Bohužel ne.",
        description: `Správná odpověď je: ${filteredExercises[currentExercise].correctAnswer}. ${filteredExercises[currentExercise].explanation}`,
        variant: "destructive",
      });
    }
  };

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setShowAnswer(false);
      form.reset();
    } else {
      // End of exercises
      toast({
        title: "Dokončeno!",
        description: `Vaše skóre: ${score.correct} z ${score.total}`,
      });
      
      // Call onComplete if it exists and pass the current exercise ID
      if (onComplete && filteredExercises[currentExercise]) {
        onComplete(filteredExercises[currentExercise].id);
      }
      
      // Reset to first exercise
      setCurrentExercise(0);
      setShowAnswer(false);
      form.reset();
    }
  };

  // Handle case when there are no exercises for selected category
  if (filteredExercises.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Pro tuto kategorii nejsou k dispozici žádná cvičení.
          </p>
        </CardContent>
      </Card>
    );
  }

  const exercise = filteredExercises[currentExercise];

  return (
    <Card className="w-full">
      <CardHeader>
        <ExerciseHeader
          currentExercise={currentExercise}
          totalExercises={filteredExercises.length}
          category={category}
          score={score}
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <ExerciseQuestion 
              exercise={exercise} 
              form={form} 
              showAnswer={showAnswer} 
            />
            <ExerciseResults 
              showAnswer={showAnswer} 
              onSubmit={() => form.handleSubmit(handleFormSubmit)()} 
              onNext={nextExercise} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GrammarExercise;
