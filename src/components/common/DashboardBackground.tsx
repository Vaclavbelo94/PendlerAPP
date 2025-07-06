
import React from 'react';
import { motion } from 'framer-motion';
import { useDHLThemeContext } from '@/contexts/DHLThemeContext';
import { DHLLogoWatermark } from './DHLLogoWatermark';

interface DashboardBackgroundProps {
  children: React.ReactNode;
  variant?: 'laws' | 'travel' | 'shifts' | 'default';
}

export const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  const { isDHLThemeActive } = useDHLThemeContext();
  const getGradientByVariant = () => {
    if (isDHLThemeActive) {
      // DHL specific gradients with yellow and red
      switch (variant) {
        case 'laws':
          return 'from-background via-background/95 to-primary/15';
        case 'travel':
          return 'from-background via-background/95 to-secondary/10';
        case 'shifts':
          return 'from-background via-background/95 to-primary/12';
        default:
          return 'from-background via-background/95 to-primary/10';
      }
    }
    
    // Standard gradients
    switch (variant) {
      case 'laws':
        return 'from-background via-background/95 to-primary/10';
      case 'travel':
        return 'from-background via-background/95 to-secondary/10';
      case 'shifts':
        return 'from-background via-background/95 to-primary/5';
      default:
        return 'from-background via-background/95 to-primary/8';
    }
  };

  const getFloatingElements = () => {
    if (isDHLThemeActive) {
      // DHL specific floating elements
      switch (variant) {
        case 'laws':
          return [
            { icon: '🚚', top: '10%', right: '10%', delay: 0 },
            { icon: '📋', bottom: '20%', left: '15%', delay: 500 },
            { icon: '⚖️', top: '60%', right: '20%', delay: 1000 },
            { icon: '🌍', bottom: '40%', right: '5%', delay: 1500 },
          ];
        case 'travel':
          return [
            { icon: '🚚', top: '15%', right: '10%', delay: 0 },
            { icon: '📦', bottom: '25%', left: '10%', delay: 500 },
            { icon: '✈️', top: '50%', right: '15%', delay: 1000 },
            { icon: '🌍', bottom: '50%', right: '8%', delay: 1500 },
          ];
        case 'shifts':
          return [
            { icon: '🚚', top: '15%', right: '10%', delay: 0 },
            { icon: '📅', bottom: '25%', left: '15%', delay: 500 },
            { icon: '⏰', top: '50%', right: '20%', delay: 1000 },
            { icon: '📦', bottom: '40%', right: '8%', delay: 1500 },
          ];
        default:
          return [
            { icon: '🚚', top: '20%', right: '10%', delay: 0 },
            { icon: '📦', bottom: '20%', left: '20%', delay: 500 },
            { icon: '✈️', top: '60%', right: '25%', delay: 1000 },
            { icon: '🌍', bottom: '50%', left: '5%', delay: 1200 },
          ];
      }
    }
    
    // Standard floating elements
    switch (variant) {
      case 'laws':
        return [
          { icon: '⚖️', top: '10%', right: '10%', delay: 0 },
          { icon: '📋', bottom: '20%', left: '15%', delay: 500 },
          { icon: '🏛️', top: '60%', right: '20%', delay: 1000 },
          { icon: '📖', bottom: '40%', right: '5%', delay: 1500 },
        ];
      case 'travel':
        return [
          { icon: '🚗', top: '15%', right: '10%', delay: 0 },
          { icon: '🗺️', bottom: '25%', left: '10%', delay: 500 },
          { icon: '⛽', top: '50%', right: '15%', delay: 1000 },
          { icon: '🚦', bottom: '50%', right: '8%', delay: 1500 },
        ];
      case 'shifts':
        return [
          { icon: '🕐', top: '15%', right: '10%', delay: 0 },
          { icon: '📅', bottom: '25%', left: '15%', delay: 500 },
          { icon: '⏰', top: '50%', right: '20%', delay: 1000 },
          { icon: '📊', bottom: '40%', right: '8%', delay: 1500 },
        ];
      default:
        return [
          { icon: '✨', top: '20%', right: '10%', delay: 0 },
          { icon: '💡', bottom: '20%', left: '20%', delay: 500 },
          { icon: '🎯', top: '60%', right: '25%', delay: 1000 },
        ];
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGradientByVariant()}`}>
      {/* DHL Logo Watermark - only for DHL theme */}
      {isDHLThemeActive && <DHLLogoWatermark />}
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-32 h-32 bg-gradient-to-r ${
          isDHLThemeActive 
            ? 'from-primary/25 to-secondary/25' 
            : 'from-primary/20 to-secondary/20'
        } rounded-full blur-xl animate-pulse`} />
        <div className={`absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r ${
          isDHLThemeActive 
            ? 'from-secondary/25 to-primary/25' 
            : 'from-secondary/20 to-primary/20'
        } rounded-full blur-xl animate-pulse delay-1000`} />
        <div className={`absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r ${
          isDHLThemeActive 
            ? 'from-primary/15 to-secondary/15' 
            : 'from-primary/10 to-secondary/10'
        } rounded-full blur-lg animate-pulse delay-500`} />
        
        {/* Floating icons */}
        {getFloatingElements().map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-10"
            style={{
              top: element.top,
              bottom: element.bottom,
              left: element.left,
              right: element.right,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0.05], 
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 4, 
              delay: element.delay / 1000,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardBackground;
