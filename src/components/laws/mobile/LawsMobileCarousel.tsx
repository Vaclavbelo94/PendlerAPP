
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { getLawCategories, getLawItems } from '@/data/lawsData';
import { useTranslation } from 'react-i18next';
import EnhancedLawCard from '../enhanced/EnhancedLawCard';
import { Law } from '@/types/laws';

interface LawsMobileCarouselProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const LawsMobileCarousel: React.FC<LawsMobileCarouselProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const { t } = useTranslation('laws');
  const navigate = useNavigate();
  const allCategories = [{ id: "all", label: t('allLaws'), iconName: "Scale" }, ...getLawCategories(t)];
  const categoryIds = allCategories.map(cat => cat.id);
  const currentIndex = allCategories.findIndex(cat => cat.id === activeCategory);

  const { containerRef } = useSwipeNavigation({
    items: categoryIds,
    currentItem: activeCategory,
    onItemChange: onCategoryChange,
    enabled: true
  });

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? allCategories.length - 1 : currentIndex - 1;
    onCategoryChange(allCategories[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % allCategories.length;
    onCategoryChange(allCategories[nextIndex].id);
  };

  const handleViewDetails = (law: Law) => {
    console.log('Mobile navigation to law:', law.id);
    navigate(`/laws/${law.id}`);
  };

  const lawItems = getLawItems(t);
  const filteredLaws = activeCategory === "all" 
    ? lawItems 
    : lawItems.filter(law => law.category === activeCategory);

  const currentCategory = allCategories[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={allCategories.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-white mb-1">
            {currentCategory?.label}
          </h2>
          <div className="flex justify-center space-x-1">
            {allCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => onCategoryChange(allCategories[index].id)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={allCategories.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {filteredLaws.map((law, index) => {
                const lawData: Law = {
                  id: law.id,
                  title: law.title,
                  summary: law.description,
                  category: law.category,
                  lastUpdated: law.updated,
                  importance: 4,
                  tags: [law.category]
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
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center text-sm text-white/70 px-4">
        {currentIndex + 1} z {allCategories.length} • {filteredLaws.length} {t('lawsCount')}
      </div>
    </div>
  );
};

export default LawsMobileCarousel;
