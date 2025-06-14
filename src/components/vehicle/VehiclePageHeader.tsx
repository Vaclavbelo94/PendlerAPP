
import React from 'react';
import { motion } from 'framer-motion';

const VehiclePageHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
        Vozidla
      </h1>
      <p className="text-lg text-muted-foreground">
        Správa vašich vozidel, spotřeby a dokumentů
      </p>
    </motion.div>
  );
};

export default VehiclePageHeader;
