
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Eye } from 'lucide-react';
import { DocumentData } from '@/utils/tax/types';
import { downloadEnhancedTaxDocument } from '@/utils/tax/enhancedPdfGenerator';

interface DocumentExamplesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleDocuments: DocumentData[] = [
  {
    name: 'Jan Novák',
    taxId: '123/4567890',
    address: 'Příkladní ulice 123, 110 00 Praha 1',
    documentType: 'steuererklaerung',
    dateOfBirth: '15.03.1985',
    yearOfTax: '2024',
    email: 'jan.novak@email.cz',
    employerName: 'Německá firma s.r.o.',
    incomeAmount: '45000',
    includeCommuteExpenses: true,
    commuteDistance: '45',
    commuteWorkDays: '220',
    includeSecondHome: true,
    includeWorkClothes: true,
    additionalNotes: 'Práce v Německu jako softwarový vývojář, pravidelné dojíždění z České republiky.'
  },
  {
    name: 'Marie Svobodová',
    taxId: '987/6543210',
    address: 'Vzorová 456, 602 00 Brno',
    documentType: 'pendlerbescheinigung',
    dateOfBirth: '22.07.1990',
    yearOfTax: '2024',
    email: 'marie.svobodova@email.cz',
    employerName: 'Bavorská společnost GmbH',
    incomeAmount: '38000',
    includeCommuteExpenses: true,
    commuteDistance: '32',
    commuteWorkDays: '200',
    includeSecondHome: false,
    includeWorkClothes: true,
    additionalNotes: 'Potvrzení o pravidelném dojíždění za prací do Bavorska.'
  },
  {
    name: 'Petr Dvořák',
    taxId: '456/7891234',
    address: 'Testovací náměstí 789, 370 01 České Budějovice',
    documentType: 'antrag-lohnsteuerermassigung',
    dateOfBirth: '10.11.1982',
    yearOfTax: '2024',
    email: 'petr.dvorak@email.cz',
    employerName: 'Rakouská firma AG',
    incomeAmount: '42000',
    includeCommuteExpenses: true,
    commuteDistance: '28',
    commuteWorkDays: '230',
    includeSecondHome: false,
    includeWorkClothes: false,
    additionalNotes: 'Žádost o snížení daně ze mzdy pro rok 2024.'
  },
  {
    name: 'Anna Kratochvílová',
    taxId: '321/9876543',
    address: 'Ukázková 321, 400 01 Ústí nad Labem',
    documentType: 'arbeitsmittelnachweis',
    dateOfBirth: '05.09.1988',
    yearOfTax: '2024',
    email: 'anna.kratochvilova@email.cz',
    employerName: 'Saská firma e.V.',
    incomeAmount: '40000',
    includeCommuteExpenses: false,
    commuteDistance: '',
    commuteWorkDays: '',
    includeSecondHome: false,
    includeWorkClothes: true,
    additionalNotes: 'Potvrzení o pracovních prostředcích potřebných k výkonu práce v Německu.'
  }
];

const documentTypeLabels = {
  'steuererklaerung': 'Daňové přiznání',
  'pendlerbescheinigung': 'Potvrzení o dojíždění',
  'antrag-lohnsteuerermassigung': 'Žádost o snížení daně ze mzdy',
  'arbeitsmittelnachweis': 'Potvrzení o pracovních prostředcích'
};

export const DocumentExamplesDialog: React.FC<DocumentExamplesDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);

  const handleDownloadExample = (document: DocumentData) => {
    downloadEnhancedTaxDocument(document);
  };

  const handlePreviewDocument = (document: DocumentData) => {
    setSelectedDocument(document);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vzory daňových dokumentů
          </DialogTitle>
          <DialogDescription>
            Prohlédněte si vzorové dokumenty pro různé typy daňových formulářů
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleDocuments.map((document, index) => (
            <Card key={index} className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{document.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {documentTypeLabels[document.documentType as keyof typeof documentTypeLabels]}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {document.yearOfTax}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p><strong>Zaměstnavatel:</strong> {document.employerName}</p>
                  <p><strong>Příjem:</strong> {document.incomeAmount} €</p>
                  {document.includeCommuteExpenses && (
                    <p><strong>Dojíždění:</strong> {document.commuteDistance} km</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewDocument(document)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Náhled
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadExample(document)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Stáhnout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedDocument && (
          <Card className="mt-6 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Náhled dokumentu</CardTitle>
              <CardDescription>
                {documentTypeLabels[selectedDocument.documentType as keyof typeof documentTypeLabels]} - {selectedDocument.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Osobní údaje</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p><strong>Jméno:</strong> {selectedDocument.name}</p>
                    <p><strong>Daňové číslo:</strong> {selectedDocument.taxId}</p>
                    <p><strong>Adresa:</strong> {selectedDocument.address}</p>
                    <p><strong>Datum narození:</strong> {selectedDocument.dateOfBirth}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pracovní údaje</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p><strong>Zaměstnavatel:</strong> {selectedDocument.employerName}</p>
                    <p><strong>Roční příjem:</strong> {selectedDocument.incomeAmount} €</p>
                    {selectedDocument.includeCommuteExpenses && (
                      <>
                        <p><strong>Vzdálenost dojíždění:</strong> {selectedDocument.commuteDistance} km</p>
                        <p><strong>Pracovní dny:</strong> {selectedDocument.commuteWorkDays}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {selectedDocument.additionalNotes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Poznámky</h4>
                  <p className="text-sm text-muted-foreground bg-white p-3 rounded border">
                    {selectedDocument.additionalNotes}
                  </p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleDownloadExample(selectedDocument)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Stáhnout tento vzor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDocument(null)}
                >
                  Zavřít náhled
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentExamplesDialog;
