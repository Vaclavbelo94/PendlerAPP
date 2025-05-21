
import React from 'react';
import { motion } from "framer-motion";
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/models/VocabularyItem';

interface DayDetailProps {
  selectedDay: Date;
  selectedDayStats: DailyProgressStat;
}

const DayDetail: React.FC<DayDetailProps> = ({ selectedDay, selectedDayStats }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 pt-4 border-t"
    >
      <div className="text-sm">
        <div className="font-medium mb-2">
          {format(selectedDay, 'EEEE d. MMMM yyyy', { locale: cs })}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Celkem</div>
            <div className="font-medium">{selectedDayStats.wordsReviewed}</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Správně</div>
            <div className="font-medium">{selectedDayStats.correctCount}</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
            <div className="text-xs text-muted-foreground">Chybně</div>
            <div className="font-medium">{selectedDayStats.incorrectCount}</div>
          </div>
        </div>
        {selectedDayStats.wordsReviewed > 0 ? (
          <div className="mt-2 text-center text-xs">
            Úspěšnost: <span className="font-medium">
              {Math.round((selectedDayStats.correctCount / selectedDayStats.wordsReviewed) * 100)}%
            </span>
          </div>
        ) : (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Žádná aktivita tento den
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DayDetail;
