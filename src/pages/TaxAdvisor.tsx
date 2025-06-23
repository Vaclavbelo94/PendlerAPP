
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumCheck from '@/components/premium/PremiumCheck';
import TaxWizardCarousel from "@/components/tax-advisor/wizard/TaxWizardCarousel";
import TaxCalculator from "@/components/tax-advisor/TaxCalculator";
import DocumentGenerator from "@/components/tax-advisor/DocumentGenerator";
import TaxOptimization from "@/components/tax-advisor/TaxOptimization";
import TaxAdvisorSwipeNavigation from "@/components/tax-advisor/TaxAdvisorSwipeNavigation";
import { TaxAdvisorMobileCarousel } from "@/components/tax-advisor/TaxAdvisorMobileCarousel";
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/useResponsive';

const TaxAdvisor = () => {
  const { t } = useTranslation('common');
  const { isMobile } = useResponsive();
  const [activeSection, setActiveSection] = useState('wizard');

  const sections = [
    {
      id: 'wizard',
      label: t('wizard'),
      component: <TaxWizardCarousel />
    },
    {
      id: 'calculator',
      label: t('calculator'),
      component: <TaxCalculator />
    },
    {
      id: 'documents',
      label: t('documents'),
      component: <DocumentGenerator />
    },
    {
      id: 'optimization',
      label: t('optimization'),
      component: <TaxOptimization />
    }
  ];

  const renderContent = () => {
    const currentSection = sections.find(section => section.id === activeSection);
    return currentSection?.component || <TaxWizardCarousel />;
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="tax-advisor">
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10">
            <div className="container max-w-6xl py-8 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  {t('taxAdvisor')}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t('taxAdvisorDescription')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {isMobile ? (
                  <TaxAdvisorMobileCarousel
                    items={sections}
                    activeItem={activeSection}
                    onItemChange={setActiveSection}
                  />
                ) : (
                  <>
                    <TaxAdvisorSwipeNavigation
                      activeTab={activeSection}
                      onTabChange={setActiveSection}
                      isMobile={false}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSection}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {renderContent()}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </PremiumCheck>
    </Layout>
  );
};

export default TaxAdvisor;
