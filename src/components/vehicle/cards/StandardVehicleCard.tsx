
import React from 'react';
import { StandardCard } from '@/components/ui/StandardCard';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface StandardVehicleCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  fullView?: boolean;
  className?: string;
}

export const StandardVehicleCard: React.FC<StandardVehicleCardProps> = ({
  title,
  description,
  children,
  actions,
  fullView = false,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <StandardCard
      title={title}
      description={description}
      className={cn(
        'h-full',
        fullView && 'min-h-[400px]',
        className
      )}
      fullHeight
    >
      <div className="space-y-4">
        <div className="flex-1">
          {children}
        </div>
        
        {actions && (
          <div className={cn(
            'flex gap-2 pt-4 border-t',
            isMobile ? 'flex-col' : 'flex-row justify-end'
          )}>
            {actions}
          </div>
        )}
      </div>
    </StandardCard>
  );
};

export default StandardVehicleCard;
