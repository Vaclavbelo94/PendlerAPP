
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
import { Search, Copy, Link as LinkIcon } from "lucide-react";

export const PasswordResetPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [resetLinks, setResetLinks] = useState<{[key: string]: string}>({});

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Zadejte email nebo jméno uživatele");
      return;
    }

    // Načtení uživatelů z localStorage
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const term = searchTerm.toLowerCase();
      
      const filteredUsers = storedUsers.filter((user: any) =>
        user.email.toLowerCase().includes(term) || 
        (user.name && user.name.toLowerCase().includes(term))
      );
      
      setUsers(filteredUsers);
      
      if (filteredUsers.length === 0) {
        toast.info("Žádní uživatelé nenalezeni");
      }
    } catch (error) {
      console.error("Chyba při hledání uživatelů:", error);
      toast.error("Nepodařilo se vyhledat uživatele");
    }
  };

  const generateResetLink = (userId: string, email: string) => {
    // V reálné aplikaci by toto generovalo unikátní token a ukládalo ho do databáze
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Uložení vygenerovaného odkazu
    setResetLinks({
      ...resetLinks,
      [userId]: resetLink
    });
    
    toast.success("Resetovací odkaz byl vygenerován");
    return resetLink;
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
            <Button onClick={handleSearch}>Hledat</Button>
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
                <TableCell className="font-medium">{user.name}</TableCell>
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
                      <span>Generovat odkaz</span>
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
                      <p className="font-medium">{user?.name}</p>
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
