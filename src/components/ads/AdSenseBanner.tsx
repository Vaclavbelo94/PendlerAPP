
import React, { useEffect, useRef } from 'react';
import { useAdSense } from './AdSenseProvider';
import { cn } from '@/lib/utils';

interface AdSenseBannerProps {
  adSlot: string; // AdSense ad slot ID
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  className,
  style,
  responsive = true
}) => {
  const { shouldShowAds, isAdSenseLoaded, loadAd, trackAdView } = useAdSense();
  const adRef = useRef<HTMLDivElement>(null);
  const adId = `adsense-${adSlot}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!shouldShowAds || !isAdSenseLoaded || !adRef.current) return;

    // Track ad view
    trackAdView(`adsense_banner_${adFormat}`);

    // Load the ad
    loadAd(adSlot, adId);
  }, [shouldShowAds, isAdSenseLoaded, adSlot, adFormat, trackAdView, loadAd, adId]);

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={cn("adsense-container", className)}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
