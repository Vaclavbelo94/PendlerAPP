
import React from "react";
import { Info } from "lucide-react";

const InfoDisclaimer: React.FC = () => {
  return (
    <div className="bg-muted/50 p-3 md:p-4 rounded-lg flex items-start md:items-center space-x-2 text-xs md:text-sm text-muted-foreground">
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5 md:mt-0" />
      <p>
        Vygenerované dokumenty slouží jako pomůcka pro přípravu vašeho daňového přiznání. 
        Přestože jsou připraveny podle aktuálních předpisů, zkontrolujte si všechny údaje 
        před oficiálním podáním.
      </p>
    </div>
  );
};

export default InfoDisclaimer;
