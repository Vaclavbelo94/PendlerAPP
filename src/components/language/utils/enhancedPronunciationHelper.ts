
import { AudioSettings } from '@/hooks/useAudioSettings';

export interface AudioPlaybackOptions {
  text: string;
  lang?: string;
  settings?: AudioSettings;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

class AudioManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;

  async playText({ text, lang = 'de-DE', settings, onStart, onEnd, onError }: AudioPlaybackOptions): Promise<void> {
    try {
      // Stop any current playback
      this.stop();

      if (!settings?.enabled) {
        onEnd?.();
        return;
      }

      // Check if speech synthesis is supported
      if (!('speechSynthesis' in window)) {
        throw new Error('Speech synthesis not supported');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      if (settings) {
        utterance.rate = settings.speed;
        utterance.volume = settings.volume;
        utterance.pitch = settings.pitch;
        
        // Try to set selected voice
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0 && settings.selectedVoiceIndex < voices.length) {
          utterance.voice = voices[settings.selectedVoiceIndex];
        }
      }

      utterance.lang = lang;
      
      // Set up event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
        onStart?.();
      };
      
      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        onEnd?.();
      };
      
      utterance.onerror = (event) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        onError?.(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      this.isPlaying = false;
      onError?.(error as Error);
    }
  }

  stop(): void {
    if (this.isPlaying) {
      speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  pause(): void {
    if (this.isPlaying) {
      speechSynthesis.pause();
    }
  }

  resume(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  get playing(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Enhanced helper functions
export const pronounceGerman = async (
  text: string, 
  settings?: AudioSettings,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (error: Error) => void }
): Promise<void> => {
  return audioManager.playText({
    text,
    lang: 'de-DE',
    settings,
    ...callbacks
  });
};

export const pronounceCzech = async (
  text: string,
  settings?: AudioSettings,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (error: Error) => void }
): Promise<void> => {
  return audioManager.playText({
    text,
    lang: 'cs-CZ',
    settings,
    ...callbacks
  });
};

export const pronounceSlovak = async (
  text: string,
  settings?: AudioSettings,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (error: Error) => void }
): Promise<void> => {
  return audioManager.playText({
    text,
    lang: 'sk-SK',
    settings,
    ...callbacks
  });
};

export const pronounceEnglish = async (
  text: string,
  settings?: AudioSettings,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (error: Error) => void }
): Promise<void> => {
  return audioManager.playText({
    text,
    lang: 'en-US',
    settings,
    ...callbacks
  });
};

// Batch playback for multiple phrases
export const playSequence = async (
  phrases: Array<{ text: string; lang?: string; pause?: number }>,
  settings?: AudioSettings,
  onProgress?: (index: number, total: number) => void
): Promise<void> => {
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i];
    onProgress?.(i, phrases.length);
    
    await new Promise<void>((resolve, reject) => {
      audioManager.playText({
        text: phrase.text,
        lang: phrase.lang || 'de-DE',
        settings,
        onEnd: resolve,
        onError: reject
      });
    });
    
    // Optional pause between phrases
    if (phrase.pause && i < phrases.length - 1) {
      await new Promise(resolve => setTimeout(resolve, phrase.pause));
    }
  }
  onProgress?.(phrases.length, phrases.length);
};

// Get available German voices
export const getGermanVoices = (): SpeechSynthesisVoice[] => {
  const voices = speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('de') || 
    voice.name.toLowerCase().includes('german') ||
    voice.name.toLowerCase().includes('deutsch')
  );
};

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};
