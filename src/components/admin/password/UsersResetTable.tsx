
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Link as LinkIcon } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
}

interface UsersResetTableProps {
  users: User[];
  resetLinks: {[key: string]: string};
  onGenerateResetLink: (userId: string, email: string) => void;
  onCopyLink: (link: string) => void;
}

export const UsersResetTable = ({ 
  users, 
  resetLinks, 
  onGenerateResetLink, 
  onCopyLink 
}: UsersResetTableProps) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Jméno</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              {resetLinks[user.id] ? (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyLink(resetLinks[user.id])}
                    className="gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Kopírovat</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateResetLink(user.id, user.email)}
                  className="gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Odeslat reset email</span>
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
