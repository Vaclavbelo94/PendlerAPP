
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface UserProfileSettings {
  id: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  emailNotifications: boolean;
  shiftNotifications: boolean;
  languageReminders: boolean;
  preferredLanguage: string;
}

const ProfileSettings = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Načítání...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rozšířené nastavení profilu</CardTitle>
        <CardDescription>
          Upravte si své osobní údaje a nastavení
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Osobní údaje</h3>
          
          <div className="space-y-2 relative">
            <Label htmlFor="displayName">Zobrazované jméno</Label>
            <div className="relative">
              <Input
                id="displayName"
                value={profileSettings.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Zadejte své jméno"
                className={filledFields.displayName ? "pr-10" : ""}
              />
              {filledFields.displayName && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">O mně</Label>
            <div className="relative">
              <Textarea
                id="bio"
                value={profileSettings.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Napište něco o sobě"
                className={filledFields.bio ? "pr-10" : ""}
              />
              {filledFields.bio && (
                <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Krátký popis, který se zobrazí na vašem profilu</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Bydliště</Label>
              <div className="relative">
                <Input
                  id="location"
                  value={profileSettings.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Např. Praha, CZ"
                  className={filledFields.location ? "pr-10" : ""}
                />
                {filledFields.location && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Webová stránka</Label>
              <div className="relative">
                <Input
                  id="website"
                  value={profileSettings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className={filledFields.website ? "pr-10" : ""}
                />
                {filledFields.website && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Nastavení oznámení</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">E-mailová oznámení</Label>
              <p className="text-sm text-muted-foreground">Dostávat důležitá oznámení e-mailem</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={profileSettings.emailNotifications}
              onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shiftNotifications">Oznámení o směnách</Label>
              <p className="text-sm text-muted-foreground">Dostávat upozornění o začátku směny</p>
            </div>
            <Switch
              id="shiftNotifications"
              checked={profileSettings.shiftNotifications}
              onCheckedChange={(checked) => handleInputChange('shiftNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="languageReminders">Jazyková připomenutí</Label>
              <p className="text-sm text-muted-foreground">Dostávat připomenutí pro učení slovíček</p>
            </div>
            <Switch
              id="languageReminders"
              checked={profileSettings.languageReminders}
              onCheckedChange={(checked) => handleInputChange('languageReminders', checked)}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Předvolby</h3>
          
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferovaný jazyk</Label>
            <Select 
              value={profileSettings.preferredLanguage} 
              onValueChange={(value) => handleInputChange('preferredLanguage', value)}
            >
              <SelectTrigger id="preferredLanguage" className="w-full">
                <SelectValue placeholder="Vyberte jazyk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Čeština</SelectItem>
                <SelectItem value="de">Němčina</SelectItem>
                <SelectItem value="en">Angličtina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={loading}>
          {loading ? "Ukládání..." : "Uložit nastavení"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
