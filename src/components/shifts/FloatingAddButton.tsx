
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';

interface FloatingAddButtonProps {
  onClick: (date?: Date) => void;
  selectedDate?: Date;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick, selectedDate }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('shifts');
  const { user } = useAuth();

  // Only show on mobile and when user is authenticated
  if (!isMobile || !user) {
    return null;
  }

  return (
    <Button
      onClick={() => onClick(selectedDate)}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      aria-label={t('addShift')}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingAddButton;
