
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
    phoneNumber: "",
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
    phoneNumber: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Load profile data from both profiles and user_extended_profiles
        const [profilesResponse, extendedResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('username, phone_number')
            .eq('id', user.id)
            .single(),
          supabase
            .from('user_extended_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
        ]);

        const profileData = profilesResponse.data;
        const extendedData = extendedResponse.data;

        if (profilesResponse.error && profilesResponse.error.code !== 'PGRST116') {
          throw profilesResponse.error;
        }

        if (extendedResponse.error && extendedResponse.error.code !== 'PGRST116') {
          console.error('Extended profile error:', extendedResponse.error);
        }

        const loadedProfile = {
          id: user.id,
          displayName: extendedData?.display_name || profileData?.username || user.user_metadata?.username || "",
          bio: extendedData?.bio || "",
          location: extendedData?.location || "",
          website: extendedData?.website || "",
          phoneNumber: profileData?.phone_number || "",
          emailNotifications: extendedData?.email_notifications !== undefined ? extendedData.email_notifications : true,
          shiftNotifications: extendedData?.shift_notifications !== undefined ? extendedData.shift_notifications : true,
          languageReminders: extendedData?.language_reminders !== undefined ? extendedData.language_reminders : true,
          preferredLanguage: extendedData?.preferred_language || "cs",
        };
        
        setProfileSettings(loadedProfile);
        
        // Set filled fields based on loaded data
        setFilledFields({
          displayName: !!loadedProfile.displayName,
          bio: !!loadedProfile.bio,
          location: !!loadedProfile.location,
          website: !!loadedProfile.website,
          phoneNumber: !!loadedProfile.phoneNumber,
        });
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
    if (typeof value === 'string' && ['displayName', 'bio', 'location', 'website', 'phoneNumber'].includes(field)) {
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
      // Update profiles table with phone number
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone_number: profileSettings.phoneNumber || null
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Check if extended profile exists
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
        // Update existing extended profile
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
        // Create new extended profile
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
