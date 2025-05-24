
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Moon, Sun, Palette } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileAppearanceProps {
  initialDarkMode: boolean;
  initialColorScheme: string;
  initialCompactMode: boolean;
  onSave: (settings: {
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
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const isMobile = useIsMobile();
  
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  
  // Synchronizovat stav dark mode s globálním tématem
  useEffect(() => {
    if (!isChangingTheme) {
      setDarkMode(theme === 'dark');
    }
  }, [theme, isChangingTheme]);
  
  // Nastavit globální téma při změně darkMode přepínače
  useEffect(() => {
    setIsChangingTheme(true);
    const timer = setTimeout(() => {
      setTheme(darkMode ? 'dark' : 'light');
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 100);
    }, 0);
    
    return () => {
      clearTimeout(timer);
    };
  }, [darkMode, setTheme]);
  
  const handleSave = () => {
    onSave({ 
      darkMode, 
      colorScheme,
      compactMode 
    });
    toast.success("Nastavení vzhledu bylo uloženo");
  };
  
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
              onCheckedChange={(checked) => {
                setIsChangingTheme(true);
                setDarkMode(checked);
              }}
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
          disabled={isChangingTheme}
          size={isMobile ? "sm" : "default"}
        >
          Uložit nastavení
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileAppearance;
