import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnimatedWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const menuItems = [
    {
      icon: LogIn,
      label: t('signIn'),
      action: () => navigate('/login'),
      variant: 'default' as const,
      primary: true
    },
    {
      icon: UserPlus,
      label: t('signUp'),
      action: () => navigate('/register'),
      variant: 'outline' as const,
      primary: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <motion.div
        className="w-full max-w-md space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          variants={itemVariants}
        >
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-xl font-bold shadow-elegant">
            PH
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('welcome')}
          </h1>
          <p className="text-muted-foreground">
            {t('chooseOption')}
          </p>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="space-y-5"
          variants={containerVariants}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant={item.variant}
                size="lg"
                className={`
                  w-full h-16 text-lg font-semibold gap-4 
                  transition-all duration-300 
                  hover:shadow-elegant hover:shadow-glow
                  ${item.primary 
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:from-primary-glow hover:to-primary shadow-lg' 
                    : 'border-2 hover:border-primary/30'
                  }
                `}
                onClick={item.action}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <p>{t('footerText')}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnimatedWelcome;