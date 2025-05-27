
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsReportsProps {
  shifts: Shift[];
}

const ShiftsReports: React.FC<ShiftsReportsProps> = ({ shifts }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  const getFilteredShifts = () => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'current-month':
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date);
          return shiftDate >= startOfMonth(now) && shiftDate <= endOfMonth(now);
        });
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date);
          return shiftDate >= startOfMonth(lastMonth) && shiftDate <= endOfMonth(lastMonth);
        });
      case 'current-year':
        return shifts.filter(shift => {
          const shiftDate = new Date(shift.date);
          return shiftDate >= startOfYear(now) && shiftDate <= endOfYear(now);
        });
      default:
        return shifts;
    }
  };

  const filteredShifts = getFilteredShifts();

  const generateReport = () => {
    const reportData = {
      period: selectedPeriod,
      totalShifts: filteredShifts.length,
      shiftTypes: filteredShifts.reduce((acc, shift) => {
        acc[shift.type] = (acc[shift.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      shifts: filteredShifts.map(shift => ({
        date: format(new Date(shift.date), 'dd.MM.yyyy'),
        type: shift.type === 'morning' ? 'Ranní' : 
              shift.type === 'afternoon' ? 'Odpolední' : 'Noční',
        notes: shift.notes || ''
      }))
    };

    const reportText = `
REPORT SMĚN
================

Období: ${getPeriodLabel()}
Celkem směn: ${reportData.totalShifts}

Rozdělení podle typů:
- Ranní směny: ${reportData.shiftTypes.morning || 0}
- Odpolední směny: ${reportData.shiftTypes.afternoon || 0}
- Noční směny: ${reportData.shiftTypes.night || 0}

Detail směn:
${reportData.shifts.map(shift => 
  `${shift.date} - ${shift.type}${shift.notes ? ` (${shift.notes})` : ''}`
).join('\n')}

Vygenerováno: ${format(new Date(), 'dd.MM.yyyy HH:mm')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smeny-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'current-month':
        return 'Aktuální měsíc';
      case 'last-month':
        return 'Minulý měsíc';
      case 'current-year':
        return 'Aktuální rok';
      default:
        return 'Všechny směny';
    }
  };

  const getShiftTypeCount = (type: string) => {
    return filteredShifts.filter(shift => shift.type === type).length;
  };

  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Žádná data pro report</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generování reportů
          </CardTitle>
          <CardDescription>
            Vyberte období a stáhněte si report vašich směn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte období" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Aktuální měsíc</SelectItem>
                  <SelectItem value="last-month">Minulý měsíc</SelectItem>
                  <SelectItem value="current-year">Aktuální rok</SelectItem>
                  <SelectItem value="all">Všechny směny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Stáhnout report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Náhled reportu - {getPeriodLabel()}</CardTitle>
          <CardDescription>
            Přehled směn za vybrané období
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žádné směny v tomto období</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-2xl font-bold">{filteredShifts.length}</div>
                  <div className="text-sm text-muted-foreground">Celkem směn</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{getShiftTypeCount('morning')}</div>
                  <div className="text-sm text-orange-600">Ranní směny</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getShiftTypeCount('afternoon')}</div>
                  <div className="text-sm text-blue-600">Odpolední směny</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getShiftTypeCount('night')}</div>
                  <div className="text-sm text-purple-600">Noční směny</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Poslední směny</h4>
                <div className="space-y-2">
                  {filteredShifts.slice(0, 5).map((shift) => (
                    <div key={shift.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span>{format(new Date(shift.date), 'dd.MM.yyyy', { locale: cs })}</span>
                      <span className="text-sm text-muted-foreground">
                        {shift.type === 'morning' ? 'Ranní' : 
                         shift.type === 'afternoon' ? 'Odpolední' : 'Noční'}
                      </span>
                    </div>
                  ))}
                  {filteredShifts.length > 5 && (
                    <div className="text-center text-sm text-muted-foreground pt-2">
                      ... a {filteredShifts.length - 5} dalších směn
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsReports;
