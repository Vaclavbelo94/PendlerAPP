
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calculator, TrendingUp, ExternalLink, FileText, CheckSquare } from 'lucide-react';
import { TaxWizardData, TaxCalculationResult } from '../types';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import ElsterGuide from '../../elster/ElsterGuide';
import DocumentChecklist from '../../elster/DocumentChecklist';

interface ResultsStepProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onExportPDF: () => void;
  onExportXML?: () => void;
  onDownloadGuide?: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ 
  data, 
  result, 
  onExportPDF, 
  onExportXML,
  onDownloadGuide 
}) => {
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('results');

  const handleOpenElster = () => {
    window.open('https://www.elster.de', '_blank');
  };

  const handleExportXML = async () => {
    if (onExportXML) {
      try {
        onExportXML();
        toast({
          title: t('wizard.results.exportSuccess'),
          description: t('wizard.results.xmlExportSuccess'),
        });
      } catch (error) {
        toast({
          title: t('wizard.results.exportError'),
          description: t('wizard.results.xmlExportError'),
          variant: "destructive",
        });
      }
    }
  };

  const handleDownloadGuide = async () => {
    if (onDownloadGuide) {
      try {
        onDownloadGuide();
        toast({
          title: t('wizard.results.exportSuccess'),
          description: t('wizard.results.guideDownloaded'),
        });
      } catch (error) {
        toast({
          title: t('wizard.results.exportError'),
          description: t('wizard.results.guideDownloadError'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">{t('wizard.results.title')}</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('wizard.results.export')}</span>
          </TabsTrigger>
          <TabsTrigger value="elster" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">{t('elster.guide.title')}</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">{t('documents.checklist.title')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          {/* Hlavní výsledky */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('wizard.results.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.totalDeductions')}</div>
              <div className="text-2xl font-bold text-green-600">
                {result.totalDeductions.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.estimatedSaving')}</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.estimatedTaxSaving.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('common:monthly')}</div>
              <div className="text-2xl font-bold text-purple-600">
                {result.monthlyBenefit.toFixed(2)} €
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">{t('wizard.results.annualBenefit')}</div>
              <div className="text-2xl font-bold text-amber-600">
                {(result.monthlyBenefit * 12).toFixed(2)} €
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailní rozpis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('wizard.results.breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>{t('wizard.results.reisepauschaleAmount')}:</span>
              <Badge variant="outline">{result.reisepausaleBenefit.toFixed(2)} €</Badge>
            </div>
            
            {result.secondHomeBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.reisepauschale.hasSecondHome')}:</span>
                <Badge variant="outline">{result.secondHomeBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.workClothesBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.workClothes')}:</span>
                <Badge variant="outline">{result.workClothesBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.educationBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.education')}:</span>
                <Badge variant="outline">{result.educationBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.insuranceBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>{t('wizard.deductions.insurance')}:</span>
                <Badge variant="outline">{result.insuranceBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.professionalLiteratureBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Odborná literatura:</span>
                <Badge variant="outline">{result.professionalLiteratureBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.toolsBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Pracovní nástroje:</span>
                <Badge variant="outline">{result.toolsBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.workingMaterialsBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Pracovní materiál:</span>
                <Badge variant="outline">{result.workingMaterialsBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.professionalAssociationBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Profesní sdružení:</span>
                <Badge variant="outline">{result.professionalAssociationBenefit.toFixed(2)} €</Badge>
              </div>
            )}
            
            {result.homeOfficeBenefit > 0 && (
              <div className="flex justify-between items-center">
                <span>Home Office:</span>
                <Badge variant="outline">{result.homeOfficeBenefit.toFixed(2)} €</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t('wizard.results.exportOptions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">{t('wizard.results.pdfExport')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('wizard.results.pdfDescription')}
                  </p>
                  <Button onClick={onExportPDF} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('wizard.results.exportPdf')}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">{t('wizard.results.xmlExport')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('wizard.results.xmlDescription')}
                  </p>
                  <Button onClick={handleExportXML} variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    {t('wizard.results.exportXml')}
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">{t('wizard.results.nextSteps')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>{t('wizard.results.step1')}</li>
                  <li>{t('wizard.results.step2')}</li>
                  <li>{t('wizard.results.step3')}</li>
                </ol>

                <div className="mt-4">
                  <Button onClick={handleOpenElster} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('elster.openElster')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elster">
          <ElsterGuide onOpenElster={handleOpenElster} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentChecklist data={data} onDownloadGuide={handleDownloadGuide} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsStep;
