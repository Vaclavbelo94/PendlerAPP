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
    
    // Parse time string (could be "06:00:00", "6:00", etc.)
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) return 'OFF';
    
    const hour = parseInt(timeMatch[1]);
    
    // Shift type detection based on start time
    if (hour >= 5 && hour <= 8) return 'R';  // Morning: 05:00-08:00
    if (hour >= 13 && hour <= 16) return 'O'; // Afternoon: 13:00-16:00
    if (hour >= 21 || hour <= 2) return 'N';  // Night: 21:00-02:00
    
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
          
          // Convert to JSON, skipping first 5 rows (skiprows=5)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            range: 5 // Start from row 6 (0-indexed)
          }) as any[][];

          if (jsonData.length < 2) {
            throw new Error('Excel soubor neobsahuje dostatek dat');
          }

          // Extract KW from filename (e.g., "KW01.xlsx" -> "KW01")
          const kwMatch = file.name.match(/KW(\d{2})/i);
          const kw = kwMatch ? `KW${kwMatch[1]}` : 'KW01';

          // Parse header row to identify Woche columns
          const headerRow = jsonData[0] || [];
          const wocheColumns: { [key: number]: number } = {};
          
          headerRow.forEach((cell: any, index: number) => {
            if (typeof cell === 'string') {
              // Look for patterns like "REVAS N", "Dpl", etc. and map to Woche numbers
              // For now, we'll assign sequential Woche numbers (1-15)
              if (cell.trim() && index > 0) { // Skip first column (days)
                const wocheNumber = (index - 1) % 15 + 1;
                wocheColumns[index] = wocheNumber;
              }
            }
          });

          const shifts: ShiftData[] = [];
          const daysOfWeek = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
          
          // Calculate start date of the KW
          const currentYear = new Date().getFullYear();
          const kwNumber = parseInt(kw.replace('KW', ''));
          const startDate = getDateOfKW(currentYear, kwNumber);

          // Process data rows (skip header)
          jsonData.slice(1).forEach((row: any[], dayIndex: number) => {
            if (dayIndex >= 7) return; // Only process 7 days
            
            const dayName = daysOfWeek[dayIndex];
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + dayIndex);
            const dateStr = date.toISOString().split('T')[0];

            // Process each Woche column
            Object.entries(wocheColumns).forEach(([colIndex, wocheNumber]) => {
              const cellValue = row[parseInt(colIndex)];
              const timeStr = cellValue ? cellValue.toString().trim() : '';
              
              const shiftType = detectShiftType(timeStr);
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
          });

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