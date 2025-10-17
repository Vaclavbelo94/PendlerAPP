import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransitionVariants } from '@/lib/animations/variants';
import { easings } from '@/lib/animations/easings';

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  direction = 'left',
  duration = 0.3 
}) => {
  const getVariants = () => {
    const offset = 20;
    switch (direction) {
      case 'left':
        return {
          initial: { opacity: 0, x: offset },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -offset }
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -offset },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: offset }
        };
      case 'up':
        return {
          initial: { opacity: 0, y: offset },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -offset }
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -offset },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: offset }
        };
      default:
        return pageTransitionVariants;
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration, ease: easings.easeInOut }}
    >
      {children}
    </motion.div>
  );
};
