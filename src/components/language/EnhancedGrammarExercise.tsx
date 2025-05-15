
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LimitedExamples from "./LimitedExamples";

interface Example {
  id: string;
  german: string;
  czech: string;
}

interface GrammarRule {
  id: string;
  name: string;
  description: string;
  examples: Example[];
}

interface GrammarCategory {
  id: string;
  name: string;
  rules: GrammarRule[];
}

interface EnhancedGrammarExerciseProps {
  category: GrammarCategory;
}

const EnhancedGrammarExercise: React.FC<EnhancedGrammarExerciseProps> = ({ category }) => {
  // Add defensive checks to prevent errors with undefined data
  if (!category) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p>Kategorie nenalezena.</p>
        </CardContent>
      </Card>
    );
  }

  // Check if rules array exists and has content
  if (!category.rules || category.rules.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>
            Pro tuto kategorii nejsou k dispozici žádná pravidla.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Now we know that category and category.rules exist and have content
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <CardDescription>
          Gramatická pravidla a příklady pro tuto kategorii
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={category.rules[0]?.id || ""}>
          <TabsList className="mb-4 flex flex-wrap">
            {category.rules.map((rule) => (
              <TabsTrigger key={rule.id} value={rule.id}>
                {rule.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {category.rules.map((rule) => (
            <TabsContent key={rule.id} value={rule.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">{rule.name}</h3>
                <p className="text-muted-foreground">{rule.description}</p>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Příklady:</h4>
                <LimitedExamples examples={rule.examples || []} initialLimit={5} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedGrammarExercise;
