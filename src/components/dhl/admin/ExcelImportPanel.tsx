import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, Check, AlertTriangle, Loader2, Download, Eye } from 'lucide-react';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ShiftData {
  day: string;
  date: string;
  woche: number;
  startTime?: string;
  endTime?: string;
  shiftType: 'R' | 'O' | 'N' | 'OFF';
  isEdited?: boolean;
}

interface ParsedExcelData {
  kw: string;
  shifts: ShiftData[];
  metadata: {
    fileName: string;
    totalDays: number;
    totalShifts: number;
    dateRange: { start: string; end: string };
  };
}

const SHIFT_TYPE_COLORS = {
  'R': 'bg-green-100 text-green-800 border-green-200',
  'O': 'bg-blue-100 text-blue-800 border-blue-200', 
  'N': 'bg-gray-800 text-white border-gray-600',
  'OFF': 'bg-gray-100 text-gray-600 border-gray-300'
};

const SHIFT_TYPE_LABELS = {
  'R': 'Ranní',
  'O': 'Odpolední',
  'N': 'Noční',
  'OFF': 'Volno'
};

export default function ExcelImportPanel() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null);
  const [editedShifts, setEditedShifts] = useState<ShiftData[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [positions, setPositions] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useStandardizedToast();

  // Load DHL positions on component mount
  useEffect(() => {
    const loadPositions = async () => {
      const { data } = await supabase
        .from('dhl_positions')
        .select('*')
        .eq('is_active', true)
        .order('name');
      setPositions(data || []);
    };
    loadPositions();
  }, []);

  const detectShiftType = (timeStr: string): 'R' | 'O' | 'N' | 'OFF' => {
    if (!timeStr || timeStr.trim() === '') return 'OFF';
    
    // Extract all time patterns from string (look for HH:MM format)
    const timePattern = /(\d{1,2}):(\d{2})/g;
    const times = [...timeStr.matchAll(timePattern)];
    
    if (times.length === 0) return 'OFF';
    
    // Get the first time as start time
    const startHour = parseInt(times[0][1]);
    const startMinute = parseInt(times[0][2]);
    
    // Noční směna (22:00-6:30)
    // Speciální případ: 23:30-00:00 znamená začátek půl hodiny před půlnocí a pokračuje až do 6:30
    if (startHour >= 22 || startHour <= 6 || 
        (startHour === 23 && startMinute >= 30)) {
      return 'N';
    }
    
    // Ranní směna (končí do 14:00-15:00)
    if (startHour >= 5 && startHour < 14) return 'R';
    
    // Odpolední směna (14:00-21:15, začíná koncem ranní)
    if (startHour >= 14 && startHour < 22) return 'O';
    
    return 'OFF';
  };

  const parseExcelFile = async (file: File): Promise<ParsedExcelData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Read sheet as 2D array without skipping rows initially
          const rawData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '' // Default value for empty cells
          }) as any[][];

          console.log('Raw Excel data:', rawData.slice(0, 15)); // Debug first 15 rows

          if (rawData.length < 15) {
            throw new Error('Excel soubor neobsahuje dostatek řádků');
          }

          // Extract KW from filename (e.g., "KW01.xlsx" -> "KW01")
          const kwMatch = file.name.match(/KW(\d{2})/i);
          const kw = kwMatch ? `KW${kwMatch[1]}` : 'KW01';

          // Find Woche numbers row (should be row 8, 0-indexed = 7)
          // Based on your image: row 8 contains numbers 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
          const wocheRowIndex = 7; // Row 8 (0-indexed)
          const wocheRow = rawData[wocheRowIndex] || [];
          const wocheNumbers: { [key: number]: number } = {};
          
          console.log(`Woche row (index ${wocheRowIndex}):`, wocheRow);
          
          wocheRow.forEach((cell: any, colIndex: number) => {
            if (cell && typeof cell === 'number' && cell >= 1 && cell <= 15) {
              wocheNumbers[colIndex] = cell;
              console.log(`Found Woche ${cell} at column ${colIndex}`);
            } else if (cell && typeof cell === 'string') {
              const wocheMatch = cell.toString().match(/^(\d{1,2})$/);
              if (wocheMatch) {
                const wocheNum = parseInt(wocheMatch[1]);
                if (wocheNum >= 1 && wocheNum <= 15) {
                  wocheNumbers[colIndex] = wocheNum;
                  console.log(`Found Woche ${wocheNum} at column ${colIndex} (string)`);
                }
              }
            }
          });

          if (Object.keys(wocheNumbers).length === 0) {
            throw new Error('Nepodařilo se najít Woche čísla v řádku 8. Očekávána čísla 1-15.');
          }

          console.log('Final Woche mapping:', wocheNumbers);

          const shifts: ShiftData[] = [];
          const daysOfWeek = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
          
          // Calculate start date of the KW
          const currentYear = new Date().getFullYear();
          const kwNumber = parseInt(kw.replace('KW', ''));
          const startDate = getDateOfKW(currentYear, kwNumber);

           // Helper function to convert Excel decimal time to HH:MM format
           const excelTimeToString = (decimalTime: number): string => {
             const totalMinutes = Math.round(decimalTime * 24 * 60);
             const hours = Math.floor(totalMinutes / 60) % 24;
             const minutes = totalMinutes % 60;
             return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
           };

           // Helper function to determine shift type based on time value
           const determineShiftType = (timeValue: any): 'R' | 'O' | 'N' | 'OFF' => {
             if (!timeValue || timeValue === 0 || timeValue === '') return 'OFF';
             
             let timeStr: string;
             
             if (typeof timeValue === 'number') {
               // Convert Excel decimal time to string
               timeStr = excelTimeToString(timeValue);
             } else if (typeof timeValue === 'string') {
               timeStr = timeValue.trim();
             } else {
               return 'OFF';
             }
             
             if (!timeStr || timeStr === '00:00') return 'OFF';
             
             console.log(`Converting time ${timeValue} -> ${timeStr}`);
             
             // Parse time string
             const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
             if (!timeMatch) return 'OFF';
             
             const hours = parseInt(timeMatch[1]);
             const minutes = parseInt(timeMatch[2]);
             const totalMinutes = hours * 60 + minutes;
             
             // Noční směna: 22:00-6:30 (včetně přes půlnoc)
             if (totalMinutes >= 22 * 60 || totalMinutes <= 6 * 60 + 30) {
               return 'N'; // Noční
             }
             // Ranní směna: 5:00-14:00
             else if (totalMinutes >= 5 * 60 && totalMinutes <= 14 * 60) {
               return 'R'; // Ranní
             }
             // Odpolední směna: 14:00-21:15
             else if (totalMinutes >= 14 * 60 && totalMinutes <= 21 * 60 + 15) {
               return 'O'; // Odpolední
             }
             
             return 'OFF';
           };

           // Process shift data rows (start from row 11, 0-indexed = 10)
           // Based on your image: Mo, Di, Mi, Do, Fr, Sa, So start at row 11
           const startDataRow = 10; // Row 11 (0-indexed)
           
           for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
             const dataRowIndex = startDataRow + dayIndex;
             if (dataRowIndex >= rawData.length) continue;
             
             const row = rawData[dataRowIndex] || [];
             const dayName = daysOfWeek[dayIndex];
             const date = new Date(startDate);
             date.setDate(startDate.getDate() + dayIndex);
             const dateStr = date.toISOString().split('T')[0];

             console.log(`Processing day ${dayName} from row ${dataRowIndex}:`, row.slice(0, 10));

             // Process each Woche column
             Object.entries(wocheNumbers).forEach(([colIndex, wocheNumber]) => {
               const cellValue = row[parseInt(colIndex)];
               
               console.log(`Day ${dayName}, Woche ${wocheNumber} (col ${colIndex}), Cell value:`, cellValue);
               
               const shiftType = determineShiftType(cellValue);
               let timeStr = '';
               
               if (cellValue && cellValue !== 0 && shiftType !== 'OFF') {
                 if (typeof cellValue === 'number') {
                   timeStr = excelTimeToString(cellValue);
                 } else {
                   timeStr = cellValue.toString().trim();
                 }
               }
               
               console.log(`Time conversion: ${cellValue} -> ${timeStr}, Shift type: ${shiftType}`);
               
               const startTime = shiftType !== 'OFF' ? timeStr : undefined;
               const endTime = shiftType !== 'OFF' ? calculateEndTime(timeStr, shiftType) : undefined;

               shifts.push({
                 day: dayName,
                 date: dateStr,
                 woche: wocheNumber,
                 startTime,
                 endTime,
                 shiftType
               });
             });
          }

          const dateRange = {
            start: shifts[0]?.date || '',
            end: shifts[shifts.length - 1]?.date || ''
          };

          resolve({
            kw,
            shifts,
            metadata: {
              fileName: file.name,
              totalDays: 7,
              totalShifts: shifts.filter(s => s.shiftType !== 'OFF').length,
              dateRange
            }
          });
        } catch (error) {
          reject(new Error(`Chyba při parsování Excel souboru: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error('Chyba při čtení souboru'));
      reader.readAsArrayBuffer(file);
    });
  };

  const getDateOfKW = (year: number, kw: number): Date => {
    // Simple approximation - could be improved with proper ISO week calculation
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay() || 7; // Monday = 1
    const firstMonday = new Date(year, 0, 1 + (8 - dayOfWeek) % 7);
    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (kw - 1) * 7);
    return targetDate;
  };

  const calculateEndTime = (startTime: string, shiftType: 'R' | 'O' | 'N'): string => {
    if (!startTime) return '';
    
    const timeMatch = startTime.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) return '';
    
    const startHour = parseInt(timeMatch[1]);
    const startMinute = parseInt(timeMatch[2]);
    
    // Standard 8-hour shifts
    let endHour = startHour + 8;
    if (endHour >= 24) endHour -= 24;
    
    return `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      showError('Neplatný formát', 'Prosím nahrajte Excel soubor (.xlsx nebo .xls)');
      return;
    }

    setIsUploading(true);
    try {
      const parsed = await parseExcelFile(file);
      setParsedData(parsed);
      setEditedShifts([...parsed.shifts]);
      success('Soubor načten', `Úspěšně načteno ${parsed.shifts.length} záznamů z ${file.name}`);
    } catch (error) {
      showError('Chyba importu', error instanceof Error ? error.message : 'Neznámá chyba');
    } finally {
      setIsUploading(false);
    }
  };

  const updateShiftType = (index: number, newType: 'R' | 'O' | 'N' | 'OFF') => {
    const updated = [...editedShifts];
    updated[index] = {
      ...updated[index],
      shiftType: newType,
      isEdited: true,
      startTime: newType === 'OFF' ? undefined : updated[index].startTime,
      endTime: newType === 'OFF' ? undefined : updated[index].endTime
    };
    setEditedShifts(updated);
  };

  const saveToDatabase = async () => {
    if (!parsedData || !selectedPosition) {
      showError('Neúplné údaje', 'Vyberte pozici před uložením');
      return;
    }

    setIsSaving(true);
    try {
      // Group shifts by Woche for batch insert
      const shiftsByWoche = editedShifts.reduce((acc, shift) => {
        if (!acc[shift.woche]) {
          acc[shift.woche] = [];
        }
        acc[shift.woche].push(shift);
        return acc;
      }, {} as Record<number, ShiftData[]>);

      // Delete existing data for this calendar week and position
      await supabase
        .from('dhl_shift_schedules')
        .delete()
        .eq('calendar_week', parseInt(parsedData.kw.replace('KW', '')))
        .eq('position_id', selectedPosition);

      // Insert new shift schedules  
      const scheduleInserts = Object.entries(shiftsByWoche).map(([woche, shifts]) => ({
        position_id: selectedPosition,
        woche_group: parseInt(woche),
        schedule_name: `${parsedData.kw} - Woche ${woche}`,
        schedule_data: JSON.parse(JSON.stringify({ shifts, kw: parsedData.kw })),
        base_date: new Date().toISOString().split('T')[0],
        base_woche: parseInt(woche),
        calendar_week: parseInt(parsedData.kw.replace('KW', '')),
        is_active: true
      }));

      const { error } = await supabase
        .from('dhl_shift_schedules')
        .insert(scheduleInserts);

      if (error) throw error;

      // Log import
      await supabase
        .from('dhl_schedule_imports')
        .insert({
          admin_user_id: (await supabase.auth.getUser()).data.user?.id || '',
          file_name: parsedData.metadata.fileName,
          import_status: 'success',
          records_processed: editedShifts.length,
          metadata: {
            kw: parsedData.kw,
            position_id: selectedPosition,
            total_shifts: editedShifts.filter(s => s.shiftType !== 'OFF').length
          }
        });

      success('Import dokončen', `Úspěšně uloženo ${editedShifts.length} směn pro ${parsedData.kw}`);
      
      // Reset form
      setParsedData(null);
      setEditedShifts([]);
      setSelectedPosition('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Save error:', error);
      showError('Chyba při ukládání', error instanceof Error ? error.message : 'Neznámá chyba');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            <CardTitle>Import směnového plánu z Excel</CardTitle>
          </div>
          <CardDescription>
            Nahrajte týdenní plán směn ve formátu .xlsx (např. KW01.xlsx, KW02.xlsx...)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="position-select">DHL Pozice</Label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte pozici pro import" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name} - {position.position_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-upload">Excel soubor</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Formát: KWxx.xlsx (např. KW01.xlsx). Data musí začínat od řádku 6.
              </p>
            </div>
          </div>

          {parsedData && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                <strong>Načteno:</strong> {parsedData.metadata.fileName} • 
                {parsedData.metadata.totalShifts} směn • 
                {parsedData.metadata.dateRange.start} - {parsedData.metadata.dateRange.end}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Preview Table */}
      {parsedData && editedShifts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <CardTitle>Náhled a editace ({parsedData.kw})</CardTitle>
              </div>
              <Button 
                onClick={saveToDatabase}
                disabled={!selectedPosition || isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Uložit do databáze
              </Button>
            </div>
            <CardDescription>
              Zkontrolujte a případně upravte detekované směny před uložením
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Den</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Woche</TableHead>
                    <TableHead>Čas</TableHead>
                    <TableHead>Typ směny</TableHead>
                    <TableHead>Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedShifts.map((shift, index) => (
                    <TableRow key={index} className={shift.isEdited ? 'bg-yellow-50' : ''}>
                      <TableCell className="font-medium">{shift.day}</TableCell>
                      <TableCell>{shift.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">W{shift.woche}</Badge>
                      </TableCell>
                      <TableCell>
                        {shift.startTime && shift.endTime 
                          ? `${shift.startTime} - ${shift.endTime}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={SHIFT_TYPE_COLORS[shift.shiftType]}>
                          {SHIFT_TYPE_LABELS[shift.shiftType]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={shift.shiftType}
                          onValueChange={(value: 'R' | 'O' | 'N' | 'OFF') => updateShiftType(index, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="R">R</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                            <SelectItem value="OFF">OFF</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                <span>Ranní (R)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                <span>Odpolední (O)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gray-800"></div>
                <span>Noční (N)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                <span>Volno (OFF)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}