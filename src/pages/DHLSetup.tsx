
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Users, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const DHLSetup: React.FC = () => {
  const { user } = useAuth();
  const { userAssignment, isLoading } = useDHLData(user?.id);
  const [activeStep, setActiveStep] = useState(1);

  const setupSteps = [
    {
      number: 1,
      title: 'Ověření účtu',
      description: 'Ověřujeme váš DHL zaměstnanecký účet',
      icon: Users,
      status: user ? 'completed' : 'current'
    },
    {
      number: 2,
      title: 'Přiřazení pozice',
      description: 'Čekáme na přiřazení vaší DHL pozice administrátorem',
      icon: MapPin,
      status: userAssignment ? 'completed' : 'pending'
    },
    {
      number: 3,
      title: 'Import směn',
      description: 'Vaše směny budou automaticky importovány z DHL systému',
      icon: Clock,
      status: 'pending'
    },
    {
      number: 4,
      title: 'Dokončeno',
      description: 'Váš DHL profil je připraven k použití',
      icon: Truck,
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'current': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <DHLLayout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Načítám DHL nastavení...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  return (
    <DHLLayout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Nastavení | PendlerApp</title>
        <meta name="description" content="Nastavení vašeho DHL účtu" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-yellow-500/5">
        <div className="container max-w-4xl py-8 px-4">
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
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  DHL Nastavení
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Nastavte si váš DHL zaměstnanecký profil
                </p>
              </div>
            </div>
          </motion.div>

          {/* Setup Steps */}
          <div className="space-y-6">
            {setupSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className={`border-2 ${isCompleted ? 'border-green-300 bg-green-50/50' : isCurrent ? 'border-yellow-300 bg-yellow-50/50' : 'border-gray-200'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100' : isCurrent ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                            <Icon className={`h-6 w-6 ${isCompleted ? 'text-green-600' : isCurrent ? 'text-yellow-600' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              Krok {step.number}: {step.title}
                              {isCompleted && <Badge className="bg-green-100 text-green-800">Dokončeno</Badge>}
                              {isCurrent && <Badge className="bg-yellow-100 text-yellow-800">Aktuální</Badge>}
                            </CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                          </div>
                        </div>
                        {index < setupSteps.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>
                    
                    {step.number === 2 && !userAssignment && (
                      <CardContent>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Čekáme na administrátora:</strong> Váš účet byl ověřen, ale ještě vám nebyla přiřazena DHL pozice. 
                            Kontaktujte prosím vašeho DHL administrátora pro dokončení nastavení.
                          </p>
                        </div>
                      </CardContent>
                    )}

                    {step.number === 2 && userAssignment && (
                      <CardContent>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Pozice přiřazena:</strong>
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Pozice:</span> {userAssignment.dhl_position?.name}
                            </div>
                            <div>
                              <span className="font-medium">Skupina:</span> {userAssignment.dhl_work_group?.name}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            {userAssignment ? (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700"
                onClick={() => window.location.href = '/dhl-dashboard'}
              >
                Přejít na DHL Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="text-muted-foreground">
                <p>Čekáme na dokončení nastavení administrátorem...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DHLLayout>
  );
};

export default DHLSetup;
