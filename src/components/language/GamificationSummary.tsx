
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Gift, BadgeCheck, CirclePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

const GamificationSummary = () => {
  const [xp, setXp] = useState(75);
  const [level, setLevel] = useState(2);
  const [streak, setStreak] = useState(4);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // XP required for next level
  const xpForNextLevel = level * 100;
  
  // Daily and weekly rewards progress
  const dailyRewardProgress = dailyGoalCompleted ? 100 : 45;
  const weeklyChallenge = {
    name: "Němčina každý den",
    progress: 4,
    total: 7,
    xpReward: 100
  };
  
  // Achievements display
  const recentAchievements = [
    {
      name: "3 dny v řadě",
      icon: <Trophy className={`h-6 w-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />,
      date: "Dnes"
    },
    {
      name: "První kvíz",
      icon: <BadgeCheck className={`h-6 w-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} />,
      date: "Včera"
    }
  ];

  // Earn XP function
  const earnXp = (amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      
      // Check if should level up
      if (newXp >= xpForNextLevel) {
        toast({
          title: "Nová úroveň!",
          description: `Gratulujeme, dosáhli jste úrovně ${level + 1}!`,
        });
        setLevel(level + 1);
        return newXp - xpForNextLevel;
      }
      return newXp;
    });
    
    toast({
      title: "Získáno XP!",
      description: `+${amount} XP za vaši aktivitu`,
    });
    
    // Update daily goal if not completed
    if (!dailyGoalCompleted) {
      setDailyGoalCompleted(true);
      setStreak(prev => prev + 1);
      toast({
        title: "Denní cíl splněn!",
        description: `Série ${streak + 1} dnů! Přijďte zítra pro další odměny.`,
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
            <span>Váš pokrok</span>
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            Úroveň {level}
          </Badge>
        </div>
        <CardDescription>
          Sledujte svůj pokrok ve výuce německého jazyka
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* XP Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span>XP: {xp}/{xpForNextLevel}</span>
              <span>{Math.round((xp / xpForNextLevel) * 100)}%</span>
            </div>
            <Progress value={(xp / xpForNextLevel) * 100} className="h-2" />
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            {/* Daily Streak */}
            <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Star className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
              </div>
              <div>
                <div className="font-medium">{streak} dní</div>
                <div className="text-xs text-muted-foreground">v řadě</div>
              </div>
            </div>
            
            {/* Daily Goal */}
            <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
              <div className={`rounded-full p-1.5 ${dailyGoalCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted'}`}>
                {dailyGoalCompleted ? (
                  <BadgeCheck className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                ) : (
                  <CirclePlus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="font-medium">{dailyGoalCompleted ? 'Splněno' : 'Denní cíl'}</div>
                <div className="text-xs text-muted-foreground">
                  {dailyGoalCompleted ? 'Přijďte zítra' : 'Dokončete lekci'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Weekly Challenge */}
          <div className="border rounded-md p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-1.5">
                <Award className={`h-4 w-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                {weeklyChallenge.name}
              </span>
              <Badge variant="secondary" className="font-normal">
                +{weeklyChallenge.xpReward} XP
              </Badge>
            </div>
            <Progress 
              value={(weeklyChallenge.progress / weeklyChallenge.total) * 100} 
              className="h-2" 
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{weeklyChallenge.progress} z {weeklyChallenge.total} dnů</span>
              <span>{weeklyChallenge.total - weeklyChallenge.progress} dnů zbývá</span>
            </div>
          </div>
          
          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Nedávné úspěchy</h4>
              <div className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 bg-primary/5 rounded-md p-2">
                    <div className="bg-primary/10 rounded-full p-1">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Akce */}
          <div className="flex justify-end">
            <Button onClick={() => earnXp(25)} size="sm">
              <Gift className="mr-1 h-4 w-4" />
              Získat XP
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummary;
