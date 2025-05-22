
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Check, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import DocumentGeneratorForm from "./DocumentGeneratorForm";
import { downloadTaxDocument } from "@/utils/tax/pdfGenerator";
import type { DocumentData } from "@/utils/tax/types";

// Přeložené názvy polí pro dokumenty
const documentTypes = [
  { value: "steuererklaerung", label: "Daňové přiznání" },
  { value: "pendlerbescheinigung", label: "Potvrzení o dojíždění" },
  { value: "antrag-lohnsteuerermassigung", label: "Žádost o snížení daně ze mzdy" },
  { value: "arbeitsmittelnachweis", label: "Potvrzení o pracovních prostředcích" }
];

// Ukázkové šablony pro generování dokumentů
const documentTemplates = [
  {
    id: "pendler",
    name: "Potvrzení o dojíždění",
    description: "Potvrzení o vzdálenosti dojíždění pro německý finanční úřad",
    fields: ["jméno", "adresa", "vzdálenost", "pracovní dny"]
  },
  {
    id: "statement",
    name: "Prohlášení o příjmech",
    description: "Potvrzení o příjmech ze zahraničí pro české úřady",
    fields: ["jméno", "daňové ID", "příjem", "období"]
  },
  {
    id: "employer",
    name: "Potvrzení zaměstnavatele",
    description: "Potvrzení pro německé úřady o zaměstnání v Německu",
    fields: ["jméno zaměstnavatele", "pozice zaměstnance", "datum nástupu", "mzda"]
  }
];

const DocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<DocumentData | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Výchozí stav formuláře
  const [formState, setFormState] = useState({
    name: "",
    taxId: "",
    address: "",
    documentType: "steuererklaerung",
    dateOfBirth: "",
    yearOfTax: new Date().getFullYear().toString(),
    email: "",
    employerName: "",
    incomeAmount: "",
    includeCommuteExpenses: false,
    commuteDistance: "",
    commuteWorkDays: "220",
    includeSecondHome: false,
    includeWorkClothes: false,
    additionalNotes: ""
  });

  const handleGenerateDocument = () => {
    setLoading(true);
    
    // Simulace generování dokumentu
    setTimeout(() => {
      setLoading(false);
      setGeneratedDoc(formState as unknown as DocumentData);
      setShowSuccessMessage(true);
      setActiveTab("generated");
      toast.success("Dokument byl úspěšně vygenerován");
    }, 1500);
  };

  const handleDownloadDocument = () => {
    if (generatedDoc) {
      downloadTaxDocument(generatedDoc);
      toast.success("Dokument byl stažen");
    } else {
      toast.error("Nelze stáhnout dokument, data nejsou dostupná");
    }
  };

  const handleReset = () => {
    setGeneratedDoc(null);
    setShowSuccessMessage(false);
    setActiveTab("templates");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Generátor dokumentů</CardTitle>
          <CardDescription>
            Vytvořte potřebné dokumenty pro úřady jednoduše a rychle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="templates">Šablony dokumentů</TabsTrigger>
              <TabsTrigger value="generated" disabled={!generatedDoc}>Vygenerované dokumenty</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates.map((template) => (
                  <Card key={template.id} className="border border-muted">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Požadovaná pole:</p>
                        <div className="space-y-1">
                          {template.fields.map((field) => (
                            <div key={field} className="flex items-center gap-2">
                              <Check className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => {
                          setFormState(prev => ({
                            ...prev,
                            documentType: template.id === "pendler" ? "pendlerbescheinigung" : 
                              template.id === "statement" ? "steuererklaerung" : "arbeitsmittelnachweis"
                          }));
                          setActiveTab("form");
                        }}
                      >
                        Vytvořit dokument
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Potřebujete specifický dokument?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Kontaktujte našeho daňového specialistu nebo navštivte oficiální stránky úřadů.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Finanční úřad</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Elster portál</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="form" className="space-y-6 pt-4">
              <DocumentGeneratorForm
                formState={formState}
                setFormState={setFormState}
                isLoading={loading}
                showSuccessMessage={showSuccessMessage}
                onGenerateDocument={handleGenerateDocument}
                onDownloadDocument={handleDownloadDocument}
                documentTypes={documentTypes}
              />
            </TabsContent>
            
            <TabsContent value="generated" className="space-y-6 pt-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Generuji dokument...</p>
                </div>
              ) : generatedDoc ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border-green-200 border rounded-md p-4 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Dokument byl úspěšně vygenerován</h3>
                      <p className="text-sm text-green-700">Můžete si jej stáhnout nebo vytisknout</p>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">
                              {generatedDoc.documentType ? 
                                documentTypes.find(d => d.value === generatedDoc.documentType)?.label || "Daňový dokument" : 
                                "Daňový dokument"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Vygenerováno {new Date().toLocaleDateString()} v {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                          <Button 
                            className="flex items-center gap-2"
                            onClick={handleDownloadDocument}
                          >
                            <Download className="h-4 w-4" />
                            <span>Stáhnout</span>
                          </Button>
                          <Button variant="outline" onClick={handleReset}>
                            Vytvořit nový
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Náhled dokumentu:</h3>
                    <AspectRatio ratio={16/9}>
                      <div className="w-full h-full bg-muted flex items-center justify-center rounded-md border">
                        <div className="text-center p-6">
                          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-muted-foreground">Náhled dokumentu není dostupný</p>
                          <p className="text-xs text-muted-foreground mt-1">Stáhněte si dokument pro zobrazení</p>
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p>Zatím nemáte žádné vygenerované dokumenty</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("templates")} 
                    className="mt-4"
                  >
                    Vytvořit dokument
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentGenerator;
