
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsDisplayProps {
  hasInput: boolean;
}

const ResultsDisplay = ({ hasInput }: ResultsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimalizované trasy</CardTitle>
        <CardDescription>Výsledky optimalizace vašich cest.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 text-center text-muted-foreground">
          <p>
            {hasInput 
              ? "Výsledky optimalizace se zobrazí zde."
              : "Zadejte místo odjezdu a cíl pro zobrazení optimalizovaných tras."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
