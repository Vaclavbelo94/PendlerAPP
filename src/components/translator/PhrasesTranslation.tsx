
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Languages } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <TabsList className="mb-6 w-full flex flex-wrap gap-2">
              {workPhrases.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className={phrasesTab === category.id ? "bg-primary text-primary-foreground" : ""}
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {workPhrases.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-2">
                <ul className="divide-y">
                  {category.phrases.map((phrase, index) => (
                    <li 
                      key={index}
                      className="py-2 flex justify-between items-center hover:bg-muted/40 rounded px-2 cursor-pointer"
                      onClick={() => handleUsePhrase(phrase)}
                    >
                      <span>{phrase}</span>
                      <Button variant="ghost" size="sm">
                        <ArrowRightLeft className="h-4 w-4 mr-1" />
                        Použít
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
