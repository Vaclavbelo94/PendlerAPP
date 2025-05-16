
import React from 'react';
import { grammarExercises, GrammarCategory } from "@/data/germanExercises";
import EnhancedGrammarExercise from "../EnhancedGrammarExercise";
import { Card, CardContent } from "@/components/ui/card";

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
        grammarExercises.map((category) => (
          <section key={category.id} id={`category-${category.id}`}>
            <EnhancedGrammarExercise category={category} />
          </section>
        ))
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
