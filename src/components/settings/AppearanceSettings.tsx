
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Palette, Monitor, Sun, Moon, Smartphone } from 'lucide-react';
import { toast } from "sonner";
import { useTheme } from '@/hooks/useTheme';

export const AppearanceSettings = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setCompactMode(parsed.compactMode ?? false);
        setFontSize(parsed.fontSize ?? 'medium');
        setAnimations(parsed.animations ?? true);
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      }
    }
  }, []);

  // Auto-save when settings change
  useEffect(() => {
    const settings = {
      theme,
      colorScheme,
      compactMode,
      fontSize,
      animations
    };
    
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    
    // Apply settings to document
    document.documentElement.setAttribute('data-compact-mode', compactMode.toString());
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-animations', animations.toString());
  }, [theme, colorScheme, compactMode, fontSize, animations]);

  const colorSchemes = [
    { value: 'blue', label: 'Modrá', color: 'bg-blue-500' },
    { value: 'purple', label: 'Fialová', color: 'bg-purple-500' },
    { value: 'green', label: 'Zelená', color: 'bg-green-500' },
    { value: 'amber', label: 'Oranžová', color: 'bg-amber-500' },
    { value: 'red', label: 'Červená', color: 'bg-red-500' },
    { value: 'pink', label: 'Růžová', color: 'bg-pink-500' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Téma aplikace
          </CardTitle>
          <CardDescription>
            Vyberte si vzhled podle svých preferencí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Barevné téma</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center gap-2 h-12"
              >
                <Sun className="h-4 w-4" />
                <span>Světlé</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2 h-12"
              >
                <Moon className="h-4 w-4" />
                <span>Tmavé</span>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Barevné schéma</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorSchemes.map((scheme) => (
                <Button
                  key={scheme.value}
                  variant={colorScheme === scheme.value ? 'default' : 'outline'}
                  onClick={() => setColorScheme(scheme.value as any)}
                  className="flex flex-col items-center gap-2 h-16"
                >
                  <div className={`w-6 h-6 rounded-full ${scheme.color}`} />
                  <span className="text-xs">{scheme.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Zobrazení a rozhraní
          </CardTitle>
          <CardDescription>
            Přizpůsobte si rozložení a velikost prvků
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode">Kompaktní režim</Label>
              <p className="text-sm text-muted-foreground">
                Menší rozestupy a kompaktnější rozložení
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={compactMode}
              onCheckedChange={(checked) => {
                setCompactMode(checked);
                toast.success("Kompaktní režim " + (checked ? "zapnut" : "vypnut"));
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Animace</Label>
              <p className="text-sm text-muted-foreground">
                Povolit animace a přechody
              </p>
            </div>
            <Switch
              id="animations"
              checked={animations}
              onCheckedChange={(checked) => {
                setAnimations(checked);
                toast.success("Animace " + (checked ? "zapnuty" : "vypnuty"));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Velikost písma</Label>
            <Select value={fontSize} onValueChange={(value) => {
              setFontSize(value);
              toast.success("Velikost písma změněna na " + value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte velikost písma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Malé</SelectItem>
                <SelectItem value="medium">Střední</SelectItem>
                <SelectItem value="large">Velké</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Všechna nastavení se ukládají automaticky při změně
        </p>
      </div>
    </div>
  );
};
