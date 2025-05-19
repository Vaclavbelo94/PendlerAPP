
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfileSettings } from "./ProfileSettingsTypes";

export const useProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileSettings, setProfileSettings] = useState<UserProfileSettings>({
    id: "",
    displayName: "",
    bio: "",
    location: "",
    website: "",
    emailNotifications: true,
    shiftNotifications: true,
    languageReminders: true,
    preferredLanguage: "cs",
  });
  
  // Track which fields have been changed by the user
  const [filledFields, setFilledFields] = useState<Record<string, boolean>>({
    displayName: false,
    bio: false,
    location: false,
    website: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Pokus o načtení rozšířeného profilu ze Supabase
        const { data, error } = await supabase
          .from('user_extended_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání profilu:', error);
          throw error;
        }

        if (data) {
          // Profil existuje, nastavíme data
          const loadedProfile = {
            id: data.user_id,
            displayName: data.display_name || user.user_metadata?.username || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            emailNotifications: data.email_notifications !== undefined ? data.email_notifications : true,
            shiftNotifications: data.shift_notifications !== undefined ? data.shift_notifications : true,
            languageReminders: data.language_reminders !== undefined ? data.language_reminders : true,
            preferredLanguage: data.preferred_language || "cs",
          };
          
          setProfileSettings(loadedProfile);
          
          // Set filled fields based on loaded data
          setFilledFields({
            displayName: !!loadedProfile.displayName,
            bio: !!loadedProfile.bio,
            location: !!loadedProfile.location,
            website: !!loadedProfile.website,
          });
        } else {
          // Profil neexistuje, nastavíme výchozí hodnoty
          setProfileSettings({
            id: user.id,
            displayName: user.user_metadata?.username || user.email?.split('@')[0] || "",
            bio: "",
            location: "",
            website: "",
            emailNotifications: true,
            shiftNotifications: true,
            languageReminders: true,
            preferredLanguage: "cs",
          });
          
          // Set displayName as filled if it comes from user metadata
          setFilledFields({
            displayName: !!(user.user_metadata?.username || user.email?.split('@')[0]),
            bio: false,
            location: false,
            website: false,
          });
        }
      } catch (error) {
        console.error('Chyba při načítání profilu:', error);
        toast.error("Nepodařilo se načíst data profilu");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (field: keyof typeof profileSettings, value: string | boolean) => {
    setProfileSettings(prev => ({ ...prev, [field]: value }));
    
    // Only update filled state for text fields
    if (typeof value === 'string' && ['displayName', 'bio', 'location', 'website'].includes(field)) {
      setFilledFields(prev => ({ 
        ...prev, 
        [field]: value.trim().length > 0 
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Kontrola, zda profil existuje
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_extended_profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Chyba při kontrole existence profilu:', checkError);
        throw checkError;
      }

      let result;
      if (existingProfile) {
        // Aktualizace existujícího profilu
        result = await supabase
          .from('user_extended_profiles')
          .update({
            display_name: profileSettings.displayName,
            bio: profileSettings.bio,
            location: profileSettings.location,
            website: profileSettings.website,
            email_notifications: profileSettings.emailNotifications,
            shift_notifications: profileSettings.shiftNotifications,
            language_reminders: profileSettings.languageReminders,
            preferred_language: profileSettings.preferredLanguage,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Vytvoření nového profilu
        result = await supabase
          .from('user_extended_profiles')
          .insert({
            user_id: user.id,
            display_name: profileSettings.displayName,
            bio: profileSettings.bio,
            location: profileSettings.location,
            website: profileSettings.website,
            email_notifications: profileSettings.emailNotifications,
            shift_notifications: profileSettings.shiftNotifications,
            language_reminders: profileSettings.languageReminders,
            preferred_language: profileSettings.preferredLanguage
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success("Profil byl úspěšně uložen");
    } catch (error) {
      console.error('Chyba při ukládání profilu:', error);
      toast.error("Nepodařilo se uložit data profilu");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profileSettings,
    filledFields,
    handleInputChange,
    handleSaveProfile
  };
};
