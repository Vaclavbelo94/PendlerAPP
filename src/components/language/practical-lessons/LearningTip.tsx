
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

const LearningTip: React.FC = () => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-medium mb-1`}>
              {t('tip.learning')}
            </h4>
            <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              {t('tip.description')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningTip;
