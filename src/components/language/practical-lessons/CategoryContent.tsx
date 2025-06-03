
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { LessonCategory } from '@/data/extendedGermanLessons';
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import PhraseCard from './PhraseCard';

interface CategoryContentProps {
  category: LessonCategory;
}

const CategoryContent: React.FC<CategoryContentProps> = ({ category }) => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  return (
    <TabsContent key={category.id} value={category.id} className="mt-6">
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className={`${useMobileLayout ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
            <span className="text-xl">{category.icon}</span>
            {category.titleKey}
          </CardTitle>
          <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            {category.phrases.length} frází
          </p>
        </CardHeader>
      </Card>
      
      <div className="mt-6 space-y-4">
        {category.phrases.map((phrase) => (
          <PhraseCard key={phrase.id} phrase={phrase} />
        ))}
      </div>
    </TabsContent>
  );
};

export default CategoryContent;
