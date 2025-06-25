
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Calculator } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import TaxAdvisorNavigation from '@/components/tax-advisor/TaxAdvisorNavigation';
import TaxCalculatorTab from '@/components/tax-advisor/TaxCalculatorTab';
import DocumentGenerator from '@/components/tax-advisor/DocumentGenerator';
import TaxReturnGuide from '@/components/tax-advisor/TaxReturnGuide';
import TaxAdvisorMobileCarousel from '@/components/tax-advisor/TaxAdvisorMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const TaxAdvisor = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('pendler');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'pendler':
      case 'calculator':
        return <TaxCalculatorTab />;
      case 'documents':
        return <DocumentGenerator />;
      case 'guide':
        return <TaxReturnGuide />;
      case 'interactive':
        return <TaxCalculatorTab />;
      default:
        return <TaxCalculatorTab />;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Daňový poradce | PendlerApp</title>
        <meta name="description" content="Daňové poradenství a kalkulace" />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Daňový poradce</h1>
              <p className="text-white/80">Kalkulace daní a optimalizace</p>
            </div>
          </div>

          {isMobile ? (
            <TaxAdvisorMobileCarousel
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : (
            <>
              <TaxAdvisorNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="mt-8">
                {renderContent()}
              </div>
            </>
          )}
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default TaxAdvisor;
