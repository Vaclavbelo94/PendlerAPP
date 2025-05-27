
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
  const title = 'Měsíční přehled směn';
  const subtitle = `${format(selectedMonth, "LLLL yyyy", { locale: cs })} • ${user.email || user.username || "Uživatel"}`;

  // Filter shifts for the selected month
  const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
  
  const filteredShifts = shifts.filter((shift: any) => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startOfMonth && shiftDate <= endOfMonth && shift.userId === user.id;
  });

  // Calculate comprehensive statistics
  const morningShifts = filteredShifts.filter((s: any) => s.type === "morning").length;
  const afternoonShifts = filteredShifts.filter((s: any) => s.type === "afternoon").length;
  const nightShifts = filteredShifts.filter((s: any) => s.type === "night").length;
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
    ['🌅 Ranní směny', morningShifts.toString(), `${totalShifts > 0 ? Math.round((morningShifts/totalShifts)*100) : 0}%`, `${morningShifts * 8}h`],
    ['☀️ Odpolední směny', afternoonShifts.toString(), `${totalShifts > 0 ? Math.round((afternoonShifts/totalShifts)*100) : 0}%`, `${afternoonShifts * 8}h`],
    ['🌙 Noční směny', nightShifts.toString(), `${totalShifts > 0 ? Math.round((nightShifts/totalShifts)*100) : 0}%`, `${nightShifts * 8}h`],
    ['', '', '', ''],
    ['📊 CELKEM', totalShifts.toString(), '100%', `${totalHours}h`]
  ];

  // Group shifts by weeks for better overview
  const shiftsByWeek = filteredShifts.reduce((acc, shift) => {
    const shiftDate = new Date(shift.date);
    const weekStart = new Date(shiftDate);
    weekStart.setDate(shiftDate.getDate() - shiftDate.getDay() + 1); // Monday as start
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(shift);
    return acc;
  }, {} as Record<string, any[]>);

  const weeklyData = Object.entries(shiftsByWeek).map(([weekStart, weekShifts]) => {
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    
    return [
      `${format(weekStartDate, 'dd.MM')} - ${format(weekEndDate, 'dd.MM')}`,
      weekShifts.length.toString(),
      `${weekShifts.length * 8}h`,
      `${weekShifts.length * 18 * 8}€`
    ];
  });

  let performanceMessage = "";
  let performanceType: 'success' | 'warning' | 'default' = 'default';
  
  if (averagePerWeek >= 4.5) {
    performanceMessage = `🎯 Výjimečný výkon! S průměrem ${averagePerWeek} směn týdně dosahujete nadstandardních výsledků. Pokračujte v tomto tempu!`;
    performanceType = 'success';
  } else if (averagePerWeek >= 3.5) {
    performanceMessage = `👍 Dobrý pracovní rytmus! Průměr ${averagePerWeek} směn týdně je solidní základ pro stabilní příjem.`;
    performanceType = 'default';
  } else if (averagePerWeek >= 2) {
    performanceMessage = `📈 Prostor pro zlepšení. Zvážte zvýšení počtu směn pro optimalizaci příjmů a kariérního růstu.`;
    performanceType = 'warning';
  } else {
    performanceMessage = `🚀 Začínáte? Postupně zvyšujte počet směn pro dosažení stabilního měsíčního příjmu.`;
    performanceType = 'warning';
  }

  return (
    <ModernPDFTemplate title={title} subtitle={subtitle}>
      {/* Executive Summary */}
      <ModernSection title="📈 Exekutivní souhrn">
        <ModernStatsGrid stats={statsData} />
        
        <ModernInfoBox type={performanceType}>
          {performanceMessage}
        </ModernInfoBox>
      </ModernSection>

      {/* Shift Distribution Analysis */}
      <ModernSection title="📊 Analýza rozložení směn">
        <ModernTable
          headers={['Typ směny', 'Počet', 'Podíl (%)', 'Celkem hodin']}
          data={breakdownData}
        />
      </ModernSection>

      {/* Weekly Breakdown */}
      {weeklyData.length > 0 && (
        <ModernSection title="📅 Týdenní přehled">
          <ModernTable
            headers={['Týden', 'Směny', 'Hodiny', 'Odhadovaný výdělek']}
            data={weeklyData}
          />
        </ModernSection>
      )}

      {/* Detailed Shifts Timeline */}
      {filteredShifts.length > 0 ? (
        <ModernSection title="🗓️ Chronologický přehled směn">
          <ModernTable
            headers={['Datum', 'Den', 'Typ směny', 'Pracovní doba', 'Poznámka']}
            data={filteredShifts
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((shift: any) => {
                const shiftDate = new Date(shift.date);
                const dayName = format(shiftDate, "EEEE", { locale: cs });
                
                let shiftIcon = "";
                let shiftLabel = "";
                let timeRange = "";
                
                switch(shift.type) {
                  case "morning": 
                    shiftIcon = "🌅";
                    shiftLabel = "Ranní"; 
                    timeRange = "06:00 - 14:00";
                    break;
                  case "afternoon": 
                    shiftIcon = "☀️";
                    shiftLabel = "Odpolední"; 
                    timeRange = "14:00 - 22:00";
                    break;
                  case "night": 
                    shiftIcon = "🌙";
                    shiftLabel = "Noční"; 
                    timeRange = "22:00 - 06:00";
                    break;
                }
                
                return [
                  format(shiftDate, "dd.MM.yyyy", { locale: cs }),
                  dayName,
                  `${shiftIcon} ${shiftLabel}`,
                  timeRange,
                  shift.notes || "—"
                ];
              })
            }
          />
          
          <ModernInfoBox type="success">
            📋 Zobrazeno celkem {filteredShifts.length} směn za období {format(selectedMonth, "LLLL yyyy", { locale: cs })}. 
            Průměrná denní pracovní doba: 8 hodin. Celkový objem práce: {totalHours} hodin.
          </ModernInfoBox>
        </ModernSection>
      ) : (
        <ModernSection title="🗓️ Přehled směn">
          <ModernInfoBox type="warning">
            📭 Pro vybrané období {format(selectedMonth, "LLLL yyyy", { locale: cs })} nejsou evidovány žádné směny. 
            Použijte aplikaci PendlerApp pro plánování a evidenci vašich pracovních směn.
          </ModernInfoBox>
        </ModernSection>
      )}

      {/* Recommendations */}
      <ModernSection title="💡 Doporučení a tipy">
        <ModernInfoBox>
          🎯 <strong>Optimalizace výkonu:</strong> Pro maximální efektivitu doporučujeme udržovat pravidelný rytmus 4-5 směn týdně. 
          Kombinace různých typů směn pomáhá udržet flexibilitu a vyšší celkový příjem.
        </ModernInfoBox>
        
        <ModernInfoBox>
          📊 <strong>Sledování trendů:</strong> Pravidelně kontrolujte své statistiky v aplikaci PendlerApp. 
          Měsíční reporty vám pomohou identifikovat nejproduktivnější období a optimalizovat plánování.
        </ModernInfoBox>
      </ModernSection>
    </ModernPDFTemplate>
  );
};

export const generateModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: any[]): Promise<Blob> => {
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

export const downloadModernShiftsDocument = async (user: any, selectedMonth: Date, shifts: any[]): Promise<void> => {
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
