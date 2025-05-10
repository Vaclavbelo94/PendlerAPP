
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Přidáno pro kompletnost
  isPremium: boolean;
  registeredAt: string;
  premiumUntil: string | null; // Datum, do kdy platí premium
}

export const UserAdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Načtení uživatelů z localStorage (v reálné aplikaci by toto přišlo z API)
    const loadUsers = () => {
      setIsLoading(true);
      try {
        let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        
        // Přidáme vlastnost isPremium, pokud neexistuje
        const enhancedUsers = storedUsers.map((user: any) => ({
          ...user,
          id: user.id || Math.random().toString(36).substr(2, 9),
          isPremium: user.isPremium || false,
          registeredAt: user.registeredAt || new Date().toISOString(),
          premiumUntil: user.premiumUntil || null,
          password: user.password || "heslo123" // Výchozí heslo pro existující uživatele bez hesla
        }));
        
        // Přidáme testovacího uživatele s premium, pokud neexistuje
        const testUserExists = enhancedUsers.some((user: User) => user.email === "vaclav@pendlerapp.com");
        
        if (!testUserExists) {
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
          
          enhancedUsers.push({
            id: Math.random().toString(36).substr(2, 9),
            name: "Václav",
            email: "vaclav@pendlerapp.com",
            password: "Vaclav711",
            isPremium: true,
            registeredAt: new Date().toISOString(),
            premiumUntil: threeMonthsLater.toISOString()
          });
          
          toast.success("Vytvořen testovací uživatelský účet s premium funkcemi");
        }
        
        setUsers(enhancedUsers);
        
        // Uložení zpět do localStorage s novými vlastnostmi
        localStorage.setItem("users", JSON.stringify(enhancedUsers));
      } catch (error) {
        console.error("Chyba při načítání uživatelů:", error);
        toast.error("Nepodařilo se načíst uživatele");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const togglePremium = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        // Pokud zapínáme premium, nastavíme datum konce za 3 měsíce
        // Pokud vypínáme premium, nastavíme datum konce na null
        const premiumUntil = !user.isPremium ? 
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() :
          null;
        
        return { 
          ...user, 
          isPremium: !user.isPremium,
          premiumUntil
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    const user = updatedUsers.find(u => u.id === userId);
    toast.success(`Uživatel ${user?.name} nyní ${user?.isPremium ? 'má' : 'nemá'} premium status`);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Načítání uživatelů...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Shield className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Žádní uživatelé</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            V systému zatím nejsou registrovaní žádní uživatelé.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jméno</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Datum registrace</TableHead>
              <TableHead>Premium do</TableHead>
              <TableHead>Premium status</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`premium-${user.id}`}
                      checked={user.isPremium}
                      onCheckedChange={() => togglePremium(user.id)}
                    />
                    <Label htmlFor={`premium-${user.id}`}>
                      {user.isPremium ? "Premium" : "Základní"}
                    </Label>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => togglePremium(user.id)}
                  >
                    {user.isPremium ? "Odebrat premium" : "Přidat premium"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
