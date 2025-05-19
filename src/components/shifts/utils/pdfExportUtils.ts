
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";

export interface ShiftExportData {
  userId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  shifts: any[];
}

/**
 * Generate and download PDF report of shifts
 */
export const generateShiftsPdf = async (
  user: any, 
  selectedMonth: Date, 
  shifts: any[]
): Promise<string> => {
  try {
    // Filter shifts for the selected month
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    const filteredShifts = shifts.filter((shift: any) => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
    });

    // Create PDF document with proper initialization for Czech language
    const doc = initializePDF();
    
    // Přidání standardní hlavičky s logem
    const title = `Přehled směn - ${format(selectedMonth, "MMMM yyyy", { locale: cs })}`;
    addDocumentHeader(doc, title);
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`Uživatel: ${user.email || user.username || ""}`, 14, 50);

    // Add summary data
    const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
    const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
    const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
    const totalShifts = filteredShifts.length;
    
    doc.setFontSize(14);
    doc.text("Souhrn směn:", 14, 60);
    doc.setFontSize(12);
    doc.text(`Ranní směny: ${morningShifts}`, 20, 70);
    doc.text(`Odpolední směny: ${afternoonShifts}`, 20, 77);
    doc.text(`Noční směny: ${nightShifts}`, 20, 84);
    doc.text(`Celkem směn: ${totalShifts}`, 20, 91);
    doc.text(`Celkem hodin: ${totalShifts * 8}`, 20, 98);

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

    // Generate a file name for the PDF
    const fileName = `smeny_${format(selectedMonth, "MM_yyyy")}.pdf`;

    // Add table to PDF
    const autoTable = await import("jspdf-autotable");
    autoTable.default(doc, {
      startY: 110,
      head: [["Datum", "Typ směny", "Poznámka"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 0, 0], textColor: [255, 255, 255] },
    });
    
    // Přidání standardní patičky
    addDocumentFooter(doc);

    // Save the PDF
    doc.save(fileName);

    // Return filename for success message
    return fileName;
  } catch (error) {
    console.error("Chyba při exportu do PDF:", error);
    throw error;
  }
};

/**
 * Save report to database if user is logged in
 */
export const saveReportToDatabase = async (
  user: any, 
  selectedMonth: Date, 
  filteredShifts: any[]
): Promise<void> => {
  if (!user || !supabase) return;
  
  try {
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    const title = `Přehled směn - ${format(selectedMonth, "MMMM yyyy", { locale: cs })}`;
    
    const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
    const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
    const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
    const totalShifts = filteredShifts.length;
    
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
    
    await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        title: reportData.title,
        type: 'shift-report',
        data: reportData.data,
        start_date: startOfMonth.toISOString(),
        end_date: endOfMonth.toISOString()
      });
      
    console.log("Report saved to database");
  } catch (err) {
    console.error("Error saving report:", err);
  }
};
