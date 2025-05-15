
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
      const reportData = {
        title: `Report směn - ${format(new Date(), "MMMM yyyy", { locale: cs })}`,
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
      
      toast({
        title: "Export do PDF zahájen",
        description: "PDF dokument bude ke stažení za okamžik",
      });
      
      // Simulace generování PDF (v produkční aplikaci by se zde volala edge funkce)
      setTimeout(() => {
        toast({
          title: "Export dokončen",
          description: "PDF bylo úspěšně vygenerováno",
        });
      }, 2000);
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
      <CardContent>
        {user ? (
          <div>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Typ směny</TableHead>
                    <TableHead>Počet směn</TableHead>
                    <TableHead className="text-right">Celkem hodin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ranní</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "morning").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "morning").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Odpolední</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "afternoon").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "afternoon").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Noční</TableCell>
                    <TableCell>{shifts.filter(s => s.type === "night").length}</TableCell>
                    <TableCell className="text-right">{shifts.filter(s => s.type === "night").length * 8}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Celkem</TableCell>
                    <TableCell>{shifts.length}</TableCell>
                    <TableCell className="text-right">{shifts.length * 8}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {/* Sekce uložených reportů */}
              {session && (
                <div className="mt-8">
                  <h3 className="text-md font-medium mb-2">Poslední uložené reporty</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : savedReports.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Název</TableHead>
                          <TableHead>Vytvořeno</TableHead>
                          <TableHead className="text-right">Akce</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedReports.map(report => (
                          <TableRow key={report.id}>
                            <TableCell>{report.title}</TableCell>
                            <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleExportPDF()}
                                disabled={isExporting || (isPremiumFeature && !canAccess)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Stáhnout
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Zatím nemáte žádné uložené reporty</p>
                  )}
                </div>
              )}
            </ScrollArea>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleExportPDF} 
                className="bg-dhl-red text-white hover:bg-dhl-red/90"
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
