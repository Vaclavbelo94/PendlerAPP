
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, Heart, BookOpen } from "lucide-react";
import { PracticalPhrase } from '@/data/extendedGermanLessons';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { cn } from '@/lib/utils';

interface PhraseCardProps {
  phrase: PracticalPhrase;
}

const PhraseCard: React.FC<PhraseCardProps> = ({ phrase }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLearned, setIsLearned] = useState(false);
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  const handleAudioPlay = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.german);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  const getImportanceBadgeColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500 text-white';
      case 'important': return 'bg-amber-500 text-white';
      case 'useful': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'critical': return 'Kritické';
      case 'important': return 'Důležité';
      case 'useful': return 'Užitečné';
      default: return 'Základní';
    }
  };

  return (
    <Card className={cn(
      "h-full transition-all duration-200 hover:shadow-md border-l-4",
      phrase.importance === 'critical' && "border-l-red-500",
      phrase.importance === 'important' && "border-l-amber-500",
      phrase.importance === 'useful' && "border-l-blue-500"
    )}>
      <CardHeader className={cn("pb-3", useMobileLayout && "pb-2")}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className={cn(
            "font-bold text-primary leading-tight flex-1",
            useMobileLayout ? "text-lg" : "text-xl"
          )}>
            {phrase.german}
          </CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAudioPlay}
              className="h-8 w-8 p-0"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn("h-8 w-8 p-0", isFavorite && "text-red-500")}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge className={cn(
            "text-xs font-medium",
            getImportanceBadgeColor(phrase.importance)
          )}>
            {getImportanceLabel(phrase.importance)}
          </Badge>
          <span className={cn(
            "text-muted-foreground text-xs",
            useMobileLayout && "text-xs"
          )}>
            {phrase.situation}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className={cn("space-y-3", useMobileLayout && "space-y-2")}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇨🇿</span>
            <span className={cn(
              "font-medium text-foreground",
              useMobileLayout ? "text-sm" : "text-base"
            )}>
              {phrase.czech}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg">🇸🇰</span>
            <span className={cn(
              "text-muted-foreground",
              useMobileLayout ? "text-sm" : "text-base"
            )}>
              {phrase.slovak}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg">🇬🇧</span>
            <span className={cn(
              "text-muted-foreground",
              useMobileLayout ? "text-sm" : "text-base"
            )}>
              {phrase.english}
            </span>
          </div>
        </div>
        
        <div className={cn(
          "p-3 bg-muted/50 rounded-lg",
          useMobileLayout && "p-2"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">Výslovnost:</span>
          </div>
          <span className={cn(
            "font-mono text-primary",
            useMobileLayout ? "text-sm" : "text-base"
          )}>
            [{phrase.phonetic}]
          </span>
        </div>

        <Button 
          variant={isLearned ? "default" : "outline"}
          size="sm"
          onClick={() => setIsLearned(!isLearned)}
          className="w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {isLearned ? "Naučeno" : "Označit jako naučené"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhraseCard;
