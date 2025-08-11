
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  Settings, 
  Compass,
  X,
  Gift,
  Target,
  Clock
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DHLOnboardingProps {
  onClose?: () => void;
}

const DHLOnboarding: React.FC<DHLOnboardingProps> = ({ onClose }) => {
  const { 
    steps, 
    currentStep, 
    totalSteps, 
    completedSteps,
    completeStep,
    skipOnboarding,
    completeOnboarding 
  } = useOnboarding();
  
  const navigate = useNavigate();
  const { t } = useTranslation(['dhl', 'common']);
  const [currentViewStep, setCurrentViewStep] = useState(0);

  const progress = (completedSteps.length / totalSteps) * 100;

  const localizedTitles: Record<string, string> = {
    welcome: t('dhl:onboarding.welcomeTitle', 'Vítejte v DHL Mode!'),
    setup: t('dhl:onboarding.setupTitle', 'Nastavení DHL'),
    'first-shift': t('dhl:onboarding.firstShiftTitle', 'Vaše první směna'),
    explore: t('dhl:onboarding.exploreTitle', 'Prozkoumejte funkce')
  };

  const localizedDescriptions: Record<string, string> = {
    welcome: t('dhl:onboarding.welcomeDesc', 'Začněme krátkým představením.'),
    setup: t('dhl:onboarding.setupDesc', 'Nastavte pozici a Woche pro generování směn.'),
    'first-shift': t('dhl:onboarding.firstShiftDesc', 'Přidejte svou první směnu.'),
    explore: t('dhl:onboarding.exploreDesc', 'Podívejte se na další funkce.')
  };

  const stepIcons = {
    welcome: Gift,
    setup: Settings,
    'first-shift': Calendar,
    explore: Compass
  };

  const stepColors = {
    welcome: 'bg-blue-100 text-blue-600',
    setup: 'bg-amber-100 text-amber-600',
    'first-shift': 'bg-green-100 text-green-600',
    explore: 'bg-purple-100 text-purple-600'
  };

  const handleStepAction = (stepId: string) => {
    switch (stepId) {
      case 'setup':
        navigate('/dhl-setup');
        break;
      case 'first-shift':
        navigate('/shifts');
        break;
      case 'explore':
        setCurrentViewStep(currentViewStep + 1);
        completeStep('explore');
        break;
      default:
        setCurrentViewStep(currentViewStep + 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentViewStep];
    if (!step) return null;

    const StepIcon = stepIcons[step.id as keyof typeof stepIcons] || Target;
    const isCompleted = step.completed;

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${stepColors[step.id as keyof typeof stepColors] || 'bg-gray-100'}`}>
              {isCompleted ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <StepIcon className="h-8 w-8" />
              )}
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Truck className="h-5 w-5 text-amber-600" />
              {localizedTitles[step.id] || step.title}
              {step.optional && <Badge variant="secondary">Volitelné</Badge>}
            </CardTitle>
            <CardDescription>{localizedDescriptions[step.id] || step.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step.id === 'welcome' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">🎉 Vítejte v DHL Mode!</h4>
                  <p className="text-sm text-amber-700">
                    PendlerApp je nyní optimalizována pro DHL zaměstnance. Můžete sledovat své směny, 
                    vypočítávat daně a využívat všechny premium funkce zdarma.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Sledování směn</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Daňové výpočty</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Časové plánování</p>
                  </div>
                </div>
              </div>
            )}

            {step.id === 'setup' && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">📋 Nastavení je klíčové</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Pro správné fungování aplikace potřebujeme znát vaši DHL pozici a aktuální Woche číslo.
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Vyberte svou pracovní pozici</li>
                    <li>• Nastavte aktuální Woche (1-15)</li>
                    <li>• Systém automaticky vypočítá vaše směny</li>
                  </ul>
                </div>
                
                {!isCompleted && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> Vaše Woche číslo najdete v pracovním rozvrhu nebo se zeptejte supervizora.
                    </p>
                  </div>
                )}
              </div>
            )}

            {step.id === 'first-shift' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">📅 Vaše první směna</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Přidání směn vám pomůže sledovat odpracované hodiny a optimalizovat daňové úspory.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-800">Automatické výpočty</div>
                      <div className="text-green-600">Hodiny, přestávky, mzda</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-800">Daňové úspory</div>
                      <div className="text-green-600">Kilometrovné, strava</div>
                    </div>
                  </div>
                </div>
                
                {!isCompleted && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      🚀 <strong>Quick Start:</strong> Stačí vybrat datum a typ směny - zbytek vyplníme za vás!
                    </p>
                  </div>
                )}
              </div>
            )}

            {step.id === 'explore' && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🔍 Prozkoumejte všechny funkce</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    PendlerApp nabízí mnoho užitečných nástrojů pro DHL zaměstnance:
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-purple-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Daňový poradce s kalkulačkou</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Sledování vozidel a nákladů</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Překladač pro práci</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Analýzy a statistiky</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 text-center">
                    🎊 <strong>Gratulujeme!</strong> Jste připraveni využívat PendlerApp naplno!
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {!isCompleted && (
                <Button 
                  onClick={() => handleStepAction(step.id)}
                  className="flex-1"
                >
                  {step.id === 'welcome' ? 'Začít' : 
                   step.id === 'setup' ? 'Nastavit profil' :
                   step.id === 'first-shift' ? 'Přidat směnu' :
                   'Dokončit'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {isCompleted && currentViewStep < steps.length - 1 && (
                <Button 
                  onClick={() => setCurrentViewStep(currentViewStep + 1)}
                  className="flex-1"
                >
                  Další krok
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {currentViewStep === steps.length - 1 && (
                <Button 
                  onClick={completeOnboarding}
                  className="flex-1"
                >
                  Dokončit průvodce
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {step.optional && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentViewStep(currentViewStep + 1)}
                >
                  Přeskočit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-8"
    >
      {/* Progress Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">DHL Onboarding</h3>
              <p className="text-sm text-amber-600">
                Krok {currentViewStep + 1} z {totalSteps}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={skipOnboarding}
            className="text-amber-600 hover:bg-amber-100"
          >
            <X className="h-4 w-4 mr-2" />
            Přeskočit
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-amber-700">
            <span>Pokrok</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {renderStepContent()}
      </AnimatePresence>

      {/* Step Navigation */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentViewStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentViewStep
                  ? 'bg-primary'
                  : step.completed
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DHLOnboarding;
