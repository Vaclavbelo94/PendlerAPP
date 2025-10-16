
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FlexContainer } from "@/components/ui/flex-container";
import { MemoizedCard } from "@/components/optimized/MemoizedCard";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  registeredAt: string;
  premiumUntil: string | null;
}

interface UserMobileCardProps {
  user: User;
  onTogglePremium: (userId: string) => void;
}

export const UserMobileCard = ({ user, onTogglePremium }: UserMobileCardProps) => {
  const { t } = useTranslation('admin-users');
  
  return (
    <MemoizedCard className="p-4">
      <FlexContainer direction="col" gap="sm">
        <FlexContainer justify="between" align="center">
          <div>
            <h4 className="font-medium text-sm">{user.name}</h4>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.isPremium ? "default" : "secondary"} className="text-xs">
            {user.isPremium ? t('table.premium') : t('table.basic')}
          </Badge>
        </FlexContainer>
        
        <div className="text-xs text-muted-foreground">
          <p>{t('mobile.registration')}: {new Date(user.registeredAt).toLocaleDateString('cs-CZ')}</p>
          {user.premiumUntil && (
            <p>{t('mobile.premiumUntil')}: {new Date(user.premiumUntil).toLocaleDateString('cs-CZ')}</p>
          )}
        </div>
        
        <FlexContainer justify="between" align="center" className="pt-2 border-t">
          <FlexContainer align="center" gap="sm">
            <Switch
              id={`premium-${user.id}`}
              checked={user.isPremium}
              onCheckedChange={() => onTogglePremium(user.id)}
            />
            <Label htmlFor={`premium-${user.id}`} className="text-xs">
              {t('mobile.premiumStatus')}
            </Label>
          </FlexContainer>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTogglePremium(user.id)}
            className="text-xs h-8"
          >
            {user.isPremium ? t('mobile.remove') : t('mobile.add')}
          </Button>
        </FlexContainer>
      </FlexContainer>
    </MemoizedCard>
  );
};
