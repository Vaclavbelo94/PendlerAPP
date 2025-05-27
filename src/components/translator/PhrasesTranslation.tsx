
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Languages } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import PhrasesCategoryNavigation from "./PhrasesCategoryNavigation";

interface PhrasesTranslationProps {
  workPhrases: Array<{
    id: string;
    title: string;
    phrases: string[];
  }>;
  phrasesTab: string;
  setPhrasesTab: (tab: string) => void;
  handleUsePhrase: (phrase: string) => void;
}

const PhrasesTranslation: React.FC<PhrasesTranslationProps> = ({
  workPhrases,
  phrasesTab,
  setPhrasesTab,
  handleUsePhrase
}) => {
  const isMobile = useMediaQuery("xs");
  
  const currentCategory = workPhrases.find(category => category.id === phrasesTab);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          <span>Užitečné fráze</span>
        </CardTitle>
        <CardDescription>
          Nejčastěji používané fráze pro různé situace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhrasesCategoryNavigation
          activeCategory={phrasesTab}
          onCategoryChange={setPhrasesTab}
        />

        {currentCategory && (
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-lg font-semibold mb-4">{currentCategory.title}</h3>
            <ul className="divide-y">
              {currentCategory.phrases.map((phrase, index) => (
                <li 
                  key={index}
                  className="py-2 md:py-3 flex justify-between items-center hover:bg-muted/40 rounded px-2 cursor-pointer text-sm md:text-base"
                  onClick={() => handleUsePhrase(phrase)}
                >
                  <span className="line-clamp-2 md:line-clamp-1 flex-1 pr-2">{phrase}</span>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    className="h-8 px-2 md:h-10 md:px-4 flex-shrink-0"
                  >
                    <ArrowRightLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className={isMobile ? "sr-only" : ""}>Použít</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhrasesTranslation;
