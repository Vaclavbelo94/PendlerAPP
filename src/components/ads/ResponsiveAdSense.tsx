
import React from 'react';
import { AdSenseBanner } from './AdSenseBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveAdSenseProps {
  mobileAdSlot: string;
  desktopAdSlot: string;
  className?: string;
}

export const ResponsiveAdSense: React.FC<ResponsiveAdSenseProps> = ({
  mobileAdSlot,
  desktopAdSlot,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <AdSenseBanner
      adSlot={isMobile ? mobileAdSlot : desktopAdSlot}
      adFormat="auto"
      className={className}
      responsive={true}
    />
  );
};
