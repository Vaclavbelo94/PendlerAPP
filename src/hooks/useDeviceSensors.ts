import { useState, useCallback, useEffect, useRef } from 'react';

interface Acceleration {
  x: number;
  y: number;
  z: number;
}

interface Orientation {
  alpha: number | null; // Z-axis (0-360)
  beta: number | null;  // X-axis (-180 to 180)
  gamma: number | null; // Y-axis (-90 to 90)
}

interface Battery {
  level: number;
  charging: boolean;
  chargingTime: number | null;
  dischargingTime: number | null;
}

type SensorType = 'accelerometer' | 'gyroscope' | 'orientation' | 'battery';
type NetworkType = 'wifi' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';

export const useDeviceSensors = () => {
  const [acceleration, setAcceleration] = useState<Acceleration | null>(null);
  const [gyroscope, setGyroscope] = useState<Acceleration | null>(null);
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [battery, setBattery] = useState<Battery | null>(null);
  const [networkType, setNetworkType] = useState<NetworkType>('unknown');
  const [isMonitoring, setIsMonitoring] = useState(false);

  const motionListenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const orientationListenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const batteryRef = useRef<any>(null);

  // Check sensor support
  const checkSupport = useCallback(() => {
    return {
      accelerometer: 'DeviceMotionEvent' in window,
      gyroscope: 'DeviceMotionEvent' in window,
      orientation: 'DeviceOrientationEvent' in window,
      battery: 'getBattery' in navigator
    };
  }, []);

  // Request sensor permissions (iOS 13+)
  const requestPermissions = useCallback(async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Permission denied:', error);
        return false;
      }
    }
    return true; // No permission needed on other platforms
  }, []);

  // Start monitoring accelerometer
  const startAccelerometer = useCallback(() => {
    if (motionListenerRef.current) return;

    const listener = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        setAcceleration({
          x: e.accelerationIncludingGravity.x || 0,
          y: e.accelerationIncludingGravity.y || 0,
          z: e.accelerationIncludingGravity.z || 0
        });
      }

      if (e.rotationRate) {
        setGyroscope({
          x: e.rotationRate.alpha || 0,
          y: e.rotationRate.beta || 0,
          z: e.rotationRate.gamma || 0
        });
      }
    };

    window.addEventListener('devicemotion', listener);
    motionListenerRef.current = listener;
  }, []);

  // Start monitoring orientation
  const startOrientation = useCallback(() => {
    if (orientationListenerRef.current) return;

    const listener = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      });
    };

    window.addEventListener('deviceorientation', listener);
    orientationListenerRef.current = listener;
  }, []);

  // Start monitoring battery
  const startBattery = useCallback(async () => {
    if (!('getBattery' in navigator)) return;

    try {
      const bat = await (navigator as any).getBattery();
      batteryRef.current = bat;

      const updateBattery = () => {
        setBattery({
          level: Math.round(bat.level * 100),
          charging: bat.charging,
          chargingTime: bat.chargingTime,
          dischargingTime: bat.dischargingTime
        });
      };

      updateBattery();

      bat.addEventListener('levelchange', updateBattery);
      bat.addEventListener('chargingchange', updateBattery);
    } catch (error) {
      console.error('Battery API error:', error);
    }
  }, []);

  // Detect network type
  const detectNetworkType = useCallback(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      const effectiveType = connection.effectiveType;
      setNetworkType(effectiveType || 'unknown');

      connection.addEventListener('change', () => {
        setNetworkType(connection.effectiveType || 'unknown');
      });
    } else {
      // Fallback: assume wifi if no API available
      setNetworkType('unknown');
    }
  }, []);

  // Start monitoring specified sensors
  const startMonitoring = useCallback(async (sensors: SensorType[] = ['accelerometer', 'orientation', 'battery']) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Sensor permissions denied');
      return;
    }

    if (sensors.includes('accelerometer') || sensors.includes('gyroscope')) {
      startAccelerometer();
    }

    if (sensors.includes('orientation')) {
      startOrientation();
    }

    if (sensors.includes('battery')) {
      startBattery();
    }

    detectNetworkType();
    setIsMonitoring(true);
  }, [requestPermissions, startAccelerometer, startOrientation, startBattery, detectNetworkType]);

  // Stop monitoring all sensors
  const stopMonitoring = useCallback(() => {
    if (motionListenerRef.current) {
      window.removeEventListener('devicemotion', motionListenerRef.current);
      motionListenerRef.current = null;
    }

    if (orientationListenerRef.current) {
      window.removeEventListener('deviceorientation', orientationListenerRef.current);
      orientationListenerRef.current = null;
    }

    setIsMonitoring(false);
  }, []);

  // Detect device shake
  const onShake = useCallback((callback: () => void, threshold = 15) => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = 0;

    const listener = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const now = Date.now();
      if (now - lastTime < 100) return;

      const deltaX = Math.abs((acc.x || 0) - lastX);
      const deltaY = Math.abs((acc.y || 0) - lastY);
      const deltaZ = Math.abs((acc.z || 0) - lastZ);

      if (deltaX + deltaY + deltaZ > threshold) {
        callback();
      }

      lastX = acc.x || 0;
      lastY = acc.y || 0;
      lastZ = acc.z || 0;
      lastTime = now;
    };

    window.addEventListener('devicemotion', listener);
    
    return () => {
      window.removeEventListener('devicemotion', listener);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    acceleration,
    gyroscope,
    orientation,
    battery,
    networkType,
    isMonitoring,
    checkSupport,
    requestPermissions,
    startMonitoring,
    stopMonitoring,
    onShake
  };
};
