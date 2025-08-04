import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  FileText, 
  Image,
  File,
  X,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DocumentData {
  id?: string;
  title: string;
  document_type: 'arbeitsvertrag' | 'anmeldung' | 'insurance' | 'payslip' | 'tax_document' | 'other';
  description?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  expiry_date?: string;
  is_verified: boolean;
  tags: string[];
  created_at?: string;
}

interface DocumentUploadWidgetProps {
  className?: string;
  onDocumentAdded?: (document: DocumentData) => void;
}

export const DocumentUploadWidget: React.FC<DocumentUploadWidgetProps> = ({ 
  className = '',
  onDocumentAdded
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState<Partial<DocumentData>>({
    title: '',
    document_type: 'other',
    description: '',
    tags: [],
    is_verified: false
  });
  const [expiryDate, setExpiryDate] = useState<Date>();

  const documentTypes = [
    { value: 'arbeitsvertrag', label: t('documents.categories.arbeitsvertrag') },
    { value: 'anmeldung', label: t('documents.categories.anmeldung') },
    { value: 'insurance', label: t('documents.categories.insurance') },
    { value: 'payslip', label: t('documents.categories.payslip') },
    { value: 'tax_document', label: t('documents.categories.tax_document') },
    { value: 'other', label: t('documents.categories.other') }
  ];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('common.error'),
          description: t('documents.fileTooLarge'),
          variant: 'destructive'
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: t('common.error'),
          description: t('documents.unsupportedFileType'),
          variant: 'destructive'
        });
        return;
      }

      setSelectedFile(file);
      setDocumentData(prev => ({
        ...prev,
        title: prev.title || file.name.split('.')[0]
      }));
      setShowUploadDialog(true);
    }
  }, [t]);

  const handleCameraCapture = useCallback(() => {
    // Create hidden file input for camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use rear camera
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        setDocumentData(prev => ({
          ...prev,
          title: prev.title || `Document_${new Date().toISOString().split('T')[0]}`
        }));
        setShowUploadDialog(true);
      }
    };
    input.click();
  }, []);

  const uploadDocument = async () => {
    if (!user || !selectedFile) return;

    setIsUploading(true);
    try {
      // Generate file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dhl-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const documentMetadata = {
        user_id: user.id,
        title: documentData.title,
        document_type: documentData.document_type,
        description: documentData.description,
        file_path: uploadData.path,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        expiry_date: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
        is_verified: false,
        tags: documentData.tags || [],
        metadata: {
          original_filename: selectedFile.name,
          uploaded_at: new Date().toISOString()
        }
      };

      const { data: docData, error: docError } = await supabase
        .from('dhl_document_storage')
        .insert(documentMetadata)
        .select()
        .single();

      if (docError) throw docError;

      // Create reminder if expiry date is set
      if (expiryDate) {
        const reminderDate = new Date(expiryDate);
        reminderDate.setDate(reminderDate.getDate() - 30); // 30 days before expiry

        await supabase
          .from('dhl_document_reminders')
          .insert({
            user_id: user.id,
            document_id: docData.id,
            reminder_type: 'expiry',
            reminder_date: reminderDate.toISOString().split('T')[0]
          });
      }

      toast({
        title: t('common.success'),
        description: t('documents.documentUploaded'),
      });

      // Reset form
      setSelectedFile(null);
      setShowUploadDialog(false);
      setDocumentData({
        title: '',
        document_type: 'other',
        description: '',
        tags: [],
        is_verified: false
      });
      setExpiryDate(undefined);

      // Notify parent component
      onDocumentAdded?.(docData as DocumentData);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t('common.error'),
        description: t('documents.uploadError'),
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="h-8 w-8" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-600" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  return (
    <div className={className}>
      {/* Upload Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => document.getElementById('file-upload')?.click()}>
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t('documents.upload')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('documents.uploadFile')}
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCameraCapture}>
          <CardContent className="p-6 text-center">
            <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{t('documents.scan')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('documents.takePhoto')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileSelect}
      />

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('documents.uploadDocument')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Preview */}
            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {getFileIcon(selectedFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setShowUploadDialog(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Document Details Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="doc-title">{t('documents.documentTitle')}</Label>
                <Input
                  id="doc-title"
                  value={documentData.title}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('documents.documentTitle')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="doc-type">{t('documents.documentType')}</Label>
                <Select
                  value={documentData.document_type}
                  onValueChange={(value) => setDocumentData(prev => ({ 
                    ...prev, 
                    document_type: value as DocumentData['document_type']
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="doc-description">{t('documents.optionalDescription')}</Label>
                <Textarea
                  id="doc-description"
                  value={documentData.description}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('documents.documentDescription')}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>{t('documents.expiryDate')} {t('documents.optionalExpiryDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : t('documents.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={uploadDocument}
                disabled={isUploading || !documentData.title?.trim()}
                className="flex-1"
              >
                {isUploading ? t('documents.uploading') : t('documents.uploadDocument')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
                className="flex-1"
              >
                {t('documents.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUploadWidget;