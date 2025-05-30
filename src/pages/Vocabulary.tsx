
import React from 'react';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import PublicPageWithPremiumCheck from '@/components/premium/PublicPageWithPremiumCheck';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Optimized lazy loading
const VocabularySection = React.lazy(() => 
  import('@/components/language/VocabularySection').catch(err => {
    console.error('Failed to load VocabularySection:', err);
    return { default: () => <div className="p-4 text-center text-muted-foreground">Lekce němčiny se nenačetly</div> };
  })
);

const LanguageManager = React.lazy(() => 
  import('@/components/language/LanguageManager').catch(err => {
    console.error('Failed to load LanguageManager:', err);
    return { default: ({ children }: { children: React.ReactNode }) => <>{children}</> };
  })
);

const GermanLessons = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  console.log('German Lessons page rendering');

  return (
    <PublicPageWithPremiumCheck featureName="Lekce němčiny" allowPublicAccess={true}>
      <ErrorBoundaryWithFallback>
        <React.Suspense fallback={<FastLoadingFallback message="Načítám správce jazykových lekcí..." />}>
          <LanguageManager>
            <div className={`container py-6 md:py-10 max-w-7xl ${useMobileLayout ? 'pb-32' : ''} ${isSmallLandscape ? 'px-2' : ''}`}>
              <div className={`mb-8 ${isSmallLandscape ? 'mb-4' : ''}`}>
                <h1 className={`${useMobileLayout ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight mb-2`}>
                  Lekce němčiny
                </h1>
                <p className={`text-muted-foreground ${useMobileLayout ? 'text-sm' : ''}`}>
                  Interaktivní výuka němčiny pro české a polské pracovníky v balíkovém centru
                </p>
              </div>

              <ErrorBoundaryWithFallback>
                <React.Suspense fallback={<FastLoadingFallback message="Načítám jazykové lekce..." />}>
                  <VocabularySection />
                </React.Suspense>
              </ErrorBoundaryWithFallback>
            </div>
          </LanguageManager>
        </React.Suspense>
      </ErrorBoundaryWithFallback>
    </PublicPageWithPremiumCheck>
  );
};

export default GermanLessons;
