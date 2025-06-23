
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle, Circle, FileText, Calculator, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  estimatedTime: string;
}

const TaxReturnGuide = () => {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(0);

  const steps: GuideStep[] = [
    {
      id: '1',
      title: t('gatherDocuments') || 'Shromážděte dokumenty',
      description: t('gatherDocumentsDesc') || 'Připravte si všechny potřebné dokumenty včetně potvrzení o příjmech a výdajích',
      icon: <FileText className="h-5 w-5" />,
      completed: false,
      estimatedTime: '15 min'
    },
    {
      id: '2',
      title: t('fillBasicInfo') || 'Vyplňte základní údaje',
      description: t('fillBasicInfoDesc') || 'Zadejte osobní údaje a základní informace o příjmech',
      icon: <Circle className="h-5 w-5" />,
      completed: false,
      estimatedTime: '10 min'
    },
    {
      id: '3',
      title: t('calculateTax') || 'Vypočítejte daň',
      description: t('calculateTaxDesc') || 'Použijte naši kalkulačku pro výpočet daňové povinnosti',
      icon: <Calculator className="h-5 w-5" />,
      completed: false,
      estimatedTime: '5 min'
    },
    {
      id: '4',
      title: t('reviewAndSubmit') || 'Zkontrolujte a odešlete',
      description: t('reviewAndSubmitDesc') || 'Zkontrolujte všechny údaje a odešlete přiznání',
      icon: <Send className="h-5 w-5" />,
      completed: false,
      estimatedTime: '10 min'
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('taxReturnGuide') || 'Průvodce daňovým přiznáním'}</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('progress') || 'Průběh'}</span>
            <span>{completedSteps}/{steps.length} {t('completed') || 'dokončeno'}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                index === currentStep ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex-shrink-0 mt-1">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {step.estimatedTime}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
              {t('previous') || 'Předchozí'}
            </Button>
            <Button 
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              {t('next') || 'Další'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxReturnGuide;
