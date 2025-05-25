
import React from 'react';
import VocabularySection from '@/components/language/VocabularySection';
import LanguageManager from '@/components/language/LanguageManager';

const Vocabulary = () => {
  return (
    <LanguageManager>
      <div className="container py-6 md:py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Slovník</h1>
          <p className="text-muted-foreground">
            Němčina pro práci v balíkovém centru - kompletní slovní zásoba a procvičování
          </p>
        </div>

        <VocabularySection />
      </div>
    </LanguageManager>
  );
};

export default Vocabulary;
