
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlayCircle, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { useDHLThemeContext } from '@/contexts/DHLThemeContext';
import { DHLLogoWatermark } from '@/components/common/DHLLogoWatermark';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';

const ModernHero = () => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const { isDHLThemeActive } = useDHLThemeContext();

  return (
    <>
      {/* Navbar */}
      <UnifiedNavbar />
      
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isDHLThemeActive ? 'bg-gradient-to-br from-background via-background/95 to-primary/10' : ''
      }`}>
      {/* DHL Logo Watermark - only for DHL theme */}
      {isDHLThemeActive && <DHLLogoWatermark />}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDHLThemeActive ? (
          // DHL themed background elements
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/25 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-3xl" />
            {/* DHL floating elements */}
            <motion.div
              className="absolute top-20 right-10 text-4xl opacity-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0.05], 
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                delay: 0,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🚚
            </motion.div>
            <motion.div
              className="absolute bottom-20 left-20 text-3xl opacity-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0.05], 
                scale: [0, 1.2, 1],
                rotate: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 4, 
                delay: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              📦
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-1/4 text-3xl opacity-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0.05], 
                scale: [0, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 4, 
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              ✈️
            </motion.div>
          </>
        ) : (
          // Standard background elements
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {t('newVersionAvailable')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-5xl lg:text-7xl font-bold mb-6 leading-tight ${
              isDHLThemeActive 
                ? 'bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'
            }`}
          >
            {t('heroMainTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('heroLongDescription')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {user ? (
              <Button size="lg" className="text-lg px-8 py-4 h-auto group" asChild>
                <Link to="/dashboard">
                  {t('goToDashboard')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8 py-4 h-auto group" asChild>
                  <Link to="/register">
                    {t('startFree')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto group" asChild>
                  <Link to="/login">
                    {t('signInAction')}
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
      </section>
    </>
  );
};

export default ModernHero;
