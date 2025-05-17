
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Star, Award, Gift, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

interface DailyChallengeProps {
  onComplete?: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ onComplete }) => {
  const [dailyChallenges, setDailyChallenges] = useState([
    {
      id: 1,
      title: "Opakuj 10 slovíček",
      description: "Procvič si 10 slovíček v sekci Slovíčka",
      progress: 6,
      total: 10,
      xpReward: 20,
      completed: false
    },
    {
      id: 2,
      title: "Dokončit 1 gramatické cvičení",
      description: "Procvič si německou gramatiku",
      progress: 0,
      total: 1,
      xpReward: 15,
      completed: false
    },
    {
      id: 3,
      title: "Nauč se 5 nových slovíček",
      description: "Přidej 5 nových slovíček do své sbírky",
      progress: 3, 
      total: 5,
      xpReward: 25,
      completed: false
    }
  ]);
  
  const [dailyStreakProgress, setDailyStreakProgress] = useState(60);
  const { toast } = useToast();
  const { theme } = useTheme();

  // Funkce pro dokončení úkolu
  const completeChallenge = (id: number) => {
    setDailyChallenges(prev => prev.map(challenge => 
      challenge.id === id ? 
      { ...challenge, progress: challenge.total, completed: true } : 
      challenge
    ));
    
    // Najít úkol pro notifikaci
    const challenge = dailyChallenges.find(c => c.id === id);
    if (challenge) {
      toast({
        title: "Úkol dokončen!",
        description: `Získáno +${challenge.xpReward} XP za dokončení denního úkolu`,
      });
      
      // Aktualizovat celkový denní progress
      updateDailyProgress();
      
      // Předat informaci o dokončení pokud je definováno
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Aktualizace celkového denního progressu
  const updateDailyProgress = () => {
    const totalChallenges = dailyChallenges.length;
    const completedChallenges = dailyChallenges.filter(c => c.completed).length + 1; // +1 pro právě dokončený
    const newProgress = Math.round((completedChallenges / totalChallenges) * 100);
    setDailyStreakProgress(newProgress);
    
    // Pokud jsou všechny úkoly splněny
    if (completedChallenges >= totalChallenges) {
      toast({
        title: "Všechny denní úkoly splněny!",
        description: "Gratulujeme! Získáváš bonus +30 XP za dokončení všech denních úkolů!",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
            <span>Denní výzvy</span>
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {dailyStreakProgress}% dokončeno
          </Badge>
        </div>
        <CardDescription>
          Dokončete denní výzvy pro získání XP a udržení série
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Celkový progress */}
        <div className="space-y-1">
          <Progress value={dailyStreakProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Denní progress</span>
            <span>{dailyStreakProgress}%</span>
          </div>
        </div>
        
        {/* Seznam denních úkolů */}
        <div className="space-y-3">
          {dailyChallenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`border rounded-md p-3 transition-colors ${
                challenge.completed ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-1 mt-0.5 ${
                    challenge.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                  }`}>
                    {challenge.completed ? (
                      <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Star className={`h-4 w-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{challenge.title}</div>
                    <div className="text-xs text-muted-foreground">{challenge.description}</div>
                  </div>
                </div>
                <Badge variant="secondary">+{challenge.xpReward} XP</Badge>
              </div>
              
              <div className="pl-7">
                <div className="flex justify-between items-center gap-4">
                  <Progress 
                    value={(challenge.progress / challenge.total) * 100} 
                    className="h-1.5 flex-1" 
                  />
                  <span className="text-xs font-medium min-w-[40px] text-right">
                    {challenge.progress}/{challenge.total}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  variant={challenge.completed ? "outline" : "default"} 
                  className={challenge.completed ? "pointer-events-none opacity-50" : ""}
                  onClick={() => completeChallenge(challenge.id)}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? 'Dokončeno' : 'Dokončit'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="text-sm">
          <span className="font-medium">Celková odměna:</span>
          <span> {dailyChallenges.reduce((sum, c) => sum + c.xpReward, 0) + 30} XP</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Gift className="h-4 w-4 text-primary" />
          <span>+30 XP bonus za dokončení všech úkolů</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DailyChallenge;
