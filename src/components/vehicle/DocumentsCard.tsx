
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentRecord } from '@/types/vehicle';
import { fetchDocuments } from '@/services/vehicleService';
import { FileText, Plus } from 'lucide-react';

interface DocumentsCardProps {
  vehicleId?: string;
  fullView?: boolean;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ vehicleId, fullView = false }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      loadDocuments();
    }
  }, [vehicleId]);

  const loadDocuments = async () => {
    if (!vehicleId) return;
    
    setIsLoading(true);
    try {
      const docs = await fetchDocuments(vehicleId);
      setDocuments(docs);
    } catch (error) {
      console.error('Chyba při načítání dokumentů:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Dokumenty</CardTitle>
          <CardDescription>Správa dokumentů vozidla a termínů platnosti</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Přidat dokument
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Zatím zde nejsou žádné dokumenty</p>
            <p className="text-sm mt-2">Klikněte na "Přidat dokument" pro nahrání prvního dokumentu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(fullView ? documents : documents.slice(0, 3)).map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                    {doc.notes && <p className="text-sm">{doc.notes}</p>}
                  </div>
                  <div className="text-right">
                    {doc.expiry_date && (
                      <p className="text-sm text-muted-foreground">
                        Platné do: {doc.expiry_date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {!fullView && documents.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="link">Zobrazit všechny dokumenty</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
