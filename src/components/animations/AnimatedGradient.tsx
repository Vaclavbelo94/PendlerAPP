import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ 
  children,
  className,
  duration = 10 
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10",
        className
      )}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 200%"
      }}
    >
      {children}
    </motion.div>
  );
};
