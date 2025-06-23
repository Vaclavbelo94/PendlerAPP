
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DocumentExample {
  id: string;
  title: string;
  description: string;
  category: string;
  downloadUrl: string;
  previewUrl?: string;
}

const documentExamples: DocumentExample[] = [
  {
    id: '1',
    title: 'Formulář pro daňové přiznání',
    description: 'Základní formulář pro podání daňového přiznání fyzické osoby',
    category: 'Daňové přiznání',
    downloadUrl: '/examples/tax-return-form.pdf',
    previewUrl: '/examples/tax-return-form-preview.pdf'
  },
  {
    id: '2',
    title: 'Příloha k přiznání - příjmy ze zahraničí',
    description: 'Formulář pro vykazování příjmů ze zahraničních zdrojů',
    category: 'Přílohy',
    downloadUrl: '/examples/foreign-income-attachment.pdf'
  }
];

const DocumentExamplesDialog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t } = useTranslation('common');

  const categories = ['all', ...Array.from(new Set(documentExamples.map(doc => doc.category)))];
  
  const filteredDocuments = selectedCategory === 'all' 
    ? documentExamples 
    : documentExamples.filter(doc => doc.category === selectedCategory);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          {t('documentExamples') || 'Vzorové dokumenty'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('documentExamples') || 'Vzorové dokumenty'}
          </DialogTitle>
          <DialogDescription>
            {t('documentExamplesDescription') || 'Prohlédněte si vzorové dokumenty a formuláře pro daňové přiznání'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? t('all') || 'Vše' : category}
              </Badge>
            ))}
          </div>

          {/* Documents List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {doc.category}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {doc.previewUrl && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        {t('preview') || 'Náhled'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      {t('download') || 'Stáhnout'}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {t('openExternal') || 'Otevřít'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentExamplesDialog;
