
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAds } from './AdProvider';
import { useNavigate } from 'react-router-dom';
import { Crown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
  variant?: 'horizontal' | 'square' | 'vertical';
  showCloseButton?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className,
  variant = 'horizontal',
  showCloseButton = false
}) => {
  const { shouldShowAds, trackAdView, trackAdClick } = useAds();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    if (shouldShowAds && isVisible) {
      trackAdView(`banner_${variant}`);
    }
  }, [shouldShowAds, isVisible, variant, trackAdView]);

  if (!shouldShowAds || !isVisible) {
    return null;
  }

  const handleUpgradeClick = () => {
    trackAdClick(`banner_${variant}_upgrade`);
    navigate('/premium');
  };

  const handleClose = () => {
    setIsVisible(false);
    trackAdClick(`banner_${variant}_close`);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'square':
        return 'w-64 h-64';
      case 'vertical':
        return 'w-48 h-96';
      default:
        return 'w-full h-24';
    }
  };

  return (
    <Card className={cn(
      "relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700",
      getVariantStyles(),
      className
    )}>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 h-6 w-6 p-0"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center space-y-2">
          <Crown className="h-8 w-8 text-amber-500 mx-auto" />
          <p className="text-sm font-medium">Reklama</p>
          <p className="text-xs text-muted-foreground">
            Odstraňte reklamy s Premium
          </p>
          <Button 
            size="sm" 
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            Upgradovat
          </Button>
        </div>
      </div>
    </Card>
  );
};
