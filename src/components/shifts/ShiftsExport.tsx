
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarExport } from './CalendarExport';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Shift } from '@/types/shifts';
import { Separator } from '@/components/ui/separator';

interface ShiftsExportProps {
  shifts: Shift[];
}

const ShiftsExport: React.FC<ShiftsExportProps> = ({ shifts }) => {
  const exportToCSV = () => {
    if (shifts.length === 0) return;

    const headers = ['Datum', 'Typ směny', 'Poznámky'];
    const csvContent = [
      headers.join(','),
      ...shifts.map(shift => [
        shift.date,
        shift.type === 'morning' ? 'Ranní' : shift.type === 'afternoon' ? 'Odpolední' : 'Noční',
        `"${shift.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'smeny-export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (shifts.length === 0) return;

    const jsonContent = JSON.stringify(shifts, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'smeny-backup.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Export do kalendáře
          </CardTitle>
          <CardDescription>
            Exportujte své směny do kalendářových aplikací
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarExport shifts={shifts} />
        </CardContent>
      </Card>

      <Separator />

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export dat
          </CardTitle>
          <CardDescription>
            Stáhněte si data o směnách v různých formátech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">CSV Export</h4>
              <p className="text-sm text-muted-foreground">
                Exportujte data pro Excel nebo jiné tabulkové procesory
              </p>
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                disabled={shifts.length === 0}
                className="w-full flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Stáhnout CSV
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">JSON Backup</h4>
              <p className="text-sm text-muted-foreground">
                Kompletní záloha všech dat o směnách
              </p>
              <Button 
                variant="outline" 
                onClick={exportToJSON}
                disabled={shifts.length === 0}
                className="w-full flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Stáhnout JSON
              </Button>
            </div>
          </div>

          {shifts.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nejsou k dispozici žádné směny pro export
            </p>
          )}
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Statistiky exportu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{shifts.length}</div>
              <div className="text-sm text-muted-foreground">Celkem směn</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {shifts.filter(s => s.type === 'morning').length}
              </div>
              <div className="text-sm text-muted-foreground">Ranní směny</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {shifts.filter(s => s.type === 'afternoon').length}
              </div>
              <div className="text-sm text-muted-foreground">Odpolední směny</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {shifts.filter(s => s.type === 'night').length}
              </div>
              <div className="text-sm text-muted-foreground">Noční směny</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsExport;
