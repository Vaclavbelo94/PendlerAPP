
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VocabularyItem } from '@/models/VocabularyItem';
import { Volume2, VolumeX, Check, X, Eye, EyeOff } from "lucide-react";
import { pronounceWord, pronounceCzech } from './utils/pronunciationHelper';

interface VocabularyReviewCardProps {
  item: VocabularyItem;
  onCorrect: () => void;
  onIncorrect: () => void;
  remainingItems: number;
  totalItems: number;
  currentStreak: number;
}

const VocabularyReviewCard: React.FC<VocabularyReviewCardProps> = ({
  item,
  onCorrect,
  onIncorrect,
  remainingItems,
  totalItems,
  currentStreak
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    setShowAnswer(false);
    setUserAnswer('');
    onCorrect();
  };

  const handleIncorrect = () => {
    setShowAnswer(false);
    setUserAnswer('');
    onIncorrect();
  };

  const progress = ((totalItems - remainingItems) / totalItems) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Procvičování</CardTitle>
            {currentStreak > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                🔥 {currentStreak}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {totalItems - remainingItems + 1} / {totalItems}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl font-bold">{item.word}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => pronounceWord(item.word)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
            
            {item.category && (
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            Jak se to řekne česky?
          </p>
        </div>

        {/* Answer section */}
        {!showAnswer ? (
          <div className="space-y-4">
            <Button
              onClick={handleShowAnswer}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Zobrazit odpověď
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <p className="text-xl font-semibold">{item.translation}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => pronounceCzech(item.translation)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              
              {item.example && (
                <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                  <p className="font-medium mb-1">Příklad:</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="italic">"{item.example}"</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => pronounceWord(item.example)}
                      className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Response buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleIncorrect}
                variant="outline"
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Nevěděl jsem
              </Button>
              <Button
                onClick={handleCorrect}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Věděl jsem
              </Button>
            </div>
          </div>
        )}

        {/* Progress info */}
        <div className="text-center text-sm text-muted-foreground">
          Zbývá {remainingItems} slovíček
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularyReviewCard;
