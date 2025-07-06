import React from 'react';
import { MediaNetBanner } from './MediaNetBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveMediaNetProps {
  mobileAdSlot: string;
  desktopAdSlot: string;
  className?: string;
}

export const ResponsiveMediaNet: React.FC<ResponsiveMediaNetProps> = ({
  mobileAdSlot,
  desktopAdSlot,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <MediaNetBanner
      adSlot={isMobile ? mobileAdSlot : desktopAdSlot}
      width={isMobile ? "320" : "728"}
      height={isMobile ? "50" : "90"}
      className={className}
    />
  );
};