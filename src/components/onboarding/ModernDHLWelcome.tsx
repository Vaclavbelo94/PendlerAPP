import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  User, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ArrowRight, 
  CheckCircle,
  Truck,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { DHLPosition } from '@/types/dhl';
import { getCalendarWeek } from '@/utils/dhl/wocheCalculator';
import { useCityAutocomplete } from '@/hooks/useCityAutocomplete';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ModernDHLWelcomeProps {
  onComplete: () => void;
}

const ModernDHLWelcome: React.FC<ModernDHLWelcomeProps> = ({ onComplete }) => {
  const { t } = useTranslation(['dhl', 'common']);
  const { user } = useAuth();
  const { success, error: showError } = useStandardizedToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    nickname: '',
    homeCity: '',
    positionId: '',
    currentWoche: ''
  });
  
  const [positions, setPositions] = useState<DHLPosition[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  
  // City autocomplete state
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const { suggestions: citySuggestions, loading: isCityLoading } = useCityAutocomplete(formData.homeCity);

  const steps: WelcomeStep[] = [
    {
      id: 'welcome',
      title: t('dhl:welcome.title', 'Vítejte v PendlerApp!'),
      description: t('dhl:welcome.subtitle', 'Děkujeme za registraci. Nastavme si společně vaši aplikaci.'),
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'nickname',
      title: t('dhl:welcome.nicknameTitle', 'Jak se vám říká?'),
      description: t('dhl:welcome.nicknameDesc', 'Nastavte si přezdívku, kterou uvidíte v aplikaci.'),
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'homeCity',
      title: t('dhl:welcome.homeCityTitle', 'Odkud jezdíte do práce?'),
      description: t('dhl:welcome.homeCityDesc', 'Pomože nám vypočítat vzdálenosti a náklady na dopravu.'),
      icon: MapPin,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'position',
      title: t('dhl:welcome.positionTitle', 'Jaká je vaše pozice?'),
      description: t('dhl:welcome.positionDesc', 'Vyberte svou pracovní pozici pro správné nastavení směn.'),
      icon: Briefcase,
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'woche',
      title: t('dhl:welcome.wocheTitle', 'Aktuální Woche'),
      description: t('dhl:welcome.wocheDesc', 'Zadejte vaši aktuální Woche pro správný rotační cyklus.'),
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Load DHL positions
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('dhl_positions')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setPositions((data || []) as any[]);
      } catch (error) {
        console.error('Error fetching positions:', error);
        showError('Chyba při načítání pozic', 'Nepodařilo se načíst seznam pozic');
      } finally {
        setIsLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [showError]);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      showError('Chyba', 'Uživatel není přihlášen');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update extended profile with nickname and home city
      const { error: profileError } = await supabase
        .from('user_extended_profiles')
        .upsert({
          user_id: user.id,
          display_name: formData.nickname.trim() || null,
          location: formData.homeCity.trim() || null,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // 2. Create DHL assignment
      const { error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .insert({
          user_id: user.id,
          dhl_position_id: formData.positionId,
          current_woche: parseInt(formData.currentWoche),
          assigned_at: new Date().toISOString(),
          is_active: true
        });

      if (assignmentError) throw assignmentError;

      // 3. Mark onboarding as complete
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      localStorage.removeItem('isDHLSelection');
      localStorage.removeItem('dhlSelectionTimestamp');

      success('Nastavení dokončeno!', 'Váš profil byl úspěšně nastaven');
      onComplete();
    } catch (error: any) {
      console.error('Error completing setup:', error);
      showError('Chyba při ukládání', error.message || 'Nepodařilo se uložit nastavení');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'welcome':
        return true;
      case 'nickname':
        return formData.nickname.trim().length > 0;
      case 'homeCity':
        return formData.homeCity.trim().length > 0;
      case 'position':
        return formData.positionId.length > 0;
      case 'woche':
        return formData.currentWoche.length > 0;
      default:
        return true;
    }
  };

  const handleCitySelect = (city: { display_name: string }) => {
    updateFormData('homeCity', city.display_name);
    setShowCitySuggestions(false);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    const StepIcon = step.icon;

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${step.color} mb-4`}>
            <StepIcon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-muted-foreground">{step.description}</p>
        </div>

        {step.id === 'welcome' && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Speciální DHL režim aktivován!</h3>
            </div>
            <p className="text-amber-700 mb-4">
              Vaše registrace byla úspěšná a nyní máte přístup ke všem premium funkcím PendlerApp zdarma.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span>Sledování směn</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span>Daňové kalkulace</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span>Kilometrovné výpočty</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4" />
                <span>Analýzy a reporty</span>
              </div>
            </div>
          </div>
        )}

        {step.id === 'nickname' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Přezdívka</Label>
              <Input
                id="nickname"
                placeholder="Např. Honza, Katka, Alex..."
                value={formData.nickname}
                onChange={(e) => updateFormData('nickname', e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Přezdívka se zobrazí v navigačním panelu a osobních zprávách aplikace.
              </p>
            </div>
          </div>
        )}

        {step.id === 'homeCity' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeCity">Domovské město</Label>
              <div className="relative">
                <Input
                  id="homeCity"
                  placeholder="Začněte psát název města..."
                  value={formData.homeCity}
                  onChange={(e) => {
                    updateFormData('homeCity', e.target.value);
                    setShowCitySuggestions(true);
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                  className="text-lg"
                  autoComplete="off"
                />
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    <div className="max-h-60 overflow-y-auto">
                      {citySuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground border-b border-border last:border-0 first:rounded-t-md last:rounded-b-md"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{suggestion.display_name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                🏠 <strong>Proč to potřebujeme:</strong> Pomáhá nám vypočítat kilometrovné a doporučit optimální trasy.
              </p>
            </div>
          </div>
        )}

        {step.id === 'position' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position">Pracovní pozice</Label>
              <Select 
                value={formData.positionId} 
                onValueChange={(value) => updateFormData('positionId', value)}
                disabled={isLoadingPositions}
              >
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Vyberte svou pozici" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{position.name}</span>
                        <span className="text-sm text-muted-foreground">{position.position_type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingPositions && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Načítání pozic...</span>
                </div>
              )}
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                💼 <strong>Pozice určuje:</strong> Vaši hodinovou sazbu a typ směn v rotačním cyklu.
              </p>
            </div>
          </div>
        )}

        {step.id === 'woche' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="woche">Aktuální Woche (KW {getCalendarWeek(new Date())})</Label>
              <Select 
                value={formData.currentWoche} 
                onValueChange={(value) => updateFormData('currentWoche', value)}
              >
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Vyberte aktuální Woche" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((woche) => (
                    <SelectItem key={woche} value={woche.toString()}>
                      Woche {woche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 mb-2">
                📅 <strong>Jak zjistit aktuální Woche:</strong>
              </p>
              <ul className="text-sm text-purple-700 space-y-1 ml-4">
                <li>• Podívejte se do svého pracovního rozvrhu</li>
                <li>• Zeptejte se supervizora nebo kolegy</li>
                <li>• Najdete to v DHL aplikacích pro zaměstnance</li>
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">DHL Nastavení</h1>
              <p className="text-sm text-muted-foreground">
                Krok {currentStep + 1} z {steps.length}
              </p>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-2">
        <CardContent className="pt-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Zpět
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
              >
                Pokračovat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={!isStepValid() || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Dokončit nastavení
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDHLWelcome;