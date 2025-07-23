
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
      // Use same clean DHL gradient for all variants
      return 'from-background via-background to-accent/5';
    }
    
    // Clean standard gradients
    return 'from-background via-background to-muted/30';
  };

  const getFloatingElements = () => {
    if (isDHLThemeActive) {
      // Subtle DHL floating elements
      switch (variant) {
        case 'laws':
          return [
            { icon: '📋', top: '15%', right: '10%', delay: 0 },
            { icon: '⚖️', bottom: '25%', left: '10%', delay: 1000 },
          ];
        case 'travel':
          return [
            { icon: '🚗', top: '20%', right: '15%', delay: 0 },
            { icon: '🗺️', bottom: '30%', left: '15%', delay: 1000 },
          ];
        case 'shifts':
          return [
            { icon: '⏰', top: '18%', right: '12%', delay: 0 },
            { icon: '📅', bottom: '28%', left: '12%', delay: 1000 },
          ];
        default:
          return [
            { icon: '✨', top: '20%', right: '10%', delay: 0 },
            { icon: '💼', bottom: '25%', left: '15%', delay: 1000 },
          ];
      }
    }
    
    // Minimal standard floating elements
    return [
      { icon: '✨', top: '20%', right: '10%', delay: 0 },
      { icon: '💡', bottom: '25%', left: '15%', delay: 1000 },
    ];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGradientByVariant()}`}>
      {/* DHL Logo Watermark - only for DHL theme */}
      {isDHLThemeActive && <DHLLogoWatermark />}
      
      {/* Clean animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle background decoration */}
        <div className={`absolute top-20 right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
          isDHLThemeActive 
            ? 'bg-primary/10' 
            : 'bg-blue-200/30'
        }`} />
        <div className={`absolute bottom-20 left-20 w-24 h-24 rounded-full blur-3xl opacity-20 ${
          isDHLThemeActive 
            ? 'bg-secondary/10' 
            : 'bg-purple-200/30'
        }`} />
        
        {/* Floating icons - very subtle */}
        {getFloatingElements().map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-xl opacity-5"
            style={{
              top: element.top,
              bottom: element.bottom,
              left: element.left,
              right: element.right,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.05, 0.02], 
              scale: [0, 1, 0.8],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 8, 
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
