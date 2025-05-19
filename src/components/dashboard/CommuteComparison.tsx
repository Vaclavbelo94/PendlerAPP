
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CommuteSummarySection from "./commute/CommuteSummarySection";
import DetailedAnalysisDialog from "./commute/DetailedAnalysisDialog";
import { detailedData, historicalData } from "./commute/constants";

const CommuteComparison = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <CommuteSummarySection 
        previousMonth="146 km" 
        currentMonth="128 km" 
        changePercentage="-12%" 
        savings="243 Kč" 
      />
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => setDialogOpen(true)}
        >
          Podrobná analýza
        </Button>
      </div>

      <DetailedAnalysisDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentMonthData={detailedData}
        historyData={historicalData}
      />
    </div>
  );
};

export default CommuteComparison;
