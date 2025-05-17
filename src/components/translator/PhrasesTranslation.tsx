
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Languages } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  // Detekce mobilního zařízení
  const isMobile = useMediaQuery("xs");
  
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
        <Tabs value={phrasesTab} onValueChange={setPhrasesTab}>
          <ScrollArea className="w-full pb-2">
            <TabsList className="mb-4 md:mb-6 w-full flex flex-wrap gap-1 md:gap-2">
              {workPhrases.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className={`text-xs md:text-sm py-1 px-2 md:py-2 md:px-3 ${phrasesTab === category.id ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {workPhrases.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-1 md:space-y-2">
                <ul className="divide-y">
                  {category.phrases.map((phrase, index) => (
                    <li 
                      key={index}
                      className="py-1 md:py-2 flex justify-between items-center hover:bg-muted/40 rounded px-2 cursor-pointer text-sm md:text-base"
                      onClick={() => handleUsePhrase(phrase)}
                    >
                      <span className="line-clamp-2 md:line-clamp-1">{phrase}</span>
                      <Button 
                        variant="ghost" 
                        size={isMobile ? "sm" : "default"}
                        className="h-8 px-2 md:h-10 md:px-4"
                      >
                        <ArrowRightLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        <span className={isMobile ? "sr-only" : ""}>Použít</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PhrasesTranslation;
