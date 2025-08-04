import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { useCompany } from '@/hooks/useCompany';
import { Navigate } from 'react-router-dom';
import ModernLayout from '@/components/modern/ModernLayout';
import DHLEmployeeNavigation from '@/components/dhl/employee/DHLEmployeeNavigation';
import DHLEmployeeDashboard from '@/components/dhl/employee/dashboard/DHLEmployeeDashboard';
import TimeTrackingWidget from '@/components/dhl/employee/timeTracking/TimeTrackingWidget';
import DHLTeamCommunication from '@/components/dhl/employee/DHLTeamCommunication';
import DHLDocumentManagement from '@/components/dhl/employee/DHLDocumentManagement';
import DHLTravelManagement from '@/components/dhl/employee/DHLTravelManagement';
import { DHLAnalyticsManagement } from '@/components/dhl/employee/DHLAnalyticsManagement';
import { DHLBrandIndicator } from '@/components/common/DHLBrandIndicator';

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
                {t('timeTracking.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeTrackingWidget />
              
              {/* Týdenní přehled */}
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="font-semibold mb-4">{t('timeTracking.weekSummary')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('timeTracking.days.monday')}</span>
                      <span className="text-sm font-medium">8.0h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('timeTracking.days.tuesday')}</span>
                      <span className="text-sm font-medium">7.5h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('timeTracking.days.wednesday')}</span>
                      <span className="text-sm font-medium">8.5h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('timeTracking.days.thursday')}</span>
                      <span className="text-sm font-medium">8.0h</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">{t('timeTracking.total')}</span>
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
                {t('shifts.description')}
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-8 border text-center">
              <h3 className="text-lg font-semibold mb-2">{t('shifts.placeholder.title')}</h3>
              <p className="text-muted-foreground">
                {t('shifts.placeholder.description')}
              </p>
            </div>
          </div>
        );
      
      case 'team':
        return <DHLTeamCommunication />;
      
      case 'documents':
        return <DHLDocumentManagement />;
      
      case 'travel':
        return <DHLTravelManagement />;
      
      case 'analytics':
        return <DHLAnalyticsManagement />;
      
      default:
        return <DHLEmployeeDashboard />;
    }
  };

  return (
    <ModernLayout>
      <div className="container mx-auto py-6">
        {/* Header s DHL Brand Indicator */}
        <div className="flex items-center justify-between mb-6">
          <DHLBrandIndicator size="lg" />
          <div className="text-sm text-muted-foreground">
            {t('common.portal')}
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6">
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
        >
          {renderActiveContent()}
        </motion.div>
      </div>
    </ModernLayout>
  );
};

export default DHLEmployeePage;