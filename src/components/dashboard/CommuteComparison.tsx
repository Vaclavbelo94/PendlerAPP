
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
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";
import { useIsMobile } from "@/hooks/use-mobile";

const detailedData = [
  { name: '1. týden', auto: 42, mhd: 32 },
  { name: '2. týden', auto: 36, mhd: 28 },
  { name: '3. týden', auto: 38, mhd: 30 },
  { name: '4. týden', auto: 32, mhd: 38 }
];

const savageData = [
  { month: 'Leden', auto: 168, mhd: 122, saved: 190 },
  { month: 'Únor', auto: 155, mhd: 115, saved: 176 },
  { month: 'Březen', auto: 178, mhd: 98, saved: 158 },
  { month: 'Duben', auto: 162, mhd: 112, saved: 178 },
  { month: 'Květen', auto: 149, mhd: 129, saved: 205 },
];

const CommuteComparison = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');
  const isMobile = useIsMobile();

  const generatePdf = () => {
    // Inicializace PDF s českou diakritikou
    const doc = initializePDF();
    
    // Přidání hlavičky s logem
    addDocumentHeader(doc, "Analýza dojíždění");
    
    // Add summary data
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Souhrn za aktuální měsíc", 14, 50);
    
    // Import dynamicky jspdf-autotable
    import("jspdf-autotable").then((autoTable) => {
      // Create summary table
      autoTable.default(doc, {
        startY: 55,
        head: [['Metrika', 'Hodnota']],
        body: [
          ['Celková vzdálenost', '128 km'],
          ['Průměrně denně', '6.4 km'],
          ['Celkové náklady', '712 Kč'],
          ['Úspora oproti min. měsíci', '243 Kč (25%)'],
          ['Auto', '63 km (49%)'],
          ['MHD', '65 km (51%)'],
          ['Úspora CO2', '8.2 kg']
        ],
      });
      
      // Add weekly data title
      doc.setFontSize(14);
      doc.text("Týdenní přehled", 14, (doc as any).lastAutoTable.finalY + 15);
      
      // Create weekly data table
      autoTable.default(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Týden', 'Automobil (km)', 'MHD (km)']],
        body: detailedData.map(item => [item.name, item.auto, item.mhd]),
      });
      
      // Přidání patičky
      addDocumentFooter(doc);
      
      // Save the PDF
      doc.save('analyza-dojizdeni.pdf');
    });
  };

  const chartHeight = isMobile ? 200 : 300;

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-end'}`}>
        <div className={`text-center ${isMobile ? 'w-full' : ''}`}>
          <div className="text-xs text-muted-foreground mb-1">Minulý měsíc</div>
          <div className="text-2xl font-bold">146 km</div>
        </div>
        <div className={`text-center ${isMobile ? 'w-full' : ''}`}>
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
                
                <div className={`h-[${chartHeight}px] mb-4`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={detailedData}
                      margin={isMobile ? { top: 20, right: 10, left: 10, bottom: 5 } : { top: 20, right: 30, left: 20, bottom: 5 }}
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
              </>
            )}

            {selectedTab === 'history' && (
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Vývoj dopravy v čase</h3>
                  <div className={`h-[${chartHeight}px] mb-4`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={savageData}
                        margin={isMobile ? { top: 5, right: 10, left: 10, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} km`, undefined]} />
                        <Legend />
                        <Bar name="Automobil" dataKey="auto" fill="#3b82f6" />
                        <Bar name="MHD" dataKey="mhd" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Kumulativní úspora</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Celková úspora:</span>
                    <span className="text-xl font-bold text-green-600">907 Kč</span>
                  </div>
                  <div className={`h-[${isMobile ? 180 : 200}px]`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={savageData}
                        margin={isMobile ? { top: 5, right: 10, left: 10, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} Kč`, undefined]} />
                        <Legend />
                        <Bar name="Úspora Kč" dataKey="saved" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={generatePdf}>
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
