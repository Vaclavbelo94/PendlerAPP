
import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const VehiclePageHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['vehicle', 'ui']);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className={`flex items-center gap-4 mb-6 ${isMobile ? 'flex-col text-center' : ''}`}>
        <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 backdrop-blur-sm border border-white/10`}>
          <Car className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
        </div>
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent`}>
            {t('vehicle:vehicleManagement')}
          </h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
            {t('vehicle:title')} - {t('ui:management')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VehiclePageHeader;
