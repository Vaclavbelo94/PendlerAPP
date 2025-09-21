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
      style={{ opacity: 0.3 }}
    >
      <img 
        src={dhlLogo} 
        alt="DHL Logo" 
        className="w-auto h-40 object-contain opacity-100"
        onError={(e) => {
          console.error('Failed to load DHL logo:', e);
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => {
          console.log('DHL logo loaded successfully');
        }}
      />
    </div>
  );
};

export default DHLLogoWatermark;