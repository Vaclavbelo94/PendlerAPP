import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Car } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import CreateRideOfferForm from './CreateRideOfferForm';

interface RideOfferFormSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOfferCreated: () => void;
}

const RideOfferFormSheet: React.FC<RideOfferFormSheetProps> = ({
  isOpen,
  setIsOpen,
  onOfferCreated
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('travel');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleOfferCreated = () => {
    onOfferCreated();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className={cn(
        "overflow-y-auto z-50", 
        isMobile ? "w-full" : "sm:max-w-2xl"
      )}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {t('createRideOfferTitle')}
          </SheetTitle>
          <SheetDescription>
            {t('createRideOfferDescription')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <CreateRideOfferForm onOfferCreated={handleOfferCreated} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RideOfferFormSheet;