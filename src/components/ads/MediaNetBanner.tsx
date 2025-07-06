import React, { useEffect, useRef } from 'react';
import { useMediaNet } from './MediaNetProvider';
import { cn } from '@/lib/utils';

interface MediaNetBannerProps {
  adSlot: string;
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MediaNetBanner: React.FC<MediaNetBannerProps> = ({
  adSlot,
  width = "728",
  height = "90",
  className,
  style
}) => {
  const { shouldShowAds, isMediaNetLoaded, loadAd, trackAdView } = useMediaNet();
  const adRef = useRef<HTMLDivElement>(null);
  const adId = `medianet-${adSlot}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!shouldShowAds || !isMediaNetLoaded || !adRef.current) return;

    trackAdView(`medianet_banner_${width}x${height}`);
    loadAd(adSlot, adId);
  }, [shouldShowAds, isMediaNetLoaded, adSlot, width, height, trackAdView, loadAd, adId]);

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={cn("medianet-container", className)}
      style={style}
    >
      <div
        id={`medianet_${adSlot}`}
        data-crid={adSlot}
        data-cv="3121199"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'inline-block',
          ...style
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.medianet_width = "${width}";
              window.medianet_height = "${height}";  
              window.medianet_crid = "${adSlot}";
              window.medianet_versionId = "3121199";
            } catch(e) {}
          `
        }}
      />
    </div>
  );
};