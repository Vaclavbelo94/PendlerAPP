
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface CompactModeToggleProps {
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
}

const CompactModeToggle = ({ compactMode, setCompactMode }: CompactModeToggleProps) => {
  const isMobile = useIsMobile();

  return (
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
  );
};

export default CompactModeToggle;
