
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Target, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { personalizationEngine } from '@/services/PersonalizationEngine';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

interface IntelligentOnboardingProps {
  isOpen: boolean;
  onComplete: (profile: any) => void;
  onClose: () => void;
}

const LearningStyleStep: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Jak se nejlépe učíte?</h3>
      <RadioGroup value={data.learningStyle} onValueChange={(value) => onChange({ ...data, learningStyle: value })}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="visual" id="visual" />
            <Label htmlFor="visual" className="flex-1">
              <div className="font-medium">Vizuálně</div>
              <div className="text-sm text-muted-foreground">Obrázky, diagramy, barevné zvýraznění</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auditory" id="auditory" />
            <Label htmlFor="auditory" className="flex-1">
              <div className="font-medium">Sluchově</div>
              <div className="text-sm text-muted-foreground">Poslech, opakování, hudba</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="kinesthetic" id="kinesthetic" />
            <Label htmlFor="kinesthetic" className="flex-1">
              <div className="font-medium">Prakticky</div>
              <div className="text-sm text-muted-foreground">Psaní, cvičení, aktivní zapojení</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" />
            <Label htmlFor="mixed" className="flex-1">
              <div className="font-medium">Kombinace stylů</div>
              <div className="text-sm text-muted-foreground">Různé přístupy podle situace</div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

const GoalsStep: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  const focusAreas = [
    'work', 'daily_conversation', 'technical_terms', 
    'business', 'travel', 'culture'
  ];

  const toggleFocusArea = (area: string) => {
    const current = data.focusAreas || [];
    const updated = current.includes(area) 
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    onChange({ ...data, focusAreas: updated });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Na co se chcete zaměřit?</h3>
      <div className="grid grid-cols-2 gap-3">
        {focusAreas.map((area) => (
          <div key={area} className="flex items-center space-x-2">
            <Checkbox
              id={area}
              checked={(data.focusAreas || []).includes(area)}
              onCheckedChange={() => toggleFocusArea(area)}
            />
            <Label htmlFor={area} className="text-sm">
              {area === 'work' && 'Práce'}
              {area === 'daily_conversation' && 'Každodenní konverzace'}
              {area === 'technical_terms' && 'Odborné termíny'}
              {area === 'business' && 'Business němčina'}
              {area === 'travel' && 'Cestování'}
              {area === 'culture' && 'Kultura'}
            </Label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Denní cíl učení (minuty)</h4>
        <Slider
          value={[data.dailyGoal || 15]}
          onValueChange={([value]) => onChange({ ...data, dailyGoal: value })}
          min={5}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="text-center text-sm text-muted-foreground">
          {data.dailyGoal || 15} minut denně
        </div>
      </div>
    </div>
  );
};

const WorkPreferencesStep: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  const shiftTypes = ['morning', 'afternoon', 'night', 'rotating'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Vaše pracovní preference</h3>
      
      <div className="space-y-4">
        <h4 className="font-medium">Preferované směny</h4>
        <div className="space-y-2">
          {shiftTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={(data.preferredShiftTypes || []).includes(type)}
                onCheckedChange={(checked) => {
                  const current = data.preferredShiftTypes || [];
                  const updated = checked 
                    ? [...current, type]
                    : current.filter((t: string) => t !== type);
                  onChange({ ...data, preferredShiftTypes: updated });
                }}
              />
              <Label htmlFor={type} className="text-sm">
                {type === 'morning' && 'Ranní (6:00-14:00)'}
                {type === 'afternoon' && 'Odpolední (14:00-22:00)'}
                {type === 'night' && 'Noční (22:00-6:00)'}
                {type === 'rotating' && 'Rotující směny'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Flexibilita</h4>
        <RadioGroup 
          value={data.flexibility} 
          onValueChange={(value) => onChange({ ...data, flexibility: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">Vysoká - mohu měnit směny</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Střední - občasné změny</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">Nízká - pevný rozvrh</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const InterfacePreferencesStep: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Nastavení rozhraní</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="compact-mode">Kompaktní režim</Label>
          <Checkbox
            id="compact-mode"
            checked={data.compactMode || false}
            onCheckedChange={(checked) => onChange({ ...data, compactMode: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifikace</Label>
          <Checkbox
            id="notifications"
            checked={data.notifications !== false}
            onCheckedChange={(checked) => onChange({ ...data, notifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animations">Animace</Label>
          <Checkbox
            id="animations"
            checked={data.animations !== false}
            onCheckedChange={(checked) => onChange({ ...data, animations: checked })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Úroveň detailů analytics</h4>
        <RadioGroup 
          value={data.detailLevel || 'basic'} 
          onValueChange={(value) => onChange({ ...data, detailLevel: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic">Základní přehled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="detailed" id="detailed" />
            <Label htmlFor="detailed">Detailní analýzy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert">Expert režim</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export const IntelligentOnboarding: React.FC<IntelligentOnboardingProps> = ({
  isOpen,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'learning_style',
      title: 'Styl učení',
      description: 'Zjistíme, jak se učíte nejefektivněji',
      icon: <Brain className="h-5 w-5" />,
      component: LearningStyleStep
    },
    {
      id: 'goals',
      title: 'Cíle a zaměření',
      description: 'Definujeme vaše studijní cíle',
      icon: <Target className="h-5 w-5" />,
      component: GoalsStep
    },
    {
      id: 'work',
      title: 'Pracovní preference',
      description: 'Nastavíme pracovní souvislosti',
      icon: <Briefcase className="h-5 w-5" />,
      component: WorkPreferencesStep
    },
    {
      id: 'interface',
      title: 'Rozhraní',
      description: 'Přizpůsobíme aplikaci vašim potřebám',
      icon: <Settings className="h-5 w-5" />,
      component: InterfacePreferencesStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Create user profile with collected data
      const profile = await personalizationEngine.createUserProfile('user_1', {
        language: {
          learningStyle: userData.learningStyle || 'mixed',
          difficulty: 'beginner',
          focusAreas: userData.focusAreas || [],
          dailyGoal: userData.dailyGoal || 15
        },
        work: {
          preferredShiftTypes: userData.preferredShiftTypes || [],
          locations: [],
          flexibility: userData.flexibility || 'medium'
        },
        interface: {
          theme: 'auto',
          compactMode: userData.compactMode || false,
          notifications: userData.notifications !== false,
          animations: userData.animations !== false
        },
        analytics: {
          detailLevel: userData.detailLevel || 'basic',
          reportFrequency: 'weekly'
        }
      });

      // Apply initial personalization
      await personalizationEngine.applyPersonalization('user_1');

      onComplete(profile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Inteligentní nastavení aplikace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Krok {currentStep + 1} z {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-green-100 text-green-700'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  step.icon
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Current step content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                data={userData}
                onChange={setUserData}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět
            </Button>

            <Button
              onClick={handleNext}
              disabled={isProcessing}
            >
              {currentStep === steps.length - 1 ? 'Dokončit' : 'Další'}
              {isProcessing ? (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntelligentOnboarding;
