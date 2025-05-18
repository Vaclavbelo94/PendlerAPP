
import React from "react";

const LanguageStatsWidget = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Naučená slova</div>
          <div className="text-2xl font-bold">364</div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Aktivní dny</div>
          <div className="text-2xl font-bold">28</div>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Nejlepší kategorie</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pracovní slovíčka</span>
            <span>94%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Doprava</span>
            <span>78%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Každodenní fráze</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageStatsWidget;
