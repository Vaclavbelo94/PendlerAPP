
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Copy, Link as LinkIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  username: string;
  email: string;
}

export const PasswordResetPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [resetLinks, setResetLinks] = useState<{[key: string]: string}>({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Zadejte email nebo jméno uživatele");
      return;
    }

    setIsSearching(true);
    try {
      const term = searchTerm.toLowerCase();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email')
        .or(`email.ilike.%${term}%,username.ilike.%${term}%`);
      
      if (error) {
        console.error("Chyba při hledání uživatelů:", error);
        toast.error("Nepodařilo se vyhledat uživatele");
        return;
      }
      
      const filteredUsers = data?.map(profile => ({
        id: profile.id,
        username: profile.username || profile.email?.split('@')[0] || 'Uživatel',
        email: profile.email || ''
      })) || [];
      
      setUsers(filteredUsers);
      
      if (filteredUsers.length === 0) {
        toast.info("Žádní uživatelé nenalezeni");
      } else {
        toast.success(`Nalezeno ${filteredUsers.length} uživatelů`);
      }
    } catch (error) {
      console.error("Chyba při hledání uživatelů:", error);
      toast.error("Nepodařilo se vyhledat uživatele");
    } finally {
      setIsSearching(false);
    }
  };

  const generateResetLink = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error("Chyba při generování reset linku:", error);
        toast.error("Nepodařilo se vygenerovat reset link");
        return;
      }
      
      // Vytvoříme mock link pro zobrazení (v reálné situaci by Supabase poslal email)
      const mockResetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`;
      
      setResetLinks({
        ...resetLinks,
        [userId]: mockResetLink
      });
      
      toast.success("Reset email byl odeslán uživateli");
    } catch (error) {
      console.error("Chyba při generování reset linku:", error);
      toast.error("Nepodařilo se vygenerovat reset link");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Odkaz zkopírován do schránky");
      },
      (err) => {
        console.error('Nepodařilo se zkopírovat odkaz: ', err);
        toast.error("Nepodařilo se zkopírovat odkaz");
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="searchUser">Vyhledat uživatele</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="searchUser"
                placeholder="Zadejte email nebo jméno uživatele"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Hledám...
                </>
              ) : (
                "Hledat"
              )}
            </Button>
          </div>
        </div>
      </div>

      {users.length > 0 && (
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
                        onClick={() => copyToClipboard(resetLinks[user.id])}
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
                      onClick={() => generateResetLink(user.id, user.email)}
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
      )}
      
      {resetLinks && Object.keys(resetLinks).length > 0 && (
        <div className="space-y-2 pt-4">
          <h3 className="text-lg font-medium">Vygenerované odkazy pro reset hesla</h3>
          <div className="space-y-2">
            {Object.entries(resetLinks).map(([userId, link]) => {
              const user = users.find(u => u.id === userId);
              return (
                <div key={userId} className="flex flex-col gap-2 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(link)}
                      className="gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Kopírovat</span>
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-xs font-mono overflow-x-auto">
                    {link}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
