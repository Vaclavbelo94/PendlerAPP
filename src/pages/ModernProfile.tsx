import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { ModernProfileCarousel } from '@/components/profile/modern/ModernProfileCarousel';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import { NavbarRightContent } from '@/components/navbar/NavbarRightContent';

const ModernProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation('profile');

  if (!user) {
    return (
      <>
        <UnifiedNavbar rightContent={<NavbarRightContent />} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
          <motion.div 
            className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg max-w-md mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LogIn className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('accessDenied')}
            </h1>
            <p className="text-muted-foreground mb-6">{t('loginRequired')}</p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {t('loginButton')}
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      <UnifiedNavbar rightContent={<NavbarRightContent />} />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            {t('myProfile')}
          </h1>
          <p className="text-muted-foreground">{t('longDescription')}</p>
          <p className="text-sm text-muted-foreground mt-2 italic">{t('swipeTip')}</p>
        </motion.div>
        
        <ModernProfileCarousel />
      </div>
    </div>
  );
};

export default ModernProfile;