
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { Eye, CheckCircle, XCircle, ThumbsUp } from "lucide-react";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

const VocabularyReview: React.FC = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const { 
    dueItems, 
    currentItem, 
    markCorrect, 
    markIncorrect, 
    goToNextItem,
    dailyGoal,
    completedToday
  } = useSpacedRepetition();
  
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    
    // Použít krátké zpoždění před přechodem na další kartu
    setTimeout(() => {
      if (correct) {
        markCorrect(currentItem!.id);
      } else {
        markIncorrect(currentItem!.id);
      }
      
      goToNextItem();
      
      // Reset stavu pro další kartu
      setShowAnswer(false);
      setAnswered(false);
      setIsCorrect(null);
    }, 1000);
  };
  
  if (!currentItem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opakování slovíček</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {dueItems.length === 0 && completedToday >= dailyGoal
              ? "Splnili jste denní cíl! Gratuluji."
              : dueItems.length === 0
              ? "Momentálně nejsou k dispozici žádná slovíčka k opakování."
              : ""}
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Denní cíl:</span>
              <span>{completedToday} / {dailyGoal}</span>
            </div>
            <Progress value={(completedToday / dailyGoal) * 100} />
          </div>
          
          <Button 
            disabled={dueItems.length === 0}
            onClick={() => goToNextItem()}
          >
            {dueItems.length > 0 ? `Začít opakování (${dueItems.length} slovíček)` : "Žádná slovíčka k opakování"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{currentItem.word}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {currentItem.category || 'Obecná kategorie'}
        </p>
      </CardHeader>
      <CardContent>
        {showAnswer ? (
          <div className="space-y-4 mb-6">
            <div className="text-xl font-semibold">{currentItem.translation}</div>
            {currentItem.example && (
              <div className="text-sm italic text-muted-foreground">
                {currentItem.example}
              </div>
            )}
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-md">
            <Button 
              variant="ghost" 
              onClick={handleShowAnswer}
              className="flex items-center gap-2"
            >
              <Eye size={18} />
              Zobrazit překlad
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Dnešní pokrok</span>
            <span>{completedToday} / {dailyGoal}</span>
          </div>
          <Progress value={(completedToday / dailyGoal) * 100} className="h-1" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          {showAnswer && !answered ? (
            <>
              <Button 
                variant="outline" 
                className="border-red-200 hover:bg-red-50 hover:text-red-600 w-1/2 mr-2"
                onClick={() => handleAnswer(false)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Špatně
              </Button>
              <Button 
                variant="outline" 
                className="border-green-200 hover:bg-green-50 hover:text-green-600 w-1/2"
                onClick={() => handleAnswer(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Správně
              </Button>
            </>
          ) : (
            <div className="flex w-full justify-center">
              {answered ? (
                <div className="text-center animate-pulse">
                  {isCorrect ? (
                    <div className="text-green-600 flex items-center">
                      <ThumbsUp className="mr-2 h-5 w-5" /> Výborně!
                    </div>
                  ) : (
                    <div className="text-red-600 flex items-center">
                      <XCircle className="mr-2 h-5 w-5" /> Příště to zvládnete!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Klikněte na "Zobrazit překlad" pro pokračování
                </div>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VocabularyReview;
