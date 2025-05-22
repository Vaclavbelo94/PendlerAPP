import React from 'react';
// Update this import path
import { useLanguageContext } from '@/hooks/useLanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GrammarTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gramatika němčiny</CardTitle>
        <CardDescription>
          Základní gramatická pravidla němčiny pro začátečníky
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center p-6">
          <p className="text-muted-foreground">
            Sekce gramatiky je momentálně ve vývoji.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarTab;
