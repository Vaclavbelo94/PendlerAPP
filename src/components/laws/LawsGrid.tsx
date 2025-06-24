
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EnhancedLawCard from './enhanced/EnhancedLawCard';
import { Law } from '@/types/laws';

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
  const { t } = useTranslation('laws');
  const navigate = useNavigate();

  const handleViewDetails = (law: Law) => {
    console.log('Navigating to law:', law.id);
    navigate(`/laws/${law.id}`);
  };

  if (laws.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-white/60 text-lg mb-2">{t('noLawsFound')}</div>
        <div className="text-white/40 text-sm">{t('tryChangeCategory')}</div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {laws.map((law, index) => {
        const lawData: Law = {
          id: law.id,
          title: law.title,
          summary: law.description,
          category: law.category,
          lastUpdated: law.updated,
          importance: 4,
          tags: [law.category],
          officialUrl: law.path
        };
        
        return (
          <EnhancedLawCard 
            key={law.id} 
            law={lawData} 
            index={index}
            onViewDetails={handleViewDetails}
          />
        );
      })}
    </div>
  );
};

export default LawsGrid;
