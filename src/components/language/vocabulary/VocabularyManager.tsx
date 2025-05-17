
import React, { useEffect } from 'react';
import { VocabularyProvider, useVocabularyContext } from './VocabularyProvider';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { toast } from '@/components/ui/use-toast';

interface VocabularyManagerProps {
  children: React.ReactNode;
}

// Offline storage key for vocabulary items
const VOCABULARY_OFFLINE_KEY = 'vocabulary_offline_data';

const VocabularySync = ({ children }: { children: React.ReactNode }) => {
  const { items, bulkAddVocabularyItems } = useVocabularyContext();
  const { isOffline } = useOfflineStatus();

  // When going offline, save the current vocabulary items to localStorage
  useEffect(() => {
    if (isOffline && items.length > 0) {
      try {
        localStorage.setItem(VOCABULARY_OFFLINE_KEY, JSON.stringify(items));
        console.log('Vocabulary data saved for offline use:', items.length, 'items');
      } catch (error) {
        console.error('Error saving vocabulary for offline use:', error);
      }
    }
  }, [isOffline, items]);

  // When coming back online, check for any offline data to restore
  useEffect(() => {
    if (!isOffline) {
      try {
        const offlineData = localStorage.getItem(VOCABULARY_OFFLINE_KEY);
        if (offlineData) {
          const parsedData = JSON.parse(offlineData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            // Only restore if there's actual data and we don't have the data already
            if (items.length === 0 || window.confirm('Chcete obnovit slovíčka uložená offline?')) {
              bulkAddVocabularyItems(parsedData);
              toast({
                title: 'Data obnovena',
                description: `${parsedData.length} slovíček bylo obnoveno z offline úložiště.`,
              });
              // Clear offline data after successful restore
              localStorage.removeItem(VOCABULARY_OFFLINE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Error restoring offline vocabulary data:', error);
      }
    }
  }, [isOffline, bulkAddVocabularyItems]);

  return <>{children}</>;
};

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
