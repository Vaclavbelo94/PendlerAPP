
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Info, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileData, generateTaxDocument } from '@/utils/taxDocumentUtils';
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormState {
  name: string;
  taxId: string;
  address: string;
  documentType: string;
  dateOfBirth?: string;
  yearOfTax: string;
  email: string;
  employerName?: string;
  incomeAmount?: string;
  includeCommuteExpenses: boolean;
  commuteDistance?: string;
  commuteWorkDays?: string;
  includeSecondHome: boolean;
  includeWorkClothes: boolean;
  additionalNotes?: string;
}

const DocumentGenerator = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const isMobile = useIsMobile();
  
  const [formState, setFormState] = useState<FormState>({
    name: "",
    taxId: "",
    address: "",
    documentType: "steuererklaerung",
    yearOfTax: new Date().getFullYear() - 1 + "",
    email: "",
    includeCommuteExpenses: true,
    includeSecondHome: false,
    includeWorkClothes: false,
    commuteWorkDays: "220" // Default value
  });
  
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [generatedDocumentData, setGeneratedDocumentData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setIsLoadingProfile(true);
    try {
      const profileData = await fetchUserProfileData(user.id);
      
      if (profileData) {
        setFormState(prev => ({
          ...prev,
          name: profileData.name || prev.name,
          email: profileData.email || prev.email,
          address: profileData.address || prev.address,
          commuteDistance: profileData.commuteDistance || prev.commuteDistance,
          additionalNotes: profileData.additionalNotes || prev.additionalNotes,
        }));
        
        toast.success("Údaje z profilu byly načteny");
      }
    } catch (error) {
      console.error("Chyba při načítání profilu:", error);
      toast.error("Nepodařilo se načíst údaje z profilu");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateFormState = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const validateForm = (): boolean => {
    const requiredFields = ["name", "taxId", "address", "documentType", "yearOfTax", "email"];
    
    for (const field of requiredFields) {
      if (!formState[field as keyof FormState]) {
        toast.error(`Prosím vyplňte všechna povinná pole označená hvězdičkou.`);
        return false;
      }
    }
    
    if (formState.includeCommuteExpenses && 
        (!formState.commuteDistance || !formState.commuteWorkDays)) {
      toast.error("Vyplňte vzdálenost dojíždění a počet pracovních dní.");
      return false;
    }
    
    return true;
  };
  
  const handleGenerateDocument = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Generate the document
      const doc = generateTaxDocument(formState);
      
      // Save reference to the generated document for later download
      setGeneratedDocumentData(doc);
      setShowSuccessMessage(true);
      
      toast.success("Dokument byl úspěšně vygenerován");
    } catch (error) {
      console.error("Chyba při generování dokumentu:", error);
      toast.error("Při generování dokumentu došlo k chybě");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadDocument = () => {
    if (!generatedDocumentData) {
      toast.error("Žádný dokument k dispozici pro stažení");
      return;
    }
    
    try {
      // Generate filename based on document type and date
      const documentType = formState.documentType;
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `${getDocumentTypeName(documentType)}_${currentDate}.pdf`;
      
      // Save the PDF
      generatedDocumentData.save(fileName);
      
      toast.success("Dokument byl úspěšně stažen");
      
      // Reset success message after a bit
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Chyba při stahování dokumentu:", error);
      toast.error("Při stahování dokumentu došlo k chybě");
    }
  };
  
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'steuererklaerung': return 'danove_priznani';
      case 'pendlerbescheinigung': return 'potvrzeni_dojizdeni';
      case 'antrag-lohnsteuerermassigung': return 'zadost_snizeni_dane';
      case 'arbeitsmittelnachweis': return 'potvrzeni_pracovni_prostredky';
      default: return 'danovy_dokument';
    }
  };
  
  const documentTypes = [
    { value: "steuererklaerung", label: "Daňové přiznání (Einkommensteuererklärung)" },
    { value: "pendlerbescheinigung", label: "Potvrzení o dojíždění (Pendlerbescheinigung)" },
    { value: "antrag-lohnsteuerermassigung", label: "Žádost o snížení daně ze mzdy" },
    { value: "arbeitsmittelnachweis", label: "Potvrzení o pracovních prostředcích" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Generátor daňových dokumentů</CardTitle>
              <CardDescription>
                Vytvořte předvyplněné dokumenty pro německá daňová přiznání
              </CardDescription>
            </div>
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadUserProfile} 
                disabled={isLoadingProfile}
                className="self-start"
              >
                {isLoadingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Načítání...
                  </>
                ) : (
                  "Načíst údaje z profilu"
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Základní informace */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Základní informace</h3>
                  <p className="text-sm text-muted-foreground">
                    Vyplňte své osobní údaje pro generování dokumentu
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Typ dokumentu *</Label>
                    <Select 
                      value={formState.documentType}
                      onValueChange={(value) => updateFormState("documentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ dokumentu" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map(docType => (
                          <SelectItem key={docType.value} value={docType.value}>
                            {docType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year-of-tax">Zdanitelné období *</Label>
                    <Input
                      id="year-of-tax"
                      type="number"
                      value={formState.yearOfTax}
                      onChange={(e) => updateFormState("yearOfTax", e.target.value)}
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Jméno a příjmení *</Label>
                    <Input
                      id="name"
                      placeholder="Jan Novák"
                      value={formState.name}
                      onChange={(e) => updateFormState("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-of-birth">Datum narození</Label>
                    <Input
                      id="date-of-birth"
                      type="date"
                      value={formState.dateOfBirth}
                      onChange={(e) => updateFormState("dateOfBirth", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Daňové identifikační číslo (Steuer-ID) *</Label>
                    <Input
                      id="tax-id"
                      placeholder="12345678912"
                      value={formState.taxId}
                      onChange={(e) => updateFormState("taxId", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresa trvalého bydliště *</Label>
                    <Textarea
                      id="address"
                      placeholder="Ulice, číslo, PSČ, město"
                      value={formState.address}
                      onChange={(e) => updateFormState("address", e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan.novak@email.cz"
                      value={formState.email}
                      onChange={(e) => updateFormState("email", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Pracovní informace */}
              <div className="space-y-5 pt-2 md:pt-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Pracovní informace</h3>
                  <p className="text-sm text-muted-foreground">
                    Doplňte údaje o vaší práci a odpočitatelných položkách
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer-name">Název zaměstnavatele</Label>
                    <Input
                      id="employer-name"
                      placeholder="Název firmy GmbH"
                      value={formState.employerName}
                      onChange={(e) => updateFormState("employerName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="income-amount">Roční příjem (€)</Label>
                    <Input
                      id="income-amount"
                      type="number"
                      placeholder="60000"
                      value={formState.incomeAmount}
                      onChange={(e) => updateFormState("incomeAmount", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <Label>Odpočitatelné položky</Label>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="commute-expenses"
                        checked={formState.includeCommuteExpenses}
                        onCheckedChange={(checked) => 
                          updateFormState("includeCommuteExpenses", checked === true)}
                      />
                      <Label 
                        htmlFor="commute-expenses"
                        className="text-sm font-normal"
                      >
                        Náklady na dojíždění (Entfernungspauschale)
                      </Label>
                    </div>
                    
                    {formState.includeCommuteExpenses && (
                      <div className="ml-6 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="commute-distance">Vzdálenost jedním směrem (km)</Label>
                          <Input
                            id="commute-distance"
                            type="number"
                            placeholder="25"
                            value={formState.commuteDistance}
                            onChange={(e) => updateFormState("commuteDistance", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="commute-work-days">Počet pracovních dní v roce</Label>
                          <Input
                            id="commute-work-days"
                            type="number"
                            placeholder="220"
                            value={formState.commuteWorkDays}
                            onChange={(e) => updateFormState("commuteWorkDays", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="second-home" 
                        checked={formState.includeSecondHome}
                        onCheckedChange={(checked) => 
                          updateFormState("includeSecondHome", checked === true)}
                      />
                      <Label 
                        htmlFor="second-home"
                        className="text-sm font-normal"
                      >
                        Druhé bydlení v Německu
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="work-clothes" 
                        checked={formState.includeWorkClothes}
                        onCheckedChange={(checked) => 
                          updateFormState("includeWorkClothes", checked === true)}
                      />
                      <Label 
                        htmlFor="work-clothes"
                        className="text-sm font-normal"
                      >
                        Pracovní oděvy a pomůcky
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="additional-notes">Další poznámky</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Doplňující informace k dokumentu..."
                      value={formState.additionalNotes}
                      onChange={(e) => updateFormState("additionalNotes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-muted/50 p-3 md:p-4 rounded-lg flex items-start md:items-center space-x-2 text-xs md:text-sm text-muted-foreground">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5 md:mt-0" />
                <p>
                  Vygenerované dokumenty slouží jako pomůcka pro přípravu vašeho daňového přiznání. 
                  Přestože jsou připraveny podle aktuálních předpisů, zkontrolujte si všechny údaje 
                  před oficiálním podáním.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        {!showSuccessMessage ? (
          <Button 
            onClick={handleGenerateDocument}
            size={isMobile ? "default" : "lg"}
            className="gap-2 w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generuji dokument...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                Vygenerovat dokument
              </>
            )}
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Dokument byl úspěšně vygenerován</span>
            </div>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "lg"} 
              className="gap-2 w-full md:w-auto"
              onClick={handleDownloadDocument}
            >
              <Download className="h-5 w-5" />
              Stáhnout dokument
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;
