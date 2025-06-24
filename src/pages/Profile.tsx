
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OptimizedLayout from '@/components/layouts/OptimizedLayout';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import ProfileMobileCarousel from '@/components/profile/mobile/ProfileMobileCarousel';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileWorkData from '@/components/profile/ProfileWorkData';
import ProfileSubscription from '@/components/profile/subscription/ProfileSubscription';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Profil | PendlerApp</title>
          <meta name="description" content="Správa uživatelského profilu" />
        </Helmet>
        
        <OptimizedLayout navbarRightContent={<LanguageSwitcher />}>
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="p-8 bg-card border rounded-2xl max-w-md mx-auto">
                <User className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h1 className="text-2xl font-bold mb-4 text-center">
                  Přístup odepřen
                </h1>
                <p className="text-muted-foreground mb-6 text-center">
                  Pro zobrazení profilu se musíte přihlásit.
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => navigate('/login')} size="lg">
                    Přihlásit se
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </OptimizedLayout>
      </>
    );
  }

  const renderDesktopContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ProfileOverview />;
      case 'workData':
        return <ProfileWorkData />;
      case 'subscription':
        return <ProfileSubscription />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Profil | PendlerApp</title>
        <meta name="description" content="Správa uživatelského profilu a nastavení účtu" />
      </Helmet>
      
      <OptimizedLayout navbarRightContent={<LanguageSwitcher />}>
        <div className="container mx-auto px-4 py-8">
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-primary/10 border`}>
                <User className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
              </div>
              <div className={isMobile ? 'text-center' : ''}>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight ${isMobile ? 'text-center' : ''}`}>
                  {isMobile ? 'Profil' : 'Můj profil'}
                </h1>
                <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-2 text-center' : 'text-lg mt-2'} max-w-3xl`}>
                  {isMobile 
                    ? 'Správa účtu a osobních nastavení.' 
                    : 'Spravujte své informace, nastavení účtu a sledujte svůj pokrok v aplikaci.'
                  }
                </p>
              </div>
            </div>
            {isMobile && (
              <p className="text-xs text-muted-foreground text-center px-4">
                💡 Tip: Přejeďte prstem doleva/doprava pro navigaci mezi záložkami
              </p>
            )}
          </motion.div>

          {/* Mobile: Swipe Carousel */}
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProfileMobileCarousel
                activeTab={activeSection}
                onTabChange={setActiveSection}
              />
            </motion.div>
          ) : (
            /* Desktop: Traditional Navigation + Content */
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <ProfileNavigation
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8"
              >
                {renderDesktopContent()}
              </motion.div>
            </>
          )}
        </div>
      </OptimizedLayout>
    </>
  );
};

export default Profile;
