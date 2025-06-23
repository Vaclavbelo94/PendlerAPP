
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LawsHeader: React.FC = () => {
  const { t } = useTranslation('laws');

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{t('lawsGuide')}</h1>
      <p className="text-muted-foreground">
        {t('lawsDescription')}
      </p>
    </div>
  );
};

export default LawsHeader;
