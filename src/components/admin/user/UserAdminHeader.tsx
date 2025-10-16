
import { FlexContainer } from "@/components/ui/flex-container";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UserAdminHeaderProps {
  userCount: number;
  onRefresh: () => void;
}

export const UserAdminHeader = ({ userCount, onRefresh }: UserAdminHeaderProps) => {
  const { t } = useTranslation('admin-users');
  return (
    <FlexContainer justify="between" align="center">
      <p className="text-sm text-muted-foreground">
        {t('userCount', { count: userCount })}
      </p>
      <Button onClick={onRefresh} variant="outline" size="sm">
        {t('refresh')}
      </Button>
    </FlexContainer>
  );
};
