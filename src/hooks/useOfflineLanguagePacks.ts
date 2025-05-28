
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { PracticalPhrase } from '@/data/practicalGermanLessons';
import { saveData, getAllData, clearStore, bulkSaveData } from '@/utils/offlineStorage';
import { defaultGermanVocabulary } from '@/data/defaultGermanVocabulary';
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
      console.log('Checking downloaded packs...');
      
      const germanBasic = await getAllData<VocabularyItem>('language_pack_german_basic');
      const germanWork = await getAllData<PracticalPhrase>('language_pack_german_work');
      
      console.log('German basic pack items:', germanBasic.length);
      console.log('German work pack items:', germanWork.length);
      
      setPacks(prev => prev.map(pack => {
        if (pack.id === 'german-basic') {
          return {
            ...pack,
            downloadedItems: germanBasic.length,
            isDownloaded: germanBasic.length > 0,
            lastUpdated: germanBasic.length > 0 ? new Date() : undefined,
            totalItems: germanBasic.length > 0 ? germanBasic.length : defaultGermanVocabulary.length
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
      toast.error('Chyba při kontrole stažených balíčků');
    }
  };

  const downloadPack = async (packId: string) => {
    if (isDownloading) {
      console.log('Already downloading, skipping...');
      return;
    }
    
    console.log(`Starting download of pack: ${packId}`);
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
    console.log('Downloading German basic pack...');
    setDownloadProgress(10);
    
    // First try to load from existing vocabulary
    const existingVocab = localStorage.getItem('vocabulary_items');
    let items: VocabularyItem[] = [];
    
    if (existingVocab) {
      try {
        const parsedItems = JSON.parse(existingVocab);
        items = parsedItems.filter((item: VocabularyItem) => 
          item.german && item.german.trim() !== ''
        );
        console.log('Loaded from localStorage:', items.length, 'items');
      } catch (e) {
        console.error('Error parsing localStorage vocabulary:', e);
      }
    }
    
    // If no items, use default vocabulary
    if (items.length === 0) {
      console.log('No existing vocabulary found, using default German vocabulary');
      items = defaultGermanVocabulary.map((item, index) => ({
        ...item,
        id: item.id || `default-${index}`
      }));
    }
    
    // Ensure all items have IDs
    items = items.map((item, index) => ({
      ...item,
      id: item.id || `vocab-${index}-${Date.now()}`
    }));
    
    setDownloadProgress(50);
    
    // Update pack info
    setPacks(prev => prev.map(pack => 
      pack.id === 'german-basic' 
        ? { ...pack, totalItems: items.length }
        : pack
    ));
    
    setDownloadProgress(75);
    
    // Save to IndexedDB
    console.log('Saving to IndexedDB:', items.length, 'items');
    await clearStore('language_pack_german_basic');
    await bulkSaveData('language_pack_german_basic', items);
    
    setDownloadProgress(100);
    console.log('German basic pack download completed');
  };

  const downloadGermanWorkPack = async () => {
    console.log('Downloading German work pack...');
    setDownloadProgress(10);
    
    // Import practical German lessons
    const { practicalGermanLessons } = await import('@/data/practicalGermanLessons');
    
    const allPhrases: PracticalPhrase[] = [];
    practicalGermanLessons.forEach(category => {
      allPhrases.push(...category.phrases);
    });
    
    setDownloadProgress(50);
    
    // Update pack info
    setPacks(prev => prev.map(pack => 
      pack.id === 'german-work' 
        ? { ...pack, totalItems: allPhrases.length }
        : pack
    ));
    
    setDownloadProgress(75);
    
    // Save to IndexedDB
    console.log('Saving work phrases to IndexedDB:', allPhrases.length, 'items');
    await clearStore('language_pack_german_work');
    await bulkSaveData('language_pack_german_work', allPhrases);
    
    setDownloadProgress(100);
    console.log('German work pack download completed');
  };

  const deletePack = async (packId: string) => {
    try {
      console.log(`Deleting pack: ${packId}`);
      
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
