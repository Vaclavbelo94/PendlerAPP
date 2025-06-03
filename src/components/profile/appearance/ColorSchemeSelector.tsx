
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ColorSchemeSelectorProps {
  colorScheme: string;
  onColorSchemeChange: (value: string) => void;
}

const colorSchemes = [
  { value: "purple", label: "Fialová", color: "bg-purple-500" },
  { value: "blue", label: "Modrá", color: "bg-blue-500" },
  { value: "green", label: "Zelená", color: "bg-green-500" },
  { value: "orange", label: "Oranžová", color: "bg-orange-500" },
  { value: "red", label: "Červená", color: "bg-red-500" },
  { value: "yellow", label: "Žlutá", color: "bg-yellow-500" }
];

const ColorSchemeSelector = ({ colorScheme, onColorSchemeChange }: ColorSchemeSelectorProps) => {
  const isMobile = useIsMobile();

  return (
    <div>
      <Label className={`${isMobile ? 'text-sm' : 'text-base'} mb-3 block`}>Barevné schéma</Label>
      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-4`}>
        Vyberte hlavní barvu aplikace
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {colorSchemes.map((scheme) => (
          <Card
            key={scheme.value}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:scale-105",
              colorScheme === scheme.value 
                ? "ring-2 ring-primary shadow-md" 
                : "hover:shadow-md"
            )}
            onClick={() => onColorSchemeChange(scheme.value)}
          >
            <CardContent className={`p-3 ${isMobile ? 'p-2' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={cn("w-6 h-6 rounded-full", scheme.color)} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                  {scheme.label}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;
