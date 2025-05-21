
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, Palette, Eye, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
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
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [selectedColorScheme, setSelectedColorScheme] = useState(initialColorScheme);
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
  
  // Synchronizovat stav barevného schématu s globálním schématem
  useEffect(() => {
    setSelectedColorScheme(colorScheme);
  }, [colorScheme]);
  
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
  
  // Nastavit globální barevné schéma při změně colorScheme
  useEffect(() => {
    // Ověříme, že selectedColorScheme je validní hodnota pro setColorScheme
    const validColorScheme = ['purple', 'blue', 'green', 'amber', 'red', 'pink'].includes(selectedColorScheme) 
      ? selectedColorScheme 
      : 'purple';
      
    setColorScheme(validColorScheme as any);
  }, [selectedColorScheme, setColorScheme]);
  
  const handleSave = () => {
    onSave({ 
      darkMode, 
      colorScheme: selectedColorScheme, 
      compactMode 
    });
    toast.success("Nastavení vzhledu bylo uloženo");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <span>Přizpůsobení vzhledu</span>
        </CardTitle>
        <CardDescription>
          Upravte si vzhled aplikace podle svých preferencí
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" className={isChangingTheme ? 'pointer-events-none' : ''}>
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-2'}`}>
            <TabsTrigger value="theme">Motiv</TabsTrigger>
            <TabsTrigger value="layout">Rozložení</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-4 pt-4">
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
            
            <div className="space-y-4">
              <div>
                <Label className="text-base">Barevné schéma</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Vyberte si primární barvu aplikace
                </p>
              </div>
              
              <RadioGroup value={selectedColorScheme} onValueChange={setSelectedColorScheme} className="grid grid-cols-3 gap-4">
                <ColorOption value="purple" label="Fialová" color="#8884d8" selected={selectedColorScheme === "purple"} />
                <ColorOption value="blue" label="Modrá" color="#0ea5e9" selected={selectedColorScheme === "blue"} />
                <ColorOption value="green" label="Zelená" color="#10b981" selected={selectedColorScheme === "green"} />
                <ColorOption value="amber" label="Jantarová" color="#f59e0b" selected={selectedColorScheme === "amber"} />
                <ColorOption value="red" label="Červená" color="#ef4444" selected={selectedColorScheme === "red"} />
                <ColorOption value="pink" label="Růžová" color="#ec4899" selected={selectedColorScheme === "pink"} />
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4 pt-4">
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
          </TabsContent>
        </Tabs>
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

interface ColorOptionProps {
  value: string;
  label: string;
  color: string;
  selected: boolean;
}

const ColorOption = ({ value, label, color, selected }: ColorOptionProps) => (
  <Label
    htmlFor={`color-${value}`}
    className={`relative flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
      selected ? 'border-primary' : ''
    }`}
  >
    <RadioGroupItem value={value} id={`color-${value}`} className="sr-only" />
    <div className="mb-3 h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs">{label}</span>
    {selected && (
      <CheckCircle className="h-5 w-5 absolute top-1 right-1 text-primary" />
    )}
  </Label>
);

export default ProfileAppearance;
