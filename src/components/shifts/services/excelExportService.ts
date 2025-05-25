
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export interface ShiftExportData {
  date: Date;
  type: string;
  notes: string;
}

export class ExcelExportService {
  static exportShiftsToExcel(shifts: ShiftExportData[], month: Date, userName?: string): void {
    // Připravit data pro Excel
    const worksheetData = [
      ['Datum', 'Typ směny', 'Poznámka', 'Hodiny'],
      ...shifts.map(shift => [
        format(shift.date, 'dd.MM.yyyy', { locale: cs }),
        shift.type === 'morning' ? 'Ranní' : 
        shift.type === 'afternoon' ? 'Odpolední' : 'Noční',
        shift.notes || '',
        '8'
      ])
    ];

    // Přidat souhrn na konec
    const morningCount = shifts.filter(s => s.type === 'morning').length;
    const afternoonCount = shifts.filter(s => s.type === 'afternoon').length;
    const nightCount = shifts.filter(s => s.type === 'night').length;
    const totalHours = shifts.length * 8;

    worksheetData.push(
      ['', '', '', ''],
      ['SOUHRN:', '', '', ''],
      ['Ranní směny:', morningCount.toString(), '', (morningCount * 8).toString()],
      ['Odpolední směny:', afternoonCount.toString(), '', (afternoonCount * 8).toString()],
      ['Noční směny:', nightCount.toString(), '', (nightCount * 8).toString()],
      ['Celkem směn:', shifts.length.toString(), '', totalHours.toString()]
    );

    // Vytvořit workbook a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Nastavit šířky sloupců
    worksheet['!cols'] = [
      { width: 12 }, // Datum
      { width: 15 }, // Typ směny
      { width: 30 }, // Poznámka
      { width: 8 }   // Hodiny
    ];

    // Přidat worksheet do workbook
    const sheetName = format(month, 'MMMM yyyy', { locale: cs });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generovat název souboru
    const fileName = `smeny_${format(month, 'MM_yyyy')}_${userName || 'report'}.xlsx`;

    // Stáhnout soubor
    XLSX.writeFile(workbook, fileName);
  }

  static exportYearlyReport(shifts: ShiftExportData[], year: number, userName?: string): void {
    const workbook = XLSX.utils.book_new();

    // Vytvořit worksheet pro každý měsíc
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthShifts = shifts.filter(shift => 
        shift.date.getFullYear() === year && shift.date.getMonth() === month
      );

      if (monthShifts.length === 0) continue;

      const worksheetData = [
        ['Datum', 'Typ směny', 'Poznámka', 'Hodiny'],
        ...monthShifts.map(shift => [
          format(shift.date, 'dd.MM.yyyy', { locale: cs }),
          shift.type === 'morning' ? 'Ranní' : 
          shift.type === 'afternoon' ? 'Odpolední' : 'Noční',
          shift.notes || '',
          '8'
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { width: 12 }, { width: 15 }, { width: 30 }, { width: 8 }
      ];

      const sheetName = format(monthDate, 'MMM yyyy', { locale: cs });
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Přidat souhrnný worksheet
    const summaryData = [
      ['Měsíc', 'Počet směn', 'Ranní', 'Odpolední', 'Noční', 'Celkem hodin']
    ];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthShifts = shifts.filter(shift => 
        shift.date.getFullYear() === year && shift.date.getMonth() === month
      );

      if (monthShifts.length === 0) continue;

      const morningCount = monthShifts.filter(s => s.type === 'morning').length;
      const afternoonCount = monthShifts.filter(s => s.type === 'afternoon').length;
      const nightCount = monthShifts.filter(s => s.type === 'night').length;

      summaryData.push([
        format(monthDate, 'MMMM', { locale: cs }),
        monthShifts.length.toString(),
        morningCount.toString(),
        afternoonCount.toString(),
        nightCount.toString(),
        (monthShifts.length * 8).toString()
      ]);
    }

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [
      { width: 12 }, { width: 12 }, { width: 8 }, { width: 12 }, { width: 8 }, { width: 12 }
    ];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Přehled');

    const fileName = `smeny_rocni_${year}_${userName || 'report'}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}
