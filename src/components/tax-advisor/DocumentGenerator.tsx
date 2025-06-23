
import React from 'react';
import EnhancedDocumentGenerator from './EnhancedDocumentGenerator';
import { useTranslation } from 'react-i18next';

const DocumentGenerator = () => {
  const { t } = useTranslation('common');
  
  return <EnhancedDocumentGenerator />;
};

export default DocumentGenerator;
