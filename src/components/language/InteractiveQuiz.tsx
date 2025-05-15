
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  type: "vocabulary" | "culture" | "phrase" | "listening";
}

interface InteractiveQuizProps {
  questions?: QuizQuestion[];
}

// Default questions
const defaultQuestions: QuizQuestion[] = [
  {
    id: "q1",
    type: "vocabulary",
    question: "Co znamená 'der Beruf'?",
    options: ["Počasí", "Zaměstnání", "Škola", "Jídlo"],
    correctAnswer: "Zaměstnání",
    explanation: "'Der Beruf' znamená povolání nebo zaměstnání."
  },
  {
    id: "q2",
    type: "culture",
    question: "Jakou barvu má německá vlajka?",
    options: ["Červená, bílá, modrá", "Černá, červená, žlutá", "Zelená, bílá, červená", "Modrá, bílá, červená"],
    correctAnswer: "Černá, červená, žlutá",
    explanation: "Německá vlajka má tři vodorovné pruhy - černý, červený a žlutý."
  },
  {
    id: "q3",
    type: "phrase",
    question: "Jak se správně řekne 'Jak se vám daří?' v němčině?",
    options: ["Wie heißt du?", "Woher kommst du?", "Wie geht es Ihnen?", "Wo wohnst du?"],
    correctAnswer: "Wie geht es Ihnen?",
    explanation: "'Wie geht es Ihnen?' je formální způsob, jak se zeptat 'Jak se vám daří?' v němčině."
  },
  {
    id: "q4",
    type: "vocabulary",
    question: "Co znamená 'das Wetter'?",
    options: ["Voda", "Vítr", "Počasí", "Týden"],
    correctAnswer: "Počasí",
    explanation: "'Das Wetter' znamená počasí."
  },
  {
    id: "q5",
    type: "culture",
    question: "Které z následujících měst je hlavním městem Německa?",
    options: ["Mnichov", "Hamburg", "Berlín", "Frankfurt"],
    correctAnswer: "Berlín",
    explanation: "Berlín je hlavní město Německa."
  }
];

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ questions = defaultQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedQuizType, setSelectedQuizType] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter questions by type if selected
  const filteredQuestions = selectedQuizType 
    ? questions.filter(q => q.type === selectedQuizType)
    : questions;

  // Get unique quiz types
  const quizTypes = Array.from(new Set(questions.map(q => q.type)));

  // Form schema
  const formSchema = z.object({
    answer: z.string().min(1, "Je potřeba vybrat odpověď")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  const startQuiz = (type: string | null = null) => {
    setSelectedQuizType(type);
    setCurrentQuestion(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
    setShowAnswer(false);
    form.reset();
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const current = filteredQuestions[currentQuestion];
    const isCorrect = values.answer === current.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Správně!",
        description: current.explanation || `Správná odpověď: ${current.correctAnswer}`,
      });
    } else {
      toast({
        title: "Bohužel ne",
        description: `Správná odpověď: ${current.correctAnswer}${current.explanation ? ` - ${current.explanation}` : ''}`,
        variant: "destructive",
      });
    }
    
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      form.reset();
    } else {
      // Quiz completed
      setQuizCompleted(true);
      toast({
        title: "Kvíz dokončen!",
        description: `Vaše skóre: ${score} z ${filteredQuestions.length}`,
      });
    }
  };

  if (!quizStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interaktivní kvíz</CardTitle>
          <CardDescription>Otestujte své znalosti němčiny</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Vyberte typ kvízu:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button onClick={() => startQuiz(null)} variant="default">
                  Všechny otázky ({questions.length})
                </Button>
                {quizTypes.map((type) => (
                  <Button 
                    key={type} 
                    onClick={() => startQuiz(type)} 
                    variant="outline"
                  >
                    {type === "vocabulary" && "Slovní zásoba"}
                    {type === "culture" && "Kultura"}
                    {type === "phrase" && "Fráze"}
                    {type === "listening" && "Poslech"}
                    {" "}({questions.filter(q => q.type === type).length})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kvíz dokončen!</CardTitle>
          <CardDescription>Vaše výsledky</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-4">
              Vaše skóre: {score} z {filteredQuestions.length}
            </h3>
            <p className="mb-6">
              {score === filteredQuestions.length 
                ? "Výborně! Získali jste plný počet bodů!" 
                : score >= filteredQuestions.length / 2 
                  ? "Dobrá práce! Zkuste to znovu pro lepší skóre." 
                  : "Zkuste to znovu a zlepšete svoje skóre."}
            </p>
            <div className="space-x-2">
              <Button onClick={() => startQuiz(selectedQuizType)}>
                Zkusit znovu
              </Button>
              <Button variant="outline" onClick={() => setQuizStarted(false)}>
                Změnit typ kvízu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = filteredQuestions[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Otázka {currentQuestion + 1}/{filteredQuestions.length}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Skóre: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
          </div>
        </div>
        <CardDescription>
          {currentQ.type === "vocabulary" && "Slovní zásoba"}
          {currentQ.type === "culture" && "Kultura"}
          {currentQ.type === "phrase" && "Fráze"}
          {currentQ.type === "listening" && "Poslech"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentQ.question}</h3>
              
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
                        {currentQ.options.map((option, index) => (
                          <div key={index} className={`flex items-center space-x-2 rounded-md border p-3 ${
                            showAnswer && option === currentQ.correctAnswer 
                              ? "border-green-500 bg-green-50" 
                              : showAnswer && field.value === option && option !== currentQ.correctAnswer
                                ? "border-red-500 bg-red-50"
                                : ""
                          }`}>
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              {!showAnswer ? (
                <Button type="submit" disabled={!form.formState.isValid}>
                  Zkontrolovat
                </Button>
              ) : (
                <Button type="button" onClick={nextQuestion}>
                  {currentQuestion < filteredQuestions.length - 1 ? "Další otázka" : "Dokončit kvíz"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InteractiveQuiz;
