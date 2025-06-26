
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useDHLShiftsIntegration } from '@/hooks/shifts/useDHLShiftsIntegration';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calculateCurrentWoche } from '@/utils/dhl/wocheCalculator';

const DHLDashboard: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const { userAssignment, isLoading } = useDHLData(user?.id);
  const { shifts, isLoading: isShiftsLoading } = useOptimizedShiftsManagement(user?.id);
  const { enhancedShifts, dhlStats } = useDHLShiftsIntegration(shifts, userAssignment);
  
  // Use DHL route guard - requires setup to access dashboard
  const { canAccess, hasAssignment, isLoading: isRouteGuardLoading } = useDHLRouteGuard(true);

  // Get current Woche information
  const currentWocheInfo = React.useMemo(() => {
    if (!userAssignment) return null;
    
    const referenceDate = userAssignment.reference_date ? 
      new Date(userAssignment.reference_date) : 
      new Date();
    const referenceWoche = userAssignment.reference_woche || 1;
    
    return calculateCurrentWoche(
      { referenceDate, referenceWoche },
      new Date()
    );
  }, [userAssignment]);

  // Get upcoming shifts (next 7 days)
  const upcomingShifts = React.useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return enhancedShifts
      .filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= today && shiftDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Show max 5 upcoming shifts
  }, [enhancedShifts]);

  // Get next shift
  const nextShift = upcomingShifts[0];

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní směna';
      case 'afternoon': return 'Odpolední směna';
      case 'night': return 'Noční směna';
      default: return 'Směna';
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-green-100 text-green-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (isLoading || isRouteGuardLoading || isShiftsLoading) {
    return (
      <DHLLayout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Načítám DHL data...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  // Route guard will handle redirects if needed
  if (!canAccess || !hasAssignment) {
    return null;
  }

  return (
    <DHLLayout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Dashboard | PendlerApp</title>
        <meta name="description" content="Your DHL shifts and schedule dashboard" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-yellow-500/5">
        <div className="container max-w-6xl py-8 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-sm">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  DHL Dashboard
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Váš rozvrh směn a pracovní informace
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Váš DHL profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pozice</div>
                      <div className="font-medium">{userAssignment?.dhl_position?.name || 'Neznámá pozice'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pracovní skupina</div>
                      <div className="font-medium">{userAssignment?.dhl_work_group?.name || 'Neznámá skupina'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Aktuální Woche</div>
                      <div className="font-medium">
                        {currentWocheInfo ? `Woche ${currentWocheInfo.currentWoche}` : 'Neznámá'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Další směna</div>
                      <div className="font-medium">
                        {nextShift ? formatDate(nextShift.date) : 'Žádná naplánována'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* DHL Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>DHL Statistiky</CardTitle>
                <CardDescription>Přehled vašich DHL směn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="text-2xl font-bold text-yellow-600">{dhlStats.totalShifts}</div>
                    <div className="text-sm text-yellow-700">Celkem směn</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="text-2xl font-bold text-green-600">{dhlStats.dhlManagedShifts}</div>
                    <div className="text-sm text-green-700">DHL generované</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="text-2xl font-bold text-blue-600">{dhlStats.manualShifts}</div>
                    <div className="text-sm text-blue-700">Manuální</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="text-2xl font-bold text-purple-600">{upcomingShifts.length}</div>
                    <div className="text-sm text-purple-700">Nadcházející</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Shift Highlight */}
          {nextShift ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Další směna</CardTitle>
                  <CardDescription className="text-yellow-700">
                    Vaše nejbližší plánovaná směna
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-yellow-800">
                        {formatDate(nextShift.date)}
                      </div>
                      <div className="text-yellow-700">
                        {getShiftTypeLabel(nextShift.type)}
                      </div>
                      {nextShift.notes && (
                        <div className="text-sm text-yellow-600">
                          {nextShift.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getShiftTypeColor(nextShift.type)}>
                        {getShiftTypeLabel(nextShift.type)}
                      </Badge>
                      {(nextShift as any).isDHLManaged && (
                        <div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            DHL Generovaná
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  V nadcházejících 7 dnech nemáte naplánované žádné směny.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Upcoming Shifts */}
          {upcomingShifts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Nadcházející směny</CardTitle>
                  <CardDescription>Váš rozvrh na následující období</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingShifts.map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold">{formatDate(shift.date)}</div>
                            <div className="text-sm text-muted-foreground">
                              {getShiftTypeLabel(shift.type)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {(shift as any).dhl_position_name || dhlStats.dhlPosition}
                            </div>
                            {shift.notes && (
                              <div className="text-sm text-muted-foreground">{shift.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getShiftTypeColor(shift.type)}>
                            {shift.type === 'morning' ? 'Ranní' : 
                             shift.type === 'afternoon' ? 'Odpolední' : 'Noční'}
                          </Badge>
                          {(shift as any).isDHLManaged ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              DHL
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Manuální
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DHLLayout>
  );
};

export default DHLDashboard;
