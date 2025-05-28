
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extendedGermanLessons } from '@/data/extendedGermanLessons';
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

interface LessonsTabsNavigationProps {
  defaultValue: string;
  children: React.ReactNode;
}

const LessonsTabsNavigation: React.FC<LessonsTabsNavigationProps> = ({ defaultValue, children }) => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className={`grid w-full ${useMobileLayout ? 'grid-cols-2 h-auto' : 'grid-cols-5'}`}>
        {extendedGermanLessons.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className={`${useMobileLayout ? 'text-xs py-2 px-2' : 'text-sm'} flex items-center gap-1`}
          >
            <span className={useMobileLayout ? 'text-sm' : 'text-base'}>{category.icon}</span>
            {useMobileLayout ? (
              <span className="truncate">{t(category.titleKey).split(' ')[0]}</span>
            ) : (
              t(category.titleKey)
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default LessonsTabsNavigation;
