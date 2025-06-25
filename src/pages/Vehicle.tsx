
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Vehicle: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('vehicle') || 'Vozidlo'} | PendlerApp</title>
        <meta name="description" content="Správa vozidla a sledování nákladů na dopravu" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10 border">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  {t('vehicle') || 'Vozidlo'}
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Správa vozidla a sledování dopravních nákladů
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8"
          >
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-4">Správa vozidla</h2>
              <p className="text-muted-foreground">
                Tato funkce je ve vývoji. Brzy zde najdete nástroje pro správu vozidla a sledování nákladů.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Vehicle;
