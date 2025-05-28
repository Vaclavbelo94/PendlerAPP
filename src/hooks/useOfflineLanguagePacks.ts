
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { PracticalPhrase } from '@/data/practicalGermanLessons';
import { saveData, getAllData, clearStore, bulkSaveData } from '@/utils/offlineStorage';
import { toast } from 'sonner';

export interface LanguagePack {
  id: string;
  name: string;
  language: string;
  flag: string;
  totalItems: number;
  downloadedItems: number;
  isDownloaded: boolean;
  lastUpdated?: Date;
  size: string;
}

export const useOfflineLanguagePacks = () => {
  const [packs, setPacks] = useState<LanguagePack[]>([
    {
      id: 'german-basic',
      name: 'Německý základní balíček',
      language: 'de',
      flag: '🇩🇪',
      totalItems: 0,
      downloadedItems: 0,
      isDownloaded: false,
      size: '2.5 MB'
    },
    {
      id: 'german-work',
      name: 'Němčina pro práci',
      language: 'de-work',
      flag: '🇩🇪',
      totalItems: 0,
      downloadedItems: 0,
      isDownloaded: false,
      size: '1.8 MB'
    }
  ]);
  
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Check downloaded packs on init
  useEffect(() => {
    checkDownloadedPacks();
  }, []);

  const checkDownloadedPacks = async () => {
    try {
      const germanBasic = await getAllData<VocabularyItem>('language_pack_german_basic');
      const germanWork = await getAllData<PracticalPhrase>('language_pack_german_work');
      
      setPacks(prev => prev.map(pack => {
        if (pack.id === 'german-basic') {
          return {
            ...pack,
            downloadedItems: germanBasic.length,
            isDownloaded: germanBasic.length > 0,
            lastUpdated: germanBasic.length > 0 ? new Date() : undefined
          };
        }
        if (pack.id === 'german-work') {
          return {
            ...pack,
            downloadedItems: germanWork.length,
            isDownloaded: germanWork.length > 0,
            lastUpdated: germanWork.length > 0 ? new Date() : undefined
          };
        }
        return pack;
      }));
    } catch (error) {
      console.error('Error checking downloaded packs:', error);
    }
  };

  const downloadPack = async (packId: string) => {
    if (isDownloading) return;
    
    setIsDownloading(packId);
    setDownloadProgress(0);

    try {
      if (packId === 'german-basic') {
        await downloadGermanBasicPack();
      } else if (packId === 'german-work') {
        await downloadGermanWorkPack();
      }
      
      toast.success('Jazykový balíček byl úspěšně stažen!');
      await checkDownloadedPacks();
    } catch (error) {
      console.error('Error downloading pack:', error);
      toast.error('Chyba při stahování jazykového balíčku');
    } finally {
      setIsDownloading(null);
      setDownloadProgress(0);
    }
  };

  const downloadGermanBasicPack = async () => {
    // Load from existing vocabulary
    const existingVocab = localStorage.getItem('vocabulary_items');
    let items: VocabularyItem[] = [];
    
    if (existingVocab) {
      items = JSON.parse(existingVocab);
    }
    
    // Filter German items
    const germanItems = items.filter(item => 
      item.german && item.german.trim() !== ''
    );
    
    setDownloadProgress(25);
    
    // Update pack info
    setPacks(prev => prev.map(pack => 
      pack.id === 'german-basic' 
        ? { ...pack, totalItems: germanItems.length }
        : pack
    ));
    
    setDownloadProgress(50);
    
    // Save to IndexedDB
    await clearStore('language_pack_german_basic');
    await bulkSaveData('language_pack_german_basic', germanItems);
    
    setDownloadProgress(100);
  };

  const downloadGermanWorkPack = async () => {
    // Import practical German lessons
    const { practicalGermanLessons } = await import('@/data/practicalGermanLessons');
    
    const allPhrases: PracticalPhrase[] = [];
    practicalGermanLessons.forEach(category => {
      allPhrases.push(...category.phrases);
    });
    
    setDownloadProgress(25);
    
    // Update pack info
    setPacks(prev => prev.map(pack => 
      pack.id === 'german-work' 
        ? { ...pack, totalItems: allPhrases.length }
        : pack
    ));
    
    setDownloadProgress(50);
    
    // Save to IndexedDB
    await clearStore('language_pack_german_work');
    await bulkSaveData('language_pack_german_work', allPhrases);
    
    setDownloadProgress(100);
  };

  const deletePack = async (packId: string) => {
    try {
      if (packId === 'german-basic') {
        await clearStore('language_pack_german_basic');
      } else if (packId === 'german-work') {
        await clearStore('language_pack_german_work');
      }
      
      toast.success('Jazykový balíček byl smazán');
      await checkDownloadedPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error('Chyba při mazání jazykového balíčku');
    }
  };

  return {
    packs,
    isDownloading,
    downloadProgress,
    downloadPack,
    deletePack,
    checkDownloadedPacks
  };
};
