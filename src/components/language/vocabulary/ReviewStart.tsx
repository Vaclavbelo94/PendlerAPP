
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface ReviewStartProps {
  dueItemsCount: number;
  onStart: () => void;
}

const ReviewStart: React.FC<ReviewStartProps> = ({
  dueItemsCount,
  onStart
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pt-6">
        <div className="rounded-full bg-primary/10 p-6 mb-4">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Připraveno k opakování</h3>
          <p className="text-muted-foreground mt-1">
            Máte {dueItemsCount} slovíček k opakování. 
            Pravidelné opakování vám pomůže efektivněji si zapamatovat slovní zásobu.
          </p>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={onStart} className="min-w-32">
          Začít opakování
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewStart;
