import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, Bell } from 'lucide-react';
import DocumentUploadWidget from './documents/DocumentUploadWidget';
import DocumentList from './documents/DocumentList';
import DocumentReminders from './documents/DocumentReminders';

interface DHLDocumentManagementProps {
  className?: string;
}

export const DHLDocumentManagement: React.FC<DHLDocumentManagementProps> = ({ 
  className = '' 
}) => {
  const { t } = useTranslation('dhl-employee');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDocumentAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleDocumentUpdate = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          {t('documents.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('documents.description')}
        </p>
      </div>

      {/* Document Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DocumentReminders key={`reminders-${refreshKey}`} />
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{t('documents.uploadNew')}</h2>
          </div>
          <DocumentUploadWidget onDocumentAdded={handleDocumentAdded} />
        </div>
      </motion.div>

      {/* Documents List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DocumentList 
          key={`documents-${refreshKey}`}
          onDocumentUpdate={handleDocumentUpdate} 
        />
      </motion.div>
    </div>
  );
};

export default DHLDocumentManagement;