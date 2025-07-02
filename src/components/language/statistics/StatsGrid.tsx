
import React from 'react';
import { BookOpen, Star, Brain, Clock } from 'lucide-react';
import StatCard from './StatCard';

interface StatsGridProps {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  dueToday: number;
  masteryPercentage: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  totalWords,
  masteredWords,
  learningWords,
  dueToday,
  masteryPercentage
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard 
        icon={<BookOpen />} 
        iconBgClass="bg-primary/10" 
        iconColor="text-primary" 
        label="Celkem slovíček" 
        value={totalWords} 
      />
      
      <StatCard 
        icon={<Star />} 
        iconBgClass="bg-amber-500/10" 
        iconColor="text-amber-500" 
        label="Zvládnutá" 
        value={masteredWords} 
        badge={{
          text: `${Math.round(masteryPercentage)}% slovní zásoby`
        }}
      />
      
      <StatCard 
        icon={<Brain />} 
        iconBgClass="bg-blue-500/10" 
        iconColor="text-blue-500" 
        label="Učím se" 
        value={learningWords} 
      />
      
      <StatCard 
        icon={<Clock />} 
        iconBgClass="bg-green-500/10" 
        iconColor="text-green-500" 
        label="K opakování" 
        value={dueToday} 
      />
    </div>
  );
};

export default StatsGrid;
