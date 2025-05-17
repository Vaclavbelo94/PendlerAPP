
import React, { useState } from "react";
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
import { FileText, Download, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>({
    name: "",
    taxId: "",
    address: "",
    documentType: "steuererklaerung",
    yearOfTax: new Date().getFullYear() - 1 + "",
    email: "",
    includeCommuteExpenses: true,
    includeSecondHome: false,
    includeWorkClothes: false
  });
  
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const updateFormState = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const validateForm = (): boolean => {
    const requiredFields = ["name", "taxId", "address", "documentType", "yearOfTax", "email"];
    
    for (const field of requiredFields) {
      if (!formState[field as keyof FormState]) {
        toast({
          title: "Chybějící údaje",
          description: `Prosím vyplňte všechna povinná pole označená hvězdičkou.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (formState.includeCommuteExpenses && 
        (!formState.commuteDistance || !formState.commuteWorkDays)) {
      toast({
        title: "Chybějící údaje",
        description: "Vyplňte vzdálenost dojíždění a počet pracovních dní.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleGenerateDocument = () => {
    if (!validateForm()) return;
    
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      // Simulate download completion after a delay
      toast({
        title: "Dokument vygenerován",
        description: "Dokument byl úspěšně vygenerován a připraven ke stažení.",
      });
      
      // Reset success message after a bit
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 2000);
  };
  
  const documentTypes = [
    { value: "steuererklaerung", label: "Daňové přiznání (Einkommensteuererklärung)" },
    { value: "pendlerbescheinigung", label: "Potvrzení o dojíždění (Pendlerbescheinigung)" },
    { value: "antrag-lohnsteuerermassigung", label: "Žádost o snížení daně ze mzdy" },
    { value: "arbeitsmittelnachweis", label: "Potvrzení o pracovních prostředcích" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generátor daňových dokumentů</CardTitle>
          <CardDescription>
            Vytvořte předvyplněné dokumenty pro německá daňová přiznání
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Základní informace */}
              <div className="space-y-6">
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
              <div className="space-y-6">
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
              <div className="bg-muted/50 p-4 rounded-lg flex items-center space-x-2 text-sm text-muted-foreground max-w-2xl">
                <Info className="h-4 w-4 flex-shrink-0" />
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
            size="lg"
            className="gap-2"
          >
            <FileText className="h-5 w-5" />
            Vygenerovat dokument
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Dokument byl úspěšně vygenerován</span>
            </div>
            <Button variant="outline" size="lg" className="gap-2">
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
