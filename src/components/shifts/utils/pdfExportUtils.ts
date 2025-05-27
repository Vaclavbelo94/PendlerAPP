
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initializePDF, addDocumentHeader, addDocumentFooter } from "@/utils/pdf/pdfHelper";
import { createStyledTable, addSection, addInfoBox } from "@/utils/pdf/enhancedPdfHelper";

export interface ShiftExportData {
  userId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  shifts: any[];
}

/**
 * Generate and download enhanced PDF report of shifts
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

    // Create enhanced PDF document
    const doc = initializePDF();
    
    const title = `Přehled směn`;
    const subtitle = `${format(selectedMonth, "MMMM yyyy", { locale: cs })} | ${user.email || user.username || ""}`;
    addDocumentHeader(doc, title, subtitle);
    
    let currentY = 75;

    // Statistická sekce
    const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
    const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
    const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
    const totalShifts = filteredShifts.length;
    const totalHours = totalShifts * 8;
    const averagePerWeek = Math.round((totalShifts / 4.33) * 10) / 10;

    currentY = addSection(doc, "Statistický přehled", currentY);
    
    await createStyledTable(doc, {
      head: [['Typ směny', 'Počet', 'Podíl', 'Hodiny']],
      body: [
        ['Ranní směny', morningShifts.toString(), `${Math.round((morningShifts/totalShifts)*100)}%`, `${morningShifts * 8}h`],
        ['Odpolední směny', afternoonShifts.toString(), `${Math.round((afternoonShifts/totalShifts)*100)}%`, `${afternoonShifts * 8}h`],
        ['Noční směny', nightShifts.toString(), `${Math.round((nightShifts/totalShifts)*100)}%`, `${nightShifts * 8}h`],
        ['CELKEM', totalShifts.toString(), '100%', `${totalHours}h`]
      ]
    }, currentY);

    // Info box s dodatečnými statistikami
    currentY = (doc as any).lastAutoTable.finalY + 10;
    currentY = addInfoBox(
      doc, 
      `📊 Průměr: ${averagePerWeek} směn týdně | Odpracováno: ${totalHours} hodin | Výdělek (est.): ${totalHours * 150} Kč`, 
      currentY, 
      'info'
    );

    // Detailní přehled směn
    if (filteredShifts.length > 0) {
      currentY = addSection(doc, "Detailní přehled všech směn", currentY + 5);
      
      const detailTableData = filteredShifts
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((shift: any, index: number) => {
          const shiftDate = new Date(shift.date);
          const dayName = format(shiftDate, "EEEE", { locale: cs });
          let shiftTypeText = "";
          let timeRange = "";
          
          switch(shift.type) {
            case "morning": 
              shiftTypeText = "Ranní"; 
              timeRange = "06:00 - 14:00";
              break;
            case "afternoon": 
              shiftTypeText = "Odpolední"; 
              timeRange = "14:00 - 22:00";
              break;
            case "night": 
              shiftTypeText = "Noční"; 
              timeRange = "22:00 - 06:00";
              break;
          }
          
          return [
            (index + 1).toString(),
            format(shiftDate, "dd.MM.yyyy", { locale: cs }),
            dayName,
            shiftTypeText,
            timeRange,
            shift.notes || "-"
          ];
        });

      await createStyledTable(doc, {
        head: [['#', 'Datum', 'Den', 'Typ', 'Čas', 'Poznámka']],
        body: detailTableData
      }, currentY, {
        styles: { fontSize: 9 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 'auto' }
        }
      });
    } else {
      currentY = addInfoBox(
        doc, 
        "ℹ️ V tomto měsíci nejsou evidovány žádné směny", 
        currentY + 5, 
        'warning'
      );
    }

    // Přidání vylepšené patičky
    addDocumentFooter(doc);

    // Generate filename
    const fileName = `smeny_${format(selectedMonth, "MM_yyyy")}_enhanced.pdf`;
    doc.save(fileName);

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
