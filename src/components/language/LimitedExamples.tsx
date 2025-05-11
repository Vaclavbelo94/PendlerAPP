
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface Example {
  id: string;
  german: string;
  czech: string;
}

interface LimitedExamplesProps {
  examples: Example[];
  initialLimit?: number;
}

const LimitedExamples: React.FC<LimitedExamplesProps> = ({ 
  examples, 
  initialLimit = 5 
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Pokud je příkladů méně než limit, zobrazíme všechny
  const hasMoreExamples = examples.length > initialLimit;
  const displayedExamples = showAll ? examples : examples.slice(0, initialLimit);
  
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {displayedExamples.map((example) => (
          <li key={example.id} className="p-2 bg-slate-50 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">{example.german}</div>
              <div>{example.czech}</div>
            </div>
          </li>
        ))}
      </ul>
      
      {hasMoreExamples && (
        <div className="flex justify-center pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center text-slate-600"
          >
            {showAll ? (
              <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                Zobrazit méně
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                Zobrazit více ({examples.length - initialLimit})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LimitedExamples;
