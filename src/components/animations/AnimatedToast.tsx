import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { springConfigs } from '@/lib/animations/springs';

interface AnimatedToastProps {
  children: React.ReactNode;
  isVisible: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  children,
  isVisible,
  position = 'bottom',
  className
}) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: position === 'top' ? -50 : 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={springConfigs.wobbly}
          className={cn(
            "fixed z-50",
            position === 'top' ? 'top-4' : 'bottom-4',
            "left-1/2 -translate-x-1/2",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
