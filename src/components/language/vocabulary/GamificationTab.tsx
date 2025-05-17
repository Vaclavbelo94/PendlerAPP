
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VocabularyItem } from '@/models/VocabularyItem';
import { Trophy, Award, Star, Book, Medal, CheckSquare, Flag, BookCheck } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface GamificationTabProps {
  userProgress: {
    totalReviewed: number;
    streakDays: number;
    averageAccuracy: number;
    dailyStats: any[];
    categoryDistribution: {
      [category: string]: number;
    };
  };
  vocabularyItems: VocabularyItem[];
  dailyGoal?: number;
  completedToday?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (data: any) => boolean;
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
}

const GamificationTab: React.FC<GamificationTabProps> = ({ 
  userProgress,
  vocabularyItems,
  dailyGoal = 10,
  completedToday = 0
}) => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { theme } = useTheme();

  // Calculate level and experience based on user's progress
  useEffect(() => {
    // Simple level calculation algorithm
    // Level is based on total vocabulary items reviewed
    const calculatedLevel = Math.floor(userProgress.totalReviewed / 10) + 1;
    const calculatedExp = userProgress.totalReviewed % 10;
    const expToNextLevel = 10; // Fixed exp per level
    
    setLevel(calculatedLevel);
    setExperience((calculatedExp / expToNextLevel) * 100);
    
    // Calculate achievements
    const calculatedAchievements: Achievement[] = [
      {
        id: 'vocabulary-beginner',
        name: 'Začátečník',
        description: 'Naučte se 10 nových slovíček',
        icon: <BookCheck className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />,
        condition: (data) => data.vocabularyItems.length >= 10,
        progress: Math.min(vocabularyItems.length, 10),
        maxProgress: 10,
        unlocked: vocabularyItems.length >= 10
      },
      {
        id: 'vocabulary-intermediate',
        name: 'Pokročilý',
        description: 'Naučte se 50 nových slovíček',
        icon: <Book className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />,
        condition: (data) => data.vocabularyItems.length >= 50,
        progress: Math.min(vocabularyItems.length, 50),
        maxProgress: 50,
        unlocked: vocabularyItems.length >= 50
      },
      {
        id: 'vocabulary-advanced',
        name: 'Expert',
        description: 'Naučte se 200 nových slovíček',
        icon: <Trophy className={`h-8 w-8 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />,
        condition: (data) => data.vocabularyItems.length >= 200,
        progress: Math.min(vocabularyItems.length, 200),
        maxProgress: 200,
        unlocked: vocabularyItems.length >= 200
      },
      {
        id: 'accuracy-novice',
        name: 'Přesnost začátečníka',
        description: 'Dosáhněte přesnosti 70% při opakování',
        icon: <CheckSquare className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
        condition: (data) => data.userProgress.averageAccuracy >= 70,
        progress: Math.min(userProgress.averageAccuracy, 70),
        maxProgress: 70,
        unlocked: userProgress.averageAccuracy >= 70
      },
      {
        id: 'accuracy-master',
        name: 'Mistr přesnosti',
        description: 'Dosáhněte přesnosti 90% při opakování',
        icon: <Medal className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />,
        condition: (data) => data.userProgress.averageAccuracy >= 90,
        progress: Math.min(userProgress.averageAccuracy, 90),
        maxProgress: 90,
        unlocked: userProgress.averageAccuracy >= 90
      },
      {
        id: 'streak-beginner',
        name: 'Učenlivý',
        description: 'Učte se 3 dny v řadě',
        icon: <Flag className={`h-8 w-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />,
        condition: (data) => data.userProgress.streakDays >= 3,
        progress: Math.min(userProgress.streakDays, 3),
        maxProgress: 3,
        unlocked: userProgress.streakDays >= 3
      },
      {
        id: 'streak-advanced',
        name: 'Vytrvalý',
        description: 'Učte se 7 dní v řadě',
        icon: <Award className={`h-8 w-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />,
        condition: (data) => data.userProgress.streakDays >= 7,
        progress: Math.min(userProgress.streakDays, 7),
        maxProgress: 7,
        unlocked: userProgress.streakDays >= 7
      },
      {
        id: 'category-collector',
        name: 'Sběratel kategorií',
        description: 'Přidejte slovíčka v 5 různých kategoriích',
        icon: <Star className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />,
        condition: (data) => Object.keys(data.userProgress.categoryDistribution).length >= 5,
        progress: Math.min(Object.keys(userProgress.categoryDistribution).length, 5),
        maxProgress: 5,
        unlocked: Object.keys(userProgress.categoryDistribution).length >= 5
      }
    ];
    
    setAchievements(calculatedAchievements);
  }, [userProgress, vocabularyItems, theme, dailyGoal, completedToday]);
  
  // Calculate rewards for unlocking achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  
  // Calculate streak information
  const streakProgress = userProgress.streakDays % 7;
  const streakProgressPercent = (streakProgress / 7) * 100;
  
  return (
    <div className="space-y-8">
      {/* Level and Experience */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Trophy className={`mr-2 h-6 w-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
              Úroveň {level}
            </div>
          </CardTitle>
          <CardDescription>Vaše dovednosti v německém jazyce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Zkušenosti</span>
              <span>Další úroveň</span>
            </div>
            <Progress value={experience} />
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold">{userProgress.totalReviewed}</div>
                <div className="text-xs text-muted-foreground">opakování</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold">{userProgress.streakDays}</div>
                <div className="text-xs text-muted-foreground">dní v řadě</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl font-bold">{userProgress.averageAccuracy}%</div>
                <div className="text-xs text-muted-foreground">přesnost</div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Streak */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Flag className={`mr-2 h-6 w-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} />
              Denní série
            </div>
          </CardTitle>
          <CardDescription>{userProgress.streakDays} dní v řadě</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Série tento týden</span>
              <span>{streakProgress}/7 dní</span>
            </div>
            <Progress value={streakProgressPercent} />
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center border
                    ${i < streakProgress 
                      ? (theme === 'dark' ? 'bg-orange-800 border-orange-700' : 'bg-orange-200 border-orange-300') 
                      : 'bg-muted border-muted-foreground/20'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div>
                <div className="text-sm font-medium">Dnešní cíl</div>
                <div className="text-xs text-muted-foreground">
                  {completedToday}/{dailyGoal} slovíček
                </div>
              </div>
              <Progress 
                value={(completedToday / dailyGoal) * 100} 
                className="w-1/2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Medal className={`mr-2 h-6 w-6 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} />
                Odznaky
              </div>
              <Badge variant="secondary" className="ml-2">
                {unlockedAchievements}/{totalAchievements}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Odemkněte odznaky za splnění výzev
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <Card 
                key={achievement.id}
                className={`border p-4 transition-colors ${
                  achievement.unlocked 
                    ? theme === 'dark' 
                      ? 'border-amber-700 bg-amber-950/20' 
                      : 'border-amber-200 bg-amber-50' 
                    : 'opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-2">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      {achievement.unlocked && (
                        <Badge variant="outline" className={`${theme === 'dark' ? 'border-amber-400 text-amber-400' : 'border-amber-500 text-amber-500'}`}>
                          Odemčeno
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                      <>
                        <div className="flex justify-between mt-2 mb-1 text-xs font-medium">
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                          <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
