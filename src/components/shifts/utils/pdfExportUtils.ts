
// Updated to use modern PDF system
import { downloadModernShiftsDocument } from "@/utils/pdf/modern/ModernShiftsPDFGenerator";
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { supabase } from "@/integrations/supabase/client";

export interface ShiftExportData {
  userId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  shifts: any[];
}

export const generateShiftsPdf = async (
  user: any, 
  selectedMonth: Date, 
  shifts: any[]
): Promise<string> => {
  try {
    await downloadModernShiftsDocument(user, selectedMonth, shifts);
    return `PendlerApp_Smeny_${format(selectedMonth, "MM_yyyy")}_modern.pdf`;
  } catch (error) {
    console.error("Chyba při exportu do PDF:", error);
    throw error;
  }
};

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
