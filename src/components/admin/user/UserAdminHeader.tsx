
import { FlexContainer } from "@/components/ui/flex-container";
import { Button } from "@/components/ui/button";

interface UserAdminHeaderProps {
  userCount: number;
  onRefresh: () => void;
}

export const UserAdminHeader = ({ userCount, onRefresh }: UserAdminHeaderProps) => {
  return (
    <FlexContainer justify="between" align="center">
      <p className="text-sm text-muted-foreground">
        Celkem uživatelů: {userCount}
      </p>
      <Button onClick={onRefresh} variant="outline" size="sm">
        Obnovit data
      </Button>
    </FlexContainer>
  );
};
