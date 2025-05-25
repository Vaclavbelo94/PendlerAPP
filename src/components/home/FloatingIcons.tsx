
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  Calculator, 
  BookOpen, 
  Languages, 
  MapPin 
} from 'lucide-react';

export const FloatingIcons = () => {
  const icons = [
    { Icon: Car, delay: 0, x: 100, y: 50 },
    { Icon: Calendar, delay: 0.5, x: -80, y: 80 },
    { Icon: Calculator, delay: 1, x: 120, y: -60 },
    { Icon: BookOpen, delay: 1.5, x: -100, y: -40 },
    { Icon: Languages, delay: 2, x: 80, y: 100 },
    { Icon: MapPin, delay: 2.5, x: -120, y: 60 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute top-1/2 left-1/2 text-primary/20"
          initial={{ 
            opacity: 0, 
            x: 0, 
            y: 0,
            scale: 0.5 
          }}
          animate={{ 
            opacity: [0, 0.6, 0],
            x: [0, x, x * 1.5],
            y: [0, y, y * 1.5],
            scale: [0.5, 1, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}
    </div>
  );
};
