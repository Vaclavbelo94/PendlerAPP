
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlexContainer } from "@/components/ui/flex-container";
import { useTranslation } from "react-i18next";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message }: LoadingStateProps) => {
  const { t } = useTranslation('admin-users');
  
  return (
    <FlexContainer justify="center" className="p-8">
      <FlexContainer direction="col" align="center" gap="sm">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-muted-foreground">{message || t('states.loading')}</p>
      </FlexContainer>
    </FlexContainer>
  );
};

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  const { t } = useTranslation('admin-users');
  
  return (
    <FlexContainer direction="col" align="center" justify="center" className="p-8 text-center">
      <Shield className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-medium">{t('states.error')}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {t('states.errorMessage')}
      </p>
      <Button onClick={onRetry} className="mt-4">
        {t('states.retry')}
      </Button>
    </FlexContainer>
  );
};

interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  const { t } = useTranslation('admin-users');
  
  return (
    <FlexContainer direction="col" align="center" justify="center" className="p-8 text-center">
      <Shield className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{t('states.empty')}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {t('states.emptyMessage')}
      </p>
      <Button onClick={onRefresh} className="mt-4" variant="outline">
        {t('states.refresh')}
      </Button>
    </FlexContainer>
  );
};
