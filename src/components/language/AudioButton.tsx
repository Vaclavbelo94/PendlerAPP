
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { useAudioSettings } from '@/hooks/useAudioSettings';
import { audioManager } from './utils/enhancedPronunciationHelper';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  text: string;
  language?: 'de' | 'cs' | 'sk' | 'en';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showText?: boolean;
  disabled?: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  language = 'de',
  variant = 'default',
  size = 'default',
  className,
  showText = true,
  disabled = false
}) => {
  const { settings, isSupported, isLoading } = useAudioSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const languageMap = {
    de: 'de-DE',
    cs: 'cs-CZ',
    sk: 'sk-SK',
    en: 'en-US'
  };

  // Clear error when text changes
  useEffect(() => {
    setError(null);
    setRetryCount(0);
  }, [text]);

  const handlePlay = async () => {
    if (!isSupported || disabled || isLoading) return;

    if (isPlaying) {
      audioManager.stop();
      setIsPlaying(false);
      return;
    }

    setError(null);
    
    try {
      console.log(`AudioButton: Attempting to play "${text}" in ${language}`);
      
      await audioManager.playText({
        text,
        lang: languageMap[language],
        settings,
        onStart: () => {
          console.log(`AudioButton: Started playing "${text}"`);
          setIsPlaying(true);
        },
        onEnd: () => {
          console.log(`AudioButton: Finished playing "${text}"`);
          setIsPlaying(false);
          setRetryCount(0);
        },
        onError: (err) => {
          console.error(`AudioButton: Error playing "${text}":`, err);
          setError('Chyba přehrávání');
          setIsPlaying(false);
          
          // Auto-retry once for transient errors
          if (retryCount === 0 && err.message.includes('synthesis')) {
            console.log('AudioButton: Retrying after synthesis error...');
            setRetryCount(1);
            setTimeout(() => handlePlay(), 500);
          }
        }
      });
    } catch (err) {
      console.error(`AudioButton: Unexpected error:`, err);
      setError('Chyba přehrávání');
      setIsPlaying(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className={cn("animate-spin", size === 'sm' ? "h-3 w-3" : "h-4 w-4")} />
          {showText && <span className="ml-2">Načítání...</span>}
        </>
      );
    }

    if (isPlaying) {
      return (
        <>
          <Loader2 className={cn("animate-spin", size === 'sm' ? "h-3 w-3" : "h-4 w-4")} />
          {showText && <span className="ml-2">Přehrává...</span>}
        </>
      );
    }

    if (error) {
      return (
        <>
          <AlertCircle className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
          {showText && <span className="ml-2">Opakovat</span>}
        </>
      );
    }

    if (!isSupported || !settings.enabled) {
      return (
        <>
          <VolumeX className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
          {showText && <span className="ml-2">Audio nedostupné</span>}
        </>
      );
    }

    return (
      <>
        <Volume2 className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
        {showText && <span className="ml-2">Přehrát</span>}
      </>
    );
  };

  const isDisabled = disabled || isLoading || (!isSupported && !error);

  const getTooltip = () => {
    if (error) return `${error} - klikněte pro opakování`;
    if (isDisabled) return "Audio není k dispozici";
    if (isPlaying) return "Zastavit přehrávání";
    return `Přehrát: ${text}`;
  };

  return (
    <Button
      onClick={handlePlay}
      variant={error ? "outline" : variant}
      size={size}
      disabled={isDisabled}
      className={cn(
        "transition-all duration-200",
        isPlaying && settings.showVisualFeedback && "animate-pulse",
        error && "border-red-200 text-red-600 hover:bg-red-50",
        className
      )}
      title={getTooltip()}
    >
      {getButtonContent()}
    </Button>
  );
};

export default AudioButton;
