
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, CheckCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useDHLSetup } from '@/hooks/dhl/useDHLSetup';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const DHLSetup: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { positions, workGroups, isLoading } = useDHLData();
  const { submitSetup, isSubmitting } = useDHLSetup();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [referenceDate, setReferenceDate] = useState<string>('');
  const [referenceWoche, setReferenceWoche] = useState<string>('');
  const [isFromRegistration, setIsFromRegistration] = useState(false);

  // Use DHL route guard to protect this page
  const { canAccess, isLoading: isRouteGuardLoading } = useDHLRouteGuard(false);

  // Filter work groups based on selected position's cycle_weeks
  const getFilteredWorkGroups = () => {
    if (!selectedPosition) {
      return workGroups; // Show all weeks if no position selected
    }
    
    const selectedPositionData = positions.find(p => p.id === selectedPosition);
    if (!selectedPositionData?.cycle_weeks || selectedPositionData.cycle_weeks.length === 0) {
      return workGroups; // Show all weeks if position has no cycle_weeks defined
    }
    
    return workGroups.filter(group => 
      selectedPositionData.cycle_weeks.includes(group.week_number)
    );
  };

  // Filter reference weeks based on selected position's cycle_weeks
  const getFilteredReferenceWeeks = () => {
    if (!selectedPosition) {
      return Array.from({ length: 15 }, (_, i) => i + 1); // Show all weeks 1-15 if no position selected
    }
    
    const selectedPositionData = positions.find(p => p.id === selectedPosition);
    if (!selectedPositionData?.cycle_weeks || selectedPositionData.cycle_weeks.length === 0) {
      return Array.from({ length: 15 }, (_, i) => i + 1); // Show all weeks if position has no cycle_weeks defined
    }
    
    return selectedPositionData.cycle_weeks.sort((a, b) => a - b);
  };

  const handlePositionChange = (positionId: string) => {
    setSelectedPosition(positionId);
    setSelectedWorkGroup(''); // Clear work group when position changes
    setReferenceWoche(''); // Clear reference woche when position changes
  };

  useEffect(() => {
    // Check if user came from registration
    const fromRegistration = localStorage.getItem('dhl-from-registration');
    if (fromRegistration === 'true') {
      setIsFromRegistration(true);
      localStorage.removeItem('dhl-from-registration'); // Clean up
    }
    
    // Set default reference date to today
    const today = new Date().toISOString().split('T')[0];
    setReferenceDate(today);
  }, []);

  const handleSubmit = async () => {
    if (!selectedPosition || !selectedWorkGroup || !referenceDate || !referenceWoche) {
      return;
    }

    console.log('=== DHL SETUP SUBMISSION ===');
    console.log('Selected position:', selectedPosition);
    console.log('Selected work group:', selectedWorkGroup);
    console.log('Reference date:', referenceDate);
    console.log('Reference woche:', referenceWoche);
    console.log('Is from registration:', isFromRegistration);

    const success = await submitSetup({
      position_id: selectedPosition,
      work_group_id: selectedWorkGroup,
      reference_date: referenceDate,
      reference_woche: parseInt(referenceWoche)
    });

    if (success) {
      console.log('DHL setup completed successfully');
      
      // Show different success message based on context
      if (isFromRegistration) {
        console.log('Redirecting to DHL dashboard after registration setup');
      } else {
        console.log('Redirecting to DHL dashboard after profile update');
      }
      
      setTimeout(() => {
        navigate('/dhl-dashboard');
      }, 1500);
    }
  };

  if (isLoading || isRouteGuardLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Načítám DHL data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If user can't access, route guard will handle redirect
  if (!canAccess) {
    return null;
  }

  const filteredWorkGroups = getFilteredWorkGroups();
  const filteredReferenceWeeks = getFilteredReferenceWeeks();

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
              {isFromRegistration ? 'Vítejte v DHL systému' : 'Nastavení DHL profilu'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isFromRegistration 
                ? 'Dokončete nastavení svého DHL profilu pro správu směn a rozvrhu'
                : 'Upravte nastavení svého DHL profilu'
              }
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
                  Vyberte svou pozici, pracovní týden a nastavte referenční bod pro výpočet Woche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Position Selection */}
                <div className="space-y-2">
                  <Label htmlFor="position">Pozice</Label>
                  <Select value={selectedPosition} onValueChange={handlePositionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte svou pozici" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          <div>
                            <div className="font-medium">{position.name}</div>
                            <div className="text-xs text-muted-foreground">{position.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Group Selection */}
                <div className="space-y-2">
                  <Label htmlFor="workGroup">Pracovní týden</Label>
                  <Select 
                    value={selectedWorkGroup} 
                    onValueChange={setSelectedWorkGroup}
                    disabled={!selectedPosition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedPosition ? "Vyberte pracovní týden" : "Nejprve vyberte pozici"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredWorkGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          Týden {group.week_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPosition && filteredWorkGroups.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Pro vybranou pozici nejsou k dispozici žádné pracovní týdny
                    </p>
                  )}
                </div>

                {/* Reference Date */}
                <div className="space-y-2">
                  <Label htmlFor="referenceDate">Referenční datum</Label>
                  <Input
                    id="referenceDate"
                    type="date"
                    value={referenceDate}
                    onChange={(e) => setReferenceDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Datum, od kterého se počítá váš Woche cyklus
                  </p>
                </div>

                {/* Reference Woche */}
                <div className="space-y-2">
                  <Label htmlFor="referenceWoche">Referenční Woche</Label>
                  <Select 
                    value={referenceWoche} 
                    onValueChange={setReferenceWoche}
                    disabled={!selectedPosition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedPosition ? "Vyberte Woche" : "Nejprve vyberte pozici"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredReferenceWeeks.map(week => (
                        <SelectItem key={week} value={week.toString()}>
                          Woche {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Jaké Woche číslo máte k referenčnímu datumu
                  </p>
                  {selectedPosition && filteredReferenceWeeks.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Pro vybranou pozici nejsou k dispozici žádné Woche týdny
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Referenční bod:</strong> Tento bod se používá pro výpočet vašeho aktuálního Woche cyklu. 
                      Pokud si nejste jisti, nastavte dnešní datum a číslo Woche, které aktuálně máte.
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedPosition || !selectedWorkGroup || !referenceDate || !referenceWoche || isSubmitting}
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
