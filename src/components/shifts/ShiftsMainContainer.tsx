
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShiftsContainer } from './hooks/useShiftsContainer';
import FastLoadingSkeleton from './FastLoadingSkeleton';
import ShiftsPageHeader from './ShiftsPageHeader';
import ShiftsFormSheets from './ShiftsFormSheets';
import EmptyShiftsState from './EmptyShiftsState';
import ShiftsErrorHandler from './ShiftsErrorHandler';
import ShiftsContentRenderer from './ShiftsContentRenderer';
import ShiftsNavigation from './ShiftsNavigation';
import ShiftsMobileCarousel from './mobile/ShiftsMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import PremiumCheck from '@/components/premium/PremiumCheck';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ShiftsMainContainer: React.FC = () => {
  const { t } = useTranslation('shifts');
  const isMobile = useIsMobile();
  const {
    user,
    isInitialized,
    isOnline,
    isSlowConnection,
    activeSection,
    isAddSheetOpen,
    setIsAddSheetOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    editingShift,
    setEditingShift,
    shifts,
    isLoading,
    error,
    isSaving,
    isChanging,
    handleSectionChange,
    handleAddShift,
    handleEditShift,
    openEditDialog,
    handleRetry,
    handleOpenAddSheet,
    deleteShift
  } = useShiftsContainer();

  if (!isInitialized || (isLoading && shifts.length === 0)) {
    return <FastLoadingSkeleton onRetry={handleRetry} timeoutMs={8000} />;
  }

  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('loginRequired')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <PremiumCheck featureKey="shifts">
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('shiftsDescription')} />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className={`mx-auto px-4 py-8 ${isMobile ? 'container' : 'max-w-full'}`}>
          {/* Header section with dashboard-style animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                <Clock className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
              </div>
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white`}>
                  {t('title')}
                </h1>
                <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                  {t('shiftsDescription')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Error handler */}
          <ShiftsErrorHandler
            isOnline={isOnline}
            isSlowConnection={isSlowConnection}
            error={error}
            onRetry={handleRetry}
          />

          {/* Empty state */}
          {shifts.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <EmptyShiftsState onAddShift={handleOpenAddSheet} />
            </motion.div>
          ) : (
            /* Main content */
            <div className="space-y-8">
              {/* Mobile: Swipe Carousel */}
              {isMobile ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <ShiftsMobileCarousel
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    shifts={shifts}
                    isLoading={isLoading}
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
                    <ShiftsPageHeader onAddShift={handleOpenAddSheet} />
                    <ShiftsNavigation
                      activeSection={activeSection}
                      onSectionChange={handleSectionChange}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-background/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-8"
                  >
                    <ShiftsContentRenderer
                      activeSection={activeSection}
                      isChanging={isChanging}
                      shifts={shifts}
                      onEditShift={openEditDialog}
                      onDeleteShift={deleteShift}
                    />
                  </motion.div>
                </>
              )}
            </div>
          )}

          {/* Form sheets */}
          <ShiftsFormSheets
            isAddSheetOpen={isAddSheetOpen}
            setIsAddSheetOpen={setIsAddSheetOpen}
            isEditSheetOpen={isEditSheetOpen}
            setIsEditSheetOpen={setIsEditSheetOpen}
            editingShift={editingShift}
            setEditingShift={setEditingShift}
            onAddShift={handleAddShift}
            onEditShift={handleEditShift}
            isSaving={isSaving}
          />
        </div>
      </DashboardBackground>
    </PremiumCheck>
  );
};

export default ShiftsMainContainer;
