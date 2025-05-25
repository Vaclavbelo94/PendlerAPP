
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { useMemoizedCallback } from "@/hooks/useMemoizedCallback";

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  registeredAt: string;
  premiumUntil: string | null;
}

export const useUserAdminLogic = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Optimalizovaný query pro načítání uživatelů
  const { data: profiles, isLoading, error, refetch } = useOptimizedQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Načítání uživatelů...");
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          email, 
          is_premium, 
          premium_expiry, 
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Chyba při načítání profilů:", error);
        throw error;
      }

      console.log("Načtená data:", data);
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minuty pro admin data
    dependencies: []
  });

  // Transformace dat s memoizací
  useEffect(() => {
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
    } else if (profiles && profiles.length === 0) {
      console.log("Žádní uživatelé nebyli nalezeni");
      setUsers([]);
    }
  }, [profiles]);

  // Optimalizovaný callback pro toggle premium
  const togglePremium = useMemoizedCallback(async (userId: string) => {
    console.log(`Hledání uživatele s ID: ${userId}`);
    console.log("Dostupní uživatelé:", users.map(u => ({ id: u.id, email: u.email, isPremium: u.isPremium })));
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      console.error("Uživatel nenalezen v lokálním stavu:", userId);
      
      // Pokusíme se načíst aktuální data z databáze
      try {
        const { data: dbUser, error } = await supabase
          .from('profiles')
          .select('id, username, email, is_premium, premium_expiry')
          .eq('id', userId)
          .single();
          
        if (error || !dbUser) {
          console.error("Uživatel neexistuje v databázi:", error);
          toast.error("Uživatel nebyl nalezen v databázi");
          return;
        }
        
        // Použijeme data z databáze a správně toggleujeme
        console.log("Použijeme data z databáze:", dbUser);
        const currentPremiumStatus = dbUser.is_premium || false;
        const newPremiumStatus = !currentPremiumStatus;
        const premiumUntil = newPremiumStatus ? 
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : 
          null;
        
        console.log(`Toggleování premium z ${currentPremiumStatus} na ${newPremiumStatus}`);
        await updateUserPremiumStatus(userId, newPremiumStatus, premiumUntil, dbUser.email);
        return;
      } catch (dbError) {
        console.error("Chyba při načítání z databáze:", dbError);
        toast.error("Nepodařilo se načíst data uživatele");
        return;
      }
    }
    
    // Správné toggleování premium statusu
    const currentPremiumStatus = user.isPremium;
    const newPremiumStatus = !currentPremiumStatus;
    const premiumUntil = newPremiumStatus ? 
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : 
      null;
    
    console.log(`Toggleování premium pro ${user.email} z ${currentPremiumStatus} na ${newPremiumStatus}`);
    await updateUserPremiumStatus(userId, newPremiumStatus, premiumUntil, user.email);
  }, [users]);

  const updateUserPremiumStatus = async (
    userId: string, 
    newPremiumStatus: boolean, 
    premiumUntil: string | null, 
    userEmail: string
  ) => {
    try {
      console.log(`Aktualizace premium statusu pro uživatele ${userId}: ${newPremiumStatus}`);
      console.log(`Email uživatele: ${userEmail}`);
      console.log(`Premium do: ${premiumUntil}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: newPremiumStatus,
          premium_expiry: premiumUntil
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Chyba při aktualizaci premium statusu:", error);
        toast.error(`Chyba při aktualizaci: ${error.message}`);
        return;
      }
      
      console.log("Premium status úspěšně aktualizován v databázi");
      
      // Aktualizujeme místní stav
      setUsers(prevUsers => 
        prevUsers.map(u => {
          if (u.id === userId) {
            return { 
              ...u, 
              isPremium: newPremiumStatus,
              premiumUntil
            };
          }
          return u;
        })
      );
      
      const userName = users.find(u => u.id === userId)?.name || userEmail.split('@')[0];
      const statusText = newPremiumStatus ? 'má' : 'nemá';
      toast.success(`Uživatel ${userName} nyní ${statusText} premium status`);
      
      // Přidáme informaci o nutnosti opětovného přihlášení
      if (!newPremiumStatus) {
        toast.info("Uživatel musí obnovit stránku nebo se znovu přihlásit pro aktualizaci premium statusu", {
          duration: 5000
        });
      }
      
      // Refresh data to ensure consistency
      await refetch();
    } catch (error) {
      console.error("Neočekávaná chyba při aktualizaci premium statusu:", error);
      toast.error("Nepodařilo se aktualizovat premium status");
    }
  };

  return {
    users,
    isLoading,
    error,
    refetch,
    togglePremium
  };
};
