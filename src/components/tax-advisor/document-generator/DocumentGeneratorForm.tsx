
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import BasicInfoFields from "./BasicInfoFields";
import WorkInfoFields from "./WorkInfoFields";
import InfoDisclaimer from "./InfoDisclaimer";
import SuccessMessage from "./SuccessMessage";

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

interface DocumentGeneratorFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  isLoading: boolean;
  showSuccessMessage: boolean;
  onGenerateDocument: () => void;
  onDownloadDocument: () => void;
  documentTypes: Array<{ value: string; label: string }>;
}

const DocumentGeneratorForm: React.FC<DocumentGeneratorFormProps> = ({
  formState,
  setFormState,
  isLoading,
  showSuccessMessage,
  onGenerateDocument,
  onDownloadDocument,
  documentTypes
}) => {
  const isMobile = useIsMobile();
  
  const updateFormState = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Základní informace */}
        <BasicInfoFields 
          documentType={formState.documentType}
          yearOfTax={formState.yearOfTax}
          name={formState.name}
          dateOfBirth={formState.dateOfBirth}
          taxId={formState.taxId}
          address={formState.address}
          email={formState.email}
          onUpdateField={updateFormState}
          documentTypes={documentTypes}
        />
        
        {/* Pracovní informace */}
        <WorkInfoFields 
          employerName={formState.employerName}
          incomeAmount={formState.incomeAmount}
          includeCommuteExpenses={formState.includeCommuteExpenses}
          commuteDistance={formState.commuteDistance}
          commuteWorkDays={formState.commuteWorkDays}
          includeSecondHome={formState.includeSecondHome}
          includeWorkClothes={formState.includeWorkClothes}
          additionalNotes={formState.additionalNotes}
          onUpdateField={updateFormState}
        />
      </div>
      
      <div className="flex justify-center">
        <InfoDisclaimer />
      </div>
      
      <div className="flex justify-center">
        {!showSuccessMessage ? (
          <Button 
            onClick={onGenerateDocument}
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
          <SuccessMessage onDownload={onDownloadDocument} />
        )}
      </div>
    </div>
  );
};

export default DocumentGeneratorForm;
