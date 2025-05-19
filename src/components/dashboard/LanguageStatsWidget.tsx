
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const LanguageStatsWidget = () => {
  // Detekce mobilního zařízení
  const isMobile = useMediaQuery("xs");
  
  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
        <div className="bg-muted/50 p-1.5 sm:p-3 rounded-lg">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Naučená slova</div>
          <div className="text-base sm:text-xl font-bold">364</div>
        </div>
        <div className="bg-muted/50 p-1.5 sm:p-3 rounded-lg">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Aktivní dny</div>
          <div className="text-base sm:text-xl font-bold">28</div>
        </div>
      </div>
      <div>
        <div className="mb-0.5 sm:mb-1.5 text-xs sm:text-sm font-medium">Nejlepší kategorie</div>
        <div className="space-y-0.5 sm:space-y-1.5">
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span>Pracovní slovíčka</span>
            <span>94%</span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span>Doprava</span>
            <span>78%</span>
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs">
            <span>Každodenní fráze</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageStatsWidget;
