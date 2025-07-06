import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MapPin } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useTranslation } from 'react-i18next';

interface AddressQuickFillProps {
  onAddressSelect: (type: 'home' | 'work', address: string) => void;
  className?: string;
}

export const AddressQuickFill: React.FC<AddressQuickFillProps> = ({
  onAddressSelect,
  className = ''
}) => {
  const { homeAddress, workAddress, hasAddresses, loading } = useUserAddresses();
  const { t } = useTranslation('travel');

  if (loading || !hasAddresses) {
    return null;
  }

  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {homeAddress && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddressSelect('home', homeAddress)}
          className="text-xs"
        >
          <Home className="h-3 w-3 mr-1" />
          Domov
        </Button>
      )}
      {workAddress && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddressSelect('work', workAddress)}
          className="text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Práce
        </Button>
      )}
    </div>
  );
};

export default AddressQuickFill;