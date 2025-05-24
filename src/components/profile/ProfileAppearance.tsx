
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileAppearanceProps {
  initialDarkMode: boolean;
  initialCompactMode: boolean;
  onSave: (settings: {
    darkMode: boolean;
    compactMode: boolean;
  }) => void;
}

const ProfileAppearance = ({
  initialDarkMode = false,
  initialCompactMode = false,
  onSave
}: ProfileAppearanceProps) => {
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const isMobile = useIsMobile();
  
  // Optimalizace pro mobilní zařízení - předejít problikání
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  
  // Synchronizovat stav dark mode s globálním tématem
  useEffect(() => {
    if (!isChangingTheme) {
      setDarkMode(theme === 'dark');
    }
  }, [theme, isChangingTheme]);
  
  // Nastavit globální téma při změně darkMode přepínače
  useEffect(() => {
    // Zamezit cyklickým aktualizacím při změně témat
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
      compactMode 
    });
    toast.success("Nastavení vzhledu bylo uloženo");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <span>Nastavení vzhledu</span>
        </CardTitle>
        <CardDescription>
          Upravte si základní nastavení zobrazení aplikace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode" className="text-base flex items-center gap-2">
                {darkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>Tmavý režim</span>
              </Label>
              <p className="text-sm text-muted-foreground">
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
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compactMode" className="text-base">Kompaktní režim</Label>
              <p className="text-sm text-muted-foreground">
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
      <CardFooter>
        <Button 
          onClick={handleSave} 
          className="ml-auto"
          disabled={isChangingTheme}
        >
          Uložit nastavení
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileAppearance;
