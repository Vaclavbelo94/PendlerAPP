import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { springConfigs } from '@/lib/animations/springs';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  animationType?: 'scale' | 'lift' | 'glow' | 'ripple';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  animationType = 'scale',
  className,
  ...props 
}) => {
  const getAnimationProps = () => {
    switch (animationType) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          transition: springConfigs.wobbly
        };
      case 'lift':
        return {
          whileHover: { y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
          whileTap: { y: 0 },
          transition: springConfigs.gentle
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: "0 0 20px hsl(var(--primary) / 0.5)",
            scale: 1.02
          },
          whileTap: { scale: 0.98 },
          transition: springConfigs.smooth
        };
      case 'ripple':
        return {
          whileTap: { scale: 0.95 },
          transition: springConfigs.stiff
        };
      default:
        return {};
    }
  };

  return (
    <motion.div {...getAnimationProps()}>
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};
