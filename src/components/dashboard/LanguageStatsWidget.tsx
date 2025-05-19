
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const LanguageStatsWidget = () => {
  // Detekce mobilního zařízení
  const isMobile = useMediaQuery("xs");
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="bg-muted/50 p-2 sm:p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Naučená slova</div>
          <div className="text-lg sm:text-2xl font-bold">364</div>
        </div>
        <div className="bg-muted/50 p-2 sm:p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Aktivní dny</div>
          <div className="text-lg sm:text-2xl font-bold">28</div>
        </div>
      </div>
      <div>
        <div className="mb-1 sm:mb-2 text-sm font-medium">Nejlepší kategorie</div>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Pracovní slovíčka</span>
            <span>94%</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Doprava</span>
            <span>78%</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Každodenní fráze</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageStatsWidget;
