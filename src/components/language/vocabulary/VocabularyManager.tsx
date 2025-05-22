
import React from 'react';
import { VocabularyProvider, useVocabularyContext } from './VocabularyProvider';

interface VocabularyManagerProps {
  children: React.ReactNode;
}

// Hlavní wrapper komponenta pro funkčnost slovní zásoby
const VocabularyManager: React.FC<VocabularyManagerProps> = ({ children }) => {
  return (
    <VocabularyProvider>
      {children}
    </VocabularyProvider>
  );
};

export { useVocabularyContext };
export default VocabularyManager;
