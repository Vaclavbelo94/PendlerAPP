
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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
          setProfileSettings({
            id: data.user_id,
            displayName: data.display_name || user.user_metadata?.username || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            emailNotifications: data.email_notifications !== undefined ? data.email_notifications : true,
            shiftNotifications: data.shift_notifications !== undefined ? data.shift_notifications : true,
            languageReminders: data.language_reminders !== undefined ? data.language_reminders : true,
            preferredLanguage: data.preferred_language || "cs",
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
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Zobrazované jméno</Label>
            <Input
              id="displayName"
              value={profileSettings.displayName}
              onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Zadejte své jméno"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">O mně</Label>
            <Input
              id="bio"
              value={profileSettings.bio}
              onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Napište něco o sobě"
            />
            <p className="text-sm text-muted-foreground">Krátký popis, který se zobrazí na vašem profilu</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Bydliště</Label>
              <Input
                id="location"
                value={profileSettings.location}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Např. Praha, CZ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Webová stránka</Label>
              <Input
                id="website"
                value={profileSettings.website}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
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
              onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, emailNotifications: checked }))}
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
              onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, shiftNotifications: checked }))}
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
              onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, languageReminders: checked }))}
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
              onValueChange={(value) => setProfileSettings(prev => ({ ...prev, preferredLanguage: value }))}
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
