
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, ArrowRight, Check } from "lucide-react";
import { VocabularyItem } from '@/models/VocabularyItem';
import { Badge } from "@/components/ui/badge";

interface VocabularyReviewProps {
  currentItem: VocabularyItem | null;
  dueItems: VocabularyItem[];
  completedToday: number;
  dailyGoal: number;
  onCorrect: (id: string) => void;
  onIncorrect: (id: string) => void;
  onNext: () => void;
}

const VocabularyReview: React.FC<VocabularyReviewProps> = ({
  currentItem,
  dueItems,
  completedToday,
  dailyGoal,
  onCorrect,
  onIncorrect,
  onNext,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  
  if (!currentItem) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Opakování slovíček</CardTitle>
          <CardDescription>Všechna slovíčka na dnes jsou hotová</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p>Gratulujeme! Dokončili jste všechna dnešní slovíčka.</p>
          <p className="text-muted-foreground mt-2">Vraťte se zítra pro další opakování.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="mb-2 flex justify-between text-sm">
              <span>Dokončeno dnes</span>
              <span className="font-medium">{completedToday}/{dailyGoal}</span>
            </div>
            <Progress value={(completedToday / dailyGoal) * 100} />
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Opakování slovíček</CardTitle>
            <CardDescription>
              Zbývá {dueItems.length} slovíček na dnes
            </CardDescription>
          </div>
          <Badge variant="outline">
            {currentItem.category || "Obecné"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-xl font-medium">{currentItem.word}</p>
            {currentItem.example && (
              <p className="text-sm italic text-muted-foreground">
                "{currentItem.example}"
              </p>
            )}
            
            {showTranslation ? (
              <div className="p-4 bg-muted/50 rounded-md mt-4">
                <p className="text-xl font-medium">{currentItem.translation}</p>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowTranslation(true)}
                className="mt-4"
              >
                Ukázat překlad
              </Button>
            )}
          </div>
          
          <div className="w-full">
            <div className="mb-2 flex justify-between text-sm">
              <span>Dokončeno dnes</span>
              <span className="font-medium">{completedToday}/{dailyGoal}</span>
            </div>
            <Progress value={(completedToday / dailyGoal) * 100} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between gap-4">
          {showTranslation ? (
            <>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onIncorrect(currentItem.id);
                  setShowTranslation(false);
                }}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Neznám
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  onCorrect(currentItem.id);
                  setShowTranslation(false);
                }}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Znám
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="ml-auto" 
              onClick={() => onNext()}
            >
              Přeskočit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VocabularyReview;
