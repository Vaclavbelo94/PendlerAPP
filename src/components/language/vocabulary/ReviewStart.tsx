
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';

interface ReviewStartProps {
  dueItemsCount: number;
  onStart: () => void;
}

const ReviewStart: React.FC<ReviewStartProps> = ({
  dueItemsCount,
  onStart
}) => {
  return (
    <>
      <div className="rounded-full bg-primary/10 p-6">
        <Brain className="h-12 w-12 text-primary" />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium">Připraveno k opakování</h3>
        <p className="text-muted-foreground mt-1">
          Máte {dueItemsCount} slovíček k opakování. 
          Pravidelné opakování vám pomůže efektivněji si zapamatovat slovní zásobu.
        </p>
      </div>
      <Button onClick={onStart}>
        Začít opakování
      </Button>
    </>
  );
};

export default ReviewStart;
