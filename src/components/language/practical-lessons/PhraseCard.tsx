
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Heart } from "lucide-react";
import { ExtendedPhrase } from '@/data/extendedGermanLessons';
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { useFavorites } from '@/hooks/useFavorites';
import AudioButton from '@/components/language/AudioButton';

interface PhraseCardProps {
  phrase: ExtendedPhrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const { currentLanguage, t } = useGermanLessonsTranslation();
  const { isMobile } = useScreenOrientation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const getTranslation = () => {
    switch (currentLanguage) {
      case 'en': return phrase.english;
      case 'de': return phrase.german;
      case 'sk': return phrase.slovak;
      default: return phrase.czech;
    }
  };

  const importanceColors = {
    critical: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    important: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    useful: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  };

  const importanceBadgeColors = {
    critical: 'bg-red-500 text-white',
    important: 'bg-orange-500 text-white',
    useful: 'bg-blue-500 text-white'
  };

  return (
    <Card className={`${importanceColors[phrase.importance]} ${isMobile ? 'mb-3' : 'mb-4'} transition-all hover:shadow-md`}>
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 dark:text-gray-100`}>
                {phrase.german}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(phrase.id)}
                className="flex-shrink-0 h-6 w-6 p-0 hover:bg-primary/10"
              >
                <Heart 
                  className={`h-3 w-3 ${isFavorite(phrase.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </Button>
            </div>
            
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300 mt-1`}>
              {getTranslation()}
            </p>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mt-1 italic`}>
              [{phrase.phonetic}]
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={`${importanceBadgeColors[phrase.importance]} text-xs flex-shrink-0`}>
              {t(`filter.${phrase.importance}`)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {phrase.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-3'}`}>
            <AudioButton
              text={phrase.german}
              language="de"
              variant="default"
              size={isMobile ? "default" : "lg"}
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-green-600 hover:bg-green-700 text-white font-medium`}
            />
            <AudioButton
              text={getTranslation()}
              language={currentLanguage === 'en' ? 'en' : currentLanguage === 'sk' ? 'sk' : 'cs'}
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className={`${isMobile ? 'w-full' : 'flex-1'} border-green-200 text-green-700 hover:bg-green-50`}
            />
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-3 border-l-4 border-l-blue-500">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Situace:</p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                  {phrase.situation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhraseCard;
