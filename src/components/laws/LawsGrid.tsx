
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedLawCard from './enhanced/EnhancedLawCard';

interface LawsGridProps {
  laws: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    updated: string;
    iconName: string;
    iconColor: string;
    path: string;
  }>;
}

const LawsGrid: React.FC<LawsGridProps> = ({ laws }) => {
  if (laws.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-white/60 text-lg mb-2">Žádné zákony nenalezeny</div>
        <div className="text-white/40 text-sm">Zkuste změnit kategorii nebo vyhledávání</div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {laws.map((law, index) => (
        <EnhancedLawCard 
          key={law.id} 
          law={law} 
          index={index}
        />
      ))}
    </div>
  );
};

export default LawsGrid;
