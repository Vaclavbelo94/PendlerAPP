import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';
import AnimatedWelcome from './AnimatedWelcome';

const WelcomeScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <SplashScreen onComplete={handleSplashComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="welcome"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedWelcome />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;