
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAds } from './AdProvider';
import { useNavigate } from 'react-router-dom';
import { Crown, Star, Zap } from 'lucide-react';

interface AdPopupProps {
  trigger?: number; // Page views or actions to trigger
}

export const AdPopup: React.FC<AdPopupProps> = ({ trigger = 5 }) => {
  const { shouldShowAds, trackAdView, trackAdClick } = useAds();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    if (!shouldShowAds) return;

    const handleRouteChange = () => {
      setPageViews(prev => {
        const newViews = prev + 1;
        if (newViews >= trigger && newViews % trigger === 0) {
          setIsOpen(true);
          trackAdView('popup_premium_offer');
        }
        return newViews;
      });
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange(); // Count initial page load

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [shouldShowAds, trigger, trackAdView]);

  if (!shouldShowAds) {
    return null;
  }

  const handleUpgrade = () => {
    trackAdClick('popup_premium_upgrade');
    setIsOpen(false);
    navigate('/premium');
  };

  const handleClose = () => {
    trackAdClick('popup_premium_close');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Crown className="h-6 w-6 text-amber-500" />
            Získejte Premium!
          </DialogTitle>
          <DialogDescription className="text-center">
            Odstraňte reklamy a odemkněte všechny prémiové funkce
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Premium výhody:
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Žádné reklamy</li>
              <li>• Pokročilé kalkulačky</li>
              <li>• Offline režim</li>
              <li>• Prioritní podpora</li>
              <li>• Exporty a zálohy</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Později
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Zap className="h-4 w-4 mr-2" />
              Upgradovat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
