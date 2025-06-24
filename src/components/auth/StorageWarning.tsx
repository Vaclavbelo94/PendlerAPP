
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { cleanupAuthState } from '@/utils/authUtils';
import { toast } from "sonner";

interface StorageWarningProps {
  onDismiss: () => void;
}

const StorageWarning: React.FC<StorageWarningProps> = ({ onDismiss }) => {
  const { t } = useTranslation('auth');

  const handleStorageCleanup = () => {
    cleanupAuthState();
    onDismiss();
    toast.success(t('storageCleanedUp'));
  };

  return (
    <Alert className="border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
        <div className="flex flex-col space-y-2">
          <span>{t('browserStorageFull')}</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleStorageCleanup}
            className="w-fit"
          >
            {t('cleanStorage')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default StorageWarning;
