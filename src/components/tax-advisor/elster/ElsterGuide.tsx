import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ExternalLink, FileText, User, Shield, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ElsterGuideProps {
  onOpenElster: () => void;
}

const ElsterGuide: React.FC<ElsterGuideProps> = ({ onOpenElster }) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const steps = [
    {
      id: 1,
      icon: User,
      titleKey: 'elster.steps.registration.title',
      descriptionKey: 'elster.steps.registration.description',
      details: [
        'elster.steps.registration.detail1',
        'elster.steps.registration.detail2',
        'elster.steps.registration.detail3',
        'elster.steps.registration.detail4'
      ]
    },
    {
      id: 2,
      icon: Shield,
      titleKey: 'elster.steps.certificate.title',
      descriptionKey: 'elster.steps.certificate.description',
      details: [
        'elster.steps.certificate.detail1',
        'elster.steps.certificate.detail2',
        'elster.steps.certificate.detail3'
      ]
    },
    {
      id: 3,
      icon: FileText,
      titleKey: 'elster.steps.newDeclaration.title',
      descriptionKey: 'elster.steps.newDeclaration.description',
      details: [
        'elster.steps.newDeclaration.detail1',
        'elster.steps.newDeclaration.detail2',
        'elster.steps.newDeclaration.detail3'
      ]
    },
    {
      id: 4,
      icon: FileText,
      titleKey: 'elster.steps.fillForm.title',
      descriptionKey: 'elster.steps.fillForm.description',
      details: [
        'elster.steps.fillForm.detail1',
        'elster.steps.fillForm.detail2',
        'elster.steps.fillForm.detail3',
        'elster.steps.fillForm.detail4'
      ]
    },
    {
      id: 5,
      icon: Send,
      titleKey: 'elster.steps.submit.title',
      descriptionKey: 'elster.steps.submit.description',
      details: [
        'elster.steps.submit.detail1',
        'elster.steps.submit.detail2',
        'elster.steps.submit.detail3'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {t('elster.guide.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('elster.guide.description')}
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={onOpenElster} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('elster.openElster')}
            </Button>
          </div>

          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="guide">{t('elster.tabs.stepByStep')}</TabsTrigger>
              <TabsTrigger value="form-mapping">{t('elster.tabs.formMapping')}</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                
                return (
                  <Card key={step.id} className={`transition-all ${isCompleted ? 'border-green-200 bg-green-50/50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-muted'}`}>
                            <Icon className={`h-4 w-4 ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{t(step.titleKey)}</h3>
                            <p className="text-sm text-muted-foreground">{t(step.descriptionKey)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStep(step.id)}
                          className={isCompleted ? 'text-green-600' : ''}
                        >
                          <CheckCircle className={`h-4 w-4 ${isCompleted ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {step.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{t(detail)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="form-mapping" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('elster.formMapping.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t('elster.formMapping.personalData')}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.personalInfo.firstName')}</span>
                            <Badge variant="outline">Mantelbogen</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.personalInfo.lastName')}</span>
                            <Badge variant="outline">Mantelbogen</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.personalInfo.address')}</span>
                            <Badge variant="outline">Mantelbogen</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {t('elster.formMapping.workData')}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.employment.employerName')}</span>
                            <Badge variant="outline">Anlage N</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.employment.annualIncome')}</span>
                            <Badge variant="outline">Anlage N</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{t('wizard.reisepauschale.title')}</span>
                            <Badge variant="outline">Anlage N - Werbungskosten</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">{t('elster.formMapping.tips')}</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• {t('elster.formMapping.tip1')}</li>
                        <li>• {t('elster.formMapping.tip2')}</li>
                        <li>• {t('elster.formMapping.tip3')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElsterGuide;