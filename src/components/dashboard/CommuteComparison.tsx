
import React from "react";
import { Button } from "@/components/ui/button";

const CommuteComparison = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Minulý měsíc</div>
          <div className="text-2xl font-bold">146 km</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Tento měsíc</div>
          <div className="text-2xl font-bold text-green-600">128 km</div>
          <div className="text-xs text-green-600">-12%</div>
        </div>
      </div>
      <div className="pt-2">
        <div className="text-xs text-muted-foreground mb-1">Úspora pohonných hmot</div>
        <div className="text-lg font-medium text-green-600">243 Kč</div>
      </div>
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Podrobná analýza
        </Button>
      </div>
    </div>
  );
};

export default CommuteComparison;
