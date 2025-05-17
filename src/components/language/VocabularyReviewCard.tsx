
import React, { useState } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Repeat, ThumbsUp, Eye } from 'lucide-react';

interface VocabularyReviewCardProps {
  item: VocabularyItem;
  onCorrect: (id: string) => void;
  onIncorrect: (id: string) => void;
  remainingItems: number;
  totalItems: number;
}

const VocabularyReviewCard: React.FC<VocabularyReviewCardProps> = ({
  item,
  onCorrect,
  onIncorrect,
  remainingItems,
  totalItems,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    
    // Use a short delay before moving to the next card
    setTimeout(() => {
      if (correct) {
        onCorrect(item.id);
      } else {
        onIncorrect(item.id);
      }
      
      // Reset state for the next card
      setShowAnswer(false);
      setAnswered(false);
      setIsCorrect(null);
    }, 1000);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progress = totalItems > 0 ? ((totalItems - remainingItems) / totalItems) * 100 : 0;

  return (
    <Card className={`transition-all duration-300 ${
      answered ? (isCorrect ? 'border-green-400 shadow-green-100' : 'border-red-400 shadow-red-100') : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {item.word}
          </CardTitle>
          <Badge variant="outline" className={`${getDifficultyColor(item.difficulty)} capitalize`}>
            {item.difficulty || 'nespecifikováno'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {item.category || 'Obecná kategorie'}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {showAnswer ? (
          <div className="space-y-4">
            <div className="text-xl font-semibold">{item.translation}</div>
            {item.example && (
              <div className="text-sm italic text-muted-foreground border-l-4 pl-3 py-1 border-primary/20">
                {item.example}
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
            <span>Postup {totalItems - remainingItems} z {totalItems}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
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
                      <Repeat className="mr-2 h-5 w-5" /> Příště to zvládnete!
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

export default VocabularyReviewCard;
