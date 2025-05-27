
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { ModernPDFTemplate } from './ModernPDFTemplate';
import { ModernSection, ModernTable, ModernInfoBox, ModernStatsGrid } from './ModernPDFComponents';

interface ModernShiftsDocumentProps {
  user: any;
  selectedMonth: Date;
  shifts: any[];
}

const ModernShiftsDocument: React.FC<ModernShiftsDocumentProps> = ({ user, selectedMonth, shifts }) => {
  const title = 'Přehled směn';
  const subtitle = `${format(selectedMonth, "MMMM yyyy", { locale: cs })} • ${user.email || user.username || ""}`;

  // Filter shifts for the selected month
  const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
  
  const filteredShifts = shifts.filter((shift: any) => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
  });

  // Calculate statistics
  const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
  const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
  const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
  const totalShifts = filteredShifts.length;
  const totalHours = totalShifts * 8;
  const averagePerWeek = Math.round((totalShifts / 4.33) * 10) / 10;

  const statsData = [
    { label: 'Celkem směn', value: totalShifts.toString() },
    { label: 'Celkem hodin', value: `${totalHours}h` },
    { label: 'Týdenní průměr', value: `${averagePerWeek}` },
    { label: 'Odhadovaný výdělek', value: `${totalHours * 150} Kč` }
  ];

  const breakdownData = [
    ['Ranní směny', morningShifts.toString(), `${Math.round((morningShifts/totalShifts)*100)}%`, `${morningShifts * 8}h`, '06:00 - 14:00'],
    ['Odpolední směny', afternoonShifts.toString(), `${Math.round((afternoonShifts/totalShifts)*100)}%`, `${afternoonShifts * 8}h`, '14:00 - 22:00'],
    ['Noční směny', nightShifts.toString(), `${Math.round((nightShifts/totalShifts)*100)}%`, `${nightShifts * 8}h`, '22:00 - 06:00']
  ];

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

  let performanceMessage = "";
  if (averagePerWeek >= 4) {
    performanceMessage = `🎯 Výborné tempo! Průměr ${averagePerWeek} směn týdně překračuje standardní požadavky.`;
  } else if (averagePerWeek >= 3) {
    performanceMessage = `👍 Dobrý výkon! Průměr ${averagePerWeek} směn týdně je v normálu.`;
  } else {
    performanceMessage = `📈 Prostor pro zlepšení. Zvažte zvýšení počtu směn pro optimální výdělek.`;
  }

  return (
    <ModernPDFTemplate title={title} subtitle={subtitle}>
      {/* Statistics Overview */}
      <ModernSection title="📊 Přehled statistik">
        <ModernStatsGrid stats={statsData} />
      </ModernSection>

      {/* Performance Insight */}
      <ModernInfoBox type={averagePerWeek >= 4 ? 'success' : averagePerWeek >= 3 ? 'default' : 'warning'}>
        {performanceMessage}
      </ModernInfoBox>

      {/* Shift Type Breakdown */}
      <ModernSection title="📋 Rozdělení podle typů směn">
        <ModernTable
          headers={['Typ směny', 'Počet', 'Podíl', 'Celkem hodin', 'Časové pásmo']}
          data={breakdownData}
        />
      </ModernSection>

      {/* Detailed Shifts Table */}
      {filteredShifts.length > 0 ? (
        <ModernSection title="📅 Detailní přehled všech směn">
          <ModernTable
            headers={['#', 'Datum', 'Den v týdnu', 'Typ směny', 'Časové pásmo', 'Poznámka']}
            data={detailTableData}
            columnWidths={['8%', '18%', '18%', '18%', '20%', '18%']}
          />
          
          <ModernInfoBox type="success">
            📋 Celkem zobrazeno {filteredShifts.length} směn za období {format(selectedMonth, "MMMM yyyy", { locale: cs })}.
          </ModernInfoBox>
        </ModernSection>
      ) : (
        <ModernSection title="📅 Přehled směn">
          <ModernInfoBox type="warning">
            📭 V tomto měsíci nejsou evidovány žádné směny. Pro přidání nových směn použijte aplikaci PendlerApp.
          </ModernInfoBox>
        </ModernSection>
      )}
    </ModernPDFTemplate>
  );
};

export const generateModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: any[]): Promise<Blob> => {
  const blob = await pdf(<ModernShiftsDocument user={user} selectedMonth={selectedMonth} shifts={shifts} />).toBlob();
  return blob;
};

export const downloadModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: any[]): Promise<void> => {
  const blob = await generateModernShiftsDocument(user, selectedMonth, shifts);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PendlerApp_Smeny_${format(selectedMonth, "MM_yyyy")}_modern.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
