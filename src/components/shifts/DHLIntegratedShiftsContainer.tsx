
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useDHLShifts } from '@/hooks/dhl/useDHLShifts';
import { useShiftsManagement } from '@/hooks/useShiftsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, User } from 'lucide-react';
import OptimizedShiftCalendar from './OptimizedShiftCalendar';
import DHLShiftCalendar from '@/components/dhl/DHLShiftCalendar';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLIntegratedShiftsContainer: React.FC = () => {
  const { user } = useAuth();
  const { userAssignment } = useDHLData(user?.id);
  const [activeTab, setActiveTab] = useState('personal');

  // Personal shifts management
  const {
    shifts: personalShifts,
    isLoading: personalLoading,
    addShift,
    updateShift,
    deleteShift
  } = useShiftsManagement(user?.id);

  // DHL shifts management
  const {
    dhlShifts,
    isLoading: dhlLoading,
    generateDHLShifts,
    overrideDHLShift,
    restoreDHLShift
  } = useDHLShifts(user?.id);

  const handleEditShift = (shift: any) => {
    updateShift(shift);
  };

  const handleDeleteShift = (shiftId: string) => {
    deleteShift(shiftId);
  };

  if (personalLoading || dhlLoading) {
    return <LoadingSpinner />;
  }

  const hasDHLAccess = userAssignment?.is_active;

  // If user has DHL access, show integrated view
  if (hasDHLAccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold">Spravování směn</h1>
              <p className="text-muted-foreground">
                Osobní směny a DHL systém - {userAssignment.dhl_position?.name}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/dhl-dashboard'}>
            <Building2 className="h-4 w-4 mr-2" />
            DHL Dashboard
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Osobní směny ({personalShifts.length})
            </TabsTrigger>
            <TabsTrigger value="dhl" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              DHL směny ({dhlShifts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Osobní kalendář směn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OptimizedShiftCalendar
                  shifts={personalShifts}
                  onEditShift={handleEditShift}
                  onDeleteShift={handleDeleteShift}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dhl" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-yellow-600" />
                    DHL spravované směny
                  </CardTitle>
                  <Badge variant="secondary">
                    {userAssignment.dhl_position?.name} - {userAssignment.dhl_work_group?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <DHLShiftCalendar
                  dhlShifts={dhlShifts}
                  onOverrideShift={overrideDHLShift}
                  onRestoreShift={restoreDHLShift}
                  onGenerateShifts={generateDHLShifts}
                  isLoading={dhlLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // If no DHL access, show regular shifts calendar
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Spravování směn</h1>
          <p className="text-muted-foreground">Osobní kalendář směn</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OptimizedShiftCalendar
            shifts={personalShifts}
            onEditShift={handleEditShift}
            onDeleteShift={handleDeleteShift}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLIntegratedShiftsContainer;
