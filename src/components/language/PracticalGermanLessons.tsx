
import React from 'react';
import { extendedGermanLessons } from '@/data/extendedGermanLessons';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import LessonsHeader from './practical-lessons/LessonsHeader';
import LessonsTabsNavigation from './practical-lessons/LessonsTabsNavigation';
import CategoryContent from './practical-lessons/CategoryContent';
import LearningTip from './practical-lessons/LearningTip';

const PracticalGermanLessons: React.FC = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <div className={`space-y-4 ${useMobileLayout ? 'px-2 pb-24' : 'px-4'}`}>
      <LessonsHeader />

      <LessonsTabsNavigation defaultValue="first-day">
        {extendedGermanLessons.map((category) => (
          <CategoryContent key={category.id} category={category} />
        ))}
      </LessonsTabsNavigation>

      <LearningTip />
    </div>
  );
};

export default PracticalGermanLessons;
