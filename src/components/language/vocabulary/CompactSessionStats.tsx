
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, Zap, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompactSessionStatsProps {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
  streakCount?: number;
}

const CompactSessionStats: React.FC<CompactSessionStatsProps> = ({
  startTime,
  correctCount,
  incorrectCount,
  reviewedWords,
  streakCount,
}) => {
  // Calculate session duration
  const durationMinutes = Math.max(
    1, 
    Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)
  );
  
  // Calculate accuracy
  const totalAnswers = correctCount + incorrectCount;
  const accuracy = totalAnswers > 0 
    ? Math.round((correctCount / totalAnswers) * 100) 
    : 0;
    
  // Calculate points
  const points = correctCount * 10 - incorrectCount * 3 + (streakCount || 0) * 5;

  // Check for any notable achievements
  const hasNotableAchievement = accuracy >= 90 || (streakCount && streakCount >= 5) || reviewedWords.length >= 15;
  
  // Define achievement badges
  const getAchievementBadge = () => {
    if (accuracy === 100 && totalAnswers >= 5) {
      return { 
        title: "Perfektní úspěšnost!", 
        icon: <Star className="h-3 w-3 mr-1 text-amber-500" />,
        color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      };
    } else if (streakCount && streakCount >= 8) {
      return { 
        title: "Skvělá série!", 
        icon: <Award className="h-3 w-3 mr-1 text-purple-500" />,
        color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      };
    } else if (reviewedWords.length >= 20) {
      return { 
        title: "Jazykový maraton!", 
        icon: <Zap className="h-3 w-3 mr-1 text-blue-500" />,
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      };
    } else if (accuracy >= 90) {
      return { 
        title: "Skvělý výkon!", 
        icon: <Award className="h-3 w-3 mr-1" />,
        color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      };
    }
    
    return null;
  };
  
  const achievementBadge = getAchievementBadge();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{durationMinutes} min</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{correctCount}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">{incorrectCount}</span>
            </div>
            
            <div className="text-sm font-medium">
              {accuracy}% úspěšnost
            </div>
            
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{points}</span>
            </motion.div>
            
            {achievementBadge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`text-xs flex items-center px-2 py-1 ${achievementBadge.color} rounded`}
              >
                {achievementBadge.icon}
                <span>{achievementBadge.title}</span>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSessionStats;
