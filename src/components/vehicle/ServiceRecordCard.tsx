
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WrenchIcon, PlusIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ServiceRecord } from '@/types/vehicle';
import { fetchServiceRecords, deleteServiceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useTranslation } from 'react-i18next';
import ServiceRecordDialog from './dialogs/ServiceRecordDialog';
import { formatDate } from '@/utils/dateUtils';

interface ServiceRecordCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({ vehicleId, fullView = false }) => {
  const { t } = useTranslation(['vehicle']);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error } = useStandardizedToast();

  const loadServiceRecords = async () => {
    try {
      setIsLoading(true);
      const records = await fetchServiceRecords(vehicleId);
      setServiceRecords(records || []);
    } catch (err: any) {
      error(t('vehicle:errorSavingServiceRecord'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServiceRecords();
  }, [vehicleId]);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: ServiceRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      setDeletingId(recordId);
      await deleteServiceRecord(recordId);
      success(t('vehicle:serviceRecordDeleted'));
      loadServiceRecords();
    } catch (err: any) {
      error(t('vehicle:errorDeletingServiceRecord'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = () => {
    loadServiceRecords();
    setIsDialogOpen(false);
  };

  const calculateTotalCost = () => {
    return serviceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
  };

  const calculateAverageCost = () => {
    if (serviceRecords.length === 0) return 0;
    return calculateTotalCost() / serviceRecords.length;
  };

  const getLastServiceDate = () => {
    if (serviceRecords.length === 0) return null;
    const sortedRecords = [...serviceRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedRecords[0].date;
  };

  const displayRecords = fullView ? serviceRecords : serviceRecords.slice(0, 3);

  if (isLoading) {
    return (
      <Card className="h-64">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">{t('vehicle:loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={fullView ? "w-full" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WrenchIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('vehicle:serviceRecords')}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddRecord}
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              {t('vehicle:add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {serviceRecords.length === 0 ? (
            <div className="text-center py-8">
              <WrenchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('vehicle:noServiceRecords')}</p>
              <Button onClick={handleAddRecord} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                {t('vehicle:addServiceRecord')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:totalServiceCost')}</h4>
                  <p className="text-2xl font-bold text-blue-600">{calculateTotalCost().toFixed(0)} Kč</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:averageServiceCost')}</h4>
                  <p className="text-2xl font-bold text-green-600">{calculateAverageCost().toFixed(0)} Kč</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:lastServiceDate')}</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {getLastServiceDate() ? formatDate(getLastServiceDate()!) : t('vehicle:noDataAvailable')}
                  </p>
                </div>
              </div>

              {/* Service Records List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('vehicle:serviceRecords')}</h4>
                  {!fullView && serviceRecords.length > 3 && (
                    <Button variant="ghost" size="sm">
                      {t('vehicle:viewAll')}
                    </Button>
                  )}
                </div>
                
                {displayRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{formatDate(record.date)}</Badge>
                          <Badge variant="secondary">{record.service_type}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:cost')}:</span>
                            <span className="ml-1 font-medium">{record.cost} Kč</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:provider')}:</span>
                            <span className="ml-1 font-medium">{record.provider}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:mileage')}:</span>
                            <span className="ml-1 font-medium">{record.mileage} km</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:description')}:</span>
                            <span className="ml-1 font-medium">{record.description}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
                          <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            {t('vehicle:edit')}
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                {t('vehicle:delete')}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('vehicle:deleteServiceRecord')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('vehicle:confirmDeleteServiceRecord')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('vehicle:cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRecord(record.id)}
                                  disabled={deletingId === record.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === record.id ? t('vehicle:deleting') : t('vehicle:delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                
                {!fullView && serviceRecords.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {t('vehicle:andMoreRecords', { count: serviceRecords.length - 3 })}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId}
        onSuccess={handleDialogSuccess}
        record={editingRecord}
      />
    </>
  );
};

export default ServiceRecordCard;
