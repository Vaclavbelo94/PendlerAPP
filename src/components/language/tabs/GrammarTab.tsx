
import React from 'react';
import { grammarExercises, GrammarCategory } from "@/data/germanExercises";
import EnhancedGrammarExercise from "../EnhancedGrammarExercise";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GrammarTabProps {
  searchResults?: {
    categoryId: string;
    ruleId: string;
  }[];
}

const GrammarTab: React.FC<GrammarTabProps> = ({ searchResults }) => {
  return (
    <>
      {grammarExercises && grammarExercises.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {grammarExercises.map((category, index) => (
            <AccordionItem 
              key={category.id} 
              value={category.id}
              className="mb-4 border rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-2 hover:bg-muted/40">
                <span className="font-medium">{category.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <EnhancedGrammarExercise category={category} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Nejsou k dispozici žádná gramatická cvičení.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GrammarTab;
