
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLAuth } from '@/hooks/useDHLAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { createDHLAssignment } from '@/utils/dhlAuthUtils';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const DHLSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dhlAuthState, isLoading: authLoading, refreshDHLAuthState } = useDHLAuth();
  const { positions, workGroups, isLoading: dataLoading } = useDHLData();
  const { success, error } = useStandardizedToast();

  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = authLoading || dataLoading;

  // Redirect if user doesn't need setup
  useEffect(() => {
    if (!isLoading && dhlAuthState && !dhlAuthState.needsSetup) {
      console.log('User does not need DHL setup, redirecting...');
      if (dhlAuthState.isDHLAdmin) {
        navigate('/dhl-admin');
      } else if (dhlAuthState.canAccessDHLFeatures) {
        navigate('/dhl-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [dhlAuthState, isLoading, navigate]);

  // Check if user is DHL employee
  useEffect(() => {
    if (!isLoading && dhlAuthState && !dhlAuthState.isDHLEmployee) {
      console.log('User is not a DHL employee, redirecting...');
      navigate('/dashboard');
    }
  }, [dhlAuthState, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedPosition || !selectedWorkGroup) {
      error('Chyba', 'Vyplňte všechna povinná pole');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating DHL assignment:', {
        userId: user.id,
        positionId: selectedPosition,
        workGroupId: selectedWorkGroup
      });

      const result = await createDHLAssignment(user.id, selectedPosition, selectedWorkGroup);
      
      if (result.success) {
        success('DHL přiřazení bylo úspěšně vytvořeno');
        
        // Refresh auth state
        await refreshDHLAuthState();
        
        // Redirect to dashboard
        navigate('/dhl-dashboard');
      } else {
        error('Chyba', result.error || 'Nepodařilo se vytvořit DHL přiřazení');
      }
    } catch (err) {
      console.error('Error creating DHL assignment:', err);
      error('Chyba', 'Nepodařilo se vytvořit DHL přiřazení');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Načítám DHL nastavení...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show access denied if not DHL employee
  if (!dhlAuthState?.isDHLEmployee) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Přístup zamítnut</h2>
            <p className="text-muted-foreground">
              Nemáte oprávnění k přístupu do DHL nastavení.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Nastavení | PendlerApp</title>
        <meta name="description" content="Dokončete DHL nastavení pro přístup k funkcím" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-yellow-500/5">
        <div className="container max-w-2xl py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-sm">
                  <Truck className="h-8 w-8 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  DHL Nastavení
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Dokončete nastavení pro přístup k DHL funkcím
              </p>
            </div>

            {/* Setup Form */}
            <Card>
              <CardHeader>
                <CardTitle>Pracovní informace</CardTitle>
                <CardDescription>
                  Vyberte svou pozici a pracovní skupinu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Position Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pozice *</label>
                    <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte pozici" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{position.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {position.position_type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Group Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pracovní skupina *</label>
                    <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte pracovní skupinu" />
                      </SelectTrigger>
                      <SelectContent>
                        {workGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{group.name}</span>
                              <Badge variant="outline" className="ml-2">
                                Týden {group.week_number}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting || !selectedPosition || !selectedWorkGroup}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Dokončuji nastavení...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Dokončit nastavení
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      Důležité informace
                    </p>
                    <p className="text-sm text-blue-700">
                      Po dokončení nastavení budete mít přístup k DHL dashboardu a můžete začít spravovat své směny.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLSetup;
