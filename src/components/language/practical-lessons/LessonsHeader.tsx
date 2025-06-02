
import React from 'react';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

const LessonsHeader: React.FC = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <div className={`text-center mb-6 ${isSmallLandscape ? 'mb-4' : ''}`}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-4xl">🇩🇪</span>
        <h1 className={`${useMobileLayout ? 'text-2xl' : 'text-3xl'} font-bold`}>
          Lekce němčiny
        </h1>
      </div>
      <p className={`text-muted-foreground max-w-3xl mx-auto ${useMobileLayout ? 'text-sm' : 'text-lg'}`}>
        Interaktivní výuka němčiny pro české a polské pracovníky v balíkovém centru
      </p>
    </div>
  );
};

export default LessonsHeader;
