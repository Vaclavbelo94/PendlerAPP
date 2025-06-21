
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from '@/hooks/useLanguage';

interface SuccessMessageProps {
  onDownload: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onDownload }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const handleDownloadClick = () => {
    if (onDownload && typeof onDownload === 'function') {
      onDownload();
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center space-x-2 text-primary">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">
          {t('documentGeneratedSuccessfully') || 'Dokument byl úspěšně vygenerován'}
        </span>
      </div>
      <Button 
        variant="outline" 
        size={isMobile ? "default" : "lg"} 
        className="gap-2 w-full md:w-auto"
        onClick={handleDownloadClick}
      >
        <Download className="h-5 w-5" />
        {t('downloadDocument') || 'Stáhnout dokument'}
      </Button>
    </div>
  );
};

export default SuccessMessage;
