
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Share2, Check, X, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { TestResult } from '@/types/language';

interface VocabularyTestResultsProps {
  results: TestResult;
  onRestart: () => void;
}

const VocabularyTestResults: React.FC<VocabularyTestResultsProps> = ({ results, onRestart }) => {
  const { toast } = useToast();
  
  // Výpočet skóre
  const score = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  
  // Výpočet doby trvání v sekundách
  const durationSeconds = Math.round(
    (results.endTime.getTime() - results.startTime.getTime()) / 1000
  );
  
  // Formátování doby trvání
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  // Získání hodnocení na základě skóre
  const getRating = (score: number) => {
    if (score >= 90) return { text: "Výborně!", variant: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
    if (score >= 75) return { text: "Velmi dobře!", variant: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
    if (score >= 60) return { text: "Dobře", variant: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" };
    if (score >= 40) return { text: "Ještě trochu procvičit", variant: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" };
    return { text: "Potřebujete více procvičovat", variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
  };
  
  const rating = getRating(score);
  
  // Funkce pro sdílení výsledků
  const handleShareResults = async () => {
    try {
      // Vytvoření textu pro sdílení
      const shareText = `Právě jsem dokončil/a test slovíček s výsledkem ${score}%! 
📊 ${results.correctAnswers} správně | ${results.wrongAnswers} špatně
⌛ Dokončeno za ${formatDuration(durationSeconds)}
#JazykováAplikace #TestSlovíček`;

      // Použití Web Share API, pokud je dostupné
      if (navigator.share) {
        await navigator.share({
          title: 'Moje výsledky testu slovíček',
          text: shareText
        });
        toast({
          title: "Sdíleno",
          description: "Vaše výsledky byly úspěšně sdíleny."
        });
      } else {
        // Fallback pokud Web Share API není podporováno
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Zkopírováno do schránky",
          description: "Text s výsledky byl zkopírován do schránky."
        });
      }
    } catch (error) {
      console.error('Chyba při sdílení:', error);
      toast({
        title: "Chyba při sdílení",
        description: "Nepodařilo se sdílet výsledky.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Výsledky testu</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-32 h-32 rounded-full flex items-center justify-center bg-primary/10 mb-2"
          >
            <span className="text-4xl font-bold">{score}%</span>
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${rating.variant}`}
          >
            {rating.text}
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xl font-bold">{results.correctAnswers}</span>
              </div>
              <span className="text-sm text-muted-foreground">Správně</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
              <div className="flex items-center">
                <X className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-xl font-bold">{results.wrongAnswers}</span>
              </div>
              <span className="text-sm text-muted-foreground">Špatně</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
              <div className="flex items-center">
                <span className="text-xl font-bold">{formatDuration(durationSeconds)}</span>
              </div>
              <span className="text-sm text-muted-foreground">Čas</span>
            </div>
          </div>
          
          {results.testItems.length > 0 && (
            <div className="w-full max-h-60 border rounded-md mt-6">
              <div className="text-sm font-medium p-3 border-b">
                Přehled otázek
              </div>
              <ScrollArea className="h-60">
                <div className="divide-y">
                  {results.testItems.map((testItem, index) => (
                    <div 
                      key={index}
                      className={`p-3 ${
                        testItem.wasCorrect 
                          ? 'bg-green-50 dark:bg-green-900/10' 
                          : 'bg-red-50 dark:bg-red-900/10'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {testItem.wasCorrect 
                            ? <Check className="h-4 w-4 text-green-600 mr-2" /> 
                            : <X className="h-4 w-4 text-red-600 mr-2" />
                          }
                          <span className="font-medium">{testItem.item.translation} → {testItem.item.word}</span>
                        </div>
                      </div>
                      
                      {!testItem.wasCorrect && (
                        <div className="text-sm mt-2">
                          <div className="text-muted-foreground">Vaše odpověď:</div>
                          <div className="font-medium text-red-600 dark:text-red-400">{testItem.userAnswer || "Bez odpovědi"}</div>
                          <div className="text-muted-foreground mt-1">Správná odpověď:</div>
                          <div className="font-medium text-green-600 dark:text-green-400">{testItem.item.word}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center gap-3">
        <Button onClick={onRestart} variant="outline" className="min-w-32">
          <RotateCcw className="h-4 w-4 mr-2" />
          Nový test
        </Button>
        
        <Button 
          onClick={handleShareResults} 
          className="min-w-32"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Sdílet
        </Button>
      </CardFooter>
    </>
  );
};

export default VocabularyTestResults;

