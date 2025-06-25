
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, Trash2, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleUploader } from './ScheduleUploader';
import { SchedulePreview } from './SchedulePreview';
import { ImportHistory } from './ImportHistory';
import { SchedulesList } from './SchedulesList';

const DHLImportPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DHL Import dat</h2>
          <p className="text-muted-foreground">
            Import plánů směn z JSON souborů a automatické generování směn pro zaměstnance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Plány směn
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Historie
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Generování
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Nahrát plán směn
              </CardTitle>
              <CardDescription>
                Nahrajte JSON soubor s plánem směn pro konkrétní pozici a pracovní skupinu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleUploader />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formát JSON souboru</CardTitle>
              <CardDescription>
                Požadovaná struktura pro import plánů směn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Povinné pole:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><code>base_date</code> - Referenční datum (YYYY-MM-DD)</li>
                    <li><code>woche</code> - Číslo týdne v cyklu (1-15)</li>
                    <li><code>YYYY-MM-DD</code> - Konkrétní data se směnami</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Struktura směny:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><code>start_time</code> - Začátek směny (HH:MM)</li>
                    <li><code>end_time</code> - Konec směny (HH:MM)</li>
                    <li><code>day</code> - Den v týdnu (volitelné)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <SchedulesList />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <ImportHistory />
        </TabsContent>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generování směn</CardTitle>
              <CardDescription>
                Automatické generování směn pro zaměstnance na základě importovaných plánů
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Bulk generování směn</h4>
                      <p className="text-sm text-muted-foreground">
                        Vygeneruje směny pro všechny zaměstnance na základě jejich pozice a pracovní skupiny
                      </p>
                    </div>
                    <Button>
                      Generovat všechny směny
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Nastavení Woche referenčních bodů</h4>
                      <p className="text-sm text-muted-foreground">
                        Správa individuálních referenčních bodů zaměstnanců pro výpočet Woche
                      </p>
                    </div>
                    <Button variant="outline">
                      Spravovat reference
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DHLImportPanel;
