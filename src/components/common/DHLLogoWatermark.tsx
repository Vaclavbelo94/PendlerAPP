import React from 'react';

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
      <svg
        width="500"
        height="150"
        viewBox="0 0 500 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Official DHL Logo Design */}
        <g fill="currentColor">
          {/* D - Enhanced with proper DHL styling */}
          <path d="M30 30h40c25 0 45 20 45 45s-20 45-45 45H30V30zm20 20v50h20c15 0 25-10 25-25s-10-25-25-25H50z"/>
          
          {/* H - Proper proportions */}
          <path d="M140 30h20v35h35V30h20v90h-20V85h-35v35h-20V30z"/>
          
          {/* L - Clean lines */}
          <path d="M240 30h20v70h45v20h-65V30z"/>
          
          {/* DHL signature yellow stripe */}
          <rect x="25" y="25" width="285" height="8" fill="#FFCC02" opacity="0.6"/>
          <rect x="25" y="137" width="285" height="8" fill="#FFCC02" opacity="0.6"/>
        </g>
        
        {/* Enhanced subtitle with DHL branding */}
        <text x="350" y="70" fontSize="16" fill="currentColor" opacity="0.6" fontWeight="500">
          Excellence.
        </text>
        <text x="350" y="90" fontSize="16" fill="currentColor" opacity="0.6" fontWeight="500">
          Simply delivered.
        </text>
        
        {/* Small logo elements */}
        <circle cx="440" cy="60" r="3" fill="#D40511" opacity="0.4"/>
        <circle cx="450" cy="75" r="2" fill="#FFCC02" opacity="0.4"/>
        <circle cx="460" cy="90" r="2.5" fill="#D40511" opacity="0.4"/>
      </svg>
    </div>
  );
};

export default DHLLogoWatermark;