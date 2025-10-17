import { useCallback } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface NativeShareAPI {
  isSupported: boolean;
  canShare: (data: ShareData) => boolean;
  share: (data: ShareData) => Promise<void>;
}

/**
 * Hook for native share functionality
 * Falls back to clipboard copy if native share is not available
 */
export const useNativeShare = (): NativeShareAPI => {
  const isSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const canShare = useCallback((data: ShareData): boolean => {
    if (!isSupported) return false;
    
    try {
      return navigator.canShare ? navigator.canShare(data) : true;
    } catch {
      return false;
    }
  }, [isSupported]);

  const share = useCallback(async (data: ShareData): Promise<void> => {
    if (!isSupported) {
      // Fallback: copy URL to clipboard
      if (data.url) {
        try {
          await navigator.clipboard.writeText(data.url);
          console.log('Link copied to clipboard');
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
        }
      }
      return;
    }

    try {
      await navigator.share(data);
      console.log('Shared successfully');
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  }, [isSupported]);

  return {
    isSupported,
    canShare,
    share
  };
};
