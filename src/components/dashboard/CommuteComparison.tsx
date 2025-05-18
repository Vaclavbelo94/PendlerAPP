
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DownloadIcon } from "lucide-react";

const detailedData = [
  { name: '1. týden', auto: 42, mhd: 32 },
  { name: '2. týden', auto: 36, mhd: 28 },
  { name: '3. týden', auto: 38, mhd: 30 },
  { name: '4. týden', auto: 32, mhd: 38 }
];

const CommuteComparison = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

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
        <Button variant="outline" size="sm" className="w-full" onClick={() => setDialogOpen(true)}>
          Podrobná analýza
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Podrobná analýza dojíždění</DialogTitle>
            <DialogDescription>
              Porovnání využití dopravních prostředků a nákladů za poslední měsíc
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={detailedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} km`, undefined]} />
                  <Legend />
                  <Bar name="Automobil" dataKey="auto" fill="#3b82f6" />
                  <Bar name="MHD" dataKey="mhd" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" /> Exportovat jako PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommuteComparison;
