
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Moon, Sun, Palette } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileAppearanceProps {
  initialDarkMode?: boolean;
  initialColorScheme?: string;
  initialCompactMode?: boolean;
  onSave?: (settings: {
    darkMode: boolean;
    colorScheme: string;
    compactMode: boolean;
  }) => void;
}

const ProfileAppearance = ({
  initialDarkMode = false,
  initialColorScheme = "purple",
  initialCompactMode = false,
  onSave
}: ProfileAppearanceProps) => {
  const { theme, setTheme, colorScheme, setColorScheme, isChangingTheme } = useTheme();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Načtení nastavení z databáze při načtení komponenty
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_appearance_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání nastavení vzhledu:', error);
          throw error;
        }

        if (data) {
          setDarkMode(data.dark_mode);
          setColorScheme(data.color_scheme);
          setCompactMode(data.compact_mode);
        }
      } catch (error) {
        console.error('Chyba při načítání nastavení vzhledu:', error);
        toast.error("Nepodařilo se načíst nastavení vzhledu");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppearanceSettings();
  }, [user]);
  
  // Synchronizovat stav dark mode s globálním tématem
  useEffect(() => {
    if (!isChangingTheme) {
      setDarkMode(theme === 'dark');
    }
  }, [theme, isChangingTheme]);
  
  // Nastavit globální téma při změně darkMode přepínače
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Zkontrolujeme, zda nastavení už existuje
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_appearance_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const settingsData = {
        user_id: user.id,
        dark_mode: darkMode,
        color_scheme: colorScheme,
        compact_mode: compactMode,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingSettings) {
        // Aktualizace existujícího nastavení
        result = await supabase
          .from('user_appearance_settings')
          .update(settingsData)
          .eq('user_id', user.id);
      } else {
        // Vytvoření nového nastavení
        result = await supabase
          .from('user_appearance_settings')
          .insert(settingsData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success("Nastavení vzhledu bylo uloženo");
      
      if (onSave) {
        onSave({ 
          darkMode, 
          colorScheme,
          compactMode 
        });
      }
    } catch (error) {
      console.error('Chyba při ukládání nastavení vzhledu:', error);
      toast.error("Nepodařilo se uložit nastavení vzhledu");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
          <Eye className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          <span>Nastavení vzhledu</span>
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
          Upravte si základní nastavení zobrazení aplikace
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-4' : ''}`}>
        <div className="space-y-6">
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <Label htmlFor="darkMode" className={`${isMobile ? 'text-sm' : 'text-base'} flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
                {darkMode ? (
                  <Moon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                ) : (
                  <Sun className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                )}
                <span>Tmavý režim</span>
              </Label>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'text-center mt-1' : ''}`}>
                Tmavý režim je šetrnější k očím při používání v noci
              </p>
            </div>
            <Switch 
              id="darkMode" 
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled={isChangingTheme}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <Label htmlFor="colorScheme" className={`${isMobile ? 'text-sm' : 'text-base'} flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
                <Palette className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <span>Barevné schéma</span>
              </Label>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'text-center mt-1' : ''}`}>
                Vyberte hlavní barvu aplikace
              </p>
            </div>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-32'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purple">Fialová</SelectItem>
                <SelectItem value="blue">Modrá</SelectItem>
                <SelectItem value="green">Zelená</SelectItem>
                <SelectItem value="amber">Oranžová</SelectItem>
                <SelectItem value="red">Červená</SelectItem>
                <SelectItem value="pink">Růžová</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="my-4" />
          
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <Label htmlFor="compactMode" className={`${isMobile ? 'text-sm' : 'text-base'}`}>Kompaktní režim</Label>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'text-center mt-1' : ''}`}>
                Zmenší velikost prvků a mezery mezi nimi
              </p>
            </div>
            <Switch 
              id="compactMode" 
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className={`${isMobile ? 'px-4' : ''}`}>
        <Button 
          onClick={handleSave} 
          className={`${isMobile ? 'w-full' : 'ml-auto'}`}
          disabled={isChangingTheme || isLoading}
          size={isMobile ? "sm" : "default"}
        >
          {isLoading ? "Ukládání..." : "Uložit nastavení"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileAppearance;
