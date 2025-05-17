
import React from 'react';
import { VocabularyProvider, useVocabularyContext } from './VocabularyProvider';
import VocabularySync from './VocabularySync';

interface VocabularyManagerProps {
  children: React.ReactNode;
}

// Main wrapper component for vocabulary functionality
const VocabularyManager: React.FC<VocabularyManagerProps> = ({ children }) => {
  return (
    <VocabularyProvider>
      <VocabularySync>
        {children}
      </VocabularySync>
    </VocabularyProvider>
  );
};

export { useVocabularyContext };
export default VocabularyManager;
