
import React, { useState, useEffect } from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import VocabularyReviewCard from './VocabularyReviewCard';
import { Brain, CheckCircle2, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VocabularyItem } from '@/models/VocabularyItem';

interface VocabularyReviewProps {
  // No props needed as we're using the useSpacedRepetition hook directly
}

interface SessionStats {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
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
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    startTime: new Date(),
    correctCount: 0,
    incorrectCount: 0,
    reviewedWords: []
  });

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
      // Reset session stats when starting a new review
      setSessionStats({
        startTime: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        reviewedWords: []
      });
    } else {
      toast({
        title: "Žádná slovíčka k opakování",
        description: "Momentálně nemáte žádná slovíčka k opakování.",
      });
    }
  };

  const handleCorrect = (itemId: string) => {
    setSessionStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + 1,
      reviewedWords: [...prev.reviewedWords, itemId]
    }));
    markCorrect(itemId);
  };

  const handleIncorrect = (itemId: string) => {
    setSessionStats(prev => ({
      ...prev,
      incorrectCount: prev.incorrectCount + 1,
      reviewedWords: [...prev.reviewedWords, itemId]
    }));
    markIncorrect(itemId);
  };

  // Calculate session duration in minutes
  const getSessionDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - sessionStats.startTime.getTime();
    return Math.round(diffMs / 60000); // Convert to minutes
  };

  // Calculate words per minute rate
  const getWordsPerMinute = () => {
    const duration = getSessionDuration();
    if (duration === 0) return 0;
    return ((sessionStats.correctCount + sessionStats.incorrectCount) / duration).toFixed(1);
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
                
                {/* Session stats display when complete */}
                {sessionStats.reviewedWords.length > 0 && (
                  <Card className="w-full bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-md">Statistika sezení</CardTitle>
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Délka sezení:</p>
                          <p className="font-medium">{getSessionDuration()} minut</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Slovíčka:</p>
                          <p className="font-medium">{sessionStats.reviewedWords.length} slov</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Správně:</p>
                          <p className="font-medium text-green-600">{sessionStats.correctCount} slov</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Nesprávně:</p>
                          <p className="font-medium text-red-600">{sessionStats.incorrectCount} slov</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <p className="text-muted-foreground">Tempo:</p>
                          <p className="font-medium">{getWordsPerMinute()} slov/min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
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
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
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

      {/* Current session stats */}
      {sessionStats.reviewedWords.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Aktuální sezení</span>
              <span className="text-xs text-muted-foreground">{getSessionDuration()} min</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <span className="text-xs text-green-600 mr-1">Správně:</span>
                  <span className="text-sm font-medium">{sessionStats.correctCount}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-red-600 mr-1">Nesprávně:</span>
                  <span className="text-sm font-medium">{sessionStats.incorrectCount}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Tempo</div>
                <div className="text-lg font-semibold">{getWordsPerMinute()}</div>
                <div className="text-xs text-muted-foreground">slov/min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VocabularyReview;
