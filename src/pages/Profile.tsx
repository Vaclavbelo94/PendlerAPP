
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardBackground from '@/components/common/DashboardBackground';
import ProfileMobileCarousel from '@/components/profile/mobile/ProfileMobileCarousel';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileAppearance from '@/components/profile/ProfileAppearance';
import ProfileSubscription from '@/components/profile/subscription/ProfileSubscription';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Profil | PendlerApp</title>
          <meta name="description" content="Správa uživatelského profilu" />
        </Helmet>
        
        <DashboardBackground variant="default">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md mx-auto">
                <User className="h-12 w-12 mx-auto mb-4 text-white" />
                <h1 className="text-2xl font-bold text-white mb-4 text-center">
                  Přístup odepřen
                </h1>
                <p className="text-white/80 mb-6 text-center">
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
        </DashboardBackground>
      </>
    );
  }

  const renderDesktopContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview />;
      case 'appearance':
        return <ProfileAppearance />;
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
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with dashboard-style animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                <User className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
              </div>
              <div className={isMobile ? 'text-center' : ''}>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white ${isMobile ? 'text-center' : ''}`}>
                  {isMobile ? 'Profil' : 'Můj profil'}
                </h1>
                <p className={`text-white/80 ${isMobile ? 'text-sm mt-2 text-center' : 'text-lg mt-2'} max-w-3xl`}>
                  {isMobile 
                    ? 'Správa účtu a osobních nastavení.' 
                    : 'Spravujte své informace, nastavení účtu a sledujte svůj pokrok v aplikaci.'
                  }
                </p>
              </div>
            </div>
            {isMobile && (
              <p className="text-xs text-white/60 text-center px-4">
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
                activeTab={activeTab}
                onTabChange={setActiveTab}
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
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
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
      </DashboardBackground>
    </>
  );
};

export default Profile;
