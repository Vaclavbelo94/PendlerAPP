
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import ProfileMobileCarousel from '@/components/profile/mobile/ProfileMobileCarousel';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileWorkData from '@/components/profile/ProfileWorkData';
import ProfileSubscription from '@/components/profile/subscription/ProfileSubscription';
import DashboardBackground from '@/components/common/DashboardBackground';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, unifiedUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation('profile');

  if (!user) {
    return (
      <>
        <Helmet>
          <title>{t('title') || 'Profil'} | PendlerApp</title>
          <meta name="description" content={t('description') || 'Správa uživatelského profilu'} />
        </Helmet>
        
        <Layout navbarRightContent={<NavbarRightContent />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="p-8 bg-card border rounded-2xl max-w-md mx-auto">
              <User className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold mb-4 text-center">
                {t('accessDenied') || 'Přístup odepřen'}
              </h1>
              <p className="text-muted-foreground mb-6 text-center">
                {t('loginRequired') || 'Pro zobrazení profilu se musíte přihlásit.'}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/login')} size="lg">
                  {t('loginButton') || 'Přihlásit se'}
                </Button>
              </div>
            </div>
          </motion.div>
        </Layout>
      </>
    );
  }

  const { containerRef } = useSwipeNavigation({
    items: ["overview", "workData", "subscription"],
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: isMobile
  });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const renderDesktopContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ProfileOverview 
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        );
      case 'workData':
        return <ProfileWorkData />;
      case 'subscription':
        return <ProfileSubscription isPremium={unifiedUser?.isPremium || false} />;
      default:
        return (
          <ProfileOverview 
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('title')} />
      </Helmet>
      
      <Layout navbarRightContent={<NavbarRightContent />}>
        <DashboardBackground variant="default">
          <div className="container mx-auto px-4 py-8">
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
                    {isMobile ? (t('title') || 'Profil') : (t('myProfile') || 'Můj profil')}
                  </h1>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-2 text-center' : 'text-lg mt-2'} max-w-3xl`}>
                    {isMobile 
                      ? (t('shortDescription') || 'Správa účtu a osobních nastavení.') 
                      : (t('longDescription') || 'Spravujte své informace, nastavení účtu a sledujte svůj pokrok v aplikaci.')
                      }
                    </p>
                  </div>
                </div>
                {isMobile && (
                  <p className="text-xs text-muted-foreground text-center px-4">
                    {t('swipeTip') || '💡 Tip: Přejeďte prstem doleva/doprava pro navigaci mezi záložkami'}
                  </p>
                )}
              </motion.div>

            <ProfileErrorBoundary>
              {isMobile ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  ref={containerRef}
                >
                  <ProfileMobileCarousel
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </motion.div>
              ) : (
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
            </ProfileErrorBoundary>
          </div>
        </DashboardBackground>
      </Layout>
    </>
  );
};

export default Profile;
