
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetConfig } from './types';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import DashboardCard from '../DashboardCard';
import { getWidgetComponent } from './EnhancedWidgetRegistry';

interface MobileDashboardCarouselProps {
  widgets: WidgetConfig[];
}

export const MobileDashboardCarousel: React.FC<MobileDashboardCarouselProps> = ({ widgets }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const widgetIds = widgets.map(w => w.id);
  const currentWidget = widgets[currentIndex];

  const { containerRef } = useSwipeNavigation({
    items: widgetIds,
    currentItem: widgetIds[currentIndex],
    onItemChange: (id) => {
      const index = widgets.findIndex(w => w.id === id);
      if (index !== -1) setCurrentIndex(index);
    },
    enabled: true
  });

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? widgets.length - 1 : prev - 1);
  }, [widgets.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev === widgets.length - 1 ? 0 : prev + 1);
  }, [widgets.length]);

  if (!currentWidget) return null;

  const WidgetComponent = getWidgetComponent(currentWidget.type);

  return (
    <div className="space-y-4">
      {/* Navigation header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={widgets.length <= 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {widgets.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={widgets.length <= 1}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Widget carousel */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWidget.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <DashboardCard
              title={currentWidget.title}
              description={currentWidget.description}
            >
              {WidgetComponent && <WidgetComponent />}
            </DashboardCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Widget counter */}
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} z {widgets.length}
      </div>
    </div>
  );
};
