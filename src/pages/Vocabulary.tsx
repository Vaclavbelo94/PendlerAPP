
import React from 'react';
import VocabularySection from '@/components/language/VocabularySection';
import LanguageManager from '@/components/language/LanguageManager';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

const Vocabulary = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <LanguageManager>
      <div className={`container py-6 md:py-10 max-w-7xl ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
        <div className={`mb-8 ${isSmallLandscape ? 'mb-4' : ''}`}>
          <h1 className={`${useMobileLayout ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight mb-2`}>
            Slovník
          </h1>
          <p className={`text-muted-foreground ${useMobileLayout ? 'text-sm' : ''}`}>
            Němčina pro práci v balíkovém centru - kompletní slovní zásoba a procvičování
          </p>
        </div>

        <VocabularySection />
      </div>
    </LanguageManager>
  );
};

export default Vocabulary;
