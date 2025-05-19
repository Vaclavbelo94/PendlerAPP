
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MonthSelector } from "./MonthSelector";
import { toast } from "@/components/ui/use-toast";
import { generateShiftsPdf, saveReportToDatabase } from "../utils/pdfExportUtils";

interface ExportDialogContentProps {
  user: any;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  onClose: () => void;
}

export const ExportDialogContent = ({ 
  user, 
  selectedMonth, 
  setSelectedMonth, 
  onClose 
}: ExportDialogContentProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      // Retrieve shifts from localStorage
      const shiftsStr = localStorage.getItem("shifts");
      const shifts = shiftsStr ? JSON.parse(shiftsStr) : [];

      // Generate and download PDF
      const fileName = await generateShiftsPdf(user, selectedMonth, shifts);
      
      // Filter shifts for the selected month to save to database
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
      
      const filteredShifts = shifts.filter((shift: any) => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
      });

      // Save report to database (non-blocking)
      saveReportToDatabase(user, selectedMonth, filteredShifts);

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
      onClose();
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Exportovat směny do PDF</DialogTitle>
        <DialogDescription>
          Vyberte měsíc, pro který chcete exportovat přehled směn.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="space-y-4">
          <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
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
  );
};
