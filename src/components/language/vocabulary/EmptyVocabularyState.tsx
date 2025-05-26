
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Download } from 'lucide-react';

interface EmptyVocabularyStateProps {
  onAddNew: () => void;
  onImport: () => void;
  onUseDefault: () => void;
}

export const EmptyVocabularyState: React.FC<EmptyVocabularyStateProps> = ({
  onAddNew,
  onImport,
  onUseDefault
}) => {
  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
          Váš slovník je prázdný
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground">
          Začněte vytvářet vlastní slovník německých slov a frází, abyste si je mohli procvičovat.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-background shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4 flex flex-col items-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-1">Přidat slova ručně</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vytvořte vlastní slovíčka
                </p>
                <Button onClick={onAddNew} size="sm">
                  Přidat slovíčko
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4 flex flex-col items-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Download className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-1">Importovat soubor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nahrát CSV nebo Excel soubor
                </p>
                <Button onClick={onImport} variant="outline" size="sm">
                  Importovat
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4 flex flex-col items-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-1">Použít připravená slova</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Načíst základní slovník
                </p>
                <Button onClick={onUseDefault} variant="secondary" size="sm">
                  Načíst slovník
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-xs text-muted-foreground px-4 pt-4">
          Tip: Pro efektivní učení si přidávejte slovíčka postupně podle témat a pravidelně je procvičujte
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyVocabularyState;
