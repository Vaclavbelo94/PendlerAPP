
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DHLSetup: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in real implementation, this would come from the database
  const positions = [
    { id: '1', name: 'Techniker', description: 'Technická pozice' },
    { id: '2', name: 'Rangierer', description: 'Rangování vozidel' },
    { id: '3', name: 'Verlader', description: 'Nakládání/vykládání' },
    { id: '4', name: 'Sortierer', description: 'Třídění zásilek' },
    { id: '5', name: 'Fahrer', description: 'Řidič' }
  ];

  const workGroups = [
    { id: '1', name: 'Skupina 1', description: 'Ranní týden 1-15' },
    { id: '2', name: 'Skupina 2', description: 'Ranní týden 2-16' },
    { id: '3', name: 'Skupina 3', description: 'Odpolední směny' },
    { id: '4', name: 'Skupina 4', description: 'Noční směny' }
  ];

  const handleSubmit = async () => {
    if (!selectedPosition || !selectedWorkGroup) {
      toast.error('Prosím vyberte pozici a pracovní skupinu');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here would be the actual API call to save the DHL assignment
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      
      toast.success('DHL nastavení bylo úspěšně dokončeno!');
      
      // Redirect to DHL dashboard
      setTimeout(() => {
        window.location.href = '/dhl-dashboard';
      }, 1500);
      
    } catch (error) {
      console.error('Error saving DHL setup:', error);
      toast.error('Chyba při ukládání nastavení');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                            <div className="text-xs text-muted-foreground">{position.description}</div>
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
                            <div className="text-xs text-muted-foreground">{group.description}</div>
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
