
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Crown,
  Shield,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string | null;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  last_login: string | null;
}

interface UserManagementTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onTogglePremium: (userId: string) => void;
  onToggleAdmin: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onViewUser: (userId: string) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onTogglePremium,
  onToggleAdmin,
  onDeleteUser,
  onViewUser
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length && users.length > 0}
              onChange={onSelectAll}
              className="rounded"
            />
          </TableHead>
          <TableHead>Uživatel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registrace</TableHead>
          <TableHead>Aktivita</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => onSelectUser(user.id)}
                className="rounded"
              />
            </TableCell>
            
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.username || user.email.split('@')[0]}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <div className="flex gap-1">
                {user.is_admin && (
                  <Badge variant="destructive" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                {user.is_premium && (
                  <Badge variant="default" className="text-xs bg-amber-100 text-amber-800">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {!user.is_admin && !user.is_premium && (
                  <Badge variant="secondary" className="text-xs">
                    Běžný
                  </Badge>
                )}
              </div>
            </TableCell>
            
            <TableCell>
              <div className="text-sm">
                {new Date(user.created_at).toLocaleDateString('cs-CZ')}
              </div>
            </TableCell>
            
            <TableCell>
              <div className="flex items-center gap-1">
                {user.last_login ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(user.last_login).toLocaleDateString('cs-CZ')}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">Nikdy</span>
                  </>
                )}
              </div>
            </TableCell>
            
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akce</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewUser(user.id)}>
                    Zobrazit detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTogglePremium(user.id)}>
                    {user.is_premium ? 'Odebrat Premium' : 'Přidat Premium'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleAdmin(user.id)}>
                    {user.is_admin ? 'Odebrat Admin' : 'Přidat Admin'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-600"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Smazat uživatele
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
