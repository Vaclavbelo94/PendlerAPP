
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';

interface ReviewStartProps {
  dueItemsCount: number;
  onStart: () => void;
}

const ReviewStart: React.FC<ReviewStartProps> = ({ dueItemsCount, onStart }) => {
  return (
    <div className="text-center space-y-4 py-6">
      {dueItemsCount > 0 ? (
        <>
          <div className="mx-auto bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">Připraveno k opakování</h3>
          <p className="text-muted-foreground">
            Máte {dueItemsCount} slovíček k opakování dnes
          </p>
          <Button onClick={onStart} className="mt-2">
            Začít opakování
          </Button>
        </>
      ) : (
        <>
          <div className="mx-auto bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">Žádná slovíčka k opakování</h3>
          <p className="text-muted-foreground">
            Momentálně nemáte žádná slovíčka k opakování.
            Přidejte nová slovíčka nebo se vraťte později.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Aktualizovat
          </Button>
        </>
      )}
    </div>
  );
};

export default ReviewStart;
