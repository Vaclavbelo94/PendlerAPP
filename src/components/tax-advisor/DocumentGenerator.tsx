
import React from 'react';
import EnhancedDocumentGenerator from './EnhancedDocumentGenerator';
import { useLanguage } from '@/hooks/useLanguage';

const DocumentGenerator = () => {
  const { t } = useLanguage();
  
  return <EnhancedDocumentGenerator />;
};

export default DocumentGenerator;
