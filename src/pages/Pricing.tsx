
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ceník</h1>
        <p className="text-muted-foreground">
          Vyberte si plán, který vám nejvíce vyhovuje
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prémiové funkce</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ceník bude implementován v budoucí verzi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
