
import React from "react";
import { useTranslation } from 'react-i18next';

const LoadingSpinner = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
