
import { useState, useEffect } from 'react';

interface LanguagePack {
  id: string;
  name: string;
  flag: string;
  size: string;
  downloaded: boolean;
  version: string;
}

export const useOfflineLanguagePacks = () => {
  const [packs, setPacks] = useState<LanguagePack[]>([
    {
      id: 'de-basic',
      name: 'Němčina - Základní balíček',
      flag: '🇩🇪',
      size: '15 MB',
      downloaded: false,
      version: '1.2'
    },
    {
      id: 'de-advanced',
      name: 'Němčina - Pokročilý balíček',
      flag: '🇩🇪',
      size: '45 MB',
      downloaded: false,
      version: '1.1'
    },
    {
      id: 'en-business',
      name: 'Angličtina - Business balíček',
      flag: '🇬🇧',
      size: '20 MB',
      downloaded: true,
      version: '2.0'
    }
  ]);
  
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadPack = async (packId: string) => {
    setIsDownloading(packId);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(null);
          setPacks(current => 
            current.map(pack => 
              pack.id === packId ? { ...pack, downloaded: true } : pack
            )
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const deletePack = (packId: string) => {
    setPacks(current => 
      current.map(pack => 
        pack.id === packId ? { ...pack, downloaded: false } : pack
      )
    );
  };

  return {
    packs,
    isDownloading,
    downloadProgress,
    downloadPack,
    deletePack
  };
};
