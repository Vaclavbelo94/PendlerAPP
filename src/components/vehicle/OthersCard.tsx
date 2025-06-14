
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useInspectionRecords } from '@/hooks/vehicle/useInspectionRecords';
import { useVignetteRecords } from '@/hooks/vehicle/useVignetteRecords';
import InsuranceCard from './InsuranceCard';
import InspectionCard from './InspectionCard';
import VignetteCard from './VignetteCard';
import DocumentsCard from './DocumentsCard';
import InspectionDialog from './dialogs/InspectionDialog';
import VignetteDialog from './dialogs/VignetteDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { InspectionRecord, VignetteRecord } from '@/types/vehicle';

interface OthersCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const OthersCard: React.FC<OthersCardProps> = ({ vehicleId, fullView = false }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("insurance");
  
  // Dialog states
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [vignetteDialogOpen, setVignetteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<InspectionRecord | undefined>();
  const [editingVignette, setEditingVignette] = useState<VignetteRecord | undefined>();
  const [deletingItem, setDeletingItem] = useState<{ type: 'inspection' | 'vignette'; id: string } | null>(null);

  // Data hooks
  const inspectionRecords = useInspectionRecords(vehicleId);
  const vignetteRecords = useVignetteRecords(vehicleId);

  const tabs = ["insurance", "inspection", "vignette", "documents"];
  
  const { containerRef } = useSwipeNavigation({
    items: tabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: isMobile && fullView
  });

  const handleEditInspection = (inspection: InspectionRecord) => {
    setEditingInspection(inspection);
    setInspectionDialogOpen(true);
  };

  const handleEditVignette = (vignette: VignetteRecord) => {
    setEditingVignette(vignette);
    setVignetteDialogOpen(true);
  };

  const handleDeleteInspection = (id: string) => {
    setDeletingItem({ type: 'inspection', id });
    setDeleteDialogOpen(true);
  };

  const handleDeleteVignette = (id: string) => {
    setDeletingItem({ type: 'vignette', id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    
    if (deletingItem.type === 'inspection') {
      await inspectionRecords.deleteInspection(deletingItem.id);
    } else {
      await vignetteRecords.deleteVignette(deletingItem.id);
    }
    
    setDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const closeInspectionDialog = () => {
    setInspectionDialogOpen(false);
    setEditingInspection(undefined);
  };

  const closeVignetteDialog = () => {
    setVignetteDialogOpen(false);
    setEditingVignette(undefined);
  };

  if (!fullView) {
    // Přehledové zobrazení - ukáže počet záznamů v každé kategorii
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ostatní
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Pojištění</p>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">STK</p>
              <p className="text-lg font-bold">{inspectionRecords.inspections.length}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dálniční známky</p>
              <p className="text-lg font-bold">{vignetteRecords.vignettes.length}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dokumenty</p>
              <p className="text-lg font-bold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Plné zobrazení
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Ostatní
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef}>
          {isMobile ? (
            // Mobile: Swipe navigation
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {tabs.map((tab, index) => (
                    <div
                      key={tab}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        tab === activeTab ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {activeTab === "insurance" && (
                  <InsuranceCard vehicleId={vehicleId} fullView />
                )}
                {activeTab === "inspection" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">STK a Emise</h3>
                      <Button size="sm" onClick={() => setInspectionDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat kontrolu
                      </Button>
                    </div>
                    <InspectionCard 
                      vehicleId={vehicleId} 
                      fullView 
                      inspections={inspectionRecords.inspections}
                      onEdit={handleEditInspection}
                      onDelete={handleDeleteInspection}
                      isLoading={inspectionRecords.isLoading}
                    />
                  </div>
                )}
                {activeTab === "vignette" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Dálniční známky</h3>
                      <Button size="sm" onClick={() => setVignetteDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat známku
                      </Button>
                    </div>
                    <VignetteCard 
                      vehicleId={vehicleId} 
                      fullView 
                      vignettes={vignetteRecords.vignettes}
                      onEdit={handleEditVignette}
                      onDelete={handleDeleteVignette}
                      isLoading={vignetteRecords.isLoading}
                    />
                  </div>
                )}
                {activeTab === "documents" && (
                  <DocumentsCard vehicleId={vehicleId} fullView />
                )}
              </div>
            </div>
          ) : (
            // Desktop: Tab navigation
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="insurance">Pojištění</TabsTrigger>
                <TabsTrigger value="inspection">STK</TabsTrigger>
                <TabsTrigger value="vignette">Dálniční známky</TabsTrigger>
                <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="insurance" className="mt-0">
                  <InsuranceCard vehicleId={vehicleId} fullView />
                </TabsContent>
                
                <TabsContent value="inspection" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">STK a Emise</h3>
                      <Button size="sm" onClick={() => setInspectionDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat kontrolu
                      </Button>
                    </div>
                    <InspectionCard 
                      vehicleId={vehicleId} 
                      fullView 
                      inspections={inspectionRecords.inspections}
                      onEdit={handleEditInspection}
                      onDelete={handleDeleteInspection}
                      isLoading={inspectionRecords.isLoading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="vignette" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Dálniční známky</h3>
                      <Button size="sm" onClick={() => setVignetteDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat známku
                      </Button>
                    </div>
                    <VignetteCard 
                      vehicleId={vehicleId} 
                      fullView 
                      vignettes={vignetteRecords.vignettes}
                      onEdit={handleEditVignette}
                      onDelete={handleDeleteVignette}
                      isLoading={vignetteRecords.isLoading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <DocumentsCard vehicleId={vehicleId} fullView />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>

        {/* Dialogs */}
        <InspectionDialog
          open={inspectionDialogOpen}
          onOpenChange={closeInspectionDialog}
          onSave={inspectionRecords.saveInspection}
          inspection={editingInspection}
          vehicleId={vehicleId}
          isLoading={inspectionRecords.isLoading}
        />

        <VignetteDialog
          open={vignetteDialogOpen}
          onOpenChange={closeVignetteDialog}
          onSave={vignetteRecords.saveVignette}
          vignette={editingVignette}
          vehicleId={vehicleId}
          isLoading={vignetteRecords.isLoading}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Potvrdit odstranění</AlertDialogTitle>
              <AlertDialogDescription>
                Opravdu chcete odstranit tento záznam? Tato akce je nevratná.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Odstranit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default OthersCard;
