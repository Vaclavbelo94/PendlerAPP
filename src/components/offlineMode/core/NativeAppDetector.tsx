
import React from 'react';

export const isNativeApp = () => {
  return (
    window.navigator.userAgent.includes('PendlerApp') ||
    document.URL.indexOf('http://') === -1 &&
    document.URL.indexOf('https://') === -1 ||
    window.matchMedia('(display-mode: standalone)').matches
  );
};

export const NativeAppDetector: React.FC = () => {
  return null;
};

export default NativeAppDetector;
