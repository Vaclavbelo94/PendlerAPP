
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  const { t } = useTranslation(['vehicle', 'ui']);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12 px-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50"
    >
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <Car className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t('vehicle:noVehiclesFound')}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t('vehicle:getStartedByAdding')}
        </p>
      </div>
      
      <Button 
        onClick={onAddVehicle}
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('vehicle:addVehicle')}
      </Button>
    </motion.div>
  );
};

export default EmptyVehicleState;
