
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Trash2, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useTaxManagement } from '@/hooks/useTaxManagement';
import { DocumentData } from '@/utils/tax/types';
import { downloadEnhancedTaxDocument } from '@/utils/tax/enhancedPdfGenerator';
import DocumentGeneratorForm from './document-generator/DocumentGeneratorForm';
import TaxNotifications from './TaxNotifications';

const EnhancedDocumentGenerator = () => {
  const { user } = useAuth();
  const { documents, saveDocument, loadDocuments } = useTaxManagement();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user?.id]);

  const handleDocumentGenerate = async (documentData: DocumentData) => {
    if (!user?.id) return;

    setIsGenerating(true);
    try {
      // Generování PDF
      downloadEnhancedTaxDocument(documentData);
      
      // Uložení do databáze
      await saveDocument({
        document_type: documentData.documentType,
        document_data: documentData,
        file_name: `${documentData.documentType}_${new Date().getFullYear()}.pdf`,
      });
      
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentRegenerate = (documentData: DocumentData) => {
    downloadEnhancedTaxDocument(documentData);
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
              onGenerate={handleDocumentGenerate}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>

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
  );
};

export default EnhancedDocumentGenerator;
