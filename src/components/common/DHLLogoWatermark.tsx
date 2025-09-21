import React from 'react';
import dhlLogo from '@/assets/dhl-logo.webp';

interface DHLLogoWatermarkProps {
  className?: string;
  opacity?: number;
}

export const DHLLogoWatermark: React.FC<DHLLogoWatermarkProps> = ({ 
  className = '',
  opacity = 0.15 
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 flex items-center justify-center ${className}`}
      style={{ opacity }}
    >
      <img 
        src={dhlLogo} 
        alt="DHL Logo" 
        className="w-auto h-32 object-contain filter grayscale opacity-80"
      />
    </div>
  );
};

export default DHLLogoWatermark;