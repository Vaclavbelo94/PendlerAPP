
import { useState } from "react";
import { CalendarIcon, Download, FileDown } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";

interface ExportPdfDialogProps {
  user: any;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const ExportPdfDialog = ({ 
  user, 
  selectedMonth, 
  setSelectedMonth 
}: ExportPdfDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);

  // Function to generate PDF and trigger download
  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      // Retrieve shifts from localStorage
      const shiftsStr = localStorage.getItem("shifts");
      const shifts = shiftsStr ? JSON.parse(shiftsStr) : [];

      // Filter shifts for the selected month
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      
      const filteredShifts = shifts.filter((shift: any) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
      });

      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      const title = `Přehled směn - ${format(selectedMonth, "MMMM yyyy", { locale: cs })}`;
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      
      // Add user info
      doc.setFontSize(12);
      doc.text(`Uživatel: ${user.email || user.username || ""}`, 14, 30);
      doc.text(`Datum exportu: ${format(new Date(), "dd.MM.yyyy HH:mm", { locale: cs })}`, 14, 37);

      // Add summary data
      const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
      const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
      const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
      const totalShifts = filteredShifts.length;
      
      doc.setFontSize(14);
      doc.text("Souhrn směn:", 14, 50);
      doc.setFontSize(12);
      doc.text(`Ranní směny: ${morningShifts}`, 20, 60);
      doc.text(`Odpolední směny: ${afternoonShifts}`, 20, 67);
      doc.text(`Noční směny: ${nightShifts}`, 20, 74);
      doc.text(`Celkem směn: ${totalShifts}`, 20, 81);
      doc.text(`Celkem hodin: ${totalShifts * 8}`, 20, 88);

      // Create table data for detailed shifts
      const tableData = filteredShifts.map((shift: any) => {
        const shiftDate = new Date(shift.date);
        let shiftTypeText = "";
        switch(shift.type) {
          case "morning": shiftTypeText = "Ranní"; break;
          case "afternoon": shiftTypeText = "Odpolední"; break;
          case "night": shiftTypeText = "Noční"; break;
        }
        return [
          format(shiftDate, "dd.MM.yyyy", { locale: cs }),
          shiftTypeText,
          shift.notes || "-"
        ];
      });

      // Add table to PDF
      autoTable(doc, {
        startY: 100,
        head: [["Datum", "Typ směny", "Poznámka"]],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [220, 0, 0], textColor: [255, 255, 255] },
      });

      // Save the PDF
      const fileName = `smeny_${format(selectedMonth, "MM_yyyy")}.pdf`;
      doc.save(fileName);

      // If user is logged in, save the report to database (non-blocking)
      if (user && supabase) {
        try {
          const reportData = {
            title,
            data: {
              shifts: filteredShifts,
              summary: {
                morning: morningShifts,
                afternoon: afternoonShifts,
                night: nightShifts,
                total: totalShifts,
                totalHours: totalShifts * 8
              }
            }
          };
          
          supabase
            .from('reports')
            .insert({
              user_id: user.id,
              title: reportData.title,
              type: 'shift-report',
              data: reportData.data,
              start_date: startOfMonth.toISOString(),
              end_date: endOfMonth.toISOString()
            })
            .then(() => {
              console.log("Report saved to database");
            })
            .catch(err => {
              console.error("Error saving report:", err);
            });
        } catch (err) {
          console.error("Error preparing report data:", err);
        }
      }

      toast({
        title: "Export dokončen",
        description: `Soubor ${fileName} byl úspěšně stažen.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error("Chyba při exportu do PDF:", error);
      toast({
        title: "Chyba exportu",
        description: "Vyskytla se chyba při generování PDF souboru.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-dhl-red text-dhl-red hover:bg-dhl-red/10"
          disabled={!user}
        >
          <FileDown className="mr-2" />
          Exportovat přehled směn do PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportovat směny do PDF</DialogTitle>
          <DialogDescription>
            Vyberte měsíc, pro který chcete exportovat přehled směn.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="month">Měsíc</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="month"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMMM yyyy", { locale: cs })
                    ) : (
                      <span>Vyberte měsíc</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={(date) => date && setSelectedMonth(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={cs}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleExportPDF} 
            className="bg-dhl-red hover:bg-dhl-red/90"
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generuji PDF..." : "Exportovat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
