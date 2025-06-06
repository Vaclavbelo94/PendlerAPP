
import { useState } from "react";
import { useStandardizedToast } from "@/hooks/useStandardizedToast";
import { supabase } from "@/integrations/supabase/client";
import { PasswordResetSearch } from "./password/PasswordResetSearch";
import { UsersResetTable } from "./password/UsersResetTable";
import { ResetLinksDisplay } from "./password/ResetLinksDisplay";

interface User {
  id: string;
  username: string;
  email: string;
}

export const PasswordResetPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [resetLinks, setResetLinks] = useState<{[key: string]: string}>({});
  const [isSearching, setIsSearching] = useState(false);
  const { success: showSuccess, error: showError, info: showInfo } = useStandardizedToast();

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      showError("Zadejte email nebo jméno uživatele");
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
        showError("Nepodařilo se vyhledat uživatele");
        return;
      }
      
      const filteredUsers = data?.map(profile => ({
        id: profile.id,
        username: profile.username || profile.email?.split('@')[0] || 'Uživatel',
        email: profile.email || ''
      })) || [];
      
      setUsers(filteredUsers);
      
      if (filteredUsers.length === 0) {
        showInfo("Žádní uživatelé nenalezeni");
      } else {
        showSuccess(`Nalezeno ${filteredUsers.length} uživatelů`);
      }
    } catch (error) {
      console.error("Chyba při hledání uživatelů:", error);
      showError("Nepodařilo se vyhledat uživatele");
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
        showError("Nepodařilo se vygenerovat reset link");
        return;
      }
      
      // Vytvoříme mock link pro zobrazení (v reálné situaci by Supabase poslal email)
      const mockResetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`;
      
      setResetLinks({
        ...resetLinks,
        [userId]: mockResetLink
      });
      
      showSuccess("Reset email byl odeslán uživateli");
    } catch (error) {
      console.error("Chyba při generování reset linku:", error);
      showError("Nepodařilo se vygenerovat reset link");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showSuccess("Odkaz zkopírován do schránky");
      },
      (err) => {
        console.error('Nepodařilo se zkopírovat odkaz: ', err);
        showError("Nepodařilo se zkopírovat odkaz");
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <PasswordResetSearch onSearch={handleSearch} isSearching={isSearching} />
      </div>

      <UsersResetTable 
        users={users}
        resetLinks={resetLinks}
        onGenerateResetLink={generateResetLink}
        onCopyLink={copyToClipboard}
      />
      
      <ResetLinksDisplay 
        resetLinks={resetLinks}
        users={users}
        onCopyLink={copyToClipboard}
      />
    </div>
  );
};
