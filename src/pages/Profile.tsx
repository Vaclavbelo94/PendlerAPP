
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useUnifiedAuth } from "@/contexts/UnifiedAuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import Footer from '@/components/layouts/Footer';
import ProfileMobileCarousel from '@/components/profile/mobile/ProfileMobileCarousel';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileWorkData from '@/components/profile/ProfileWorkData';
import ProfileSubscription from '@/components/profile/subscription/ProfileSubscription';
import DashboardBackground from '@/components/common/DashboardBackground';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import UnifiedRoleIndicator from '@/components/auth/UnifiedRoleIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, unifiedUser } = useUnifiedAuth();
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
        
        <div className="min-h-screen flex flex-col bg-background">
          <UnifiedNavbar />
          
          <main className="flex-1">
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
            </div>
          </main>
          
          <Footer />
        </div>
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
        return (
          <ProfileSubscription 
            isPremium={unifiedUser?.hasPremiumAccess}
            premiumExpiry={null}
          />
        );
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
        <title>{t('title') || 'Profil'} | PendlerApp</title>
        <meta name="description" content={t('description') || 'Správa uživatelského profilu'} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <UnifiedNavbar />
        
        <main className="flex-1">
          <DashboardBackground variant="default">
            <div className="container mx-auto px-4 py-8">
              {/* Header section with role indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className={`flex items-center gap-4 mb-6 ${isMobile ? 'flex-col text-center' : ''}`}>
                  <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                    <User className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                  </div>
                  <div className="flex-1">
                    <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white mb-2`}>
                      {t('title') || 'Můj Profil'}
                    </h1>
                    <div className="flex items-center gap-3">
                      <p className="text-white/80 text-lg">
                        {unifiedUser?.displayName || user?.email?.split('@')[0]}
                      </p>
                      {unifiedUser && (
                        <UnifiedRoleIndicator 
                          role={unifiedUser.role} 
                          status={unifiedUser.status}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <ProfileErrorBoundary>
                {/* Mobile: Swipe Carousel */}
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
              </ProfileErrorBoundary>
            </div>
          </DashboardBackground>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Profile;
