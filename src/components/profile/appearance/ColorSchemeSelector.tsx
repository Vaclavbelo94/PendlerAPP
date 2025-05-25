
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ColorSchemeSelectorProps {
  colorScheme: string;
  onColorSchemeChange: (value: string) => void;
}

const ColorSchemeSelector = ({ colorScheme, onColorSchemeChange }: ColorSchemeSelectorProps) => {
  const isMobile = useIsMobile();

  return (
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
      <Select value={colorScheme} onValueChange={onColorSchemeChange}>
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
  );
};

export default ColorSchemeSelector;
