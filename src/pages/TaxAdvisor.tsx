
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, FileText, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TaxOptimizer from '@/components/tax-advisor/TaxOptimizer';
import DocumentGenerator from '@/components/tax-advisor/DocumentGenerator';

const TaxAdvisor = () => {
  const { t } = useTranslation(['common', 'navigation']);
  const [activeTab, setActiveTab] = useState('optimizer');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('navigation:taxAdvisor')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('common:taxAdvisorDescription')}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t('common:taxOptimization')}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('common:documents')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TaxOptimizer />
            </motion.div>
          </TabsContent>

          <TabsContent value="documents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DocumentGenerator />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TaxAdvisor;
