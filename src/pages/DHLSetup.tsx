
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLAuth } from '@/hooks/useDHLAuth';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { createDHLAssignment } from '@/utils/dhlAuthUtils';
import { supabase } from '@/integrations/supabase/client';

interface DHLPosition {
  id: string;
  name: string;
  description?: string;
}

interface DHLWorkGroup {
  id: string;
  name: string;
  description?: string;
}

const DHLSetup: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const { needsSetup, isDHLEmployee, isLoading: authLoading, refreshDHLAuthState } = useDHLAuth();
  
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [workGroups, setWorkGroups] = useState<DHLWorkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load positions and work groups from database
  useEffect(() => {
    const loadData = async () => {
      if (!user || !isDHLEmployee) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        console.log('Loading DHL positions and work groups...');
        
        const [positionsResult, workGroupsResult] = await Promise.all([
          supabase
            .from('dhl_positions')
            .select('id, name, description')
            .eq('is_active', true)
            .order('name'),
          supabase
            .from('dhl_work_groups')
            .select('id, name, description')
            .eq('is_active', true)
            .order('week_number')
        ]);

        if (positionsResult.error) {
          console.error('Error loading positions:', positionsResult.error);
          throw new Error('Chyba při načítání pozic: ' + positionsResult.error.message);
        }
        
        if (workGroupsResult.error) {
          console.error('Error loading work groups:', workGroupsResult.error);
          throw new Error('Chyba při načítání pracovních skupin: ' + workGroupsResult.error.message);
        }

        console.log('Loaded positions:', positionsResult.data?.length || 0);
        console.log('Loaded work groups:', workGroupsResult.data?.length || 0);

        setPositions(positionsResult.data || []);
        setWorkGroups(workGroupsResult.data || []);

        if (!positionsResult.data?.length) {
          setError('Nejsou dostupné žádné pozice. Kontaktujte administrátora.');
        } else if (!workGroupsResult.data?.length) {
          setError('Nejsou dostupné žádné pracovní skupiny. Kontaktujte administrátora.');
        }
      } catch (error) {
        console.error('Error loading DHL data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Neočekávaná chyba při načítání dat';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth state to be loaded
    if (!authLoading) {
      loadData();
    }
  }, [user, isDHLEmployee, authLoading]);

  // Handle redirects after auth state is loaded
  useEffect(() => {
    if (!authLoading && user) {
      if (!isDHLEmployee) {
        console.log('User is not DHL employee, redirecting to dashboard...');
        window.location.href = '/dashboard';
      } else if (!needsSetup) {
        console.log('User does not need setup, redirecting to DHL dashboard...');
        window.location.href = '/dhl-dashboard';
      }
    } else if (!authLoading && !user) {
      console.log('No user, redirecting to login...');
      window.location.href = '/login';
    }
  }, [authLoading, user, isDHLEmployee, needsSetup]);

  const handleSubmit = async () => {
    if (!selectedPosition || !selectedWorkGroup || !user) {
      toast.error('Prosím vyberte pozici a pracovní skupinu');
      return;
    }

    // Validate selections exist in loaded data
    const selectedPositionExists = positions.some(p => p.id === selectedPosition);
    const selectedWorkGroupExists = workGroups.some(w => w.id === selectedWorkGroup);

    if (!selectedPositionExists || !selectedWorkGroupExists) {
      toast.error('Neplatný výběr pozice nebo pracovní skupiny');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creating DHL assignment...', {
        userId: user.id,
        positionId: selectedPosition,
        workGroupId: selectedWorkGroup
      });

      const result = await createDHLAssignment(user.id, selectedPosition, selectedWorkGroup);
      
      if (result.success) {
        toast.success('DHL nastavení bylo úspěšně dokončeno!');
        
        // Refresh DHL auth state
        await refreshDHLAuthState();
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          window.location.href = '/dhl-dashboard';
        }, 1000);
      } else {
        const errorMessage = result.error || 'Chyba při ukládání nastavení';
        console.error('Assignment creation failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving DHL setup:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neočekávaná chyba při ukládání nastavení';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Ověřuji přístup...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading while data is loading
  if (loading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Načítám DHL data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Nastavení | PendlerApp</title>
        <meta name="description" content="Setup your DHL employee profile and work preferences" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-yellow-500/5">
        <div className="container max-w-2xl py-8 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-sm">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent mb-4">
              Vítejte v DHL systému
            </h1>
            <p className="text-lg text-muted-foreground">
              Dokončete nastavení svého DHL profilu pro správu směn a rozvrh
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Setup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Nastavení DHL profilu
                </CardTitle>
                <CardDescription>
                  Vyberte svou pozici a pracovní skupinu pro automatické generování směn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Position Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pozice</label>
                  <Select 
                    value={selectedPosition} 
                    onValueChange={setSelectedPosition}
                    disabled={!positions.length || isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        positions.length ? "Vyberte svou pozici" : "Žádné pozice k dispozici"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          <div>
                            <div className="font-medium">{position.name}</div>
                            {position.description && (
                              <div className="text-xs text-muted-foreground">{position.description}</div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Group Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pracovní skupina</label>
                  <Select 
                    value={selectedWorkGroup} 
                    onValueChange={setSelectedWorkGroup}
                    disabled={!workGroups.length || isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        workGroups.length ? "Vyberte pracovní skupinu" : "Žádné skupiny k dispozici"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {workGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div>
                            <div className="font-medium">{group.name}</div>
                            {group.description && (
                              <div className="text-xs text-muted-foreground">{group.description}</div>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Poznámka:</strong> Po dokončení nastavení budou vaše směny automaticky generovány podle vybrané pozice a pracovní skupiny. Můžete je později upravit v DHL dashboardu.
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedPosition || !selectedWorkGroup || isSubmitting || !!error}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Ukládám...
                    </>
                  ) : (
                    <>
                      Dokončit nastavení
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLSetup;
