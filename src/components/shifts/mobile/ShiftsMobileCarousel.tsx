
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';
import ShiftsCalendar from '../ShiftsCalendar';
import ShiftsAnalytics from '../ShiftsAnalytics';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface ShiftsMobileCarouselProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  shifts?: Shift[];
  isLoading?: boolean;
}

export const ShiftsMobileCarousel: React.FC<ShiftsMobileCarouselProps> = ({
  activeSection,
  onSectionChange,
  shifts = [],
  isLoading = false
}) => {
  const { t } = useTranslation('shifts');

  const sections = [
    { id: 'calendar', label: t('calendar'), icon: Calendar },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 }
  ];

  const sectionIds = sections.map(section => section.id);
  const currentIndex = sections.findIndex(section => section.id === activeSection);

  const { containerRef } = useSwipeNavigation({
    items: sectionIds,
    currentItem: activeSection,
    onItemChange: onSectionChange,
    enabled: true
  });

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    onSectionChange(sections[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % sections.length;
    onSectionChange(sections[nextIndex].id);
  };

  const renderSectionContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'calendar':
        return <ShiftsCalendar />;
      case 'analytics':
        return <ShiftsAnalytics shifts={shifts} />;
      default:
        return <ShiftsCalendar />;
    }
  };

  const currentSection = sections[currentIndex];
  const Icon = currentSection?.icon || Calendar;

  return (
    <div className="space-y-4">
      {/* Section Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={sections.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {currentSection?.label}
            </h2>
          </div>
          <div className="flex justify-center space-x-1">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => onSectionChange(sections[index].id)}
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
          disabled={sections.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Section Content with Animation */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section info */}
      <div className="text-center text-sm text-white/70 px-4">
        {currentIndex + 1} z {sections.length} • {currentSection?.label}
        {!isLoading && shifts.length > 0 && (
          <span className="ml-2">({shifts.length} {t('shifts')})</span>
        )}
      </div>
    </div>
  );
};

export default ShiftsMobileCarousel;
