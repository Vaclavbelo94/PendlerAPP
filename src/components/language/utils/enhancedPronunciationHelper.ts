
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
  private voicesLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = new Promise((resolve) => {
      const checkVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.voicesLoaded = true;
          console.log('AudioManager: Voices loaded:', voices.length);
          resolve();
        } else {
          // Some browsers load voices asynchronously
          setTimeout(checkVoices, 100);
        }
      };

      if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = checkVoices;
        checkVoices(); // Check immediately in case voices are already loaded
      } else {
        console.warn('AudioManager: Speech synthesis not supported');
        resolve();
      }
    });

    return this.loadingPromise;
  }

  private async ensureVoicesLoaded(): Promise<void> {
    if (!this.voicesLoaded) {
      await this.initializeVoices();
    }
  }

  private getBestVoice(lang: string): SpeechSynthesisVoice | null {
    const voices = speechSynthesis.getVoices();
    
    // First try to find exact language match
    let voice = voices.find(v => v.lang === lang);
    
    // If not found, try language prefix (e.g., 'de' for 'de-DE')
    if (!voice) {
      const langPrefix = lang.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // Prefer local voices over remote ones
    if (voice && voices.filter(v => v.lang.startsWith(lang.split('-')[0])).length > 1) {
      const localVoice = voices.find(v => 
        v.lang.startsWith(lang.split('-')[0]) && v.localService
      );
      if (localVoice) voice = localVoice;
    }
    
    console.log(`AudioManager: Selected voice for ${lang}:`, voice?.name || 'default');
    return voice;
  }

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
        throw new Error('Speech synthesis not supported in this browser');
      }

      // Ensure voices are loaded
      await this.ensureVoicesLoaded();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      if (settings) {
        utterance.rate = Math.max(0.1, Math.min(2, settings.speed));
        utterance.volume = Math.max(0, Math.min(1, settings.volume));
        utterance.pitch = Math.max(0, Math.min(2, settings.pitch));
        
        // Try to set the best voice for the language
        const bestVoice = this.getBestVoice(lang);
        if (bestVoice) {
          utterance.voice = bestVoice;
        } else {
          // Fallback: try to use selected voice index if available
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0 && settings.selectedVoiceIndex < voices.length) {
            utterance.voice = voices[settings.selectedVoiceIndex];
          }
        }
      }

      utterance.lang = lang;
      
      // Set up event handlers
      utterance.onstart = () => {
        this.isPlaying = true;
        console.log(`AudioManager: Started speaking: "${text.substring(0, 50)}..."`);
        onStart?.();
      };
      
      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        console.log(`AudioManager: Finished speaking: "${text.substring(0, 50)}..."`);
        onEnd?.();
      };
      
      utterance.onerror = (event) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        const errorMsg = `Speech synthesis error: ${event.error}`;
        console.error('AudioManager:', errorMsg, event);
        onError?.(new Error(errorMsg));
      };

      // Additional safety timeout
      const timeout = setTimeout(() => {
        if (this.isPlaying) {
          console.warn('AudioManager: Speech synthesis timeout, stopping...');
          this.stop();
          onError?.(new Error('Speech synthesis timeout'));
        }
      }, 30000); // 30 second timeout

      utterance.onend = () => {
        clearTimeout(timeout);
        this.isPlaying = false;
        this.currentUtterance = null;
        console.log(`AudioManager: Finished speaking: "${text.substring(0, 50)}..."`);
        onEnd?.();
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      this.isPlaying = false;
      this.currentUtterance = null;
      console.error('AudioManager: Unexpected error:', error);
      onError?.(error as Error);
    }
  }

  stop(): void {
    if (this.isPlaying) {
      speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
      console.log('AudioManager: Stopped playback');
    }
  }

  pause(): void {
    if (this.isPlaying) {
      speechSynthesis.pause();
      console.log('AudioManager: Paused playback');
    }
  }

  resume(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      console.log('AudioManager: Resumed playback');
    }
  }

  get playing(): boolean {
    return this.isPlaying;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }

  getGermanVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => 
      voice.lang.startsWith('de') || 
      voice.name.toLowerCase().includes('german') ||
      voice.name.toLowerCase().includes('deutsch')
    );
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Enhanced helper functions with better error handling
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

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

// Diagnostic function for troubleshooting
export const diagnoseAudioSupport = () => {
  const diagnosis = {
    speechSynthesisSupported: 'speechSynthesis' in window,
    voicesAvailable: speechSynthesis.getVoices().length,
    germanVoicesAvailable: audioManager.getGermanVoices().length,
    currentlyPlaying: audioManager.playing
  };
  
  console.log('AudioManager Diagnosis:', diagnosis);
  return diagnosis;
};
