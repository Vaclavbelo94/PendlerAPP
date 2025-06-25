
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportData {
  positions: Array<{
    name: string;
    position_type: string;
    hourly_rate?: number;
    description?: string;
  }>;
  work_groups: Array<{
    name: string;
    week_number: number;
    description?: string;
  }>;
  shift_templates: Array<{
    position_name: string;
    work_group_name: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    break_duration?: number;
    is_required?: boolean;
  }>;
}

const DHLBulkImport: React.FC = () => {
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<string[]>([]);
  const { success, error } = useStandardizedToast();

  const validateImportData = (data: any): data is ImportData => {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.positions)) return false;
    if (!Array.isArray(data.work_groups)) return false;
    if (!Array.isArray(data.shift_templates)) return false;
    return true;
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      error('Chyba', 'Prosím vložte data pro import');
      return;
    }

    try {
      setIsImporting(true);
      setImportResults([]);
      
      const parsedData = JSON.parse(importData);
      
      if (!validateImportData(parsedData)) {
        throw new Error('Neplatný formát dat');
      }

      const results: string[] = [];

      // Import positions
      if (parsedData.positions.length > 0) {
        const { data: positionsData, error: positionsError } = await supabase
          .from('dhl_positions')
          .insert(parsedData.positions.map(pos => ({
            name: pos.name,
            position_type: pos.position_type as any,
            hourly_rate: pos.hourly_rate || null,
            description: pos.description || null,
            is_active: true
          })))
          .select();

        if (positionsError) throw positionsError;
        results.push(`✅ Importováno ${positionsData.length} pozic`);
      }

      // Import work groups
      if (parsedData.work_groups.length > 0) {
        const { data: groupsData, error: groupsError } = await supabase
          .from('dhl_work_groups')
          .insert(parsedData.work_groups.map(group => ({
            name: group.name,
            week_number: group.week_number,
            description: group.description || null,
            is_active: true
          })))
          .select();

        if (groupsError) throw groupsError;
        results.push(`✅ Importováno ${groupsData.length} pracovních skupin`);
      }

      // Import shift templates (requires position and work group IDs)
      if (parsedData.shift_templates.length > 0) {
        // First, get position and work group mappings
        const { data: positions } = await supabase
          .from('dhl_positions')
          .select('id, name');
        
        const { data: workGroups } = await supabase
          .from('dhl_work_groups')
          .select('id, name');

        const positionMap = new Map(positions?.map(p => [p.name, p.id]) || []);
        const workGroupMap = new Map(workGroups?.map(g => [g.name, g.id]) || []);

        const templatesWithIds = parsedData.shift_templates
          .map(template => ({
            position_id: positionMap.get(template.position_name) || null,
            work_group_id: workGroupMap.get(template.work_group_name) || null,
            day_of_week: template.day_of_week,
            start_time: template.start_time,
            end_time: template.end_time,
            break_duration: template.break_duration || 30,
            is_required: template.is_required || false
          }))
          .filter(template => template.position_id && template.work_group_id);

        if (templatesWithIds.length > 0) {
          const { data: templatesData, error: templatesError } = await supabase
            .from('dhl_shift_templates')
            .insert(templatesWithIds)
            .select();

          if (templatesError) throw templatesError;
          results.push(`✅ Importováno ${templatesData.length} šablon směn`);
        }

        if (templatesWithIds.length < parsedData.shift_templates.length) {
          results.push(`⚠️ ${parsedData.shift_templates.length - templatesWithIds.length} šablon přeskočeno (neplatné odkazy)`);
        }
      }

      setImportResults(results);
      success('Úspěch', 'Import byl dokončen');
      setImportData('');

    } catch (err) {
      error('Chyba', err instanceof Error ? err.message : 'Chyba při importu dat');
      console.error('Import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const exampleData = {
    positions: [
      {
        name: "Verlader Inbound",
        position_type: "verlader",
        hourly_rate: 12.50,
        description: "Nakládání zboží"
      }
    ],
    work_groups: [
      {
        name: "Woche 1",
        week_number: 1,
        description: "První pracovní týden"
      }
    ],
    shift_templates: [
      {
        position_name: "Verlader Inbound",
        work_group_name: "Woche 1",
        day_of_week: 1,
        start_time: "06:00",
        end_time: "14:00",
        break_duration: 30,
        is_required: true
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hromadný import dat</h2>
        <p className="text-muted-foreground">
          Importujte pozice, pracovní skupiny a šablony směn pomocí JSON formátu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import dat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="import-data">JSON data pro import</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Vložte JSON data zde..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleImport} 
              disabled={isImporting || !importData.trim()}
              className="w-full"
            >
              {isImporting ? 'Importuje se...' : 'Spustit import'}
            </Button>

            {importResults.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {importResults.map((result, index) => (
                      <div key={index}>{result}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Příklad formátu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Data musí být ve formátu JSON a obsahovat pole: positions, work_groups, shift_templates
                </AlertDescription>
              </Alert>

              <div>
                <Label>Příklad správného formátu:</Label>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {JSON.stringify(exampleData, null, 2)}
                </pre>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Poznámky k formátu:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>position_type: technik, rangierer, verlader, sortierer, fahrer, other</li>
                  <li>day_of_week: 0=Neděle, 1=Pondělí, ..., 6=Sobota</li>
                  <li>časy ve formátu HH:MM</li>
                  <li>shift_templates odkazy musí odpovídat názvům pozic a skupin</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DHLBulkImport;
