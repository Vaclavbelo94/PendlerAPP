
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLAuth } from '@/hooks/useDHLAuth';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DHLDashboard: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const { canAccessDHLFeatures, isLoading, dhlAuthState } = useDHLAuth();

  // Show loading state
  if (isLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Načítám DHL dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Check access
  if (!canAccessDHLFeatures) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Přístup zamítnut</h2>
            <p className="text-muted-foreground">
              Nemáte oprávnění k přístupu do DHL dashboardu.
            </p>
            {dhlAuthState?.needsSetup && (
              <p className="text-sm text-blue-600 mt-2">
                Dokončete prosím DHL nastavení.
              </p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Mock data - in real implementation, this would come from the database
  const userProfile = {
    position: 'Techniker',
    workGroup: 'Skupina 1',
    nextShift: {
      date: '2025-01-02',
      startTime: '06:00',
      endTime: '14:00',
      type: 'morning' as const,
      location: 'DHL Hub Praha'
    }
  };

  const upcomingShifts = [
    {
      id: '1',
      date: '2025-01-02',
      startTime: '06:00',
      endTime: '14:00',
      type: 'morning' as const,
      location: 'DHL Hub Praha',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2025-01-03',
      startTime: '06:00',
      endTime: '14:00',
      type: 'morning' as const,
      location: 'DHL Hub Praha',
      status: 'confirmed'
    },
    {
      id: '3',
      date: '2025-01-04',
      startTime: '06:00',
      endTime: '14:00',
      type: 'morning' as const,
      location: 'DHL Hub Praha',
      status: 'pending'
    }
  ];

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-green-100 text-green-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pozice</div>
                      <div className="font-medium">{userProfile.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pracovní skupina</div>
                      <div className="font-medium">{userProfile.workGroup}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Další směna</div>
                      <div className="font-medium">
                        {userProfile.nextShift.date} {userProfile.nextShift.startTime}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Shift Highlight */}
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
                      {userProfile.nextShift.date}
                    </div>
                    <div className="text-yellow-700">
                      {userProfile.nextShift.startTime} - {userProfile.nextShift.endTime}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {userProfile.nextShift.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getShiftTypeColor(userProfile.nextShift.type)}>
                      Ranní směna
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Shifts */}
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
                          <div className="font-bold">{shift.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{shift.location}</div>
                          <div className="text-sm text-muted-foreground">8 hodin</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getShiftTypeColor(shift.type)}>
                          {shift.type === 'morning' ? 'Ranní' : 
                           shift.type === 'afternoon' ? 'Odpolední' : 'Noční'}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(shift.status)}>
                          {shift.status === 'confirmed' ? 'Potvrzeno' :
                           shift.status === 'pending' ? 'Čeká' : 'Zrušeno'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLDashboard;
