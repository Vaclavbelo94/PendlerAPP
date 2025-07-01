
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DocumentDialog from '../dialogs/DocumentDialog';
import InspectionDialog from '../dialogs/InspectionDialog';
import VignetteDialog from '../dialogs/VignetteDialog';

interface OthersCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const OthersCard: React.FC<OthersCardProps> = ({ vehicleId, fullView = false }) => {
  const { t } = useTranslation(['vehicle']);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isInspectionDialogOpen, setIsInspectionDialogOpen] = useState(false);
  const [isVignetteDialogOpen, setIsVignetteDialogOpen] = useState(false);

  // Mock data - replace with real data fetching
  const documents = [
    {
      id: '1',
      name: 'Technický průkaz',
      type: 'technicky_prukaz',
      expiry_date: '2025-12-31'
    }
  ];

  const inspections = [
    {
      id: '1',
      inspection_date: '2024-01-15',
      next_inspection_date: '2025-01-15',
      result: 'Prošel',
      station: 'STK Brno',
      cost: '800',
      mileage: '50000'
    }
  ];

  const vignettes = [
    {
      id: '1',
      country: 'Rakousko',
      vignette_type: 'Roční',
      valid_from: '2024-01-01',
      valid_until: '2024-12-31',
      cost: '96.40'
    }
  ];

  const handleSuccess = () => {
    console.log('Record operation completed');
  };

  if (fullView) {
    return (
      <>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Ostatní</span>
            </CardTitle>
            <CardDescription>Dokumenty, STK a dálniční známky</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="documents">Dokumenty</TabsTrigger>
                <TabsTrigger value="inspections">STK</TabsTrigger>
                <TabsTrigger value="vignettes">Známky</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Dokumenty</h3>
                  <Button size="sm" onClick={() => setIsDocumentDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat dokument
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{doc.name}</div>
                        {doc.expiry_date && (
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(doc.expiry_date).toLocaleDateString('cs-CZ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="inspections" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">STK kontroly</h3>
                  <Button size="sm" onClick={() => setIsInspectionDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat STK
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {inspections.map((inspection) => (
                    <div key={inspection.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{inspection.station}</div>
                        <Badge variant={inspection.result === 'Prošel' ? 'default' : 'destructive'}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {inspection.result}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Další kontrola: {new Date(inspection.next_inspection_date).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="vignettes" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Dálniční známky</h3>
                  <Button size="sm" onClick={() => setIsVignetteDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat známku
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {vignettes.map((vignette) => (
                    <div key={vignette.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{vignette.country}</div>
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vignette.vignette_type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Platnost do: {new Date(vignette.valid_until).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <DocumentDialog
          isOpen={isDocumentDialogOpen}
          onClose={() => setIsDocumentDialogOpen(false)}
          vehicleId={vehicleId}
          onSuccess={handleSuccess}
        />

        <InspectionDialog
          open={isInspectionDialogOpen}
          onOpenChange={setIsInspectionDialogOpen}
          onSave={async (data) => {
            console.log('Inspection saved:', data);
            handleSuccess();
            return data as any;
          }}
          vehicleId={vehicleId}
        />

        <VignetteDialog
          open={isVignetteDialogOpen}
          onOpenChange={setIsVignetteDialogOpen}
          onSave={async (data) => {
            console.log('Vignette saved:', data);
            handleSuccess();
            return data as any;
          }}
          vehicleId={vehicleId}
        />
      </>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <CardTitle className="text-sm font-medium">Ostatní</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDocumentDialogOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Dokumenty: {documents.length}
            </div>
            <div className="text-xs text-muted-foreground">
              STK kontroly: {inspections.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Dálniční známky: {vignettes.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentDialog
        isOpen={isDocumentDialogOpen}
        onClose={() => setIsDocumentDialogOpen(false)}
        vehicleId={vehicleId}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default OthersCard;
