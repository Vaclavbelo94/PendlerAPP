
import { useState, useEffect, useCallback } from 'react';

interface AudioSettings {
  enabled: boolean;
  selectedVoiceIndex: number;
  speed: number;
  volume: number;
  pitch: number;
  autoPlay: boolean;
  showVisualFeedback: boolean;
}

const defaultSettings: AudioSettings = {
  enabled: true,
  selectedVoiceIndex: 0,
  speed: 1.0,
  volume: 0.8,
  pitch: 1.0,
  autoPlay: false,
  showVisualFeedback: true,
};

export const useAudioSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        const germanVoices = voices.filter(voice => voice.lang.startsWith('de'));
        setAvailableVoices(germanVoices.length > 0 ? germanVoices : voices);
        setIsLoading(false);
      };

      // Load voices immediately if available
      loadVoices();
      
      // Also listen for voices changed event (some browsers load voices asynchronously)
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    } else {
      setIsSupported(false);
      setIsLoading(false);
    }
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('audioSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn('Failed to parse saved audio settings:', error);
      }
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('audioSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getSelectedVoice = useCallback(() => {
    return availableVoices[settings.selectedVoiceIndex] || null;
  }, [availableVoices, settings.selectedVoiceIndex]);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('audioSettings');
  }, []);

  return {
    settings,
    updateSettings,
    availableVoices,
    getSelectedVoice,
    resetToDefaults,
    isLoading,
    isSupported,
  };
};
