
import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { Exercise } from "@/data/germanExercises";

interface ExerciseQuestionProps {
  exercise: Exercise;
  form: any;
  showAnswer: boolean;
}

const ExerciseQuestion = ({ exercise, form, showAnswer }: ExerciseQuestionProps) => {
  const isAnswerCorrect = form.getValues().answer === exercise.correctAnswer;

  return (
    <div className="space-y-4">
      <div className="bg-muted/20 p-4 rounded-lg">
        <p className="text-lg font-medium">{exercise.question}</p>
      </div>

      <FormField
        control={form.control}
        name="answer"
        render={({ field }) => (
          <FormItem>
            {exercise.type === "multiplechoice" && exercise.options && (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-2"
                disabled={showAnswer}
              >
                {exercise.options.map((option) => (
                  <div
                    key={option}
                    className={`flex items-center space-x-2 rounded-md border p-3 ${
                      showAnswer && option === exercise.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : showAnswer && field.value === option && option !== exercise.correctAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-input"
                    }`}
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label
                      htmlFor={option}
                      className="flex-1 font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                    {showAnswer && option === exercise.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {showAnswer && field.value === option && option !== exercise.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}

            {exercise.type === "fillblank" && (
              <FormControl>
                <Input
                  placeholder="Zadejte odpověď"
                  {...field}
                  disabled={showAnswer}
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {showAnswer && (
        <Alert className={isAnswerCorrect ? "bg-green-50" : "bg-red-50"}>
          <AlertDescription className="text-sm">
            {exercise.explanation}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExerciseQuestion;
