
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

const LessonsHeader: React.FC = () => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${useMobileLayout ? 'text-lg' : 'text-xl'} flex items-center gap-3`}>
          <span className="text-2xl">🇩🇪</span>
          {t('lessons.title')}
        </CardTitle>
        <p className={`${useMobileLayout ? 'text-sm' : 'text-base'} text-muted-foreground`}>
          {t('lessons.subtitle')}
        </p>
      </CardHeader>
    </Card>
  );
};

export default LessonsHeader;
