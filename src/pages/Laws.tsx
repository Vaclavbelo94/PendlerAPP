
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Scale } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsGrid from '@/components/laws/LawsGrid';
import LawsHeader from '@/components/laws/LawsHeader';
import LawsMobileCarousel from '@/components/laws/mobile/LawsMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const Laws = () => {
  const { t } = useTranslation('laws');
  const [activeSection, setActiveSection] = useState('all');
  const isMobile = useIsMobile();

  return (
    <Layout>
      <Helmet>
        <title>Právo | PendlerApp</title>
        <meta name="description" content="Právní informace a předpisy" />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Právo</h1>
              <p className="text-white/80">Právní informace a předpisy</p>
            </div>
          </div>

          {isMobile ? (
            <LawsMobileCarousel
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          ) : (
            <>
              <LawsNavigation
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
              <div className="mt-8">
                <LawsGrid activeSection={activeSection} />
              </div>
            </>
          )}
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default Laws;
