
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

  // Mapping pro převod category.id na správný navigation klíč
  const getNavigationKey = (categoryId: string): string => {
    switch (categoryId) {
      case 'first-day': return 'nav.first-day';
      case 'daily-communication': return 'nav.daily-communication';
      case 'technical-terms': return 'nav.technical-terms';
      case 'shift-work': return 'nav.shift-work';
      case 'work-evaluation': return 'nav.work-evaluation';
      case 'numbers-time': return 'nav.numbers-time';
      case 'problems-help': return 'nav.problems-help';
      case 'end-of-shift': return 'nav.end-of-shift';
      default: return `nav.${categoryId}`;
    }
  };

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className={`grid w-full ${useMobileLayout ? 'grid-cols-2 h-auto' : 'grid-cols-5'}`}>
        {extendedGermanLessons.map((category) => {
          const navKey = getNavigationKey(category.id);
          const translatedName = t(navKey);
          
          // Fallback na titleKey pokud nav klíč neexistuje
          const displayName = translatedName !== navKey ? translatedName : t(category.titleKey);
          
          return (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className={`${useMobileLayout ? 'text-xs py-2 px-2' : 'text-sm'} flex items-center gap-1`}
            >
              <span className={useMobileLayout ? 'text-sm' : 'text-base'}>{category.icon}</span>
              {useMobileLayout ? (
                <span className="truncate">{displayName.split(' ')[0]}</span>
              ) : (
                displayName
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default LessonsTabsNavigation;
