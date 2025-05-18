
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileData, generateTaxDocument } from '@/utils/taxDocumentUtils';
import { toast } from "sonner";
import DocumentGeneratorHeader from "./document-generator/DocumentGeneratorHeader";
import DocumentGeneratorForm from "./document-generator/DocumentGeneratorForm";

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
          <DocumentGeneratorHeader
            onLoadProfile={loadUserProfile}
            isLoadingProfile={isLoadingProfile}
          />
        </CardHeader>
        <CardContent>
          <DocumentGeneratorForm
            formState={formState}
            setFormState={setFormState}
            isLoading={isLoading}
            showSuccessMessage={showSuccessMessage}
            onGenerateDocument={handleGenerateDocument}
            onDownloadDocument={handleDownloadDocument}
            documentTypes={documentTypes}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentGenerator;
