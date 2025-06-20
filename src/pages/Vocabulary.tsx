
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Languages } from 'lucide-react';

const Vocabulary = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-6 md:py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {t('translator')}
        </h1>
        <p className="text-muted-foreground">
          Jazykové nástroje pro práci v Německu
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              {t('translator')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Využijte náš překladač pro překlad mezi češtinou, polštinou a němčinou.
            </p>
            <div className="text-center">
              <a 
                href="/translator" 
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Languages className="h-4 w-4 mr-2" />
                Otevřít překladač
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Jazykové materiály
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sekce jazykových lekcí byla odstraněna. Využijte překladač pro rychlé překlady potřebných frází a výrazů.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;
