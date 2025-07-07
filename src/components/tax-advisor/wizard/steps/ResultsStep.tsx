import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, FileText, Download, ExternalLink, Archive, Send, RefreshCw, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../types';
import { generateEnhancedTaxPDF } from '@/utils/pdf/modern/EnhancedTaxPDFGenerator';
import ElsterGuide from '../../elster/ElsterGuide';
import DocumentChecklist from '../../elster/DocumentChecklist';
import DataSummaryTable from '../components/DataSummaryTable';
import FormCodeGenerator from '../components/FormCodeGenerator';
import AssistedSubmissionRequest from '../components/AssistedSubmissionRequest';
import TaxAnalyticsDashboard from '../../analytics/TaxAnalyticsDashboard';
import AdvancedExportManager from '../../export/AdvancedExportManager';
import SmartValidationEngine from '../../validation/SmartValidationEngine';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
  onExportXML?: () => void;
  onDownloadGuide?: () => void;
  onDataChange?: (newData: TaxWizardData) => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  data, 
  result, 
  onExportPDF, 
  onExportXML, 
  onDownloadGuide,
  onDataChange 
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [formCode, setFormCode] = useState<string>('');

  const handleEnhancedPDFExport = async () => {
    try {
      await generateEnhancedTaxPDF(data, result, t);
    } catch (error) {
      console.error('Error generating enhanced PDF:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const openElster = () => {
    window.open('https://www.elster.de', '_blank');
  };

  const estimatedRefund = result.totalDeductions * 0.25; // 25% paušální sazba

  return (
    <div className="space-y-6">
      {/* Hlavní přehled výsledků */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('wizard.results.summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(result.reisepausaleBenefit)}
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.totalReisepauschale')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatCurrency(result.totalDeductions)}
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.totalDeductions')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(estimatedRefund)}
              </div>
              <p className="text-sm text-muted-foreground">{t('wizard.results.estimatedRefund')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="summary">{t('wizard.results.tabs.summary')}</TabsTrigger>
          <TabsTrigger value="data">{t('wizard.results.tabs.allData')}</TabsTrigger>
          <TabsTrigger value="export">{t('wizard.results.tabs.export')}</TabsTrigger>
          <TabsTrigger value="elster">{t('wizard.results.tabs.elster')}</TabsTrigger>
          <TabsTrigger value="documents">{t('wizard.results.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="assistance">{t('wizard.results.tabs.assistance')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('wizard.results.tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('wizard.results.breakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>{t('wizard.results.pendlerPauschale')}</span>
                    <span className="font-semibold">{formatCurrency(result.reisepausaleBenefit)}</span>
                  </div>
                  
                  {result.secondHomeBenefit > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span>{t('wizard.results.secondHomeBenefit')}</span>
                      <span className="font-semibold">{formatCurrency(result.secondHomeBenefit)}</span>
                    </div>
                  )}

                  {result.workClothesBenefit > 0 && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span>{t('wizard.deductions.workClothes')}</span>
                      <span className="font-semibold">{formatCurrency(result.workClothesBenefit)}</span>
                    </div>
                  )}
                  {result.educationBenefit > 0 && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span>{t('wizard.deductions.education')}</span>
                      <span className="font-semibold">{formatCurrency(result.educationBenefit)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded font-bold">
                      <span>{t('wizard.results.totalDeductions')}</span>
                      <span>{formatCurrency(result.totalDeductions)}</span>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">{t('wizard.results.expectedRefund')}</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(estimatedRefund)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('wizard.results.refundNote')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <DataSummaryTable data={data} result={result} />
        </TabsContent>

        <TabsContent value="export">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t('wizard.results.exportOptions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={onExportPDF} variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{t('wizard.results.exportPDF')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('wizard.results.exportPDFDesc')}</p>
                    </div>
                  </Button>
                  
                  <Button onClick={handleEnhancedPDFExport} variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Archive className="h-4 w-4" />
                        <span className="font-medium">{t('wizard.results.exportEnhancedPDF')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('wizard.results.exportEnhancedPDFDesc')}</p>
                    </div>
                  </Button>

                  {onExportXML && (
                    <Button onClick={onExportXML} variant="outline" className="h-auto p-4">
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <ExternalLink className="h-4 w-4" />
                          <span className="font-medium">{t('wizard.results.exportXML')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t('wizard.results.exportXMLDesc')}</p>
                      </div>
                    </Button>
                  )}

                  <Button onClick={openElster} className="h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <ExternalLink className="h-4 w-4" />
                        <span className="font-medium">{t('wizard.results.openElster')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('wizard.results.openElsterDesc')}</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <FormCodeGenerator 
              data={data} 
              result={result} 
            />
          </div>
        </TabsContent>

        <TabsContent value="elster">
          <ElsterGuide onOpenElster={openElster} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentChecklist 
            data={data} 
            onDownloadGuide={onDownloadGuide || (() => {})} 
          />
        </TabsContent>

        <TabsContent value="assistance">
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