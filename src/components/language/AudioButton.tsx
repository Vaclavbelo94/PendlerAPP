
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useAudioSettings } from '@/hooks/useAudioSettings';
import { pronounceGerman, audioManager } from './utils/enhancedPronunciationHelper';
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
  const { settings, isSupported } = useAudioSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languageMap = {
    de: 'de-DE',
    cs: 'cs-CZ',
    sk: 'sk-SK',
    en: 'en-US'
  };

  const handlePlay = async () => {
    if (!isSupported || !settings.enabled || disabled) return;

    if (isPlaying) {
      audioManager.stop();
      setIsPlaying(false);
      return;
    }

    setError(null);
    
    try {
      await audioManager.playText({
        text,
        lang: languageMap[language],
        settings,
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: (err) => {
          setError('Chyba přehrávání');
          setIsPlaying(false);
          console.error('Audio playback error:', err);
        }
      });
    } catch (err) {
      setError('Chyba přehrávání');
      setIsPlaying(false);
      console.error('Audio playback error:', err);
    }
  };

  const getButtonContent = () => {
    if (isPlaying) {
      return (
        <>
          <Loader2 className={cn("animate-spin", size === 'sm' ? "h-3 w-3" : "h-4 w-4")} />
          {showText && <span className="ml-2">Přehrává...</span>}
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

  const isDisabled = disabled || !isSupported || !settings.enabled;

  return (
    <Button
      onClick={handlePlay}
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn(
        "transition-all duration-200",
        isPlaying && settings.showVisualFeedback && "animate-pulse",
        error && "border-red-200 text-red-600",
        className
      )}
      title={error || (isDisabled ? "Audio není k dispozici" : `Přehrát: ${text}`)}
    >
      {getButtonContent()}
    </Button>
  );
};

export default AudioButton;
