import { useCallback } from 'react';
import { useDevice } from './useDevice';

type HapticIntensity = 'light' | 'medium' | 'heavy';
type HapticNotificationType = 'success' | 'warning' | 'error';

interface HapticsAPI {
  isSupported: boolean;
  impact: (intensity?: HapticIntensity) => void;
  notification: (type: HapticNotificationType) => void;
  selection: () => void;
  vibrate: (pattern: number | number[]) => void;
}

/**
 * Hook for haptic feedback (vibration)
 * Provides consistent haptic patterns across iOS and Android
 */
export const useHaptics = (): HapticsAPI => {
  const { isIOS, isAndroid } = useDevice();
  
  const isSupported = 'vibrate' in navigator;

  // Impact feedback - for button presses and interactions
  const impact = useCallback((intensity: HapticIntensity = 'medium') => {
    if (!isSupported) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };

    navigator.vibrate(patterns[intensity]);
  }, [isSupported]);

  // Notification feedback - for success/warning/error states
  const notification = useCallback((type: HapticNotificationType) => {
    if (!isSupported) return;

    const patterns = {
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [30, 150, 30, 150, 30]
    };

    navigator.vibrate(patterns[type]);
  }, [isSupported]);

  // Selection feedback - for picker/slider interactions
  const selection = useCallback(() => {
    if (!isSupported) return;
    navigator.vibrate(5);
  }, [isSupported]);

  // Custom vibration pattern
  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isSupported) return;
    navigator.vibrate(pattern);
  }, [isSupported]);

  return {
    isSupported,
    impact,
    notification,
    selection,
    vibrate
  };
};

/**
 * Hook for auto-haptic on button clicks
 * Usage: <Button {...useAutoHaptic()} onClick={handleClick}>
 */
export const useAutoHaptic = (intensity: HapticIntensity = 'light') => {
  const { impact } = useHaptics();

  return {
    onTouchStart: () => impact(intensity),
  };
};
