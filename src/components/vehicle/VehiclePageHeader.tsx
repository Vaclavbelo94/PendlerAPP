
import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VehiclePageHeader: React.FC = () => {
  const { t } = useTranslation(['vehicle']);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Car className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('vehicle:vehicleManagement')}
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {t('vehicle:vehicleInfo')}
      </p>
    </motion.div>
  );
};

export default VehiclePageHeader;
