import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Image,
  File,
  Eye,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Document {
  id: string;
  title: string;
  document_type: string;
  description?: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  expiry_date?: string;
  is_verified: boolean;
  tags: string[];
  created_at: string;
  metadata?: any;
}

interface DocumentListProps {
  className?: string;
  onDocumentUpdate?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  className = '',
  onDocumentUpdate
}) => {
  const { t } = useTranslation('dhl-employee');
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'expiry'>('date');

  useEffect(() => {
    if (user) {
      loadDocuments();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dhl_document_storage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při načítání dokumentů',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('document-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dhl_document_storage',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          loadDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('dhl-documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete document record
      const { error: dbError } = await supabase
        .from('dhl_document_storage')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast({
        title: t('common.success'),
        description: 'Dokument byl smazán',
      });

      loadDocuments();
      onDocumentUpdate?.();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při mazání dokumentu',
        variant: 'destructive'
      });
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('dhl-documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.title;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t('common.success'),
        description: 'Dokument byl stažen',
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: t('common.error'),
        description: 'Chyba při stahování dokumentu',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-600" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-6 w-6 text-red-600" />;
    } else {
      return <File className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return t(`documents.categories.${type}`);
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', label: t('documents.expired'), color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 30) {
      return { 
        status: 'warning', 
        label: t('documents.expiryWarning', { days: daysUntilExpiry }), 
        color: 'bg-yellow-100 text-yellow-800' 
      };
    }
    return null;
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || doc.document_type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'expiry':
          if (!a.expiry_date && !b.expiry_date) return 0;
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat dokumenty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny typy</SelectItem>
                <SelectItem value="arbeitsvertrag">Pracovní smlouva</SelectItem>
                <SelectItem value="anmeldung">Přihlášení</SelectItem>
                <SelectItem value="insurance">Pojištění</SelectItem>
                <SelectItem value="payslip">Výplatní páska</SelectItem>
                <SelectItem value="tax_document">Daňový dokument</SelectItem>
                <SelectItem value="other">Ostatní</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Podle data</SelectItem>
                <SelectItem value="name">Podle názvu</SelectItem>
                <SelectItem value="expiry">Podle vypršení</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAndSortedDocuments.map((document) => {
            const expiryStatus = getExpiryStatus(document.expiry_date);
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(document.mime_type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate" title={document.title}>
                            {document.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {getDocumentTypeLabel(document.document_type)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {document.is_verified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {!document.is_verified && (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {document.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {document.description}
                      </p>
                    )}

                    {/* Expiry Warning */}
                    {expiryStatus && (
                      <div className="mb-3">
                        <Badge variant="secondary" className={`text-xs ${expiryStatus.color}`}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {expiryStatus.label}
                        </Badge>
                      </div>
                    )}

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* File Info */}
                    <div className="text-xs text-muted-foreground mb-4">
                      <div>Velikost: {(document.file_size / 1024 / 1024).toFixed(2)} MB</div>
                      <div>Nahráno: {new Date(document.created_at).toLocaleDateString('cs-CZ')}</div>
                      {document.expiry_date && (
                        <div>Vyprší: {new Date(document.expiry_date).toLocaleDateString('cs-CZ')}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(document)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Stáhnout
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Smazat dokument</AlertDialogTitle>
                            <AlertDialogDescription>
                              Opravdu chcete smazat dokument "{document.title}"? Tato akce je nevratná.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušit</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDocument(document.id, document.file_path)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Smazat
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {searchTerm || filterType !== 'all' ? 'Žádné dokumenty nenalezeny' : 'Žádné dokumenty'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterType !== 'all' 
                ? 'Zkuste změnit filtry nebo vyhledávání'
                : 'Nahrajte svůj první dokument pomocí tlačítek výše'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentList;