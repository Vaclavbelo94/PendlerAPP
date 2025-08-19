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
      <SheetContent className="overflow-y-auto z-50 flex flex-col">
        <SheetHeader className="flex-shrink-0 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Car className="h-5 w-5 md:h-6 md:w-6" />
            {t('createRideOfferTitle')}
          </SheetTitle>
          <SheetDescription className="text-sm md:text-base">
            {t('createRideOfferDescription')}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <CreateRideOfferForm onOfferCreated={handleOfferCreated} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RideOfferFormSheet;