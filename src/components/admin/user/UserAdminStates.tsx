
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlexContainer } from "@/components/ui/flex-container";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Načítání uživatelů..." }: LoadingStateProps) => {
  return (
    <FlexContainer justify="center" className="p-8">
      <FlexContainer direction="col" align="center" gap="sm">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </FlexContainer>
    </FlexContainer>
  );
};

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <FlexContainer direction="col" align="center" justify="center" className="p-8 text-center">
      <Shield className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-medium">Chyba při načítání</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        Nepodařilo se načíst uživatele z databáze. Zkuste to prosím znovu.
      </p>
      <Button onClick={onRetry} className="mt-4">
        Zkusit znovu
      </Button>
    </FlexContainer>
  );
};

interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <FlexContainer direction="col" align="center" justify="center" className="p-8 text-center">
      <Shield className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Žádní uživatelé</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        V systému zatím nejsou registrovaní žádní uživatelé nebo nemáte oprávnění je zobrazit.
      </p>
      <Button onClick={onRefresh} className="mt-4" variant="outline">
        Obnovit
      </Button>
    </FlexContainer>
  );
};
