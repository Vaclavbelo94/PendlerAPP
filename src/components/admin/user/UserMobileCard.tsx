
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FlexContainer } from "@/components/ui/flex-container";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-4">
      <FlexContainer direction="col" gap="sm">
        <FlexContainer justify="between" align="center">
          <div>
            <h4 className="font-medium text-sm">{user.name}</h4>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant={user.isPremium ? "default" : "secondary"} className="text-xs">
            {user.isPremium ? "Premium" : "Základní"}
          </Badge>
        </FlexContainer>
        
        <div className="text-xs text-muted-foreground">
          <p>Registrace: {new Date(user.registeredAt).toLocaleDateString('cs-CZ')}</p>
          {user.premiumUntil && (
            <p>Premium do: {new Date(user.premiumUntil).toLocaleDateString('cs-CZ')}</p>
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
              Premium status
            </Label>
          </FlexContainer>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTogglePremium(user.id)}
            className="text-xs h-8"
          >
            {user.isPremium ? "Odebrat" : "Přidat"}
          </Button>
        </FlexContainer>
      </FlexContainer>
    </Card>
  );
};
