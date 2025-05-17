
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Zap } from 'lucide-react';
import SessionStats from './SessionStats';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ReviewCompleteProps {
  completedToday: number;
  dailyGoal: number;
  sessionStats: {
    startTime: Date;
    correctCount: number;
    incorrectCount: number;
    reviewedWords: string[];
    completionTime?: Date;
    averageResponseTime?: number;
    streakCount?: number;
  };
  onRefresh: () => void;
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({
  completedToday,
  dailyGoal,
  sessionStats,
  onRefresh
}) => {
  // Výpočet bodů
  const points = sessionStats.correctCount * 10 - 
                sessionStats.incorrectCount * 3 + 
                (sessionStats.streakCount || 0) * 5;

  // Určení, zda byl splněn denní cíl
  const isGoalMet = dailyGoal > 0 && completedToday >= dailyGoal;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pt-6">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="rounded-full bg-green-100 p-6 mb-4"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Opakování dokončeno!</h3>
          <p className="text-muted-foreground mt-1">
            Dnes jste si zopakovali {completedToday} slovíček.
            {isGoalMet && " Splnili jste svůj denní cíl!"}
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-center"
          >
            <div className="bg-amber-100 rounded-full py-1 px-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-lg">{points} bodů</span>
            </div>
          </motion.div>
          
          {isGoalMet && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mt-3"
            >
              <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full py-1 px-3 gap-1">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">+50 bodů za splnění denního cíle!</span>
              </div>
            </motion.div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Session stats display when complete */}
        {sessionStats.reviewedWords.length > 0 && (
          <SessionStats {...sessionStats} />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center gap-3 pb-6">
        <Button onClick={onRefresh} variant="outline" className="min-w-32">
          Aktualizovat
        </Button>
        {sessionStats.reviewedWords.length > 5 && (
          <Button variant="default" className="min-w-32">
            Sdílet výsledek
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewComplete;
