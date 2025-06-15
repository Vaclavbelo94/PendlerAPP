
import React from 'react';
import { motion } from 'framer-motion';

interface DashboardBackgroundProps {
  children: React.ReactNode;
  variant?: 'laws' | 'travel' | 'shifts' | 'profile' | 'settings' | 'default';
}

export const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ 
  children, 
  variant = 'default' 
}) => {
  const getGradientByVariant = () => {
    switch (variant) {
      case 'laws':
        return 'from-background via-background/95 to-blue-500/5';
      case 'travel':
        return 'from-background via-background/95 to-primary/5';
      case 'shifts':
        return 'from-background via-background/95 to-green-500/5';
      case 'profile':
        return 'from-background via-background/95 to-purple-500/5';
      case 'settings':
        return 'from-background via-background/95 to-slate-500/5';
      default:
        return 'from-background via-background/95 to-primary/5';
    }
  };

  const getFloatingElements = () => {
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
      case 'profile':
        return [
          { icon: '👤', top: '15%', right: '10%', delay: 0 },
          { icon: '📱', bottom: '25%', left: '15%', delay: 500 },
          { icon: '⭐', top: '50%', right: '20%', delay: 1000 },
          { icon: '🎯', bottom: '40%', right: '8%', delay: 1500 },
        ];
      case 'settings':
        return [
          { icon: '⚙️', top: '15%', right: '10%', delay: 0 },
          { icon: '🔧', bottom: '25%', left: '15%', delay: 500 },
          { icon: '🛠️', top: '50%', right: '20%', delay: 1000 },
          { icon: '⚡', bottom: '40%', right: '8%', delay: 1500 },
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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        
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
