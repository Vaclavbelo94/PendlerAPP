import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Calculator, 
  TrendingUp, 
  Euro,
  PieChart,
  BarChart3,
  FileDown,
  Globe,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../types';
import TaxAnalyticsDashboard from '../../analytics/TaxAnalyticsDashboard';
import AdvancedExportManager from '../../export/AdvancedExportManager';
import SmartValidationEngine from '../../validation/SmartValidationEngine';
import TaxDashboard from '../../dashboard/TaxDashboard';
import DataSummaryTable from '../components/DataSummaryTable';
import FormCodeGenerator from '../components/FormCodeGenerator';
import AssistedSubmissionRequest from '../components/AssistedSubmissionRequest';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
  onExportXML?: () => void;
  onDownloadGuide?: () => void;
  onLoadData?: (data: TaxWizardData) => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  data, 
  result, 
  onExportPDF, 
  onExportXML, 
  onDownloadGuide,
  onLoadData 
}) => {
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const [formCode, setFormCode] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Quick Results Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('wizard.results.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Euro className="h-5 w-5 text-green-600 mr-1" />
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(result.reisepausaleBenefit)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.reisepauschaleAmount')}</p>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-1" />
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.totalDeductions)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.totalDeductions')}</p>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calculator className="h-5 w-5 text-purple-600 mr-1" />
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(result.totalDeductions * 0.25)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.estimatedRefund')}</p>
            </div>
          </div>
          
          {/* ELSTER Information Alert */}
          <Alert className="mt-4 border-blue-200 bg-blue-50/50">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-blue-800">{t('wizard.elster.title')}</AlertTitle>
            <AlertDescription className="text-blue-700">
              {t('wizard.elster.description')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      {/* Progress indicator pro dokončené kroky */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Výpočet dokončen</h3>
        </div>
        <p className="text-sm text-green-700">
          Všechna data byla úspěšně zpracována a výsledky jsou připraveny k exportu.
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-1 h-auto p-1">
          <TabsTrigger value="summary" className="text-xs sm:text-sm py-2 px-2 sm:px-4">{t('common.summary')}</TabsTrigger>
          <TabsTrigger value="elster" className="text-xs sm:text-sm py-2 px-2 sm:px-4">ELSTER</TabsTrigger>
          <TabsTrigger value="formcode" className="text-xs sm:text-sm py-2 px-2 sm:px-4">{t('wizard.formCode.title')}</TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm py-2 px-2 sm:px-4">{t('wizard.results.exportOptions')}</TabsTrigger>
          <TabsTrigger value="submit" className="text-xs sm:text-sm py-2 px-2 sm:px-4">{t('wizard.assistedSubmission.title')}</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <DataSummaryTable data={data} result={result} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={onExportPDF} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('wizard.results.exportPdf')}
                </Button>
                
                <Button onClick={onExportXML} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('wizard.elster.xmlExport')}
                </Button>
                
                <Button onClick={onDownloadGuide} variant="outline" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  {t('wizard.elster.downloadGuide')}
                </Button>
                
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('wizard.formCode.title')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ELSTER Online Filing Tab */}
        <TabsContent value="elster" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('wizard.elster.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {t('wizard.elster.description')}
              </p>
              
              {/* Benefits Section */}
              <Card className="bg-green-50/50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {t('wizard.elster.benefits')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t('wizard.elster.benefit1')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t('wizard.elster.benefit2')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t('wizard.elster.benefit3')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{t('wizard.elster.benefit4')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step-by-Step Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('wizard.elster.howToSubmit')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {step}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            {t(`wizard.elster.step${step}`)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t(`wizard.elster.step${step}Description`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('wizard.elster.requiredDocuments')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((doc) => (
                      <div key={doc} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{t(`wizard.elster.document${doc}`)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={onExportXML} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('wizard.elster.xmlExport')}
                </Button>
                <Button onClick={onDownloadGuide} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('wizard.elster.downloadGuide')}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://elster.de" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    elster.de
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Code Tab */}
        <TabsContent value="formcode">
          <FormCodeGenerator 
            data={data} 
            result={result} 
            onLoadData={onLoadData}
          />
        </TabsContent>

        {/* Export Tab - Vylepšené možnosti */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t('wizard.results.exportOptions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={onExportPDF} className="w-full h-16 flex flex-col gap-1">
                  <Download className="h-5 w-5" />
                  <span className="text-sm font-semibold">{t('wizard.results.exportPdf')}</span>
                  <span className="text-xs opacity-80">Kompletní dokument</span>
                </Button>
                <Button onClick={onExportXML} variant="outline" className="w-full h-16 flex flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-semibold">{t('wizard.elster.xmlExport')}</span>
                  <span className="text-xs opacity-80">Pro ELSTER</span>
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> PDF dokument obsahuje všechny výpočty a je vhodný pro archivaci. XML soubor můžete importovat přímo do ELSTER portálu.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submit Tab */}
        <TabsContent value="submit">
          <AssistedSubmissionRequest 
            data={data} 
            result={result}
            formCode={formCode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsStep;