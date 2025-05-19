
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import CommuteComparisonChart from "./CommuteComparisonChart";
import { generateComparisonPdf } from "./utils/pdfUtils";

interface DetailedAnalysisProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonthData: any[];
  historyData: any[];
}

const DetailedAnalysisDialog = ({ open, onOpenChange, currentMonthData, historyData }: DetailedAnalysisProps) => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] p-4' : 'max-w-3xl'}`}>
        <DialogHeader>
          <DialogTitle>Podrobná analýza dojíždění</DialogTitle>
          <DialogDescription>
            Porovnání využití dopravních prostředků a nákladů za poslední měsíc
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center mb-6 border-b">
            <div className="flex space-x-2 pb-2">
              <Button 
                variant={selectedTab === 'current' ? "default" : "ghost"}
                onClick={() => setSelectedTab('current')}
                size="sm"
              >
                Aktuální měsíc
              </Button>
              <Button 
                variant={selectedTab === 'history' ? "default" : "ghost"}
                onClick={() => setSelectedTab('history')}
                size="sm"
              >
                Historie
              </Button>
            </div>
          </div>

          {selectedTab === 'current' && (
            <>
              <div className={`grid grid-cols-1 ${!isMobile && 'md:grid-cols-2'} gap-4 mb-6`}>
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Souhrn</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Celková vzdálenost:</span>
                      <span className="font-medium">128 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Průměrně denně:</span>
                      <span className="font-medium">6.4 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Celkové náklady:</span>
                      <span className="font-medium">712 Kč</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Úspora oproti min. měsíci:</span>
                      <span className="font-medium text-green-600">243 Kč (25%)</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Způsob dopravy</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Auto:</span>
                      <span className="font-medium">63 km (49%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MHD:</span>
                      <span className="font-medium">65 km (51%)</span>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Úspora CO2:</span>
                        <span className="font-medium text-green-600">8.2 kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <CommuteComparisonChart 
                data={currentMonthData} 
                tooltipFormatter={(value) => [`${value} km`, undefined]}
                bars={[
                  { name: "Automobil", dataKey: "auto", fill: "#3b82f6" },
                  { name: "MHD", dataKey: "mhd", fill: "#10b981" }
                ]}
              />
            </>
          )}

          {selectedTab === 'history' && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3">Vývoj dopravy v čase</h3>
                <CommuteComparisonChart 
                  data={historyData} 
                  tooltipFormatter={(value) => [`${value} km`, undefined]}
                  bars={[
                    { name: "Automobil", dataKey: "auto", fill: "#3b82f6" },
                    { name: "MHD", dataKey: "mhd", fill: "#10b981" }
                  ]}
                />
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3">Kumulativní úspora</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Celková úspora:</span>
                  <span className="text-xl font-bold text-green-600">907 Kč</span>
                </div>
                <CommuteComparisonChart 
                  data={historyData}
                  height={isMobile ? 180 : 200}
                  tooltipFormatter={(value) => [`${value} Kč`, undefined]}
                  bars={[
                    { name: "Úspora Kč", dataKey: "saved", fill: "#10b981" }
                  ]}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={() => generateComparisonPdf()}
            >
              <DownloadIcon className="h-4 w-4" /> Exportovat jako PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalysisDialog;
