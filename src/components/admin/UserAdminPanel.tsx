
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  registeredAt: string;
  premiumUntil: string | null;
}

export const UserAdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        console.log("Načítání uživatelů...");
        
        // Načtení všech profilů z databáze
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, email, is_premium, premium_expiry, created_at')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Chyba při načítání profilů:", error);
          throw error;
        }

        console.log("Načtené profily:", profiles);

        if (profiles && profiles.length > 0) {
          const transformedUsers: User[] = profiles.map(profile => ({
            id: profile.id,
            name: profile.username || profile.email?.split('@')[0] || 'Uživatel',
            email: profile.email || '',
            isPremium: profile.is_premium || false,
            registeredAt: profile.created_at,
            premiumUntil: profile.premium_expiry || null
          }));
          
          setUsers(transformedUsers);
          console.log("Transformovaní uživatelé:", transformedUsers);
          toast.success(`Načteno ${transformedUsers.length} uživatelů`);
        } else {
          console.log("Žádní uživatelé nebyli nalezeni");
          setUsers([]);
        }
      } catch (error) {
        console.error("Chyba při načítání uživatelů:", error);
        toast.error("Nepodařilo se načíst uživatele z databáze");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const togglePremium = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newPremiumStatus = !user.isPremium;
    
    // Vypočítat datum expirace premium (90 dní od teď)
    const premiumUntil = newPremiumStatus ? 
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : 
      null;
    
    try {
      console.log(`Aktualizace premium statusu pro uživatele ${userId}: ${newPremiumStatus}`);
      
      // Aktualizace v Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: newPremiumStatus,
          premium_expiry: premiumUntil
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Chyba při aktualizaci premium statusu:", error);
        throw error;
      }
      
      // Aktualizace lokálního stavu
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { 
            ...u, 
            isPremium: newPremiumStatus,
            premiumUntil
          };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      toast.success(`Uživatel ${user.name} nyní ${newPremiumStatus ? 'má' : 'nemá'} premium status`);
    } catch (error) {
      console.error("Chyba při aktualizaci premium statusu:", error);
      toast.error("Nepodařilo se aktualizovat premium status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Načítání uživatelů...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Shield className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Žádní uživatelé</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          V systému zatím nejsou registrovaní žádní uživatelé nebo nemáte oprávnění je zobrazit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Celkem uživatelů: {users.length}
        </p>
      </div>
      
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
              <TableCell>{new Date(user.registeredAt).toLocaleDateString('cs-CZ')}</TableCell>
              <TableCell>
                {user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString('cs-CZ') : "-"}
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
    </div>
  );
};
