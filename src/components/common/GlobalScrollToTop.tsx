
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { cn } from '@/lib/utils';

interface GlobalScrollToTopProps {
  className?: string;
  threshold?: number;
}

export const GlobalScrollToTop: React.FC<GlobalScrollToTopProps> = ({ 
  className,
  threshold = 300 
}) => {
  const { showScrollTop, scrollToTop } = useScrollToTop(threshold);

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "md:bottom-8 md:right-8", // Větší spacing na desktopu
            className
          )}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3
          }}
        >
          <motion.button
            className={cn(
              "bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl",
              "p-3 md:p-4", // Responsive padding
              "hover:bg-primary/90 active:scale-95",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              // Mobile optimizations
              "min-h-[48px] min-w-[48px]", // Touch-friendly minimum size
              "touch-manipulation" // Disable double-tap zoom
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
