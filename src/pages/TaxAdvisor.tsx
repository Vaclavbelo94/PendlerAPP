
import React from "react";
import { motion } from "framer-motion";
import PremiumCheck from '@/components/premium/PremiumCheck';
import TaxWizardCarousel from "@/components/tax-advisor/wizard/TaxWizardCarousel";

const TaxAdvisor = () => {
  return (
    <PremiumCheck featureKey="tax-advisor">
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10">
          <div className="container max-w-6xl py-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Daňový poradce
              </h1>
              <p className="text-lg text-muted-foreground">
                Průvodce krok za krokem pro optimální daňové přiznání
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TaxWizardCarousel />
            </motion.div>
          </div>
        </div>
      </div>
    </PremiumCheck>
  );
};

export default TaxAdvisor;
