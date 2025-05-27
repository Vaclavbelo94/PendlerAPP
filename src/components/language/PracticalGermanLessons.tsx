
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, VolumeX, Info } from "lucide-react";
import { practicalGermanLessons, PracticalPhrase } from '@/data/practicalGermanLessons';
import { useGermanLessonsTranslation } from '@/hooks/useGermanLessonsTranslation';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Audio enhancement s německým hlasem
const playGermanAudio = (text: string, isSlowSpeed: boolean = false) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = isSlowSpeed ? 0.6 : 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
};

// Komponenta pro jednu frázi
const PhraseCard: React.FC<{ phrase: PracticalPhrase }> = ({ phrase }) => {
  const { currentLanguage, t } = useGermanLessonsTranslation();
  const { isMobile } = useScreenOrientation();
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);

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

  const importanceLabels = {
    critical: 'Klíčové',
    important: 'Důležité',
    useful: 'Užitečné'
  };

  return (
    <Card className={`${importanceColors[phrase.importance]} ${isMobile ? 'mb-3' : 'mb-4'}`}>
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900 dark:text-gray-100`}>
              {phrase.german}
            </CardTitle>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 dark:text-gray-300 mt-1`}>
              {getTranslation()}
            </p>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mt-1 italic`}>
              [{phrase.phonetic}]
            </p>
          </div>
          <Badge className={`${importanceBadgeColors[phrase.importance]} text-xs flex-shrink-0`}>
            {importanceLabels[phrase.importance]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-3'}`}>
            <Button 
              onClick={() => playGermanAudio(phrase.german, false)}
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-green-600 hover:bg-green-700 text-white font-medium`}
              size={isMobile ? "default" : "lg"}
            >
              <Volume2 className="h-5 w-5 mr-2" />
              {t('action.normalSpeech')}
            </Button>
            <Button 
              onClick={() => playGermanAudio(phrase.german, true)}
              variant="outline"
              className={`${isMobile ? 'w-full' : 'flex-1'} border-green-200 text-green-700 hover:bg-green-50`}
              size={isMobile ? "default" : "lg"}
            >
              <VolumeX className="h-5 w-5 mr-2" />
              {t('action.slowSpeech')}
            </Button>
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

// Komponenta pro výběr jazyka
const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useGermanLessonsTranslation();
  const { isMobile } = useScreenOrientation();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>
          Jazyk rozhraní / Interface Language
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLanguage === lang.code ? "default" : "outline"}
              onClick={() => changeLanguage(lang.code)}
              className={`${isMobile ? 'text-xs py-2' : 'text-sm'} justify-start`}
              size={isMobile ? "sm" : "default"}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Hlavní komponenta
const PracticalGermanLessons: React.FC = () => {
  const { t } = useGermanLessonsTranslation();
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

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

      {/* Výběr jazyka */}
      <LanguageSelector />

      {/* Lekce podle kategorií */}
      <Tabs defaultValue="first-day" className="w-full">
        <TabsList className={`grid w-full ${useMobileLayout ? 'grid-cols-2 h-auto' : 'grid-cols-4'}`}>
          {practicalGermanLessons.map((category) => (
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

        {practicalGermanLessons.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className={`${useMobileLayout ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
                  <span className="text-xl">{category.icon}</span>
                  {t(category.titleKey)}
                </CardTitle>
                <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {category.phrases.length} frází pro tuto situaci
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

      {/* Tip na konci */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-medium mb-1`}>
                Tip pro efektivní učení
              </h4>
              <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Používejte fráze aktivně v práci. Opakujte si je každý den a nebojte se chyb. 
                Němečtí kolegové ocení vaši snahu mluvit jejich jazykem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticalGermanLessons;
