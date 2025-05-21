
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium">Žádné promo kódy</h3>
      <p className="text-sm text-muted-foreground mt-2">
        V systému nejsou vytvořeny žádné promo kódy.
      </p>
      <Button onClick={onCreateClick} className="mt-4">
        Vytvořit první kód
      </Button>
    </div>
  );
};
