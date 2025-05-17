
import React, { useState, useEffect } from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import VocabularyReviewCard from './VocabularyReviewCard';
import { Brain, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VocabularyItem } from '@/models/VocabularyItem';

interface VocabularyReviewProps {
  // No props needed as we're using the useSpacedRepetition hook directly
}

const VocabularyReview: React.FC<VocabularyReviewProps> = () => {
  const { toast } = useToast();
  const { 
    dueItems, 
    currentItem, 
    markCorrect, 
    markIncorrect, 
    goToNextItem,
    dailyGoal,
    completedToday,
    getStatistics
  } = useSpacedRepetition();
  
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!currentItem && dueItems.length === 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [currentItem, dueItems]);

  const handleStartReview = () => {
    if (dueItems.length > 0) {
      goToNextItem();
      setIsComplete(false);
    } else {
      toast({
        title: "Žádná slovíčka k opakování",
        description: "Momentálně nemáte žádná slovíčka k opakování.",
      });
    }
  };

  const goalProgress = Math.min((completedToday / Math.max(dailyGoal, 1)) * 100, 100);

  if (!currentItem) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Opakování slovíček</CardTitle>
          <CardDescription>
            {isComplete
              ? "Všechna slovíčka na dnešek jsou hotová. Skvělá práce!"
              : `Máte ${dueItems.length} slovíček k opakování.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {isComplete ? (
              <>
                <div className="rounded-full bg-green-100 p-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">Opakování dokončeno!</h3>
                  <p className="text-muted-foreground mt-1">
                    Dnes jste si zopakovali {completedToday} slovíček.
                    {dailyGoal > 0 && completedToday >= dailyGoal && " Splnili jste svůj denní cíl!"}
                  </p>
                </div>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Aktualizovat
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-6">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium">Připraveno k opakování</h3>
                  <p className="text-muted-foreground mt-1">
                    Máte {dueItems.length} slovíček k opakování. 
                    Pravidelné opakování vám pomůže efektivněji si zapamatovat slovní zásobu.
                  </p>
                </div>
                <Button onClick={handleStartReview}>
                  Začít opakování
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <VocabularyReviewCard
        item={currentItem}
        onCorrect={markCorrect}
        onIncorrect={markIncorrect}
        remainingItems={dueItems.length}
        totalItems={dueItems.length + 1} // Include current item
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Denní cíl: {completedToday}/{dailyGoal}</span>
            <span className="text-sm font-medium">{Math.round(goalProgress)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularyReview;
