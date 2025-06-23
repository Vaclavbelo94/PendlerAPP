import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TaxAdvisorMobileCarouselProps {
  items: Array<{
    id: string;
    label: string;
    component: React.ReactNode;
  }>;
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export const TaxAdvisorMobileCarousel: React.FC<TaxAdvisorMobileCarouselProps> = ({
  items,
  activeItem,
  onItemChange
}) => {
  const { t } = useTranslation('common');
  const itemIds = items.map(item => item.id);
  const { containerRef, currentIndex, canSwipeLeft, canSwipeRight } = useSwipeNavigation({
    items: itemIds,
    currentItem: activeItem,
    onItemChange,
    enabled: true
  });

  const currentItem = items.find(item => item.id === activeItem);
  
  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onItemChange(items[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    onItemChange(items[nextIndex].id);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Navigation arrows */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="p-2"
          aria-label={t('previous') || 'Předchozí'}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-center">
          {currentItem?.label}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="p-2"
          aria-label={t('next') || 'Další'}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-2">
          {items.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content with swipe animation */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentItem?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaxAdvisorMobileCarousel;
