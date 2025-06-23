
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldIcon, PlusIcon, EditIcon, TrashIcon, MoreHorizontalIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { InsuranceRecord } from '@/types/vehicle';
import { fetchInsuranceRecords, deleteInsuranceRecord } from '@/services/vehicleService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { useTranslation } from 'react-i18next';
import InsuranceRecordDialog from './dialogs/InsuranceRecordDialog';
import { formatDate } from '@/utils/dateUtils';

interface InsuranceCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ vehicleId, fullView = false }) => {
  const { t } = useTranslation(['vehicle']);
  const [insuranceRecords, setInsuranceRecords] = useState<InsuranceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InsuranceRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error } = useStandardizedToast();

  const loadInsuranceRecords = async () => {
    try {
      setIsLoading(true);
      const records = await fetchInsuranceRecords(vehicleId);
      setInsuranceRecords(records || []);
    } catch (err: any) {
      error(t('vehicle:errorLoadingInsuranceRecords'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsuranceRecords();
  }, [vehicleId]);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: InsuranceRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      setDeletingId(recordId);
      await deleteInsuranceRecord(recordId);
      success(t('vehicle:insuranceRecordDeleted'));
      loadInsuranceRecords();
    } catch (err: any) {
      error(t('vehicle:errorDeletingInsuranceRecord'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = () => {
    loadInsuranceRecords();
    setIsDialogOpen(false);
  };

  const calculateTotalCost = () => {
    return insuranceRecords.reduce((sum, record) => sum + (parseFloat(record.monthly_cost) || 0), 0);
  };

  const getActiveInsurance = () => {
    const now = new Date();
    return insuranceRecords.find(record => {
      const expiryDate = new Date(record.valid_until);
      return expiryDate > now;
    });
  };

  const displayRecords = fullView ? insuranceRecords : insuranceRecords.slice(0, 3);

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
              <ShieldIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('vehicle:insurance')}</CardTitle>
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
          {insuranceRecords.length === 0 ? (
            <div className="text-center py-8">
              <ShieldIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('vehicle:noInsuranceRecords')}</p>
              <Button onClick={handleAddRecord} className="gap-2">
                <PlusIcon className="h-4 w-4" />
                {t('vehicle:addInsuranceRecord')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Insurance Summary */}
              {getActiveInsurance() && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('vehicle:activeInsurance')}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('vehicle:insuranceProvider')}:</span>
                      <span className="ml-1 font-medium">{getActiveInsurance()?.provider}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('vehicle:insuranceExpiry')}:</span>
                      <span className="ml-1 font-medium">{formatDate(getActiveInsurance()!.valid_until)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('vehicle:coverageType')}:</span>
                      <span className="ml-1 font-medium">{getActiveInsurance()?.coverage_type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('vehicle:policyNumber')}:</span>
                      <span className="ml-1 font-medium">{getActiveInsurance()?.policy_number}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:totalInsuranceCost')}</h4>
                  <p className="text-2xl font-bold text-blue-600">{calculateTotalCost().toFixed(0)} Kč</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">{t('vehicle:insuranceStatus')}</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {getActiveInsurance() ? t('vehicle:active') : t('vehicle:noActiveInsurance')}
                  </p>
                </div>
              </div>

              {/* Insurance Records List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('vehicle:insuranceRecords')}</h4>
                  {!fullView && insuranceRecords.length > 3 && (
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
                          <Badge variant="outline">{formatDate(record.valid_from)}</Badge>
                          <Badge variant="secondary">{record.coverage_type}</Badge>
                          {getActiveInsurance()?.id === record.id && (
                            <Badge variant="default">{t('vehicle:active')}</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:insuranceProvider')}:</span>
                            <span className="ml-1 font-medium">{record.provider}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:monthlyCost')}:</span>
                            <span className="ml-1 font-medium">{record.monthly_cost} Kč</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:insuranceExpiry')}:</span>
                            <span className="ml-1 font-medium">{formatDate(record.valid_until)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t('vehicle:policyNumber')}:</span>
                            <span className="ml-1 font-medium">{record.policy_number}</span>
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
                                <AlertDialogTitle>{t('vehicle:deleteInsuranceRecord')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('vehicle:confirmDeleteInsuranceRecord')}
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
                
                {!fullView && insuranceRecords.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {t('vehicle:andMoreRecords', { count: insuranceRecords.length - 3 })}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InsuranceRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleId={vehicleId}
        onSuccess={handleDialogSuccess}
        record={editingRecord}
      />
    </>
  );
};

export default InsuranceCard;
