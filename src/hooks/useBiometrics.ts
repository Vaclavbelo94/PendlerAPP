import { useState, useCallback, useEffect } from 'react';

type BiometricType = 'fingerprint' | 'face' | 'iris' | 'none';

interface BiometricOptions {
  title?: string;
  subtitle?: string;
  description?: string;
  fallbackLabel?: string;
  cancelLabel?: string;
}

interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}

export const useBiometrics = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [isChecking, setIsChecking] = useState(true);

  // Check platform and biometric availability
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    setIsChecking(true);
    
    try {
      // Check if Web Authentication API is available
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsSupported(available);
        
        if (available) {
          // Try to determine biometric type from platform
          const userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            setBiometricType('face'); // Face ID on iOS
          } else if (userAgent.includes('android')) {
            setBiometricType('fingerprint'); // Typically fingerprint on Android
          } else {
            setBiometricType('fingerprint'); // Default to fingerprint
          }
          
          // Check if user has biometrics enrolled (we can't directly check, so assume yes if available)
          setIsEnrolled(true);
        }
      } else {
        setIsSupported(false);
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsSupported(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Authenticate with biometrics
  const authenticate = useCallback(async (
    options: BiometricOptions = {}
  ): Promise<BiometricResult> => {
    if (!isSupported) {
      return {
        success: false,
        error: 'Biometric authentication not supported'
      };
    }

    try {
      // Create a challenge (in production, get this from your server)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Request authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname
        }
      } as any);

      if (credential) {
        return {
          success: true,
          biometricType
        };
      } else {
        return {
          success: false,
          error: 'Authentication cancelled'
        };
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      let errorMessage = 'Authentication failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Authentication cancelled or not allowed';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Biometric authentication not set up';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [isSupported, biometricType]);

  // Enroll biometrics (register)
  const enroll = useCallback(async (
    userId: string,
    options: BiometricOptions = {}
  ): Promise<BiometricResult> => {
    if (!isSupported) {
      return {
        success: false,
        error: 'Biometric authentication not supported'
      };
    }

    try {
      // Create a challenge (in production, get this from your server)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Convert userId to Uint8Array
      const userIdBuffer = new TextEncoder().encode(userId);

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: document.title || 'App',
            id: window.location.hostname
          },
          user: {
            id: userIdBuffer,
            name: userId,
            displayName: userId
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },  // ES256
            { type: 'public-key', alg: -257 } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      } as any);

      if (credential) {
        setIsEnrolled(true);
        return {
          success: true,
          biometricType
        };
      } else {
        return {
          success: false,
          error: 'Enrollment cancelled'
        };
      }
    } catch (error: any) {
      console.error('Biometric enrollment error:', error);
      
      let errorMessage = 'Enrollment failed';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Enrollment cancelled or not allowed';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [isSupported, biometricType]);

  // Simple authentication prompt with fallback
  const promptAuth = useCallback(async (
    message: string = 'Authenticate to continue'
  ): Promise<boolean> => {
    if (!isSupported || !isEnrolled) {
      // Fallback to password prompt
      const password = window.prompt(message);
      return password !== null;
    }

    const result = await authenticate({ title: message });
    return result.success;
  }, [isSupported, isEnrolled, authenticate]);

  return {
    isSupported,
    isEnrolled,
    isChecking,
    biometricType,
    authenticate,
    enroll,
    promptAuth,
    checkBiometricSupport
  };
};
