
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface ReviewHeaderProps {
  isComplete: boolean;
  dueItemsCount: number;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ isComplete, dueItemsCount }) => {
  if (isComplete) {
    return (
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <CardTitle>Opakování dokončeno</CardTitle>
        </div>
        <CardDescription>
          Všechna slovíčka pro dnešek jsou zopakována
        </CardDescription>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5 text-blue-500" />
        <CardTitle>Opakování slovíček</CardTitle>
      </div>
      <CardDescription>
        {dueItemsCount > 0 
          ? `Máte ${dueItemsCount} slovíček k opakování` 
          : 'Žádná slovíčka k opakování'}
      </CardDescription>
    </CardHeader>
  );
};

export default ReviewHeader;
