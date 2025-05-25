
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Vocabulary = () => {
  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Slovník</h1>
        <p className="text-muted-foreground">
          Spravujte svou slovní zásobu a jazykové dovednosti
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Slovní zásoba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Funkce slovníku bude implementována v budoucí verzi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;
