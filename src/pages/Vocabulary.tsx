
import React from 'react';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import LoadingFallback from '@/components/common/LoadingFallback';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Lazy load components with proper error handling
const VocabularySection = React.lazy(() => 
  import('@/components/language/VocabularySection').catch(err => {
    console.error('Failed to load VocabularySection:', err);
    return { default: () => <div>Chyba při načítání slovní zásoby</div> };
  })
);

const LanguageManager = React.lazy(() => 
  import('@/components/language/LanguageManager').catch(err => {
    console.error('Failed to load LanguageManager:', err);
    return { default: ({ children }: { children: React.ReactNode }) => <>{children}</> };
  })
);

const Vocabulary = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  console.log('Vocabulary page rendering');

  return (
    <ErrorBoundaryWithFallback>
      <React.Suspense fallback={<LoadingFallback message="Načítám správce jazyka..." />}>
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

            <ErrorBoundaryWithFallback>
              <React.Suspense fallback={<LoadingFallback message="Načítám slovní zásobu..." />}>
                <VocabularySection />
              </React.Suspense>
            </ErrorBoundaryWithFallback>
          </div>
        </LanguageManager>
      </React.Suspense>
    </ErrorBoundaryWithFallback>
  );
};

export default Vocabulary;
