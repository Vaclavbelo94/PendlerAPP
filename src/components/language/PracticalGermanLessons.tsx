
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Heart, Search as SearchIcon } from "lucide-react";
import { extendedGermanLessons, ExtendedPhrase } from '@/data/extendedGermanLessons';
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { useFavorites } from '@/hooks/useFavorites';
import AudioButton from '@/components/language/AudioButton';

// Enhanced phrase card with new audio buttons
const PhraseCard: React.FC<{ phrase: ExtendedPhrase }> = ({ phrase }) => {
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

// Simple filter component without search
const SimpleFilter: React.FC<{
  selectedImportance: string;
  onImportanceChange: (importance: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  favorites: string[];
  totalPhrases: number;
  filteredCount: number;
}> = ({
  selectedImportance,
  onImportanceChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favorites,
  totalPhrases,
  filteredCount
}) => {
  const { t } = useGermanLessonsTranslation();

  const importanceOptions = [
    { value: 'all', labelKey: 'filter.all' },
    { value: 'critical', labelKey: 'filter.critical' },
    { value: 'important', labelKey: 'filter.important' },
    { value: 'useful', labelKey: 'filter.useful' }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavoritesOnly}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              {t('instruction.favorites')} ({favorites.length})
            </Button>

            <div className="text-sm text-muted-foreground ml-auto">
              {filteredCount} z {totalPhrases} frází
            </div>
          </div>

          {/* Importance filters */}
          <div>
            <h4 className="text-sm font-medium mb-2">Důležitost</h4>
            <div className="flex flex-wrap gap-2">
              {importanceOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={selectedImportance === option.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onImportanceChange(option.value)}
                >
                  {t(option.labelKey)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component with enhanced audio integration
const PracticalGermanLessons: React.FC = () => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const { favorites } = useFavorites();
  const useMobileLayout = isMobile || isSmallLandscape;

  const [selectedImportance, setSelectedImportance] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filtered phrases logic (removed search functionality)
  const filteredLessons = useMemo(() => {
    return extendedGermanLessons.map(category => {
      let phrases = category.phrases;

      // Importance filter
      if (selectedImportance !== 'all') {
        phrases = phrases.filter(phrase => phrase.importance === selectedImportance);
      }

      // Favorites filter
      if (showFavoritesOnly) {
        phrases = phrases.filter(phrase => favorites.includes(phrase.id));
      }

      return { ...category, phrases };
    }).filter(category => category.phrases.length > 0);
  }, [selectedImportance, showFavoritesOnly, favorites]);

  const totalPhrasesCount = extendedGermanLessons.reduce((sum, cat) => sum + cat.phrases.length, 0);
  const filteredPhrasesCount = filteredLessons.reduce((sum, cat) => sum + cat.phrases.length, 0);

  return (
    <div className={`space-y-4 ${useMobileLayout ? 'px-2 pb-24' : 'px-4'}`}>
      {/* Header */}
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

      {/* Simple filter without search */}
      <SimpleFilter
        selectedImportance={selectedImportance}
        onImportanceChange={setSelectedImportance}
        favorites={favorites}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        totalPhrases={totalPhrasesCount}
        filteredCount={filteredPhrasesCount}
      />

      {/* Lessons by categories */}
      <Tabs defaultValue="first-day" className="w-full">
        <TabsList className={`grid w-full ${useMobileLayout ? 'grid-cols-2 h-auto' : 'grid-cols-5'}`}>
          {filteredLessons.map((category) => (
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

        {filteredLessons.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`${useMobileLayout ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
                  <span className="text-xl">{category.icon}</span>
                  {t(category.titleKey)}
                </CardTitle>
                <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {category.phrases.length} frází • {category.estimatedTime} min • {category.description}
                </p>
              </CardHeader>
            </Card>
            
            <div className="mt-4 space-y-3">
              {category.phrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* No results message */}
      {filteredPhrasesCount === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Žádné výsledky</h3>
            <p className="text-muted-foreground">
              Zkuste změnit filtry.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedImportance('all');
                setShowFavoritesOnly(false);
              }}
              className="mt-4"
            >
              Vymazat filtry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Learning tip */}
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
    </div>
  );
};

export default PracticalGermanLessons;
