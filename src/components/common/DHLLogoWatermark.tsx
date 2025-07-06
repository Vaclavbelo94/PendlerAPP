import React from 'react';

interface DHLLogoWatermarkProps {
  className?: string;
  opacity?: number;
}

export const DHLLogoWatermark: React.FC<DHLLogoWatermarkProps> = ({ 
  className = '',
  opacity = 0.05 
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 flex items-center justify-center ${className}`}
      style={{ opacity }}
    >
      <svg
        width="400"
        height="120"
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* DHL Logo SVG - Simplified version */}
        <g fill="currentColor">
          {/* D */}
          <path d="M20 20h30c20 0 35 15 35 35s-15 35-35 35H20V20zm15 15v40h15c10 0 20-5 20-20s-10-20-20-20H35z"/>
          
          {/* H */}
          <path d="M110 20h15v25h25V20h15v70h-15V60h-25v30h-15V20z"/>
          
          {/* L */}
          <path d="M200 20h15v55h35v15h-50V20z"/>
        </g>
        
        {/* Subtitle */}
        <text x="280" y="50" fontSize="14" fill="currentColor" opacity="0.7">
          Excellence. Simply delivered.
        </text>
      </svg>
    </div>
  );
};

export default DHLLogoWatermark;