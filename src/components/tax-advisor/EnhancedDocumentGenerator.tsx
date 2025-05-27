
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Calendar, Info, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import { DocumentData } from '@/utils/tax/types';
import { downloadEnhancedTaxDocument } from '@/utils/tax/enhancedPdfGenerator';
import DocumentGeneratorForm from './DocumentGeneratorForm';
import TaxNotifications from './TaxNotifications';
import DocumentExamplesDialog from './DocumentExamplesDialog';

const EnhancedDocumentGenerator = () => {
  const { user } = useAuth();
  const { documents, saveDocument, loadDocuments } = useTaxManagement();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showExamplesDialog, setShowExamplesDialog] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    taxId: '',
    address: '',
    documentType: 'steuererklaerung',
    dateOfBirth: '',
    yearOfTax: new Date().getFullYear().toString(),
    email: '',
    employerName: '',
    incomeAmount: '',
    includeCommuteExpenses: false,
    commuteDistance: '',
    commuteWorkDays: '220',
    includeSecondHome: false,
    includeWorkClothes: false,
    additionalNotes: ''
  });

  const documentTypes = [
    { value: 'steuererklaerung', label: 'Daňové přiznání' },
    { value: 'pendlerbescheinigung', label: 'Potvrzení o dojíždění' },
    { value: 'antrag-lohnsteuerermassigung', label: 'Žádost o snížení daně ze mzdy' },
    { value: 'arbeitsmittelnachweis', label: 'Potvrzení o pracovních prostředcích' }
  ];

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user?.id]);

  const handleDocumentGenerate = async () => {
    if (!user?.id) return;

    setIsGenerating(true);
    try {
      // Generování PDF
      downloadEnhancedTaxDocument(formState as DocumentData);
      
      // Uložení do databáze
      await saveDocument({
        document_type: formState.documentType,
        document_data: formState as DocumentData,
        file_name: `${formState.documentType}_${new Date().getFullYear()}.pdf`,
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentRegenerate = (documentData: DocumentData) => {
    downloadEnhancedTaxDocument(documentData);
  };

  const handleDownloadDocument = () => {
    downloadEnhancedTaxDocument(formState as DocumentData);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generátor daňových dokumentů</CardTitle>
            <CardDescription>Pro používání generátoru se musíte přihlásit</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Přihlaste se pro generování a ukládání daňových dokumentů
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        {/* Vzory dokumentů section for non-logged users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vzory dokumentů
            </CardTitle>
            <CardDescription>
              Ukázky dokumentů budou brzy k dispozici
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowExamplesDialog(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Zobrazit příklady
            </Button>
          </CardContent>
        </Card>
        
        <TaxNotifications />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaxNotifications />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generovat nový dokument</CardTitle>
            <CardDescription>
              Vyplňte formulář pro vytvoření daňového dokumentu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentGeneratorForm 
              formState={formState}
              setFormState={setFormState}
              isLoading={isGenerating}
              showSuccessMessage={showSuccessMessage}
              onGenerateDocument={handleDocumentGenerate}
              onDownloadDocument={handleDownloadDocument}
              documentTypes={documentTypes}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Vzory dokumentů section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vzory dokumentů
              </CardTitle>
              <CardDescription>
                Prohlédněte si vzorové dokumenty s ukázkovými daty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowExamplesDialog(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Zobrazit příklady
              </Button>
            </CardContent>
          </Card>

          {/* Historie dokumentů */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historie dokumentů
              </CardTitle>
              <CardDescription>
                Vaše vygenerované daňové dokumenty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Zatím jste nevygenerovali žádné dokumenty
                    </AlertDescription>
                  </Alert>
                ) : (
                  documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            {document.document_data.documentType === 'steuererklaerung' && 'Daňové přiznání'}
                            {document.document_data.documentType === 'pendlerbescheinigung' && 'Potvrzení o dojíždění'}
                            {document.document_data.documentType === 'antrag-lohnsteuerermassigung' && 'Žádost o snížení daně ze mzdy'}
                            {document.document_data.documentType === 'arbeitsmittelnachweis' && 'Potvrzení o pracovních prostředcích'}
                          </h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(document.created_at!).toLocaleDateString('cs-CZ')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {document.document_data.yearOfTax}
                        </Badge>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDocumentRegenerate(document.document_data)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Stáhnout
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentExamplesDialog 
        open={showExamplesDialog}
        onOpenChange={setShowExamplesDialog}
      />
    </div>
  );
};

export default EnhancedDocumentGenerator;
