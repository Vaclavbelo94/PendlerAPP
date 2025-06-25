
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Globe } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import TranslatorNavigation from '@/components/translator/TranslatorNavigation';
import TextTranslation from '@/components/translator/TextTranslation';
import PhrasesTranslation from '@/components/translator/PhrasesTranslation';
import TranslationHistory from '@/components/translator/TranslationHistory';
import AIChatInterface from '@/components/translator/AIChatInterface';
import OptimizedMobileTranslator from '@/components/translator/OptimizedMobileTranslator';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const Translator = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('text');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextTranslation />;
      case 'phrases':
        return <PhrasesTranslation />;
      case 'history':
        return <TranslationHistory />;
      case 'ai':
        return <AIChatInterface />;
      default:
        return <TextTranslation />;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Překladač | PendlerApp</title>
        <meta name="description" content="Překladač a jazykové nástroje" />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Překladač</h1>
              <p className="text-white/80">Překladač a jazykové nástroje</p>
            </div>
          </div>

          {isMobile ? (
            <OptimizedMobileTranslator
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : (
            <>
              <TranslatorNavigation
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

export default Translator;
