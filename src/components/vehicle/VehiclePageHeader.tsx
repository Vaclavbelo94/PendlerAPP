
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

const VehiclePageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
        {t('vehicle')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('vehicleDescription')}
      </p>
    </motion.div>
  );
};

export default VehiclePageHeader;
