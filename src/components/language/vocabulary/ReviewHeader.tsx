
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ReviewHeaderProps {
  isComplete: boolean;
  dueItemsCount: number;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ isComplete, dueItemsCount }) => {
  return (
    <CardHeader>
      <CardTitle>Opakování slovíček</CardTitle>
      <CardDescription>
        {isComplete
          ? "Všechna slovíčka na dnešek jsou hotová. Skvělá práce!"
          : `Máte ${dueItemsCount} slovíček k opakování.`}
      </CardDescription>
    </CardHeader>
  );
};

export default ReviewHeader;
