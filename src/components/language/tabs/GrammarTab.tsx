
import React, { useState } from 'react';
import { useLanguageContext } from '@/hooks/useLanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import GrammarExercise from '@/components/language/GrammarExercise';
import EnhancedGrammarExercise from '@/components/language/EnhancedGrammarExercise';
import { grammarExercises, grammarExercises2 } from '@/data/germanExercises';

const GrammarTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const categories = [
    { id: 'basic', name: 'Základy' },
    { id: 'nouns', name: 'Podstatná jména' },
    { id: 'articles', name: 'Členy' },
    { id: 'verbs', name: 'Slovesa' },
    { id: 'cases', name: 'Pády' },
    { id: 'exercises', name: 'Cvičení' },
  ];

  const getSelectedCategory = () => {
    return grammarExercises.find(cat => cat.id === selectedCategory) 
      || grammarExercises[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gramatika němčiny</CardTitle>
        <CardDescription>
          Základní gramatická pravidla němčiny pro začátečníky
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" onValueChange={setSelectedCategory}>
          <ScrollArea className="w-full pb-4">
            <TabsList className="inline-flex h-auto flex-wrap mb-4 w-full gap-2">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          <TabsContent value="exercises" className="space-y-4">
            <div className="space-y-4">
              <div className="pb-2">
                <h3 className="text-lg font-medium">Gramatická cvičení</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Procvičte si gramatická pravidla na interaktivních cvičeních
                </p>
              </div>
              <GrammarExercise 
                exercises={grammarExercises2}
                category="členy" 
              />
            </div>
          </TabsContent>

          {['basic', 'nouns', 'articles', 'verbs', 'cases'].map((categoryId) => (
            <TabsContent key={categoryId} value={categoryId}>
              {categoryId === selectedCategory && (
                <EnhancedGrammarExercise 
                  category={getSelectedCategory()}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GrammarTab;
