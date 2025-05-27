
import { 
  initializeProfessionalPDF, 
  addProfessionalHeader, 
  addProfessionalFooter,
  createProfessionalTable,
  addProfessionalSection,
  addProfessionalInfoBox,
  addProfessionalStatsCard,
  PROFESSIONAL_COLORS,
  SPACING
} from "@/utils/pdf/professionalPdfHelper";
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ShiftExportData {
  userId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  shifts: any[];
}

/**
 * Generate professional PDF report of shifts
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

    // Create professional PDF document
    const doc = initializeProfessionalPDF();
    
    const title = `Přehled směn`;
    const subtitle = `${format(selectedMonth, "MMMM yyyy", { locale: cs })} • ${user.email || user.username || ""}`;
    addProfessionalHeader(doc, title, subtitle, 'primary');
    
    let currentY = 75;

    // Professional statistics section
    const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
    const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
    const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
    const totalShifts = filteredShifts.length;
    const totalHours = totalShifts * 8;
    const averagePerWeek = Math.round((totalShifts / 4.33) * 10) / 10;

    // Stats cards
    const stats = [
      { label: 'Celkem směn', value: totalShifts.toString(), color: PROFESSIONAL_COLORS.primary.main },
      { label: 'Celkem hodin', value: `${totalHours}h`, color: PROFESSIONAL_COLORS.accent.main },
      { label: 'Týdenní průměr', value: `${averagePerWeek}`, color: PROFESSIONAL_COLORS.success },
      { label: 'Odhadovaný výdělek', value: `${totalHours * 150} Kč`, color: PROFESSIONAL_COLORS.secondary.main }
    ];
    
    currentY = addProfessionalStatsCard(doc, stats, currentY);
    
    // Breakdown section
    currentY = addProfessionalSection(doc, "📊 Rozdělení podle typů směn", currentY, 'primary');
    
    await createProfessionalTable(doc, {
      head: [['Typ směny', 'Počet', 'Podíl', 'Celkem hodin', 'Časové pásmo']],
      body: [
        ['Ranní směny', morningShifts.toString(), `${Math.round((morningShifts/totalShifts)*100)}%`, `${morningShifts * 8}h`, '06:00 - 14:00'],
        ['Odpolední směny', afternoonShifts.toString(), `${Math.round((afternoonShifts/totalShifts)*100)}%`, `${afternoonShifts * 8}h`, '14:00 - 22:00'],
        ['Noční směny', nightShifts.toString(), `${Math.round((nightShifts/totalShifts)*100)}%`, `${nightShifts * 8}h`, '22:00 - 06:00']
      ]
    }, currentY);

    // Performance insights
    currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
    
    let performanceMessage = "";
    if (averagePerWeek >= 4) {
      performanceMessage = `🎯 Výborné tempo! Průměr ${averagePerWeek} směn týdně překračuje standardní požadavky.`;
    } else if (averagePerWeek >= 3) {
      performanceMessage = `👍 Dobrý výkon! Průměr ${averagePerWeek} směn týdně je v normálu.`;
    } else {
      performanceMessage = `📈 Prostor pro zlepšení. Zvažte zvýšení počtu směn pro optimální výdělek.`;
    }
    
    currentY = addProfessionalInfoBox(doc, performanceMessage, currentY, 'info');

    // Detailed shifts table if any exist
    if (filteredShifts.length > 0) {
      currentY = addProfessionalSection(doc, "📅 Detailní přehled všech směn", currentY, 'secondary');
      
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
            shift.notes || "—"
          ];
        });

      await createProfessionalTable(doc, {
        head: [['#', 'Datum', 'Den v týdnu', 'Typ směny', 'Časové pásmo', 'Poznámka']],
        body: detailTableData
      }, currentY, {
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 'auto' }
        }
      });
      
      // Summary insight
      currentY = (doc as any).lastAutoTable.finalY + SPACING.lg;
      const summaryText = `📋 Celkem zobrazeno ${filteredShifts.length} směn za období ${format(selectedMonth, "MMMM yyyy", { locale: cs })}. Dokument vygenerován ${new Date().toLocaleString('cs-CZ')}.`;
      currentY = addProfessionalInfoBox(doc, summaryText, currentY, 'success');
      
    } else {
      currentY = addProfessionalInfoBox(
        doc, 
        "📭 V tomto měsíci nejsou evidovány žádné směny. Pro přidání nových směn použijte aplikaci PendlerApp.", 
        currentY, 
        'warning'
      );
    }

    // Add professional footer
    addProfessionalFooter(doc);

    // Generate filename with professional naming
    const fileName = `PendlerApp_Smeny_${format(selectedMonth, "MM_yyyy")}.pdf`;
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
