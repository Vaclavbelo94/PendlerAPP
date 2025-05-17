
import React from 'react';
import { VocabularyProvider } from './VocabularyProvider';
import { useVocabularyContext } from '@/contexts/VocabularyContext';

interface VocabularyManagerProps {
  children: React.ReactNode;
}

const VocabularyManager: React.FC<VocabularyManagerProps> = ({ children }) => {
  return (
    <VocabularyProvider>
      {children}
    </VocabularyProvider>
  );
};

export { useVocabularyContext };
export default VocabularyManager;
