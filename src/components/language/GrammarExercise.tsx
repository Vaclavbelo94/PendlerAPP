import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Exercise } from "@/data/germanExercises";

type GrammarExerciseProps = {
  exercises: Exercise[];
  category?: string;
  onComplete?: (exerciseId: number) => void;  // Added onComplete prop
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
  React.useEffect(() => {
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
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
        <div className="flex justify-between items-center">
          <CardTitle>Cvičení {currentExercise + 1}/{filteredExercises.length}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Skóre: {score.correct}/{score.total}
          </div>
        </div>
        <CardDescription>
          {exercise.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="mb-6">
              <p className="text-lg mb-4">{exercise.question}</p>

              {exercise.type === 'multiplechoice' && exercise.options && (
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                          disabled={showAnswer}
                        >
                          {exercise.options.map((option, index) => (
                            <div key={index} className={`flex items-center space-x-2 rounded-md border p-3 ${
                              showAnswer && option === exercise.correctAnswer 
                                ? "border-green-500 bg-green-50" 
                                : showAnswer && field.value === option && option !== exercise.correctAnswer
                                  ? "border-red-500 bg-red-50"
                                  : ""
                            }`}>
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                                {option}
                              </label>
                              {showAnswer && option === exercise.correctAnswer && (
                                <Check className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {exercise.type === 'fillblank' && (
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={showAnswer}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte správnou odpověď" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exercise.options?.map((option, index) => (
                            <SelectItem key={index} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-between">
              {!showAnswer ? (
                <Button type="submit" disabled={showAnswer}>
                  Zkontrolovat
                </Button>
              ) : (
                <Button type="button" onClick={nextExercise} className="flex items-center gap-2">
                  Další <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GrammarExercise;
