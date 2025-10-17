import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { springConfigs } from '@/lib/animations/springs';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  lift?: boolean;
  glow?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className,
  tilt = true,
  lift = true,
  glow = false
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      whileHover={lift ? { 
        y: -8,
        boxShadow: glow 
          ? "0 10px 40px hsl(var(--primary) / 0.2)" 
          : "0 10px 30px rgba(0,0,0,0.1)"
      } : {}}
      transition={springConfigs.gentle}
      className={cn("cursor-pointer", className)}
    >
      <Card className="h-full">
        {children}
      </Card>
    </motion.div>
  );
};
