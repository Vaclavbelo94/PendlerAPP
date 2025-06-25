
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLAuth } from '@/hooks/useDHLAuth';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createDHLAssignment } from '@/utils/dhlAuthUtils';
import { supabase } from '@/integrations/supabase/client';

const DHLSetup: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const { needsSetup, refreshDHLAuthState } = useDHLAuth();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);
  const [workGroups, setWorkGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load positions and work groups from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const [positionsResult, workGroupsResult] = await Promise.all([
          supabase.from('dhl_positions').select('*').eq('is_active', true),
          supabase.from('dhl_work_groups').select('*').eq('is_active', true)
        ]);

        if (positionsResult.data) {
          setPositions(positionsResult.data);
        }
        
        if (workGroupsResult.data) {
          setWorkGroups(workGroupsResult.data);
        }
      } catch (error) {
        console.error('Error loading DHL data:', error);
        toast.error('Chyba při načítání dat DHL');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Redirect if user doesn't need setup
  useEffect(() => {
    if (!loading && !needsSetup && user) {
      window.location.href = '/dhl-dashboard';
    }
  }, [loading, needsSetup, user]);

  const handleSubmit = async () => {
    if (!selectedPosition || !selectedWorkGroup || !user) {
      toast.error('Prosím vyberte pozici a pracovní skupinu');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createDHLAssignment(user.id, selectedPosition, selectedWorkGroup);
      
      if (result.success) {
        toast.success('DHL nastavení bylo úspěšně dokončeno!');
        
        // Refresh DHL auth state
        await refreshDHLAuthState();
        
        // Redirect to DHL dashboard
        setTimeout(() => {
          window.location.href = '/dhl-dashboard';
        }, 1500);
      } else {
        toast.error(result.error || 'Chyba při ukládání nastavení');
      }
    } catch (error) {
      console.error('Error saving DHL setup:', error);
      toast.error('Chyba při ukládání nastavení');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Dokončete nastavení svého DHL profilu pro správu směn a rozvrhu
            </p>
          </motion.div>

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
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte svou pozici" />
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
                  <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte pracovní skupinu" />
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
                  disabled={!selectedPosition || !selectedWorkGroup || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Ukládám...'
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
