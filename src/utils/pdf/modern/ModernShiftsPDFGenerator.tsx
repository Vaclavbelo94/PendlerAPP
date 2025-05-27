
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { ModernPDFTemplate } from './ModernPDFTemplate';
import { ModernSection, ModernTable, ModernInfoBox, ModernStatsGrid } from './ModernPDFComponents';

interface Shift {
  id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  notes: string;
  userId: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ModernShiftsDocumentProps {
  user: any;
  selectedMonth: Date;
  shifts: Shift[];
}

const ModernShiftsDocument: React.FC<ModernShiftsDocumentProps> = ({ user, selectedMonth, shifts }) => {
  const title = 'Měsíční přehled směn';
  const subtitle = `${format(selectedMonth, "LLLL yyyy", { locale: cs })} • ${user.email || user.username || "Uživatel"}`;

  // Filter shifts for the selected month
  const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
  
  const filteredShifts = shifts.filter((shift: Shift) => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
  });

  // Calculate comprehensive statistics
  const morningShifts = filteredShifts.filter((s: Shift) => s.type === "morning").length;
  const afternoonShifts = filteredShifts.filter((s: Shift) => s.type === "afternoon").length;
  const nightShifts = filteredShifts.filter((s: Shift) => s.type === "night").length;
  const totalShifts = filteredShifts.length;
  const totalHours = totalShifts * 8;
  const averagePerWeek = Math.round((totalShifts / 4.33) * 10) / 10;
  const estimatedEarnings = totalHours * 18; // €18/hour estimate

  const statsData = [
    { label: 'Celkem směn', value: totalShifts.toString() },
    { label: 'Odpracované hodiny', value: `${totalHours}h` },
    { label: 'Týdenní průměr', value: `${averagePerWeek} směn` },
    { label: 'Odhadovaný výdělek', value: `${estimatedEarnings}€` }
  ];

  const breakdownData = [
    ['Ranní směny', morningShifts.toString(), `${totalShifts > 0 ? Math.round((morningShifts/totalShifts)*100) : 0}%`, `${morningShifts * 8}h`],
    ['Odpolední směny', afternoonShifts.toString(), `${totalShifts > 0 ? Math.round((afternoonShifts/totalShifts)*100) : 0}%`, `${afternoonShifts * 8}h`],
    ['Noční směny', nightShifts.toString(), `${totalShifts > 0 ? Math.round((nightShifts/totalShifts)*100) : 0}%`, `${nightShifts * 8}h`],
    ['CELKEM', totalShifts.toString(), '100%', `${totalHours}h`]
  ];

  let performanceMessage = "";
  let performanceType: 'success' | 'warning' | 'default' = 'default';
  
  if (averagePerWeek >= 4.5) {
    performanceMessage = `Výjimečný výkon! S průměrem ${averagePerWeek} směn týdně dosahujete nadstandardních výsledků.`;
    performanceType = 'success';
  } else if (averagePerWeek >= 3.5) {
    performanceMessage = `Dobrý pracovní rytmus! Průměr ${averagePerWeek} směn týdně je solidní základ.`;
    performanceType = 'default';
  } else {
    performanceMessage = `Prostor pro zlepšení. Zvažte zvýšení počtu směn pro optimalizaci příjmů.`;
    performanceType = 'warning';
  }

  return (
    <ModernPDFTemplate title={title} subtitle={subtitle}>
      {/* Statistiky */}
      <ModernSection title="Souhrn měsíce">
        <ModernStatsGrid stats={statsData} />
        
        <ModernInfoBox type={performanceType}>
          {performanceMessage}
        </ModernInfoBox>
      </ModernSection>

      {/* Rozložení směn */}
      <ModernSection title="Analýza směn">
        <ModernTable
          headers={['Typ směny', 'Počet', 'Podíl (%)', 'Celkem hodin']}
          data={breakdownData}
        />
      </ModernSection>

      {/* Detail směn */}
      {filteredShifts.length > 0 ? (
        <ModernSection title="Chronologický přehled směn">
          <ModernTable
            headers={['Datum', 'Den', 'Typ směny', 'Poznámka']}
            data={filteredShifts
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((shift: Shift) => {
                const shiftDate = new Date(shift.date);
                const dayName = format(shiftDate, "EEEE", { locale: cs });
                
                let shiftLabel = "";
                switch(shift.type) {
                  case "morning": shiftLabel = "Ranní"; break;
                  case "afternoon": shiftLabel = "Odpolední"; break;
                  case "night": shiftLabel = "Noční"; break;
                }
                
                return [
                  format(shiftDate, "dd.MM.yyyy", { locale: cs }),
                  dayName,
                  shiftLabel,
                  shift.notes || "—"
                ];
              })
            }
          />
          
          <ModernInfoBox type="success">
            Zobrazeno celkem {filteredShifts.length} směn za období {format(selectedMonth, "LLLL yyyy", { locale: cs })}. 
            Celkový objem práce: {totalHours} hodin.
          </ModernInfoBox>
        </ModernSection>
      ) : (
        <ModernSection title="Přehled směn">
          <ModernInfoBox type="warning">
            Pro vybrané období {format(selectedMonth, "LLLL yyyy", { locale: cs })} nejsou evidovány žádné směny.
          </ModernInfoBox>
        </ModernSection>
      )}
    </ModernPDFTemplate>
  );
};

export const generateModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: Shift[]): Promise<Blob> => {
  try {
    console.log('🔄 Generování moderního PDF dokumentu směn...', { month: format(selectedMonth, 'LLLL yyyy', { locale: cs }), shiftsCount: shifts.length });
    const blob = await pdf(<ModernShiftsDocument user={user} selectedMonth={selectedMonth} shifts={shifts} />).toBlob();
    console.log('✅ Moderní PDF dokument směn úspěšně vygenerován');
    return blob;
  } catch (error) {
    console.error('❌ Chyba při generování PDF:', error);
    throw new Error('Nepodařilo se vygenerovat PDF dokument: ' + (error as Error).message);
  }
};

export const downloadModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: Shift[]): Promise<void> => {
  try {
    console.log('📥 Zahajování stahování moderního PDF dokumentu směn...');
    const blob = await generateModernShiftsDocument(user, selectedMonth, shifts);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `PendlerApp_Smeny_${format(selectedMonth, "LLLL_yyyy", { locale: cs })}_modern.pdf`;
    link.download = filename;
    
    console.log('📄 Stahování souboru:', filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Moderní PDF dokument směn úspěšně stažen');
  } catch (error) {
    console.error('❌ Chyba při stahování PDF:', error);
    throw error;
  }
};
