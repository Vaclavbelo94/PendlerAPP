
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Volume2, 
  CheckCircle, 
  PlayCircle,
  Trophy,
  Target,
  Brain,
  Zap
} from "lucide-react";
import { allLessons, Lesson, LessonVocabularyItem } from '@/data/germanLessonsContent';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

// Helper function pro přehrání výslovnosti
const pronounceWord = (word: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE';
    utterance.rate = 0.8; // Pomalejší tempo pro lepší porozumění
    speechSynthesis.speak(utterance);
  }
};

// Komponenta pro zobrazení jednoho slovíčka
const VocabularyCard: React.FC<{ item: LessonVocabularyItem }> = ({ item }) => {
  const [showExample, setShowExample] = useState(false);
  
  const importanceColors = {
    critical: 'bg-red-50 border-red-200',
    important: 'bg-orange-50 border-orange-200', 
    useful: 'bg-blue-50 border-blue-200'
  };

  const importanceBadgeColors = {
    critical: 'bg-red-500',
    important: 'bg-orange-500',
    useful: 'bg-blue-500'
  };

  return (
    <Card className={`mb-3 ${importanceColors[item.importance]}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {item.german}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => pronounceWord(item.german)}
              >
                <Volume2 className="h-4 w-4" />
                <span className="sr-only">Přečíst</span>
              </Button>
            </CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium">{item.czech}</span>
              {item.polish && <span className="text-muted-foreground ml-2">({item.polish})</span>}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
            <Badge className={`text-xs text-white ${importanceBadgeColors[item.importance]}`}>
              {item.importance === 'critical' ? 'Klíčové' : 
               item.importance === 'important' ? 'Důležité' : 'Užitečné'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm" 
          onClick={() => setShowExample(!showExample)}
        >
          {showExample ? 'Skrýt příklad' : 'Zobrazit příklad'}
        </Button>
        {showExample && (
          <div className="mt-2 p-3 bg-white/50 rounded border text-sm">
            <p className="italic mb-1">"{item.example}"</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs" 
              onClick={() => pronounceWord(item.example)}
            >
              <Volume2 className="h-3 w-3 mr-1" />
              Přečíst příklad
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Komponenta pro jednu lekci
const LessonCard: React.FC<{ 
  lesson: Lesson; 
  onStartLesson: (lesson: Lesson) => void;
  isCompleted?: boolean;
  progress?: number;
}> = ({ lesson, onStartLesson, isCompleted = false, progress = 0 }) => {
  const { isMobile } = useScreenOrientation();
  
  const difficultyColors = {
    beginner: 'bg-green-50 border-green-200',
    intermediate: 'bg-orange-50 border-orange-200',
    advanced: 'bg-red-50 border-red-200'
  };

  const difficultyLabels = {
    beginner: 'Začátečník',
    intermediate: 'Mírně pokročilý', 
    advanced: 'Pokročilý'
  };

  return (
    <Card className={`${difficultyColors[lesson.difficulty]} ${isMobile ? 'mb-3' : 'mb-4'}`}>
      <CardHeader className={isMobile ? 'pb-2' : 'pb-3'}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
              {lesson.title}
            </CardTitle>
            <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
              {lesson.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {difficultyLabels[lesson.difficulty]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress bar pro rozdělanou lekci */}
          {progress > 0 && progress < 100 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Pokrok</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {/* Info o lekci */}
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2 text-xs`}>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{lesson.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{lesson.vocabulary.length} slov</span>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{lesson.phrases.length} frází</span>
              </div>
            )}
          </div>

          {/* Akční tlačítka */}
          <div className="flex gap-2">
            <Button 
              onClick={() => onStartLesson(lesson)}
              className="flex-1"
              size={isMobile ? "sm" : "default"}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              {isCompleted ? 'Opakovat' : progress > 0 ? 'Pokračovat' : 'Začít'}
            </Button>
            {lesson.vocabulary.length > 0 && (
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={() => pronounceWord(lesson.vocabulary[0].german)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Detail lekce
const LessonDetail: React.FC<{ 
  lesson: Lesson; 
  onBack: () => void;
}> = ({ lesson, onBack }) => {
  const { isMobile } = useScreenOrientation();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" onClick={onBack} size={isMobile ? "sm" : "default"}>
          ← Zpět
        </Button>
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{lesson.title}</h2>
      </div>

      <Tabs defaultValue="vocabulary" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 h-auto' : 'grid-cols-4'}`}>
          <TabsTrigger value="vocabulary" className={isMobile ? 'text-xs py-2' : ''}>
            <BookOpen className="h-4 w-4 mr-1" />
            {isMobile ? 'Slovíčka' : 'Slovní zásoba'}
          </TabsTrigger>
          <TabsTrigger value="phrases" className={isMobile ? 'text-xs py-2' : ''}>
            <Zap className="h-4 w-4 mr-1" />
            {isMobile ? 'Fráze' : 'Užitečné fráze'}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="tips">
                <Target className="h-4 w-4 mr-1" />
                Tipy
              </TabsTrigger>
              <TabsTrigger value="culture">
                <Brain className="h-4 w-4 mr-1" />
                Kultura
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="vocabulary" className="mt-4">
          <ScrollArea className={isMobile ? "h-[400px]" : "h-[500px]"}>
            <div className="space-y-3">
              {lesson.vocabulary.map((item, index) => (
                <VocabularyCard key={index} item={item} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="phrases" className="mt-4">
          <div className="space-y-3">
            {lesson.phrases.map((phrase, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{phrase.german}</p>
                      <p className="text-sm text-muted-foreground">{phrase.czech}</p>
                      {phrase.polish && (
                        <p className="text-xs text-muted-foreground">({phrase.polish})</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => pronounceWord(phrase.german)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs bg-blue-50 p-2 rounded">
                    <strong>Situace:</strong> {phrase.situation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {!isMobile && (
          <>
            <TabsContent value="tips" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Praktické tipy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lesson.practicalTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture" className="mt-4">
              {lesson.culturalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kulturní poznámky</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {lesson.culturalNotes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Brain className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

// Hlavní komponenta
const GermanLessonsSection: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Pokud je vybrána lekce, zobraz detail
  if (selectedLesson) {
    return (
      <div className={`${useMobileLayout ? 'px-2' : 'px-4'}`}>
        <LessonDetail lesson={selectedLesson} onBack={handleBackToLessons} />
      </div>
    );
  }

  // Výchozí zobrazení se seznamem lekcí
  return (
    <div className={`space-y-4 ${useMobileLayout ? 'px-2' : ''}`}>
      {/* Header s přehledem */}
      <Card>
        <CardHeader>
          <CardTitle className={`${useMobileLayout ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <Trophy className="h-5 w-5 text-yellow-500" />
            Lekce němčiny pro balíkové centrum
          </CardTitle>
          <CardDescription className={useMobileLayout ? 'text-sm' : ''}>
            Praktické německé výrazy a komunikace pro práci v logistickém centru. 
            Speciálně navrženo pro český a polské zaměstnance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid ${useMobileLayout ? 'grid-cols-2' : 'grid-cols-4'} gap-4 text-center`}>
            <div>
              <div className={`${useMobileLayout ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
                {allLessons.length}
              </div>
              <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Celkem lekcí
              </div>
            </div>
            <div>
              <div className={`${useMobileLayout ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
                {completedLessons.length}
              </div>
              <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Dokončeno
              </div>
            </div>
            {!useMobileLayout && (
              <>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {allLessons.reduce((sum, lesson) => sum + lesson.vocabulary.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Slovíček</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {allLessons.reduce((sum, lesson) => sum + lesson.estimatedTime, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Minut</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seznam lekcí */}
      <div className="space-y-4">
        <h3 className={`${useMobileLayout ? 'text-base' : 'text-lg'} font-semibold`}>
          Dostupné lekce
        </h3>
        
        {allLessons.map((lesson) => (
          <LessonCard 
            key={lesson.id}
            lesson={lesson}
            onStartLesson={handleStartLesson}
            isCompleted={completedLessons.includes(lesson.id)}
            progress={0} // TODO: Implementovat tracking pokroku
          />
        ))}
      </div>

      {/* Tip pro začátečníky */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-medium mb-1`}>
                Tip pro efektivní učení
              </h4>
              <p className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Doporučujeme procházet lekce postupně a pravidelně opakovat naučené slovíčko. 
                Každá lekce obsahuje praktické příklady z reálného pracovního prostředí.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GermanLessonsSection;
