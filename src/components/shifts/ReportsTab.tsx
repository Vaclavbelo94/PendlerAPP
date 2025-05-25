import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Shift } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { usePremiumCheck } from "@/hooks/usePremiumCheck";
import { Skeleton } from "@/components/ui/skeleton";
import { jsPDF } from "jspdf";
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";

interface ReportsTabProps {
  user: any;
  shifts: Shift[];
}

export const ReportsTab = ({ user, shifts }: ReportsTabProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Kontrola, zda je uživatel premium
  const { canAccess, isPremiumFeature } = usePremiumCheck('pdf-export');
  
  // Načtení uložených reportů
  useEffect(() => {
    if (user && session) {
      fetchUserReports();
    }
  }, [user, session]);
  
  const fetchUserReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'shift-report')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setSavedReports(data || []);
    } catch (error) {
      console.error("Chyba při načítání reportů:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst reporty",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pro export PDF
  const handleExportPDF = async () => {
    // Kontrola premium přístupu
    if (isPremiumFeature && !canAccess) {
      toast({
        title: "Prémiová funkce",
        description: "Pro export do PDF je potřeba mít prémiový účet",
        variant: "destructive",
      });
      return;
    }
    
    setIsExporting(true);
    try {
      // Příprava dat reportu
      const reportTitle = `Report směn - ${format(new Date(), "MMMM yyyy", { locale: cs })}`;
      const reportData = {
        title: reportTitle,
        data: {
          shifts: shifts.map(shift => ({
            date: shift.date.toISOString(),
            type: shift.type,
            notes: shift.notes || ""
          })),
          summary: {
            morning: shifts.filter(s => s.type === "morning").length,
            afternoon: shifts.filter(s => s.type === "afternoon").length,
            night: shifts.filter(s => s.type === "night").length,
            total: shifts.length,
            totalHours: shifts.length * 8
          }
        }
      };
      
      // Vytvoření PDF s hlavičkou a logem
      const doc = initializePDF();
      addDocumentHeader(doc, reportTitle);
      
      // Přidání informací o uživateli
      doc.setFontSize(12);
      doc.text(`Uživatel: ${user?.email || user?.name || ""}`, 14, 50);
      doc.text(`Období: ${format(new Date(), "MMMM yyyy", { locale: cs })}`, 14, 57);

      // Přidání shrnutí směn
      doc.setFontSize(14);
      doc.text("Souhrn směn", 14, 70);
      
      // Dynamicky importovat autoTable
      import("jspdf-autotable").then((autoTable) => {
        autoTable.default(doc, {
          startY: 75,
          head: [['Typ směny', 'Počet', 'Celkem hodin']],
          body: [
            ['Ranní', reportData.data.summary.morning, reportData.data.summary.morning * 8],
            ['Odpolední', reportData.data.summary.afternoon, reportData.data.summary.afternoon * 8],
            ['Noční', reportData.data.summary.night, reportData.data.summary.night * 8],
            ['Celkem', reportData.data.summary.total, reportData.data.summary.totalHours]
          ],
          theme: 'grid',
          headStyles: { fillColor: [220, 0, 0], textColor: [255, 255, 255] }
        });
        
        // Přidání detailního seznamu směn
        const shiftsData = shifts.map(shift => [
          format(shift.date, "dd.MM.yyyy", { locale: cs }),
          shift.type === "morning" ? "Ranní" : 
          shift.type === "afternoon" ? "Odpolední" : "Noční",
          shift.notes || "-"
        ]);
        
        if (shiftsData.length > 0) {
          doc.setFontSize(14);
          doc.text("Detail směn", 14, (doc as any).lastAutoTable.finalY + 15);
          
          autoTable.default(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Datum', 'Typ směny', 'Poznámka']],
            body: shiftsData,
            theme: 'grid',
            headStyles: { fillColor: [220, 0, 0], textColor: [255, 255, 255] }
          });
        }
        
        // Přidání patičky
        addDocumentFooter(doc);
        
        // Uložení PDF
        doc.save(`report_smen_${format(new Date(), "MM_yyyy")}.pdf`);
      });
      
      if (user && session) {
        // Uložení reportu do databáze
        const { data, error } = await supabase
          .from('reports')
          .insert({
            user_id: user.id,
            title: reportData.title,
            type: 'shift-report',
            data: reportData.data,
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
            end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
          })
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Report uložen",
          description: "Report byl úspěšně vygenerován a uložen",
        });
        
        // Aktualizace seznamu reportů
        fetchUserReports();
      }
      
    } catch (error) {
      console.error("Chyba při exportu do PDF:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se exportovat data do PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-dhl-yellow">
      <CardHeader className="border-b border-dhl-yellow">
        <CardTitle>Přehled směn - {format(new Date(), "MMMM yyyy", { locale: cs })}</CardTitle>
        <CardDescription>Podrobný výpis směn</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {user ? (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Typ směny</TableHead>
                    <TableHead className="text-center min-w-[100px]">Počet směn</TableHead>
                    <TableHead className="text-right min-w-[120px]">Celkem hodin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ranní</TableCell>
                    <TableCell className="text-center">{shifts.filter(s => s.type === "morning").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "morning").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Odpolední</TableCell>
                    <TableCell className="text-center">{shifts.filter(s => s.type === "afternoon").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "afternoon").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Noční</TableCell>
                    <TableCell className="text-center">{shifts.filter(s => s.type === "night").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "night").length * 8}</TableCell>
                  </TableRow>
                  <TableRow className="border-t-2 font-semibold">
                    <TableCell className="font-bold">Celkem</TableCell>
                    <TableCell className="text-center font-bold">{shifts.length}</TableCell>
                    <TableCell className="text-right font-bold">{shifts.length * 8}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
              
            {/* Sekce uložených reportů */}
            {session && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Poslední uložené reporty</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : savedReports.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Název</TableHead>
                          <TableHead className="min-w-[120px]">Vytvořeno</TableHead>
                          <TableHead className="text-right min-w-[100px]">Akce</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedReports.map(report => (
                          <TableRow key={report.id}>
                            <TableCell className="break-words max-w-[200px]">{report.title}</TableCell>
                            <TableCell className="whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleExportPDF()}
                                disabled={isExporting || (isPremiumFeature && !canAccess)}
                                className="whitespace-nowrap"
                              >
                                <Download className="h-4 w-4 mr-1" /> Stáhnout
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Zatím nemáte žádné uložené reporty</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={handleExportPDF} 
                className="bg-dhl-red text-white hover:bg-dhl-red/90 whitespace-nowrap"
                disabled={isExporting || (isPremiumFeature && !canAccess)}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Generuji PDF..." : "Exportovat do PDF"}
                {isPremiumFeature && !canAccess && <span className="ml-2">(Premium)</span>}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <Lock className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení reportů směn</p>
            <Button 
              className="mt-2" 
              onClick={() => navigate("/login")}
              variant="default"
            >
              Přihlásit se
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
