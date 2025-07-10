import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, Trash2, Download, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleUploader } from './ScheduleUploader';
import { SchedulePreview } from './SchedulePreview';
import { ImportHistory } from './ImportHistory';
import { SchedulesList } from './SchedulesList';
import { PositionManagementPanel } from './PositionManagementPanel';
import BulkShiftGeneration from './BulkShiftGeneration';
import WocheReferenceManager from './WocheReferenceManager';
import AnnualPlanImport from '@/components/admin/dhl/AnnualPlanImport';
import './MobileDHLStyles.css';

const DHLImportPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    // Listen for messages to switch tabs
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'switchToUploadTab') {
        setActiveTab('upload');
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="dhl-admin-container space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="dhl-admin-header px-2 sm:px-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">DHL Import dat</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Import plánů směn z JSON souborů a automatické generování směn pro zaměstnance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="dhl-mobile-tabs px-2">
          <TabsList className="tabs-list grid w-full grid-cols-3 sm:grid-cols-7 gap-1 h-auto p-1">
            <TabsTrigger value="upload" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <Upload className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Import</span>
            </TabsTrigger>
            <TabsTrigger value="annual" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <Calendar className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Roční</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <FileText className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Plány</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <Users className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Pozice</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <CheckCircle className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Historie</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <Download className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Gener.</span>
            </TabsTrigger>
            <TabsTrigger value="references" className="dhl-mobile-tab-trigger flex flex-col sm:flex-row items-center gap-1 py-2 px-1 text-xs min-h-[60px] sm:min-h-[40px] touch-manipulation">
              <CheckCircle className="h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="block text-center leading-tight">Ref.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="dhl-mobile-card">
            <CardHeader className="dhl-mobile-card-header">
              <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Nahrát plán směn</span>
              </CardTitle>
              <CardDescription className="dhl-mobile-card-description">
                Nahrajte JSON soubor s plánem směn pro konkrétní pozici a pracovní skupinu
              </CardDescription>
            </CardHeader>
            <CardContent className="dhl-mobile-card-content dhl-mobile-upload-section">
              <ScheduleUploader />
            </CardContent>
          </Card>

          <Card className="dhl-mobile-card">
            <CardHeader className="dhl-mobile-card-header">
              <CardTitle className="dhl-mobile-card-title">Formát JSON souboru</CardTitle>
              <CardDescription className="dhl-mobile-card-description">
                Požadovaná struktura pro import plánů směn
              </CardDescription>
            </CardHeader>
            <CardContent className="dhl-mobile-card-content">
              <div className="space-y-4">
                <div className="dhl-mobile-format-info">
                  <h4 className="dhl-mobile-format-title">Povinné pole:</h4>
                  <ul className="dhl-mobile-format-list space-y-1">
                    <li><code>base_date</code> - Referenční datum (YYYY-MM-DD)</li>
                    <li><code>woche</code> - Číslo týdne v cyklu (1-15)</li>
                    <li><code>YYYY-MM-DD</code> - Konkrétní data se směnami</li>
                  </ul>
                </div>
                
                <div className="dhl-mobile-format-info">
                  <h4 className="dhl-mobile-format-title">Struktura směny:</h4>
                  <ul className="dhl-mobile-format-list space-y-1">
                    <li><code>start_time</code> - Začátek směny (HH:MM)</li>
                    <li><code>end_time</code> - Konec směny (HH:MM)</li>
                    <li><code>day</code> - Den v týdnu (volitelné)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annual Plans Tab */}
        <TabsContent value="annual" className="space-y-6">
          <Card className="dhl-mobile-card">
            <CardHeader className="dhl-mobile-card-header">
              <CardTitle className="dhl-mobile-card-title flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Import ročních plánů</span>
              </CardTitle>
              <CardDescription className="dhl-mobile-card-description">
                Nahrajte Excel soubor s ročními plány směn obsahující kalendářní týdny KW01-KW53
              </CardDescription>
            </CardHeader>
            <CardContent className="dhl-mobile-card-content">
              <AnnualPlanImport />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <SchedulesList />
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6">
          <PositionManagementPanel />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <ImportHistory />
        </TabsContent>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <BulkShiftGeneration />
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-6">
          <WocheReferenceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DHLImportPanel;
