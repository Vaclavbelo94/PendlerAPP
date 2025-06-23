
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FuelIcon, PlusIcon, MoreHorizontalIcon, EditIcon, TrashIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FuelRecord } from '@/types/vehicle';
import { fetchFuelRecords, deleteFuelRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useTranslation } from 'react-i18next';
import FuelRecordDialog from './dialogs/FuelRecordDialog';
import { formatDate } from '@/utils/dateUtils';

interface FuelConsumptionCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const FuelConsumptionCard: React.FC<FuelConsumptionCardProps> = ({ vehicleId, fullView = false }) => {
  const { t } = useTranslation(['vehicle']);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error } = useStandardizedToast();

  const loadFuelRecords = async () => {
    try {
      setIsLoading(true);
      const records = await fetchFuelRecords(vehicleId);
      setFuelRecords(records || []);
    } catch (err: any) {
      error(t('vehicle:errorSavingFuelRecord'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFuelRecords();
  }, [vehicleId]);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: FuelRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      setDeletingId(recordId);
      await deleteFuelRecord(recordId);
      success(t('vehicle:fuelRecordDeleted'));
      loadFuelRecords();
    } catch (err: any) {
      error(t('vehicle:errorDeletingFuelRecord'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = () => {
    loadFuelRecords();
    setIsDialogOpen(false);
  };

  const calculateTotalCost = () => {
    return fuelRecords.reduce((sum, record) => sum + (record.total_cost || 0), 0);
  };

  const calculateAveragePrice = () => {
    if (fuelRecords.length === 0) return 0;
    const total = fuelRecords.reduce((sum, record) => sum + (record.price_per_liter || 0), 0);
    return total / fuelRecords.length;
  };

  const calculateTotalLiters = () => {
    return fuelRecords.reduce((sum, record) => sum + (record.amount_liters || 0), 0);
  };

  const displayRecords = fullView ? fuelRecords : fuelRecords.slice(0, 3);

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
              <FuelIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('vehicle:fuelConsumption')}</CardTitle>
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
          {fuelRecords.length === 0 ? (
            <div className="text-center py-8">
              <FuelIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('vehicle:noFuelRecords')}</p>
              <Button onClick={handleAddRecord} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                {t('vehicle:addFuelRecord')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:totalFuelCost')}</h4>
                  <p className="text-2xl font-bold text-blue-600">{calculateTotalCost().toFixed(0)} Kč</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:averageFuelPrice')}</h4>
                  <p className="text-2xl font-bold text-green-600">{calculateAveragePrice().toFixed(2)} Kč/L</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:totalFuelConsumed')}</h4>
                  <p className="text-2xl font-bold text-purple-600">{calculateTotalLiters().toFixed(0)} L</p>
                </div>
              </div>

              {/* Fuel Records List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('vehicle:fuelRecords')}</h4>
                  {!fullView && fuelRecords.length > 3 && (
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
                          <Badge variant="secondary">{record.station}</Badge>
                          {record.full_tank && (
                            <Badge variant="default">{t('vehicle:fullTank')}</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:amount')}:</span>
                            <span className="ml-1 font-medium">{record.amount_liters}L</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:pricePerLiter')}:</span>
                            <span className="ml-1 font-medium">{record.price_per_liter} Kč</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:totalCost')}:</span>
                            <span className="ml-1 font-medium">{record.total_cost} Kč</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:mileageAtRefuel')}:</span>
                            <span className="ml-1 font-medium">{record.mileage} km</span>
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
                                <AlertDialogTitle>{t('vehicle:deleteFuelRecord')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('vehicle:confirmDeleteFuelRecord')}
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
                
                {!fullView && fuelRecords.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {t('vehicle:andMoreRecords', { count: fuelRecords.length - 3 })}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FuelRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId}
        onSuccess={handleDialogSuccess}
      />
    </>
  );
};

export default FuelConsumptionCard;
