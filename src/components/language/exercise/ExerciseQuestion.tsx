
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Check } from "lucide-react";
import { Exercise } from "@/data/germanExercises";

interface ExerciseQuestionProps {
  exercise: Exercise;
  form: UseFormReturn<{answer?: string}, any>; // Changed from {answer: string} to {answer?: string}
  showAnswer: boolean;
}

const ExerciseQuestion: React.FC<ExerciseQuestionProps> = ({ 
  exercise, 
  form, 
  showAnswer 
}) => {
  return (
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
  );
};

export default ExerciseQuestion;
