import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, Trash2, Download, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleUploader } from '@/components/dhl/admin/ScheduleUploader';
import { SchedulePreview } from '@/components/dhl/admin/SchedulePreview';
import { ImportHistory } from '@/components/dhl/admin/ImportHistory';
import { SchedulesList } from '@/components/dhl/admin/SchedulesList';
import { PositionManagementPanel } from '@/components/dhl/admin/PositionManagementPanel';
import '@/components/dhl/admin/MobileDHLStyles.css';

const DHLAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const renderUploadContent = () => {
    return (
      <>
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
      </>
    );
  };

  const renderSchedulesContent = () => {
    return <SchedulesList />;
  };

  const renderPositionsContent = () => {
    return <PositionManagementPanel />;
  };

  const renderHistoryContent = () => {
    return <ImportHistory />;
  };

  const renderGenerateContent = () => {
    return (
      <Card className="dhl-mobile-card">
        <CardHeader className="dhl-mobile-card-header">
          <CardTitle className="dhl-mobile-card-title">Generování směn</CardTitle>
          <CardDescription className="dhl-mobile-card-description">
            Automatické generování směn pro zaměstnance na základě importovaných plánů
          </CardDescription>
        </CardHeader>
        <CardContent className="dhl-mobile-card-content">
          <div className="space-y-4">
            <div className="dhl-mobile-schedule-item border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm sm:text-base dhl-text-wrap">Bulk generování směn</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 dhl-text-wrap">
                    Vygeneruje směny pro všechny zaměstnance na základě jejich pozice a pracovní skupiny
                  </p>
                </div>
                <Button className="w-full sm:w-auto dhl-mobile-button sm:dhl-mobile-button-secondary">
                  Generovat všechny směny
                </Button>
              </div>
            </div>

            <div className="dhl-mobile-schedule-item border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm sm:text-base dhl-text-wrap">Nastavení Woche referenčních bodů</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 dhl-text-wrap">
                    Správa individuálních referenčních bodů zaměstnanců pro výpočet Woche
                  </p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto dhl-mobile-button sm:dhl-mobile-button-secondary">
                  Spravovat reference
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="dhl-admin-container space-y-6">
      {/* Header */}
      <div className="dhl-admin-header">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DHL Import dat</h2>
          <p className="text-muted-foreground mt-2">
            Import plánů směn z JSON souborů a automatické generování směn pro zaměstnance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="dhl-mobile-tabs">
          <TabsList className="tabs-list grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
            <TabsTrigger value="upload" className="dhl-mobile-tab-trigger flex items-center gap-1 sm:gap-2">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Import</span>
              <span className="sm:hidden">Import</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="dhl-mobile-tab-trigger flex items-center gap-1 sm:gap-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Plány směn</span>
              <span className="sm:hidden">Plány</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="dhl-mobile-tab-trigger flex items-center gap-1 sm:gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pozice</span>
              <span className="sm:hidden">Pozice</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="dhl-mobile-tab-trigger flex items-center gap-1 sm:gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Historie</span>
              <span className="sm:hidden">Historie</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="dhl-mobile-tab-trigger flex items-center gap-1 sm:gap-2">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Generování</span>
              <span className="sm:hidden">Gen.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          {renderUploadContent()}
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          {renderSchedulesContent()}
        </TabsContent>

        {/* Positions Tab - NOW WITH ACTUAL COMPONENT */}
        <TabsContent value="positions" className="space-y-6">
          {renderPositionsContent()}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {renderHistoryContent()}
        </TabsContent>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          {renderGenerateContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DHLAdmin;
