import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  Table, 
  Mail, 
  Settings,
  Calendar,
  FileSpreadsheet,
  Database,
  Cloud,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { TaxWizardData, TaxCalculationResult } from '../wizard/types';
import * as XLSX from 'xlsx';

interface AdvancedExportManagerProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
}

const AdvancedExportManager: React.FC<AdvancedExportManagerProps> = ({ 
  data, 
  result 
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState({
    includePersonalData: true,
    includeCalculations: true,
    includeRecommendations: true,
    format: 'detailed',
    emailSettings: {
      recipient: data.personalInfo.email || '',
      subject: 'Tax Return Calculations',
      schedule: 'manual'
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const exportToExcel = async () => {
    try {
      // Příprava dat pro Excel export
      const workbook = XLSX.utils.book_new();
      
      // Osobní údaje
      const personalData = [
        ['Pole', 'Hodnota'],
        ['Jméno', data.personalInfo.firstName],
        ['Příjmení', data.personalInfo.lastName],
        ['Adresa', data.personalInfo.address],
        ['Daňové ID', data.personalInfo.taxId],
        ['Email', data.personalInfo.email]
      ];
      
      // Zaměstnanecké údaje
      const employmentData = [
        ['Pole', 'Hodnota'],
        ['Zaměstnavatel', data.employmentInfo.employerName],
        ['Roční příjem', formatCurrency(data.employmentInfo.annualIncome)],
        ['Daňová třída', data.employmentInfo.taxClass],
        ['Pracovní dny/rok', data.employmentInfo.workDaysPerYear]
      ];
      
      // Výpočty
      const calculationsData = [
        ['Typ odpočtu', 'Částka', 'ELSTER pole'],
        ['Reisepauschale', formatCurrency(result.reisepausaleBenefit), 'Anlage N - Zeile 31-35'],
        ['Pracovní oblečení', formatCurrency(result.workClothesBenefit), 'Anlage N - Zeile 41'],
        ['Vzdělávání', formatCurrency(result.educationBenefit), 'Anlage N - Zeile 44'],
        ['Pojištění', formatCurrency(result.insuranceBenefit), 'Anlage N - Zeile 48'],
        ['Celkem odpočty', formatCurrency(result.totalDeductions), ''],
        ['Odhadovaná úspora', formatCurrency(result.totalDeductions * 0.25), '']
      ];
      
      // Vytvoření listů
      const personalSheet = XLSX.utils.aoa_to_sheet(personalData);
      const employmentSheet = XLSX.utils.aoa_to_sheet(employmentData);
      const calculationsSheet = XLSX.utils.aoa_to_sheet(calculationsData);
      
      XLSX.utils.book_append_sheet(workbook, personalSheet, 'Osobní údaje');
      XLSX.utils.book_append_sheet(workbook, employmentSheet, 'Zaměstnání');
      XLSX.utils.book_append_sheet(workbook, calculationsSheet, 'Výpočty');
      
      // Export souboru
      const fileName = `tax_return_${data.personalInfo.lastName}_${new Date().getFullYear()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: t('export.success'),
        description: t('export.excelDownloaded'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('export.excelError'),
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ['Typ', 'Pole', 'Hodnota', 'ELSTER pole'],
      ['Osobní', 'Jméno', data.personalInfo.firstName, 'Mantelbogen - Zeile 4'],
      ['Osobní', 'Příjmení', data.personalInfo.lastName, 'Mantelbogen - Zeile 3'],
      ['Osobní', 'Daňové ID', data.personalInfo.taxId, 'Mantelbogen - Zeile 1'],
      ['Zaměstnání', 'Zaměstnavatel', data.employmentInfo.employerName, 'Anlage N - Zeile 4'],
      ['Zaměstnání', 'Roční příjem', formatCurrency(data.employmentInfo.annualIncome), 'Anlage N - Zeile 21'],
      ['Odpočty', 'Reisepauschale', formatCurrency(result.reisepausaleBenefit), 'Anlage N - Zeile 31-35'],
      ['Odpočty', 'Celkem', formatCurrency(result.totalDeductions), ''],
      ['Úspora', 'Odhadovaná', formatCurrency(result.totalDeductions * 0.25), '']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_return_${data.personalInfo.lastName}_${new Date().getFullYear()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('export.success'),
      description: t('export.csvDownloaded'),
    });
  };

  const sendEmailReport = async () => {
    try {
      // Simulace odeslání emailu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('export.emailSent'),
        description: t('export.emailSentDescription'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('export.emailError'),
        variant: "destructive",
      });
    }
  };

  const scheduleReport = async () => {
    try {
      // Simulace nastavení plánovaného reportu
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: t('export.scheduleSet'),
        description: t('export.scheduleSetDescription'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('export.scheduleError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('export.advancedExportManager')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="formats" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="formats">{t('export.tabs.formats')}</TabsTrigger>
              <TabsTrigger value="settings">{t('export.tabs.settings')}</TabsTrigger>
              <TabsTrigger value="email">{t('export.tabs.email')}</TabsTrigger>
              <TabsTrigger value="integration">{t('export.tabs.integration')}</TabsTrigger>
            </TabsList>

            <TabsContent value="formats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Excel Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('export.excelDescription')}
                    </p>
                    <Button onClick={exportToExcel} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t('export.downloadExcel')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Table className="h-4 w-4 text-blue-600" />
                      CSV Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('export.csvDescription')}
                    </p>
                    <Button onClick={exportToCSV} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t('export.downloadCSV')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      Enhanced PDF
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('export.enhancedPdfDescription')}
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {t('export.downloadPDF')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('export.exportSettings')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includePersonal"
                        checked={exportSettings.includePersonalData}
                        onCheckedChange={(checked) => 
                          setExportSettings(prev => ({ ...prev, includePersonalData: !!checked }))
                        }
                      />
                      <Label htmlFor="includePersonal">{t('export.includePersonalData')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCalculations"
                        checked={exportSettings.includeCalculations}
                        onCheckedChange={(checked) => 
                          setExportSettings(prev => ({ ...prev, includeCalculations: !!checked }))
                        }
                      />
                      <Label htmlFor="includeCalculations">{t('export.includeCalculations')}</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRecommendations"
                        checked={exportSettings.includeRecommendations}
                        onCheckedChange={(checked) => 
                          setExportSettings(prev => ({ ...prev, includeRecommendations: !!checked }))
                        }
                      />
                      <Label htmlFor="includeRecommendations">{t('export.includeRecommendations')}</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('export.reportFormat')}</Label>
                    <Select
                      value={exportSettings.format}
                      onValueChange={(value) => 
                        setExportSettings(prev => ({ ...prev, format: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">{t('export.summarized')}</SelectItem>
                        <SelectItem value="detailed">{t('export.detailed')}</SelectItem>
                        <SelectItem value="professional">{t('export.professional')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('export.emailReports')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recipient">{t('export.recipientEmail')}</Label>
                    <Input
                      id="email-recipient"
                      type="email"
                      value={exportSettings.emailSettings.recipient}
                      onChange={(e) => 
                        setExportSettings(prev => ({
                          ...prev,
                          emailSettings: { ...prev.emailSettings, recipient: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-subject">{t('export.emailSubject')}</Label>
                    <Input
                      id="email-subject"
                      value={exportSettings.emailSettings.subject}
                      onChange={(e) => 
                        setExportSettings(prev => ({
                          ...prev,
                          emailSettings: { ...prev.emailSettings, subject: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('export.scheduleFrequency')}</Label>
                    <Select
                      value={exportSettings.emailSettings.schedule}
                      onValueChange={(value) => 
                        setExportSettings(prev => ({
                          ...prev,
                          emailSettings: { ...prev.emailSettings, schedule: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">{t('export.manual')}</SelectItem>
                        <SelectItem value="monthly">{t('export.monthly')}</SelectItem>
                        <SelectItem value="quarterly">{t('export.quarterly')}</SelectItem>
                        <SelectItem value="yearly">{t('export.yearly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={sendEmailReport} className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('export.sendNow')}
                    </Button>
                    <Button onClick={scheduleReport} variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('export.schedule')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {t('export.accountingSoftware')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>DATEV</span>
                      <Badge variant="outline">{t('export.available')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Lexware</span>
                      <Badge variant="outline">{t('export.available')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Sage</span>
                      <Badge variant="secondary">{t('export.comingSoon')}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cloud className="h-4 w-4" />
                      {t('export.cloudStorage')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Google Drive</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>Dropbox</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span>OneDrive</span>
                      <Badge variant="secondary">{t('export.comingSoon')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedExportManager;