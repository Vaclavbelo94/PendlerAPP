import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';
import { Navigate } from 'react-router-dom';
import DHLEmployeeNavigation from '@/components/dhl/employee/DHLEmployeeNavigation';
import DHLEmployeeDashboard from '@/components/dhl/employee/dashboard/DHLEmployeeDashboard';
import TimeTrackingWidget from '@/components/dhl/employee/timeTracking/TimeTrackingWidget';
import DHLTeamCommunication from '@/components/dhl/employee/DHLTeamCommunication';
import { DHLBrandIndicator } from '@/components/common/DHLBrandIndicator';
import { DHLLogoWatermark } from '@/components/common/DHLLogoWatermark';
import PageContainer from '@/components/layouts/PageContainer';

const DHLEmployeePage: React.FC = () => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const { isDHL } = useCompany();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect pokud není DHL zaměstnanec
  if (!user || !isDHL) {
    return <Navigate to="/" replace />;
  }

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DHLEmployeeDashboard />;
      
      case 'timeTracking':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{t('timeTracking.title')}</h1>
              <p className="text-muted-foreground">
                Sledujte svou pracovní dobu a přestávky
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeTrackingWidget />
              
              {/* Placeholder pro další komponenty */}
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="font-semibold mb-4">{t('timeTracking.weekSummary')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Pondělí</span>
                      <span className="text-sm font-medium">8.0h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Úterý</span>
                      <span className="text-sm font-medium">7.5h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Středa</span>
                      <span className="text-sm font-medium">8.5h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Čtvrtek</span>
                      <span className="text-sm font-medium">8.0h</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Celkem</span>
                      <span className="font-bold">32.0h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'shifts':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{t('shifts.title')}</h1>
              <p className="text-muted-foreground">
                Přehled vašich směn a možnost výměny
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-8 border text-center">
              <h3 className="text-lg font-semibold mb-2">Komponenta směn</h3>
              <p className="text-muted-foreground">
                Bude implementována v další fázi
              </p>
            </div>
          </div>
        );
      
      case 'team':
        return <DHLTeamCommunication />;
      
      case 'documents':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{t('documents.title')}</h1>
              <p className="text-muted-foreground">
                Spravujte své pracovní dokumenty
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-8 border text-center">
              <h3 className="text-lg font-semibold mb-2">Správa dokumentů</h3>
              <p className="text-muted-foreground">
                Bude implementována v další fázi
              </p>
            </div>
          </div>
        );
      
      case 'travel':
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{t('travel.title')}</h1>
              <p className="text-muted-foreground">
                Sledujte své cesty do práce
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-8 border text-center">
              <h3 className="text-lg font-semibold mb-2">Cestovní systém</h3>
              <p className="text-muted-foreground">
                Bude implementován v další fázi
              </p>
            </div>
          </div>
        );
      
      default:
        return <DHLEmployeeDashboard />;
    }
  };

  return (
    <PageContainer className="relative min-h-screen">
      {/* DHL Watermark */}
      <DHLLogoWatermark />
      
      {/* Header s DHL Brand Indicator */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <DHLBrandIndicator size="lg" />
        <div className="text-sm text-muted-foreground">
          DHL Employee Portal
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <DHLEmployeeNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>

      {/* Main Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        {renderActiveContent()}
      </motion.div>
    </PageContainer>
  );
};

export default DHLEmployeePage;