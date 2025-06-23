
import React from 'react';
import { Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface EmptyVehicleStateProps {
  onAddVehicle: () => void;
}

const EmptyVehicleState: React.FC<EmptyVehicleStateProps> = ({ onAddVehicle }) => {
  const { t } = useTranslation(['vehicle']);

  return (
    <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-sm border-dashed border-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center"
      >
        <Car className="h-10 w-10 text-primary" />
      </motion.div>
      
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl font-semibold mb-3 text-foreground"
      >
        {t('vehicle:noVehiclesFound')}
      </motion.h3>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-muted-foreground mb-8 max-w-md mx-auto"
      >
        {t('vehicle:getStartedByAdding')}
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          onClick={onAddVehicle}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('vehicle:addVehicle')}
        </Button>
      </motion.div>
    </Card>
  );
};

export default EmptyVehicleState;
