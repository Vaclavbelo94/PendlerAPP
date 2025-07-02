
import { useState, useEffect, useCallback } from 'react';

export interface AudioSettings {
  enabled: boolean;
  speed: number; // 0.5 - 1.5
  volume: number; // 0 - 1
  pitch: number; // 0.5 - 2
  selectedVoiceIndex: number;
  autoPlay: boolean;
  showVisualFeedback: boolean;
}

const defaultAudioSettings: AudioSettings = {
  enabled: true,
  speed: 0.8,
  volume: 0.8,
  pitch: 1,
  selectedVoiceIndex: 0,
  autoPlay: false,
  showVisualFeedback: true
};

export const useAudioSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Filter for German voices first, then fallback to any available
      const germanVoices = voices.filter(voice => 
        voice.lang.startsWith('de') || 
        voice.name.toLowerCase().includes('german') ||
        voice.name.toLowerCase().includes('deutsch')
      );
      
      const allVoices = germanVoices.length > 0 ? germanVoices : voices;
      setAvailableVoices(allVoices);
      setIsLoading(false);
    };

    // Load voices immediately if available
    loadVoices();
    
    // Also listen for voices changed event (some browsers load voices asynchronously)
    speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('audio_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultAudioSettings, ...parsed });
      } catch (error) {
        console.error('Error loading audio settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('audio_settings', JSON.stringify(updatedSettings));
  }, [settings]);

  const getSelectedVoice = useCallback(() => {
    if (availableVoices.length === 0) return null;
    return availableVoices[settings.selectedVoiceIndex] || availableVoices[0];
  }, [availableVoices, settings.selectedVoiceIndex]);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultAudioSettings);
    localStorage.removeItem('audio_settings');
  }, []);

  return {
    settings,
    updateSettings,
    availableVoices,
    getSelectedVoice,
    resetToDefaults,
    isLoading,
    isSupported: 'speechSynthesis' in window
  };
};
