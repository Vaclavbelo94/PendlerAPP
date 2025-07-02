
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from 'lucide-react';
import { Example } from '@/data/germanExercises';

interface LimitedExamplesProps {
  examples: Example[];
  initialLimit?: number;
}

const LimitedExamples: React.FC<LimitedExamplesProps> = ({ examples, initialLimit = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedExamples = showAll ? examples : examples.slice(0, initialLimit);

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-3">
      {displayedExamples.map((example) => (
        <Card key={example.id} className="p-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <p className="font-medium">{example.german}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-7 w-7 p-0"
                  onClick={() => handleTextToSpeech(example.german)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Přečíst</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{example.czech}</p>
            </div>
          </div>
        </Card>
      ))}

      {examples.length > initialLimit && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Zobrazit méně příkladů" : `Zobrazit všech ${examples.length} příkladů`}
        </Button>
      )}
    </div>
  );
};

export default LimitedExamples;
