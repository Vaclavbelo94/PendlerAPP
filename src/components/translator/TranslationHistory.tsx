
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, History } from "lucide-react";

interface TranslationHistoryProps {
  history: Array<{
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: Date;
  }>;
  handleLoadFromHistory: (item: any) => void;
  handleClearHistory: () => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  history,
  handleLoadFromHistory,
  handleClearHistory
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <span>Historie překladů</span>
        </CardTitle>
        <CardDescription>
          Vaše poslední překlady
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Zatím nemáte žádné překlady v historii</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.sourceLanguage === 'cs' ? 'Čeština' : 
                         item.sourceLanguage === 'de' ? 'Němčina' : 'Angličtina'}
                      </span>
                      <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {item.targetLanguage === 'cs' ? 'Čeština' : 
                         item.targetLanguage === 'de' ? 'Němčina' : 'Angličtina'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="text-sm line-clamp-2">{item.sourceText}</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="text-sm line-clamp-2">{item.translatedText}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLoadFromHistory(item)}
                    >
                      Použít znovu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Vymazat historii
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationHistory;
