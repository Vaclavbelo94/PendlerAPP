
import React, { useEffect } from 'react';
import { useVocabularyContext } from './VocabularyProvider';
import { useVocabularySyncManager } from '@/hooks/useVocabularySyncManager';

interface VocabularySyncProps {
  children: React.ReactNode;
}

const VocabularySync: React.FC<VocabularySyncProps> = ({ children }) => {
  const { items, bulkAddVocabularyItems, testHistory } = useVocabularyContext();
  
  const {
    isSyncing,
    lastSynced,
    manualSync
  } = useVocabularySyncManager(items, bulkAddVocabularyItems, testHistory);

  // Expose the sync function to the vocabulary context
  useEffect(() => {
    if (window) {
      // @ts-ignore - Add the function to window for global access
      window.manualVocabSync = manualSync;
    }
    
    return () => {
      if (window && window.manualVocabSync) {
        // @ts-ignore - Clean up on unmount
        delete window.manualVocabSync;
      }
    };
  }, [manualSync]);

  return <>{children}</>;
};

export default VocabularySync;
