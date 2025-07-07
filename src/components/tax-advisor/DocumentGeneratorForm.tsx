
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslation } from "react-i18next";
import BasicInfoFields from "./document-generator/BasicInfoFields";
import WorkInfoFields from "./document-generator/WorkInfoFields";
import InfoDisclaimer from "./document-generator/InfoDisclaimer";
import SuccessMessage from "./document-generator/SuccessMessage";

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
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const isMobile = useMediaQuery("xs");
  
  const updateFormState = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Základní informace */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
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
        </div>
        
        {/* Pracovní informace */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
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
      </div>
      
      <div className="flex justify-center">
        <InfoDisclaimer />
      </div>
      
      <div className="flex justify-center">
        {!showSuccessMessage ? (
          <Button 
            onClick={onGenerateDocument}
            size="lg"
            className="gap-2 w-full md:w-auto px-8 py-6 h-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('generating', { ns: 'common' }) || 'Generuji dokument...'}
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                {t('generateDocument') || 'Vygenerovat dokument'}
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
