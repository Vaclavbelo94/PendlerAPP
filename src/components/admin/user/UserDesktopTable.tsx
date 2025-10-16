
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FlexContainer } from "@/components/ui/flex-container";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  registeredAt: string;
  premiumUntil: string | null;
}

interface UserDesktopTableProps {
  users: User[];
  onTogglePremium: (userId: string) => void;
}

export const UserDesktopTable = ({ users, onTogglePremium }: UserDesktopTableProps) => {
  const { t } = useTranslation('admin-users');
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.name')}</TableHead>
          <TableHead>{t('table.email')}</TableHead>
          <TableHead>{t('table.registeredAt')}</TableHead>
          <TableHead>{t('table.premiumUntil')}</TableHead>
          <TableHead>{t('table.premiumStatus')}</TableHead>
          <TableHead className="text-right">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{new Date(user.registeredAt).toLocaleDateString('cs-CZ')}</TableCell>
            <TableCell>
              {user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString('cs-CZ') : "-"}
            </TableCell>
            <TableCell>
              <FlexContainer align="center" gap="sm">
                <Switch
                  id={`premium-${user.id}`}
                  checked={user.isPremium}
                  onCheckedChange={() => onTogglePremium(user.id)}
                />
                <Label htmlFor={`premium-${user.id}`}>
                  {user.isPremium ? t('table.premium') : t('table.basic')}
                </Label>
              </FlexContainer>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTogglePremium(user.id)}
              >
                {user.isPremium ? t('table.removePremium') : t('table.addPremium')}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
